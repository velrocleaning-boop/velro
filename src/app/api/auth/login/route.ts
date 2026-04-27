import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { signAccessToken, signRefreshToken, hashToken } from '@/lib/jwt';
import { rateLimit, limits } from '@/lib/rate-limit';
import { getIP } from '@/lib/auth';
import { ok, badRequest, unauthorized, tooManyRequests, serverError } from '@/lib/response';
import { logAudit } from '@/lib/audit';

export async function POST(request: NextRequest) {
  const ip = getIP(request);
  const rl = rateLimit(`login:${ip}`, limits.auth);
  if (!rl.allowed) return tooManyRequests('Too many login attempts. Try again in 15 minutes.');

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) return badRequest('Email and password are required');

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email, password_hash, first_name, last_name, role, is_active, loyalty_points, referral_code, wallet_balance')
      .eq('email', email.toLowerCase())
      .single();

    if (!user || !user.password_hash) return unauthorized('Invalid email or password');
    if (!user.is_active) return unauthorized('Account is deactivated. Contact support.');

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return unauthorized('Invalid email or password');

    // Update last login
    await supabaseAdmin
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    // Issue tokens
    const accessToken = await signAccessToken({ userId: user.id, role: user.role, email: user.email });
    const refreshToken = await signRefreshToken(user.id);
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await supabaseAdmin.from('refresh_tokens').insert({
      user_id: user.id,
      token_hash: tokenHash,
      ip_address: ip,
      device_info: request.headers.get('user-agent') || undefined,
      expires_at: expiresAt.toISOString(),
    });

    await logAudit({
      userId: user.id,
      action: 'user.login',
      resourceType: 'user',
      resourceId: user.id,
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    const response = ok({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        loyaltyPoints: user.loyalty_points,
        walletBalance: user.wallet_balance,
        referralCode: user.referral_code,
      },
      accessToken,
      refreshToken,
    });

    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
    });
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    return serverError('Login failed', err);
  }
}
