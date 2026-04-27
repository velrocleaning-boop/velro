import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getIP } from '@/lib/auth';
import { ok, created, badRequest, unauthorized, serverError, paginated } from '@/lib/response';
import { logUserAction } from '@/lib/audit';

function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `TKT-${timestamp}-${random}`;
}

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'));
  const status = searchParams.get('status');
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('tickets')
    .select('*, ticket_messages(count)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (user.role === 'customer') {
    query = query.eq('user_id', user.userId);
  }
  if (status) query = query.eq('status', status);

  const { data, count, error: fetchError } = await query;
  if (fetchError) return serverError('Failed to fetch tickets', fetchError);

  return paginated(data || [], count || 0, page, limit);
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const body = await request.json();
    const { subject, message, category = 'inquiry', priority = 'normal', bookingId } = body;

    if (!subject || !message) return badRequest('Subject and message are required');

    const ticketNumber = generateTicketNumber();

    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from('tickets')
      .insert({
        user_id: user.userId,
        booking_id: bookingId || null,
        ticket_number: ticketNumber,
        subject,
        category,
        priority,
        status: 'open',
      })
      .select()
      .single();

    if (ticketError) return serverError('Failed to create ticket', ticketError);

    // Add first message
    await supabaseAdmin.from('ticket_messages').insert({
      ticket_id: ticket.id,
      sender_id: user.userId,
      sender_role: user.role === 'customer' ? 'customer' : 'admin',
      message,
    });

    await logUserAction(user.userId, 'ticket.created', 'ticket', ticket.id, getIP(request));

    return created({ ticket, ticketNumber });
  } catch (err) {
    return serverError('Ticket creation failed', err);
  }
}
