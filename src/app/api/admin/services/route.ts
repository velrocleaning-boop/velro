import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireAuth, getIP } from '@/lib/auth';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/response';
import { logUserAction } from '@/lib/audit';

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const { data, error: fetchError } = await supabaseAdmin
    .from('services_catalog')
    .select('*, service_addons(*)')
    .order('sort_order');

  if (fetchError) return serverError('Failed to fetch services', fetchError);
  return ok(data || []);
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  try {
    const body = await request.json();
    const { slug, name, nameAr, description, descriptionAr, basePrice, priceUnit, minPrice, maxPrice, category, durationMinutes, imageUrl, sortOrder, features, requirements } = body;

    if (!slug || !name || !basePrice) return badRequest('Slug, name, and base price are required');

    const { data: service, error: insertError } = await supabaseAdmin
      .from('services_catalog')
      .insert({
        slug,
        name,
        name_ar: nameAr,
        description,
        description_ar: descriptionAr,
        base_price: basePrice,
        price_unit: priceUnit || 'flat',
        min_price: minPrice,
        max_price: maxPrice,
        category: category || 'cleaning',
        duration_minutes: durationMinutes || 120,
        image_url: imageUrl,
        sort_order: sortOrder || 0,
        features: features || [],
        requirements,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') return badRequest('Service slug already exists');
      return serverError('Failed to create service', insertError);
    }

    await logUserAction(user.userId, 'admin.service.created', 'service', service.id, getIP(request));
    return created(service);
  } catch (err) {
    return serverError('Service creation failed', err);
  }
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await requireAuth(request, 'admin');
  if (error || !user) return unauthorized(error || 'Unauthorized');

  const body = await request.json();
  const { id, ...rest } = body;
  if (!id) return badRequest('Service ID required');

  const allowed = ['name', 'name_ar', 'description', 'base_price', 'price_unit', 'min_price',
    'max_price', 'category', 'duration_minutes', 'image_url', 'sort_order', 'is_active', 'features'];

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    const bodyKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    if (rest[bodyKey] !== undefined) updates[key] = rest[bodyKey];
    else if (rest[key] !== undefined) updates[key] = rest[key];
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('services_catalog')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (updateError) return serverError('Failed to update service', updateError);
  await logUserAction(user.userId, 'admin.service.updated', 'service', id, getIP(request));
  return ok(updated);
}
