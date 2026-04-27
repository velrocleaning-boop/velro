import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth } from '@/lib/auth';
import { ok, unauthorized, serverError } from '@/lib/response';

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('referral_code, loyalty_points')
      .eq('id', user.userId)
      .single();

    const { data: referrals } = await supabaseAdmin
      .from('referrals')
      .select('*, referred:referred_id(first_name, last_name, created_at)')
      .eq('referrer_id', user.userId)
      .order('created_at', { ascending: false });

    const totalReferred = referrals?.length || 0;
    const qualifiedReferrals = referrals?.filter((r) => r.status !== 'pending').length || 0;
    const totalPointsEarned = referrals?.reduce((sum, r) => sum + (r.reward_points || 0), 0) || 0;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://velro.sa';
    const referralLink = `${siteUrl}/register?ref=${userData?.referral_code}`;

    return ok({
      referralCode: userData?.referral_code,
      referralLink,
      totalReferred,
      qualifiedReferrals,
      totalPointsEarned,
      referrals: referrals || [],
      rewardPerReferral: 500,
    });
  } catch (err) {
    return serverError('Failed to fetch referral data', err);
  }
}
