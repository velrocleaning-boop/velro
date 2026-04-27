import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth } from '@/lib/auth';
import { ok, unauthorized, serverError } from '@/lib/response';

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const { data } = await supabaseAdmin
      .from('users')
      .select(
        'id, email, first_name, last_name, phone, role, avatar_url, is_verified, loyalty_points, wallet_balance, referral_code, vip_level, customer_segment, lifetime_value, created_at, last_login_at, metadata'
      )
      .eq('id', user.userId)
      .single();

    if (!data) return unauthorized('User not found');

    return ok({
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
      role: data.role,
      avatarUrl: data.avatar_url,
      isVerified: data.is_verified,
      loyaltyPoints: data.loyalty_points,
      walletBalance: data.wallet_balance,
      referralCode: data.referral_code,
      vipLevel: data.vip_level,
      createdAt: data.created_at,
      lastLoginAt: data.last_login_at,
    });
  } catch (err) {
    return serverError('Failed to fetch user', err);
  }
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const body = await request.json();
    const { firstName, lastName, phone, avatarUrl } = body;

    const { data, error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.userId)
      .select('id, email, first_name, last_name, phone, avatar_url')
      .single();

    if (updateError) return serverError('Failed to update profile');
    return ok(data);
  } catch (err) {
    return serverError('Profile update failed', err);
  }
}
