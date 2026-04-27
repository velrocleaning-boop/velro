import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { hashToken, verifyRefreshToken } from '@/lib/jwt';
import { ok, serverError } from '@/lib/response';

export async function POST(request: NextRequest) {
  try {
    const refreshToken =
      request.cookies.get('refresh_token')?.value ||
      (await request.json().catch(() => ({}))).refreshToken;

    if (refreshToken) {
      try {
        const payload = await verifyRefreshToken(refreshToken);
        const tokenHash = hashToken(refreshToken);
        await supabaseAdmin
          .from('refresh_tokens')
          .update({ is_revoked: true, revoked_at: new Date().toISOString() })
          .eq('token_hash', tokenHash)
          .eq('user_id', payload.userId);
      } catch {
        // Ignore invalid token errors during logout
      }
    }

    const response = ok({ message: 'Logged out successfully' });
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    response.cookies.delete('admin_token');
    return response;
  } catch (err) {
    return serverError('Logout failed', err);
  }
}
