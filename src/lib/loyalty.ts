import { supabaseAdmin } from './supabase-admin';

const POINTS_PER_SAR = 1; // 1 point per SAR spent
const POINT_VALUE_SAR = 0.01; // 1 point = 0.01 SAR

export async function awardLoyaltyPoints(
  userId: string,
  amountSpent: number,
  bookingId: string,
  description: string
): Promise<number> {
  const pointsToAward = Math.floor(amountSpent * POINTS_PER_SAR);

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('loyalty_points')
    .eq('id', userId)
    .single();

  const currentBalance = user?.loyalty_points || 0;
  const newBalance = currentBalance + pointsToAward;

  await Promise.all([
    supabaseAdmin.from('users').update({ loyalty_points: newBalance }).eq('id', userId),
    supabaseAdmin.from('loyalty_transactions').insert({
      user_id: userId,
      booking_id: bookingId,
      type: 'earned',
      points: pointsToAward,
      balance_after: newBalance,
      description,
    }),
  ]);

  return pointsToAward;
}

export async function redeemLoyaltyPoints(
  userId: string,
  pointsToRedeem: number
): Promise<{ success: boolean; discountAmount: number; newBalance: number }> {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('loyalty_points')
    .eq('id', userId)
    .single();

  if (!user || user.loyalty_points < pointsToRedeem) {
    return { success: false, discountAmount: 0, newBalance: user?.loyalty_points || 0 };
  }

  const discountAmount = Math.round(pointsToRedeem * POINT_VALUE_SAR * 100) / 100;
  const newBalance = user.loyalty_points - pointsToRedeem;

  await Promise.all([
    supabaseAdmin.from('users').update({ loyalty_points: newBalance }).eq('id', userId),
    supabaseAdmin.from('loyalty_transactions').insert({
      user_id: userId,
      type: 'redeemed',
      points: -pointsToRedeem,
      balance_after: newBalance,
      description: `Redeemed ${pointsToRedeem} points for ${discountAmount} SAR discount`,
    }),
  ]);

  return { success: true, discountAmount, newBalance };
}

export async function awardReferralBonus(referrerId: string, referredId: string): Promise<void> {
  const REFERRAL_POINTS = 500;

  const { data: referrer } = await supabaseAdmin
    .from('users')
    .select('loyalty_points')
    .eq('id', referrerId)
    .single();

  const currentBalance = referrer?.loyalty_points || 0;
  const newBalance = currentBalance + REFERRAL_POINTS;

  await Promise.all([
    supabaseAdmin.from('users').update({ loyalty_points: newBalance }).eq('id', referrerId),
    supabaseAdmin.from('loyalty_transactions').insert({
      user_id: referrerId,
      type: 'referral',
      points: REFERRAL_POINTS,
      balance_after: newBalance,
      description: 'Referral bonus - friend made their first booking',
    }),
    supabaseAdmin
      .from('referrals')
      .update({
        status: 'rewarded',
        reward_given: true,
        reward_points: REFERRAL_POINTS,
        qualified_at: new Date().toISOString(),
      })
      .eq('referrer_id', referrerId)
      .eq('referred_id', referredId),
  ]);
}

export function getSARValueOfPoints(points: number): number {
  return Math.round(points * POINT_VALUE_SAR * 100) / 100;
}
