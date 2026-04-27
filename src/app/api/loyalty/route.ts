import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth } from '@/lib/auth';
import { ok, badRequest, unauthorized, serverError } from '@/lib/response';
import { redeemLoyaltyPoints, getSARValueOfPoints } from '@/lib/loyalty';

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('loyalty_points, vip_level')
      .eq('id', user.userId)
      .single();

    const points = userData?.loyalty_points || 0;
    const sarValue = getSARValueOfPoints(points);

    // Get transaction history
    const { data: transactions } = await supabaseAdmin
      .from('loyalty_transactions')
      .select('*')
      .eq('user_id', user.userId)
      .order('created_at', { ascending: false })
      .limit(20);

    // Determine next VIP tier
    const { count: totalBookings } = await supabaseAdmin
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.userId)
      .eq('payment_status', 'paid');

    const bookingCount = totalBookings || 0;
    let currentTier = 'none';
    let nextTier = 'silver';
    let bookingsToNext = 5 - bookingCount;

    if (bookingCount >= 20) { currentTier = 'platinum'; nextTier = 'none'; bookingsToNext = 0; }
    else if (bookingCount >= 10) { currentTier = 'gold'; nextTier = 'platinum'; bookingsToNext = 20 - bookingCount; }
    else if (bookingCount >= 5) { currentTier = 'silver'; nextTier = 'gold'; bookingsToNext = 10 - bookingCount; }

    return ok({
      points,
      sarValue,
      vipLevel: currentTier,
      nextTier: nextTier === 'none' ? null : nextTier,
      bookingsToNextTier: Math.max(0, bookingsToNext),
      transactions: transactions || [],
    });
  } catch (err) {
    return serverError('Failed to fetch loyalty data', err);
  }
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const body = await request.json();
    const { pointsToRedeem } = body;

    if (!pointsToRedeem || pointsToRedeem <= 0) return badRequest('Points to redeem must be positive');
    if (pointsToRedeem < 100) return badRequest('Minimum redemption is 100 points');
    if (!Number.isInteger(pointsToRedeem)) return badRequest('Points must be a whole number');

    const result = await redeemLoyaltyPoints(user.userId, pointsToRedeem);

    if (!result.success) {
      return badRequest('Insufficient loyalty points');
    }

    return ok({
      pointsRedeemed: pointsToRedeem,
      discountAmount: result.discountAmount,
      newBalance: result.newBalance,
      message: `Successfully redeemed ${pointsToRedeem} points for ${result.discountAmount} SAR discount`,
    });
  } catch (err) {
    return serverError('Redemption failed', err);
  }
}
