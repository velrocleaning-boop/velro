import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth } from '@/lib/auth';
import { ok, unauthorized, serverError, paginated } from '@/lib/response';

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
  const search = searchParams.get('search') || '';
  const role = searchParams.get('role') || '';
  const vipLevel = searchParams.get('vip') || '';
  const sortBy = searchParams.get('sort') || 'created_at';
  const order = searchParams.get('order') === 'asc';
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('users')
    .select(
      'id, email, first_name, last_name, phone, role, is_active, is_verified, loyalty_points, wallet_balance, vip_level, lifetime_value, created_at, last_login_at, fraud_flags',
      { count: 'exact' }
    )
    .order(sortBy, { ascending: order })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,phone.ilike.%${search}%`);
  }
  if (role) query = query.eq('role', role);
  if (vipLevel) query = query.eq('vip_level', vipLevel);

  const { data, count, error: fetchError } = await query;
  if (fetchError) return serverError('Failed to fetch users', fetchError);

  return paginated(data || [], count || 0, page, limit);
}
