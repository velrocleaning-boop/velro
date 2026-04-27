import { supabaseAdmin } from './supabase-admin';

export interface CouponValidationResult {
  valid: boolean;
  error?: string;
  coupon?: {
    id: string;
    code: string;
    type: string;
    value: number;
    maxDiscountAmount: number | null;
  };
  discountAmount?: number;
}

export async function validateCoupon(
  code: string,
  orderAmount: number,
  userId: string,
  serviceSlug?: string
): Promise<CouponValidationResult> {
  const { data: coupon } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (!coupon) return { valid: false, error: 'Invalid coupon code' };

  const now = new Date();

  if (coupon.valid_from && new Date(coupon.valid_from) > now) {
    return { valid: false, error: 'Coupon is not yet active' };
  }
  if (coupon.valid_until && new Date(coupon.valid_until) < now) {
    return { valid: false, error: 'Coupon has expired' };
  }
  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
    return { valid: false, error: 'Coupon usage limit reached' };
  }
  if (orderAmount < coupon.min_order_amount) {
    return {
      valid: false,
      error: `Minimum order amount is ${coupon.min_order_amount} SAR`,
    };
  }

  // Check user-specific coupon
  if (coupon.user_specific_id && coupon.user_specific_id !== userId) {
    return { valid: false, error: 'This coupon is not available for your account' };
  }

  // Check service applicability
  if (coupon.applicable_services?.length > 0 && serviceSlug) {
    if (!coupon.applicable_services.includes(serviceSlug)) {
      return { valid: false, error: 'Coupon not applicable for this service' };
    }
  }

  // Check per-user usage limit
  const { count } = await supabaseAdmin
    .from('coupon_usages')
    .select('*', { count: 'exact', head: true })
    .eq('coupon_id', coupon.id)
    .eq('user_id', userId);

  if (coupon.user_limit && (count || 0) >= coupon.user_limit) {
    return { valid: false, error: 'You have already used this coupon' };
  }

  // First order check
  if (coupon.is_first_order_only) {
    const { count: bookingCount } = await supabaseAdmin
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    if ((bookingCount || 0) > 0) {
      return { valid: false, error: 'This coupon is for first orders only' };
    }
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.type === 'percentage') {
    discountAmount = (orderAmount * coupon.value) / 100;
    if (coupon.max_discount_amount) {
      discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
    }
  } else if (coupon.type === 'flat') {
    discountAmount = Math.min(coupon.value, orderAmount);
  } else if (coupon.type === 'free_service') {
    discountAmount = orderAmount;
  }

  discountAmount = Math.round(discountAmount * 100) / 100;

  return {
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      maxDiscountAmount: coupon.max_discount_amount,
    },
    discountAmount,
  };
}

export async function recordCouponUsage(
  couponId: string,
  userId: string,
  bookingId: string,
  discountAmount: number
): Promise<void> {
  await Promise.all([
    supabaseAdmin.from('coupon_usages').insert({
      coupon_id: couponId,
      user_id: userId,
      booking_id: bookingId,
      discount_amount: discountAmount,
    }),
    supabaseAdmin
      .from('coupons')
      .update({ usage_count: supabaseAdmin.rpc('increment', { x: 1 }) })
      .eq('id', couponId),
  ]);
}
