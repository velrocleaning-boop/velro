import { SignJWT, jwtVerify } from 'jose';
import { createHash } from 'crypto';

const secret = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET || 'fallback-secret-change-in-production'
  );

const refreshSecret = () =>
  new TextEncoder().encode(
    (process.env.JWT_REFRESH_SECRET || process.env.SUPABASE_JWT_SECRET || 'fallback-refresh') + '_refresh'
  );

export interface AccessTokenPayload {
  userId: string;
  role: string;
  email: string;
}

export async function signAccessToken(payload: AccessTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secret());
}

export async function signRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ userId, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(refreshSecret());
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, secret());
  return payload as unknown as AccessTokenPayload;
}

export async function verifyRefreshToken(token: string): Promise<{ userId: string }> {
  const { payload } = await jwtVerify(token, refreshSecret());
  return payload as { userId: string };
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
