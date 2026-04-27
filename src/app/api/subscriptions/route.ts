import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getIP } from '@/lib/auth';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/response';
import { logUserAction } from '@/lib/audit';

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { data, error: fetchError } = await supabaseAdmin
    .from('subscriptions')
    .select('*, services_catalog(name, slug, image_url)')
    .eq('user_id', user.userId)
    .order('created_at', { ascending: false });

  if (fetchError) return serverError('Failed to fetch subscriptions', fetchError);
  return ok(data || []);
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const body = await request.json();
    const { planName, serviceId, frequency, rooms = 1, bathrooms = 1, district, pricePerSession } = body;

    if (!planName || !serviceId || !frequency || !pricePerSession) {
      return badRequest('Plan name, service ID, frequency, and price are required');
    }

    const nextServiceDate = new Date();
    nextServiceDate.setDate(nextServiceDate.getDate() + 7);
    const nextBillingDate = new Date(nextServiceDate);

    const { data: sub, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: user.userId,
        plan_name: planName,
        service_id: serviceId,
        frequency,
        price_per_session: pricePerSession,
        rooms,
        bathrooms,
        district,
        next_service_date: nextServiceDate.toISOString().split('T')[0],
        next_billing_date: nextBillingDate.toISOString().split('T')[0],
        status: 'active',
      })
      .select()
      .single();

    if (subError) return serverError('Failed to create subscription', subError);

    await logUserAction(user.userId, 'subscription.created', 'subscription', sub.id, getIP(request));
    return created(sub);
  } catch (err) {
    return serverError('Subscription creation failed', err);
  }
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const body = await request.json();
    const { subscriptionId, action, cancelReason } = body;

    if (!subscriptionId || !action) return badRequest('Subscription ID and action required');

    const { data: sub } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('user_id', user.userId)
      .single();

    if (!sub) return badRequest('Subscription not found');

    let updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (action === 'pause') updates.status = 'paused';
    else if (action === 'resume') updates.status = 'active';
    else if (action === 'cancel') {
      updates = { ...updates, status: 'cancelled', cancelled_at: new Date().toISOString(), cancel_reason: cancelReason };
    } else return badRequest('Invalid action. Use: pause, resume, cancel');

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update(updates)
      .eq('id', subscriptionId)
      .select()
      .single();

    if (updateError) return serverError('Failed to update subscription', updateError);

    await logUserAction(user.userId, `subscription.${action}`, 'subscription', subscriptionId, getIP(request));
    return ok(updated);
  } catch (err) {
    return serverError('Subscription update failed', err);
  }
}
