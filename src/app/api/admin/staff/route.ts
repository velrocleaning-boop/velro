import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getIP } from '@/lib/auth';
import { ok, created, badRequest, unauthorized, serverError, paginated } from '@/lib/response';
import { logUserAction } from '@/lib/audit';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
  const available = searchParams.get('available');
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('staff')
    .select('*, users(id, email, first_name, last_name, phone, is_active)', { count: 'exact' })
    .order('rating', { ascending: false })
    .range(offset, offset + limit - 1);

  if (available === 'true') query = query.eq('is_available', true);

  const { data, count, error: fetchError } = await query;
  if (fetchError) return serverError('Failed to fetch staff', fetchError);

  return paginated(data || [], count || 0, page, limit);
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const body = await request.json();
    const { email, firstName, lastName, phone, password, specializations, availabilityZones, hourlyRate } = body;

    if (!email || !firstName || !password) return badRequest('Email, first name, and password are required');

    const passwordHash = await bcrypt.hash(password, 12);

    const { data: staffUser, error: userError } = await supabaseAdmin
      .from('users')
      .insert({ email: email.toLowerCase(), first_name: firstName, last_name: lastName, phone, password_hash: passwordHash, role: 'staff' })
      .select('id')
      .single();

    if (userError) return serverError('Failed to create staff account', userError);

    const employeeId = `EMP-${Date.now().toString(36).toUpperCase()}`;

    const { data: staffRecord, error: staffError } = await supabaseAdmin
      .from('staff')
      .insert({
        user_id: staffUser.id,
        employee_id: employeeId,
        specializations: specializations || [],
        availability_zones: availabilityZones || [],
        hourly_rate: hourlyRate,
        joined_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (staffError) return serverError('Failed to create staff profile', staffError);

    await logUserAction(user.userId, 'admin.staff.created', 'staff', staffRecord.id, getIP(request));
    return created({ user: staffUser, staff: staffRecord, employeeId });
  } catch (err) {
    return serverError('Staff creation failed', err);
  }
}
