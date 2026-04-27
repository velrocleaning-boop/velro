import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { signAccessToken, signRefreshToken, hashToken } from '@/lib/jwt';
import { rateLimit, limits } from '@/lib/rate-limit';
import { getIP } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';
import { ok, created, badRequest, conflict, tooManyRequests, serverError } from '@/lib/response';
import { logAudit } from '@/lib/audit';

function generateReferralCode(name: string): string {
  const clean = name.replace(/\s+/g, '').toUpperCase().slice(0, 4);
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${clean}${rand}`;
}

export async function POST(request: NextRequest) {
  const ip = getIP(request);
  const rl = rateLimit(`register:${ip}`, limits.auth);
  if (!rl.allowed) return tooManyRequests('Too many registration attempts. Try again later.');

  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, referralCode } = body;

    if (!email || !password) return badRequest('Email and password are required');
    if (password.length < 8) return badRequest('Password must be at least 8 characters');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return badRequest('Invalid email format');

    // Check existing user
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) return conflict('An account with this email already exists');

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Check referral
    let referredById: string | null = null;
    if (referralCode) {
      const { data: referrer } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('referral_code', referralCode.toUpperCase())
        .single();
      if (referrer) referredById = referrer.id;
    }

    const fullName = `${firstName || ''} ${lastName || ''}`.trim() || 'Customer';
    const newReferralCode = generateReferralCode(fullName);

    // Create user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        first_name: firstName || null,
        last_name: lastName || null,
        phone: phone || null,
        referral_code: newReferralCode,
        referred_by: referredById,
        role: 'customer',
      })
      .select('id, email, first_name, last_name, role, referral_code, loyalty_points')
      .single();

    if (error || !user) return serverError('Failed to create account', error);

    // Record referral
    if (referredById) {
      await supabaseAdmin.from('referrals').insert({
        referrer_id: referredById,
        referred_id: user.id,
        referral_code: referralCode.toUpperCase(),
        status: 'pending',
      });
    }

    // Issue tokens
    const accessToken = await signAccessToken({ userId: user.id, role: user.role, email: user.email });
    const refreshToken = await signRefreshToken(user.id);
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await supabaseAdmin.from('refresh_tokens').insert({
      user_id: user.id,
      token_hash: tokenHash,
      ip_address: ip,
      expires_at: expiresAt.toISOString(),
    });

    // Welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.first_name || 'Customer', newReferralCode).catch(() => {});

    await logAudit({
      userId: user.id,
      action: 'user.registered',
      resourceType: 'user',
      resourceId: user.id,
      ipAddress: ip,
    });

    const response = created({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        loyaltyPoints: user.loyalty_points,
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
    return serverError('Registration failed', err);
  }
}
