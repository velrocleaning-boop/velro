import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getIP } from '@/lib/auth';
import { ok, badRequest, unauthorized, notFound, serverError } from '@/lib/response';
import { logAudit } from '@/lib/audit';

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const body = await request.json();
    const { paymentId, refundAmount, reason } = body;

    if (!paymentId || !refundAmount) return badRequest('Payment ID and refund amount are required');

    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (!payment) return notFound('Payment not found');
    if (payment.status === 'refunded') return badRequest('Payment already fully refunded');

    const maxRefund = payment.amount - (payment.refund_amount || 0);
    if (refundAmount > maxRefund) {
      return badRequest(`Maximum refundable amount is ${maxRefund} SAR`);
    }

    const isFullRefund = refundAmount >= maxRefund;
    const newRefundTotal = (payment.refund_amount || 0) + refundAmount;

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        refund_amount: newRefundTotal,
        refund_reason: reason,
        status: isFullRefund ? 'refunded' : 'partial_refund',
        refunded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (updateError) return serverError('Failed to process refund', updateError);

    // Update booking status if fully refunded
    if (payment.booking_id && isFullRefund) {
      await supabaseAdmin
        .from('bookings')
        .update({ payment_status: 'refunded' })
        .eq('id', payment.booking_id);
    }

    // Credit wallet if partial
    if (payment.user_id && !isFullRefund) {
      const { data: u } = await supabaseAdmin.from('users').select('wallet_balance').eq('id', payment.user_id).single();
      const newBalance = (u?.wallet_balance || 0) + refundAmount;
      await Promise.all([
        supabaseAdmin.from('users').update({ wallet_balance: newBalance }).eq('id', payment.user_id),
        supabaseAdmin.from('wallet_transactions').insert({
          user_id: payment.user_id,
          type: 'refund',
          amount: refundAmount,
          balance_after: newBalance,
          description: `Refund for payment ${paymentId.slice(0, 8)}`,
          reference_id: paymentId,
          reference_type: 'payment',
        }),
      ]);
    }

    await logAudit({
      userId: user.userId,
      action: 'payment.refunded',
      resourceType: 'payment',
      resourceId: paymentId,
      ipAddress: getIP(request),
      newValues: { refundAmount, reason },
    });

    return ok({ payment: updated, refundAmount, isFullRefund });
  } catch (err) {
    return serverError('Refund failed', err);
  }
}
