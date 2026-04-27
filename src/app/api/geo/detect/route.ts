import { NextRequest } from 'next/server';
import { detectZoneFromCoordinates, calculateDistanceFee } from '@/lib/geo';
import { ok, badRequest, serverError } from '@/lib/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');

  if (isNaN(lat) || isNaN(lng)) {
    return badRequest('Valid lat and lng query params required');
  }

  try {
    const zone = await detectZoneFromCoordinates({ lat, lng });
    const distanceFee = calculateDistanceFee({ lat, lng });

    return ok({
      zone,
      distanceFee,
      coordinates: { lat, lng },
      inServiceArea: !!zone,
    });
  } catch (err) {
    return serverError('Geo detection failed', err);
  }
}
