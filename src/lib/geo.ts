import { supabaseAdmin } from './supabase-admin';

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface ZoneInfo {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  isActive: boolean;
  basePriceMultiplier: number;
  surgeMultiplier: number;
}

// Haversine distance in km
export function haversineDistance(a: GeoLocation, b: GeoLocation): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

// Distance fee: 10 SAR per km beyond 5 km from city center
const CITY_CENTER: GeoLocation = { lat: 24.6877, lng: 46.7219 }; // Riyadh center
const FREE_RADIUS_KM = 5;
const RATE_PER_KM = 10;

export function calculateDistanceFee(customerLocation: GeoLocation): number {
  const dist = haversineDistance(CITY_CENTER, customerLocation);
  const billable = Math.max(0, dist - FREE_RADIUS_KM);
  return Math.round(billable * RATE_PER_KM);
}

export async function detectZoneFromSlug(slug: string): Promise<ZoneInfo | null> {
  const { data } = await supabaseAdmin
    .from('service_zones')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    nameAr: data.name_ar,
    slug: data.slug,
    isActive: data.is_active,
    basePriceMultiplier: data.base_price_multiplier,
    surgeMultiplier: data.surge_multiplier,
  };
}

export async function getAllZones(): Promise<ZoneInfo[]> {
  const { data } = await supabaseAdmin
    .from('service_zones')
    .select('*')
    .eq('is_active', true)
    .order('name');

  return (data || []).map((z) => ({
    id: z.id,
    name: z.name,
    nameAr: z.name_ar,
    slug: z.slug,
    isActive: z.is_active,
    basePriceMultiplier: z.base_price_multiplier,
    surgeMultiplier: z.surge_multiplier,
  }));
}

export async function detectZoneFromCoordinates(
  coords: GeoLocation
): Promise<ZoneInfo | null> {
  const zones = await getAllZones();

  // Find nearest zone center (simplified - real implementation uses polygon check)
  const { data } = await supabaseAdmin
    .from('service_zones')
    .select('*')
    .eq('is_active', true)
    .not('center_lat', 'is', null);

  let nearest: (typeof data extends (infer T)[] | null ? T : never) | null = null;
  let minDist = Infinity;

  for (const zone of data || []) {
    if (zone.center_lat && zone.center_lng) {
      const dist = haversineDistance(coords, { lat: zone.center_lat, lng: zone.center_lng });
      if (dist < minDist) {
        minDist = dist;
        nearest = zone;
      }
    }
  }

  return nearest
    ? {
        id: nearest.id,
        name: nearest.name,
        nameAr: nearest.name_ar,
        slug: nearest.slug,
        isActive: nearest.is_active,
        basePriceMultiplier: nearest.base_price_multiplier,
        surgeMultiplier: nearest.surge_multiplier,
      }
    : null;
}
