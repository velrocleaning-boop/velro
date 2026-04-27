import { supabaseAdmin } from './supabase-admin';

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00',
];
const MAX_BOOKINGS_PER_SLOT = 5;
const LOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export interface AvailableSlot {
  date: string;
  time: string;
  available: boolean;
  remaining: number;
}

export async function getAvailableSlots(date: string, zoneSlug?: string): Promise<AvailableSlot[]> {
  const { data: existingBookings } = await supabaseAdmin
    .from('bookings')
    .select('time')
    .eq('date', date)
    .not('status', 'in', '("Cancelled")');

  const bookingCounts: Record<string, number> = {};
  for (const b of existingBookings || []) {
    if (b.time) {
      bookingCounts[b.time] = (bookingCounts[b.time] || 0) + 1;
    }
  }

  // Release expired locks
  await supabaseAdmin
    .from('slots')
    .update({ booking_id: null, locked_until: null, locked_by: null })
    .lt('locked_until', new Date().toISOString())
    .is('booking_id', null);

  // Get active locks
  const { data: lockedSlots } = await supabaseAdmin
    .from('slots')
    .select('time_slot')
    .eq('date', date)
    .not('locked_until', 'is', null)
    .gt('locked_until', new Date().toISOString());

  const lockedCounts: Record<string, number> = {};
  for (const s of lockedSlots || []) {
    lockedCounts[s.time_slot] = (lockedCounts[s.time_slot] || 0) + 1;
  }

  const today = new Date();
  const slotDate = new Date(date);
  const isToday = slotDate.toDateString() === today.toDateString();
  const currentHour = today.getHours();

  return TIME_SLOTS.map((time) => {
    const [h] = time.split(':').map(Number);
    if (isToday && h <= currentHour + 1) {
      return { date, time, available: false, remaining: 0 };
    }

    const booked = (bookingCounts[time] || 0) + (lockedCounts[time] || 0);
    const remaining = Math.max(0, MAX_BOOKINGS_PER_SLOT - booked);
    return { date, time, available: remaining > 0, remaining };
  });
}

export async function lockSlot(
  date: string,
  timeSlot: string,
  sessionToken: string
): Promise<boolean> {
  const lockedUntil = new Date(Date.now() + LOCK_DURATION_MS).toISOString();

  const { error } = await supabaseAdmin.from('slots').upsert(
    { date, time_slot: timeSlot, locked_until: lockedUntil, locked_by: sessionToken },
    { onConflict: 'date,time_slot,staff_id', ignoreDuplicates: false }
  );

  return !error;
}

export async function releaseSlotLock(date: string, timeSlot: string, sessionToken: string): Promise<void> {
  await supabaseAdmin
    .from('slots')
    .delete()
    .eq('date', date)
    .eq('time_slot', timeSlot)
    .eq('locked_by', sessionToken)
    .is('booking_id', null);
}

export async function getAvailableDates(startDate: string, days = 30): Promise<string[]> {
  const dates: string[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 5) { // Friday is weekly off
      dates.push(d.toISOString().split('T')[0]);
    }
  }

  return dates;
}
