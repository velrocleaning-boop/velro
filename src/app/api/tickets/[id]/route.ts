import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getIP } from '@/lib/auth';
import { ok, badRequest, unauthorized, forbidden, notFound, serverError } from '@/lib/response';
import { createNotification } from '@/lib/notifications';
import { sendTicketReply } from '@/lib/email';
import { logUserAction } from '@/lib/audit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { data: ticket } = await supabaseAdmin
    .from('tickets')
    .select('*, ticket_messages(*, users(first_name, last_name, role))')
    .eq('id', id)
    .single();

  if (!ticket) return notFound('Ticket not found');
  if (user.role === 'customer' && ticket.user_id !== user.userId) return forbidden();

  return ok(ticket);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { data: ticket } = await supabaseAdmin
    .from('tickets')
    .select('*')
    .eq('id', id)
    .single();

  if (!ticket) return notFound('Ticket not found');
  if (user.role === 'customer' && ticket.user_id !== user.userId) return forbidden();
  if (ticket.status === 'closed') return badRequest('Cannot reply to a closed ticket');

  const body = await request.json();
  const { message, attachments } = body;
  if (!message) return badRequest('Message is required');

  const { data: msg, error: msgError } = await supabaseAdmin
    .from('ticket_messages')
    .insert({
      ticket_id: id,
      sender_id: user.userId,
      sender_role: user.role === 'customer' ? 'customer' : 'admin',
      message,
      attachments: attachments || [],
    })
    .select()
    .single();

  if (msgError) return serverError('Failed to send message', msgError);

  // Update ticket status
  const newStatus = user.role === 'customer' ? 'open' : 'waiting_customer';
  await supabaseAdmin
    .from('tickets')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', id);

  // Notify the other party
  if (user.role !== 'customer' && ticket.user_id) {
    createNotification({
      userId: ticket.user_id,
      type: 'ticket_reply',
      title: 'Support Reply',
      body: `New reply on ticket #${ticket.ticket_number}`,
      data: { ticketId: id, ticketNumber: ticket.ticket_number },
    }).catch(() => {});

    // Get user email
    const { data: ticketUser } = await supabaseAdmin
      .from('users')
      .select('email, first_name')
      .eq('id', ticket.user_id)
      .single();
    if (ticketUser?.email) {
      sendTicketReply(ticketUser.email, ticketUser.first_name || 'Customer', ticket.ticket_number, message).catch(() => {});
    }
  }

  return ok(msg);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const body = await request.json();
  const { status, priority, assignedToId, resolutionNotes, satisfactionRating } = body;

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (status) updates.status = status;
  if (priority) updates.priority = priority;
  if (assignedToId) updates.assigned_to_id = assignedToId;
  if (resolutionNotes) updates.resolution_notes = resolutionNotes;
  if (satisfactionRating) updates.satisfaction_rating = satisfactionRating;
  if (status === 'resolved') updates.resolved_at = new Date().toISOString();

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('tickets')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (updateError) return serverError('Failed to update ticket', updateError);

  await logUserAction(user.userId, 'ticket.updated', 'ticket', id, getIP(request));
  return ok(updated);
}
