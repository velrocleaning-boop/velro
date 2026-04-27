import { supabaseAdmin } from './supabase-admin';

export type NotificationType =
  | 'booking_created'
  | 'booking_confirmed'
  | 'booking_assigned'
  | 'booking_started'
  | 'booking_completed'
  | 'booking_cancelled'
  | 'payment_received'
  | 'payment_failed'
  | 'refund_processed'
  | 'ticket_reply'
  | 'ticket_resolved'
  | 'review_approved'
  | 'loyalty_points_earned'
  | 'loyalty_points_redeemed'
  | 'subscription_renewed'
  | 'subscription_expiring'
  | 'coupon_applied'
  | 'referral_qualified'
  | 'system';

interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channels?: ('inapp' | 'email' | 'sms' | 'push')[];
}

export async function createNotification(payload: NotificationPayload): Promise<void> {
  await supabaseAdmin.from('notifications').insert({
    user_id: payload.userId,
    type: payload.type,
    title: payload.title,
    body: payload.body,
    data: payload.data || {},
    channel: payload.channels || ['inapp'],
    sent_at: new Date().toISOString(),
  });
}

export async function notifyBookingCreated(userId: string, bookingId: string, service: string): Promise<void> {
  await createNotification({
    userId,
    type: 'booking_created',
    title: 'Booking Received',
    body: `Your ${service} booking has been submitted. We'll confirm shortly.`,
    data: { bookingId },
  });
}

export async function notifyBookingStatusChange(
  userId: string,
  bookingId: string,
  status: string
): Promise<void> {
  const messages: Record<string, { title: string; body: string }> = {
    Confirmed: { title: 'Booking Confirmed ✅', body: 'Your booking is confirmed. A cleaner will be assigned soon.' },
    Assigned: { title: 'Cleaner Assigned 🧹', body: 'A professional cleaner has been assigned to your booking.' },
    'In Progress': { title: 'Cleaning Started 🏠', body: 'Your cleaning service is now in progress.' },
    Completed: { title: 'Service Completed ⭐', body: 'Your cleaning is done! Please leave a review.' },
    Cancelled: { title: 'Booking Cancelled', body: 'Your booking has been cancelled.' },
  };

  const msg = messages[status] || { title: `Booking ${status}`, body: `Your booking status: ${status}` };

  await createNotification({
    userId,
    type: `booking_${status.toLowerCase().replace(' ', '_')}` as NotificationType,
    title: msg.title,
    body: msg.body,
    data: { bookingId, status },
  });
}

export async function notifyPaymentReceived(userId: string, amount: number, bookingId: string): Promise<void> {
  await createNotification({
    userId,
    type: 'payment_received',
    title: 'Payment Confirmed 💳',
    body: `Payment of ${amount} SAR received for your booking.`,
    data: { amount, bookingId },
  });
}

export async function notifyLoyaltyPointsEarned(userId: string, points: number, balance: number): Promise<void> {
  await createNotification({
    userId,
    type: 'loyalty_points_earned',
    title: 'Points Earned! 🌟',
    body: `You earned ${points} loyalty points. Total balance: ${balance} points.`,
    data: { points, balance },
  });
}

export async function markNotificationsRead(userId: string, notificationIds: string[]): Promise<void> {
  await supabaseAdmin
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .in('id', notificationIds);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await supabaseAdmin
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('is_read', false);
}
