import { NextRequest } from 'next/server';
import { calculatePrice } from '@/lib/pricing';
import { ok, badRequest, serverError } from '@/lib/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, rooms, bathrooms, tier, addonIds, zoneSlug, date, time, isPriority, propertySizeSqm } = body;

    if (!service) return badRequest('Service is required');

    const pricing = await calculatePrice({
      serviceSlug: service,
      rooms: rooms || 1,
      bathrooms: bathrooms || 1,
      tier: tier || 'standard',
      addonIds,
      zoneSlug,
      date,
      time,
      isPriority,
      propertySizeSqm,
    });

    return ok(pricing);
  } catch (err: any) {
    if (err.message?.includes('not found')) return badRequest(err.message);
    return serverError('Pricing calculation failed', err);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get('service');
  if (!service) return badRequest('Service slug is required');

  try {
    const pricing = await calculatePrice({
      serviceSlug: service,
      rooms: parseInt(searchParams.get('rooms') || '1'),
      bathrooms: parseInt(searchParams.get('bathrooms') || '1'),
      tier: (searchParams.get('tier') as 'standard' | 'premium' | 'deep') || 'standard',
      zoneSlug: searchParams.get('zone') || undefined,
      date: searchParams.get('date') || undefined,
      time: searchParams.get('time') || undefined,
      isPriority: searchParams.get('priority') === 'true',
    });

    return ok(pricing);
  } catch (err: any) {
    if (err.message?.includes('not found')) return badRequest(err.message);
    return serverError('Pricing failed', err);
  }
}
