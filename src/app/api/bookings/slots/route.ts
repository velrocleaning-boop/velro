import { NextRequest } from 'next/server';
import { getAvailableSlots, getAvailableDates } from '@/lib/slots';
import { ok, badRequest, serverError } from '@/lib/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const zone = searchParams.get('zone');
  const daysAhead = parseInt(searchParams.get('days') || '30');

  try {
    if (date) {
      // Return slots for a specific date
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return badRequest('Invalid date format (YYYY-MM-DD)');
      const slots = await getAvailableSlots(date, zone || undefined);
      return ok({ date, slots });
    }

    // Return available dates for next N days
    const today = new Date().toISOString().split('T')[0];
    const availableDates = await getAvailableDates(today, Math.min(daysAhead, 60));

    // Return first available slot for each date (summary mode)
    const summary = availableDates.map((d) => ({ date: d, available: true }));
    return ok({ dates: summary });
  } catch (err) {
    return serverError('Failed to fetch slots', err);
  }
}
