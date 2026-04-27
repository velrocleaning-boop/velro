import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyRefreshToken, signAccessToken, signRefreshToken, hashToken } from '@/lib/jwt';
import { getIP } from '@/lib/auth';
import { ok, unauthorized, serverError } from '@/lib/response';

export async function POST(request: NextRequest) {
  try {
    const refreshToken =
      request.cookies.get('refresh_token')?.value ||
      (await request.json().catch(() => ({}))).refreshToken;

    if (!refreshToken) return unauthorized('No refresh token');

    let payload: { userId: string };
    try {
      payload = await verifyRefreshToken(refreshToken);
    } catch {
      return unauthorized('Invalid or expired refresh token');
    }

    const tokenHash = hashToken(refreshToken);

    const { data: storedToken } = await supabaseAdmin
      .from('refresh_tokens')
      .select('*')
      .eq('token_hash', tokenHash)
      .eq('user_id', payload.userId)
      .eq('is_revoked', false)
      .single();

    if (!storedToken || new Date(storedToken.expires_at) < new Date()) {
      return unauthorized('Refresh token expired or revoked');
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email, role, is_active')
      .eq('id', payload.userId)
      .single();

    if (!user || !user.is_active) return unauthorized('Account not found or deactivated');

    // Rotate refresh token
    await supabaseAdmin
      .from('refresh_tokens')
      .update({ is_revoked: true, revoked_at: new Date().toISOString() })
      .eq('id', storedToken.id);

    const newAccessToken = await signAccessToken({ userId: user.id, role: user.role, email: user.email });
    const newRefreshToken = await signRefreshToken(user.id);
    const newHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await supabaseAdmin.from('refresh_tokens').insert({
      user_id: user.id,
      token_hash: newHash,
      ip_address: getIP(request),
      expires_at: expiresAt.toISOString(),
    });

    const response = ok({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    response.cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
    });
    response.cookies.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    return serverError('Token refresh failed', err);
  }
}
