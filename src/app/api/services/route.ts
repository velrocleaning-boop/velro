import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ok, serverError } from '@/lib/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const includeAddons = searchParams.get('addons') === 'true';

  try {
    let query = supabaseAdmin
      .from('services_catalog')
      .select(includeAddons ? '*, service_addons(*)' : '*')
      .eq('is_active', true)
      .order('sort_order');

    if (category) query = query.eq('category', category);

    const { data, error } = await query;
    if (error) {
      // Fall back to static data if DB table not yet populated
      return ok(STATIC_SERVICES);
    }

    return ok(data?.length ? data : STATIC_SERVICES);
  } catch (err) {
    return ok(STATIC_SERVICES);
  }
}

// Static fallback until DB is seeded
const STATIC_SERVICES = [
  { slug: 'standard-cleaning', name: 'Standard Cleaning', base_price: 50, price_unit: 'per_hour', category: 'cleaning', duration_minutes: 120 },
  { slug: 'deep-cleaning', name: 'Deep Cleaning', base_price: 250, price_unit: 'flat', category: 'deep', duration_minutes: 240 },
  { slug: 'move-in-out', name: 'Move-in / Move-out Cleaning', base_price: 400, price_unit: 'flat', category: 'deep', duration_minutes: 360 },
  { slug: 'sofa-steam', name: 'Sofa & Carpet Steam Cleaning', base_price: 150, price_unit: 'flat', category: 'specialty', duration_minutes: 180 },
  { slug: 'ac-duct-cleaning', name: 'AC Duct & Vent Cleaning', base_price: 200, price_unit: 'flat', category: 'specialty', duration_minutes: 120 },
  { slug: 'marble-polishing', name: 'Marble Polishing', base_price: 300, price_unit: 'flat', category: 'specialty', duration_minutes: 240 },
];
