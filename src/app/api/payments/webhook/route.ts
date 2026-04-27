import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ok, badRequest, serverError } from '@/lib/response';
import { createHmac } from 'crypto';

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  return signature === expected;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-webhook-signature') || '';
    const gateway = request.headers.get('x-gateway') || 'unknown';

    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || '';
    if (webhookSecret && !verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      return badRequest('Invalid webhook signature');
    }

    const payload = JSON.parse(rawBody);
    const { event, data } = payload;

    switch (event) {
      case 'payment.completed': {
        await supabaseAdmin
          .from('payments')
          .update({ status: 'completed', gateway_response: data, updated_at: new Date().toISOString() })
          .eq('gateway_transaction_id', data.transactionId);

        if (data.bookingId) {
          await supabaseAdmin
            .from('bookings')
            .update({ payment_status: 'paid', status: 'Confirmed', confirmed_at: new Date().toISOString() })
            .eq('id', data.bookingId);
        }
        break;
      }

      case 'payment.failed': {
        await supabaseAdmin
          .from('payments')
          .update({ status: 'failed', gateway_response: data, updated_at: new Date().toISOString() })
          .eq('gateway_transaction_id', data.transactionId);

        if (data.bookingId) {
          await supabaseAdmin
            .from('bookings')
            .update({ payment_status: 'failed' })
            .eq('id', data.bookingId);
        }
        break;
      }

      case 'subscription.renewed': {
        if (data.subscriptionId) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              next_billing_date: data.nextBillingDate,
              total_sessions: supabaseAdmin.rpc('increment', { x: 1 }) as unknown as number,
              total_paid: supabaseAdmin.rpc('increment_decimal', { x: data.amount }) as unknown as number,
              updated_at: new Date().toISOString(),
            })
            .eq('gateway_subscription_id', data.subscriptionId);
        }
        break;
      }

      case 'subscription.cancelled': {
        if (data.subscriptionId) {
          await supabaseAdmin
            .from('subscriptions')
            .update({ status: 'cancelled', cancelled_at: new Date().toISOString(), updated_at: new Date().toISOString() })
            .eq('gateway_subscription_id', data.subscriptionId);
        }
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    // Log webhook event
    await supabaseAdmin.from('audit_logs').insert({
      action: `webhook.${event}`,
      resource_type: 'webhook',
      metadata: { gateway, event, data },
    });

    return ok({ received: true, event });
  } catch (err) {
    return serverError('Webhook processing failed', err);
  }
}
