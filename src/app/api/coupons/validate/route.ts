import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { validateCoupon } from '@/lib/coupons';
import { ok, badRequest, unauthorized, serverError } from '@/lib/response';

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const body = await request.json();
    const { code, orderAmount, service } = body;

    if (!code) return badRequest('Coupon code is required');
    if (!orderAmount || orderAmount <= 0) return badRequest('Valid order amount is required');

    const result = await validateCoupon(code, orderAmount, user.userId, service);

    if (!result.valid) return badRequest(result.error || 'Invalid coupon');

    return ok({
      valid: true,
      code: result.coupon!.code,
      type: result.coupon!.type,
      value: result.coupon!.value,
      discountAmount: result.discountAmount,
      finalAmount: Math.max(0, orderAmount - result.discountAmount!),
    });
  } catch (err) {
    return serverError('Coupon validation failed', err);
  }
}
