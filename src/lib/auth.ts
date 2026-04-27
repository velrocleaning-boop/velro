import { NextRequest } from 'next/server';
import { verifyAccessToken, AccessTokenPayload } from './jwt';

const ROLE_HIERARCHY: Record<string, number> = {
  customer: 0,
  staff: 1,
  admin: 2,
  super_admin: 3,
};

export type AuthUser = AccessTokenPayload;

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    let token = request.headers.get('authorization')?.replace('Bearer ', '').trim();
    if (!token) token = request.cookies.get('access_token')?.value;
    if (!token) return null;
    return await verifyAccessToken(token);
  } catch {
    return null;
  }
}

export function hasRole(userRole: string, minRole: string): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 0);
}

export async function requireAuth(
  request: NextRequest,
  minRole = 'customer'
): Promise<{ user: AuthUser | null; error: string | null }> {
  const user = await getAuthUser(request);
  if (!user) return { user: null, error: 'Unauthorized' };
  if (!hasRole(user.role, minRole)) return { user: null, error: 'Forbidden' };
  return { user, error: null };
}

export function getIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '0.0.0.0'
  );
}
