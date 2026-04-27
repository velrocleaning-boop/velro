import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getIP } from '@/lib/auth';
import { ok, created, badRequest, unauthorized, serverError, paginated } from '@/lib/response';
import { logUserAction } from '@/lib/audit';

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
  const active = searchParams.get('active');
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('coupons')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (active === 'true') query = query.eq('is_active', true);
  else if (active === 'false') query = query.eq('is_active', false);

  const { data, count, error: fetchError } = await query;
  if (fetchError) return serverError('Failed to fetch coupons', fetchError);

  return paginated(data || [], count || 0, page, limit);
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const body = await request.json();
    const {
      code, name, description, type, value, minOrderAmount, maxDiscountAmount,
      usageLimit, userLimit, validFrom, validUntil, applicableServices,
      isFirstOrderOnly, userSpecificId, isActive = true,
    } = body;

    if (!code || !name || !type || value === undefined) {
      return badRequest('Code, name, type, and value are required');
    }
    if (!['percentage', 'flat', 'free_service', 'loyalty_multiplier'].includes(type)) {
      return badRequest('Invalid coupon type');
    }
    if (type === 'percentage' && (value < 0 || value > 100)) {
      return badRequest('Percentage value must be 0-100');
    }

    const { data: coupon, error: insertError } = await supabaseAdmin
      .from('coupons')
      .insert({
        code: code.toUpperCase(),
        name,
        description,
        type,
        value,
        min_order_amount: minOrderAmount || 0,
        max_discount_amount: maxDiscountAmount || null,
        usage_limit: usageLimit || null,
        user_limit: userLimit || 1,
        valid_from: validFrom || new Date().toISOString(),
        valid_until: validUntil || null,
        applicable_services: applicableServices || [],
        is_first_order_only: isFirstOrderOnly || false,
        user_specific_id: userSpecificId || null,
        is_active: isActive,
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') return badRequest('Coupon code already exists');
      return serverError('Failed to create coupon', insertError);
    }

    await logUserAction(user.userId, 'admin.coupon.created', 'coupon', coupon.id, getIP(request));
    return created(coupon);
  } catch (err) {
    return serverError('Coupon creation failed', err);
  }
}
