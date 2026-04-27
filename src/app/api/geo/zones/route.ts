import { NextRequest } from 'next/server';
import { getAllZones, detectZoneFromCoordinates } from '@/lib/geo';
import { ok, badRequest, serverError } from '@/lib/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');

  try {
    if (!isNaN(lat) && !isNaN(lng)) {
      const zone = await detectZoneFromCoordinates({ lat, lng });
      return ok({ detectedZone: zone, allZones: await getAllZones() });
    }

    const zones = await getAllZones();
    return ok(zones);
  } catch (err) {
    return serverError('Failed to fetch zones', err);
  }
}
