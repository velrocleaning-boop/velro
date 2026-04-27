import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { pgQuery } from '@/lib/pg-pool';
import { getAuthUser, getIP } from '@/lib/auth';
import { rateLimit, limits } from '@/lib/rate-limit';
import { calculatePrice } from '@/lib/pricing';
import { validateCoupon, recordCouponUsage } from '@/lib/coupons';
import { notifyBookingCreated } from '@/lib/notifications';
import { sendBookingConfirmation, sendNewBookingAlert } from '@/lib/email';
import { logAudit } from '@/lib/audit';
import { ok, created, badRequest, unauthorized, tooManyRequests, serverError, paginated } from '@/lib/response';

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'));
  const status = searchParams.get('status');
  const offset = (page - 1) * limit;

  try {
    let query = supabaseAdmin
      .from('bookings')
      .select('*', { count: 'exact' })
      .eq('user_id', user.userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);

    const { data, count, error } = await query;
    if (error) return serverError('Failed to fetch bookings', error);

    return paginated(data || [], count || 0, page, limit);
  } catch (err) {
    return serverError('Failed to fetch bookings', err);
  }
}

export async function POST(request: NextRequest) {
  const ip = getIP(request);
  const rl = rateLimit(`booking:${ip}`, limits.booking);
  if (!rl.allowed) return tooManyRequests('Slow down. Too many booking attempts.');

  try {
    const body = await request.json();
    const {
      name, email, phone, district, service, rooms, bathrooms, date, time,
      tier, addonIds, zoneSlug, notes, isPriority, isRecurring, recurringFrequency,
      address, couponCode, propertySizeSqm,
    } = body;

    if (!phone || !service || !date || !time) {
      return badRequest('Phone, service, date, and time are required');
    }
    if (!name && !email) return badRequest('Name or email is required');

    const user = await getAuthUser(request);

    // Lookup service
    const { data: serviceData } = await supabaseAdmin
      .from('services_catalog')
      .select('id, name, base_price')
      .eq('slug', service)
      .eq('is_active', true)
      .single();

    // Calculate price
    let pricing = null;
    let totalPrice = null;
    let basePrice = null;
    try {
      pricing = await calculatePrice({
        serviceSlug: service,
        rooms: rooms || 1,
        bathrooms: bathrooms || 1,
        tier: tier || 'standard',
        addonIds,
        zoneSlug: zoneSlug || district,
        date,
        time,
        isPriority,
        isRecurring,
        propertySizeSqm,
      });
      totalPrice = pricing.total;
      basePrice = pricing.basePrice;
    } catch {
      // Pricing optional — still save booking
    }

    // Validate coupon
    let discountAmount = 0;
    let couponId: string | null = null;
    if (couponCode && user && totalPrice) {
      const couponResult = await validateCoupon(couponCode, totalPrice, user.userId, service);
      if (couponResult.valid && couponResult.discountAmount) {
        discountAmount = couponResult.discountAmount;
        couponId = couponResult.coupon!.id;
        totalPrice = Math.max(0, totalPrice - discountAmount);
      }
    }

    // Direct pg insert — bypasses PostgREST schema cache entirely
    const rows = await pgQuery<{ id: string }>(
      `INSERT INTO bookings (
        name, email, phone, district, service, service_id,
        rooms, bathrooms, date, time, tier, addons,
        total_price, base_price, discount_amount, coupon_code,
        address, notes, is_priority, is_recurring, recurring_frequency,
        property_size_sqm, user_id, status, payment_status
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,
        $13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25
      ) RETURNING *`,
      [
        name ?? null,
        email ?? null,
        phone,
        district || zoneSlug || null,
        service,
        serviceData?.id ?? null,
        rooms || 1,
        bathrooms || 1,
        date,
        time,
        tier || 'standard',
        JSON.stringify(addonIds || []),
        totalPrice ?? null,
        basePrice ?? null,
        discountAmount,
        couponCode ?? null,
        address ?? null,
        notes ?? null,
        isPriority || false,
        isRecurring || false,
        isRecurring ? recurringFrequency : null,
        propertySizeSqm ?? null,
        user?.userId ?? null,
        'Pending',
        'unpaid',
      ]
    );

    const booking = rows[0];
    if (!booking) return serverError('Failed to create booking');

    // Record coupon usage
    if (couponId && user) {
      await recordCouponUsage(couponId, user.userId, booking.id, discountAmount);
    }

    // Notifications (non-blocking)
    const emailTo = email || '';
    if (user) {
      notifyBookingCreated(user.userId, booking.id, service).catch(() => {});
    }
    if (emailTo) {
      sendBookingConfirmation(emailTo, {
        name: name || 'Customer',
        service: serviceData?.name || service,
        date,
        time,
        district: district || zoneSlug || '',
        total: totalPrice || undefined,
        bookingId: booking.id,
      }).catch(() => {});
    }
    sendNewBookingAlert(booking).catch(() => {});

    await logAudit({
      userId: user?.userId,
      action: 'booking.created',
      resourceType: 'booking',
      resourceId: booking.id,
      ipAddress: ip,
      newValues: { service, date, time, totalPrice },
    });

    return created({ booking, pricing });
  } catch (err) {
    return serverError('Booking creation failed', err);
  }
}
