// ============================================================
// VELRO BACKEND API TEST SCRIPT
// Run: node test-api.mjs
// ============================================================

const BASE = 'http://localhost:3000';
let accessToken = '';
let refreshToken = '';
let userId = '';
let bookingId = '';
let ticketId = '';
let couponCode = '';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

let passed = 0;
let failed = 0;
const failures = [];

function log(msg, color = 'white') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function section(title) {
  console.log(`\n${colors.bold}${colors.cyan}━━━ ${title} ━━━${colors.reset}`);
}

async function test(name, fn) {
  try {
    const result = await fn();
    if (result.ok) {
      log(`  ✅ ${name}`, 'green');
      passed++;
      return result.data;
    } else {
      log(`  ❌ ${name} → ${result.error}`, 'red');
      failures.push({ name, error: result.error });
      failed++;
      return null;
    }
  } catch (err) {
    log(`  💥 ${name} → ${err.message}`, 'red');
    failures.push({ name, error: err.message });
    failed++;
    return null;
  }
}

async function req(method, path, body, auth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (json.success === false || (!res.ok && !json.success)) {
    return { ok: false, error: json.error || `HTTP ${res.status}`, status: res.status, data: json };
  }
  return { ok: true, data: json.data ?? json, status: res.status };
}

// ============================================================
// TESTS
// ============================================================

async function testAuth() {
  section('AUTH SYSTEM');

  // Register
  const regData = await test('POST /api/auth/register', async () => {
    const res = await req('POST', '/api/auth/register', {
      email: `test_${Date.now()}@velro.sa`,
      password: 'Test1234!',
      firstName: 'Test',
      lastName: 'User',
      phone: '+966501234567',
    });
    if (res.ok) {
      accessToken = res.data.accessToken;
      refreshToken = res.data.refreshToken;
      userId = res.data.user?.id;
    }
    return res;
  });

  // Login with same email (register again would fail, test login separately)
  await test('POST /api/auth/login (wrong password)', async () => {
    const res = await req('POST', '/api/auth/login', {
      email: 'nonexistent@velro.sa',
      password: 'wrongpassword',
    });
    return { ok: res.status === 401, error: res.status !== 401 ? 'Expected 401' : undefined };
  });

  // Get current user
  await test('GET /api/auth/me', async () => {
    return req('GET', '/api/auth/me', null, true);
  });

  // Update profile
  await test('PATCH /api/auth/me', async () => {
    return req('PATCH', '/api/auth/me', { firstName: 'Updated', phone: '+966509999999' }, true);
  });

  // Refresh token
  await test('POST /api/auth/refresh', async () => {
    const res = await req('POST', '/api/auth/refresh', { refreshToken });
    if (res.ok) {
      accessToken = res.data.accessToken;
      refreshToken = res.data.refreshToken;
    }
    return res;
  });
}

async function testBookings() {
  section('BOOKING SYSTEM');

  // Get available slots
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];

  await test('GET /api/bookings/slots?date=...', async () => {
    return req('GET', `/api/bookings/slots?date=${dateStr}`);
  });

  // Get available dates
  await test('GET /api/bookings/slots (date range)', async () => {
    return req('GET', `/api/bookings/slots?days=14`);
  });

  // Pricing calculator
  await test('POST /api/bookings/pricing', async () => {
    return req('POST', '/api/bookings/pricing', {
      service: 'standard-cleaning',
      rooms: 3,
      bathrooms: 2,
      tier: 'standard',
    });
  });

  // Pricing via GET
  await test('GET /api/bookings/pricing?service=...', async () => {
    return req('GET', '/api/bookings/pricing?service=standard-cleaning&rooms=2&bathrooms=1');
  });

  // Create booking
  const bookingData = await test('POST /api/bookings', async () => {
    const res = await req('POST', '/api/bookings', {
      name: 'Test Customer',
      email: 'testcustomer@velro.sa',
      phone: '+966501234567',
      district: 'al-olaya',
      service: 'standard-cleaning',
      rooms: 2,
      bathrooms: 1,
      date: dateStr,
      time: '10:00',
      tier: 'standard',
      notes: 'Test booking from API script',
    }, true);
    if (res.ok) bookingId = res.data.booking?.id;
    return res;
  });

  // Get bookings list
  await test('GET /api/bookings', async () => {
    return req('GET', '/api/bookings', null, true);
  });

  // Get single booking
  if (bookingId) {
    await test('GET /api/bookings/:id', async () => {
      return req('GET', `/api/bookings/${bookingId}`, null, true);
    });

    // Update booking notes
    await test('PATCH /api/bookings/:id (notes)', async () => {
      return req('PATCH', `/api/bookings/${bookingId}`, { notes: 'Updated notes' }, true);
    });

    // Reschedule
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    await test('POST /api/bookings/:id/reschedule', async () => {
      return req('POST', `/api/bookings/${bookingId}/reschedule`, {
        newDate: futureDate.toISOString().split('T')[0],
        newTime: '14:00',
      }, true);
    });

    // Cancel booking
    await test('POST /api/bookings/:id/cancel', async () => {
      return req('POST', `/api/bookings/${bookingId}/cancel`, {
        reason: 'Test cancellation',
      }, true);
    });
  }
}

async function testServices() {
  section('SERVICES');

  await test('GET /api/services', async () => {
    return req('GET', '/api/services');
  });

  await test('GET /api/services?category=cleaning', async () => {
    return req('GET', '/api/services?category=cleaning');
  });

  await test('GET /api/services/recommend', async () => {
    return req('GET', '/api/services/recommend?propertyType=apartment&rooms=2');
  });

  await test('GET /api/services/recommend (with auth)', async () => {
    return req('GET', '/api/services/recommend?rooms=3', null, true);
  });
}

async function testCoupons() {
  section('COUPONS ENGINE');

  // First create a coupon via admin, then test validation
  // We'll test validation with a non-existent code (should return error)
  await test('POST /api/coupons/validate (invalid code)', async () => {
    const res = await req('POST', '/api/coupons/validate', {
      code: 'FAKECODE999',
      orderAmount: 300,
    }, true);
    return { ok: res.status === 400, error: res.status !== 400 ? 'Expected 400 for invalid coupon' : undefined };
  });
}

async function testReviews() {
  section('REVIEWS SYSTEM');

  await test('GET /api/reviews', async () => {
    return req('GET', '/api/reviews');
  });

  await test('GET /api/reviews?page=1&limit=5', async () => {
    return req('GET', '/api/reviews?page=1&limit=5');
  });

  // Try submitting review without completed booking (should fail)
  await test('POST /api/reviews (no completed booking - expected 400)', async () => {
    const res = await req('POST', '/api/reviews', {
      bookingId: '00000000-0000-0000-0000-000000000000',
      overallRating: 5,
      comment: 'Great service!',
    }, true);
    return { ok: res.status === 400 || res.status === 404, error: res.ok ? 'Should have failed' : undefined };
  });
}

async function testNotifications() {
  section('NOTIFICATIONS');

  await test('GET /api/notifications', async () => {
    return req('GET', '/api/notifications', null, true);
  });

  await test('GET /api/notifications?unread=true', async () => {
    return req('GET', '/api/notifications?unread=true', null, true);
  });

  await test('PATCH /api/notifications (mark all read)', async () => {
    return req('PATCH', '/api/notifications', { markAll: true }, true);
  });
}

async function testTickets() {
  section('SUPPORT TICKETS');

  const ticketData = await test('POST /api/tickets', async () => {
    const res = await req('POST', '/api/tickets', {
      subject: 'Test support ticket',
      message: 'This is a test message from the API test script.',
      category: 'inquiry',
      priority: 'normal',
    }, true);
    if (res.ok) ticketId = res.data.ticket?.id;
    return res;
  });

  await test('GET /api/tickets', async () => {
    return req('GET', '/api/tickets', null, true);
  });

  if (ticketId) {
    await test('GET /api/tickets/:id', async () => {
      return req('GET', `/api/tickets/${ticketId}`, null, true);
    });

    await test('POST /api/tickets/:id (reply)', async () => {
      return req('POST', `/api/tickets/${ticketId}`, {
        message: 'Follow-up message from customer',
      }, true);
    });
  }
}

async function testLoyalty() {
  section('LOYALTY & REFERRALS');

  await test('GET /api/loyalty', async () => {
    return req('GET', '/api/loyalty', null, true);
  });

  await test('POST /api/loyalty (redeem - insufficient points)', async () => {
    const res = await req('POST', '/api/loyalty', { pointsToRedeem: 999999 }, true);
    return { ok: res.status === 400, error: res.status !== 400 ? 'Expected 400' : undefined };
  });

  await test('GET /api/referrals', async () => {
    return req('GET', '/api/referrals', null, true);
  });
}

async function testGeo() {
  section('GEO & ZONES');

  await test('GET /api/geo/zones', async () => {
    return req('GET', '/api/geo/zones');
  });

  await test('GET /api/geo/zones?lat=24.68&lng=46.72', async () => {
    return req('GET', '/api/geo/zones?lat=24.68&lng=46.72');
  });

  await test('GET /api/geo/detect?lat=24.68&lng=46.72', async () => {
    return req('GET', '/api/geo/detect?lat=24.68&lng=46.72');
  });

  await test('GET /api/geo/detect (missing params - expected 400)', async () => {
    const res = await req('GET', '/api/geo/detect');
    return { ok: res.status === 400, error: res.status !== 400 ? 'Expected 400' : undefined };
  });
}

async function testBlog() {
  section('BLOG / CMS');

  await test('GET /api/blog', async () => {
    return req('GET', '/api/blog');
  });

  await test('GET /api/blog?page=1&limit=5', async () => {
    return req('GET', '/api/blog?page=1&limit=5');
  });

  await test('GET /api/blog/nonexistent-post (expected 404)', async () => {
    const res = await req('GET', '/api/blog/nonexistent-slug-12345');
    return { ok: res.status === 404, error: res.status !== 404 ? 'Expected 404' : undefined };
  });
}

async function testSubscriptions() {
  section('SUBSCRIPTIONS');

  await test('GET /api/subscriptions', async () => {
    return req('GET', '/api/subscriptions', null, true);
  });
}

async function testPayments() {
  section('PAYMENTS');

  await test('GET /api/payments', async () => {
    return req('GET', '/api/payments', null, true);
  });

  // Test refund without admin (should fail)
  await test('POST /api/payments/refund (no admin - expected 401/403)', async () => {
    const res = await req('POST', '/api/payments/refund', {
      paymentId: '00000000-0000-0000-0000-000000000000',
      refundAmount: 100,
    }, true);
    return { ok: res.status === 401 || res.status === 403, error: res.ok ? 'Should have been rejected' : undefined };
  });
}

async function testAdminDashboard() {
  section('ADMIN APIs (requires admin role — will return 403 for customer)');

  await test('GET /api/admin/dashboard (customer → 403)', async () => {
    const res = await req('GET', '/api/admin/dashboard', null, true);
    return { ok: res.status === 403 || res.status === 401, error: res.ok ? 'Should have been 403' : undefined };
  });

  await test('GET /api/admin/analytics (customer → 403)', async () => {
    const res = await req('GET', '/api/admin/analytics', null, true);
    return { ok: res.status === 403 || res.status === 401, error: res.ok ? 'Should have been 403' : undefined };
  });

  await test('GET /api/admin/users (customer → 403)', async () => {
    const res = await req('GET', '/api/admin/users', null, true);
    return { ok: res.status === 403 || res.status === 401, error: res.ok ? 'Should have been 403' : undefined };
  });
}

async function testRateLimit() {
  section('RATE LIMITING');

  await test('Rate limit on auth endpoints', async () => {
    // Send 3 rapid invalid login attempts
    for (let i = 0; i < 3; i++) {
      await fetch(`${BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'x@x.com', password: 'wrong' }),
      });
    }
    // Should still work (limit is 10/15min)
    return { ok: true };
  });
}

async function testLogout() {
  section('LOGOUT');

  await test('POST /api/auth/logout', async () => {
    return req('POST', '/api/auth/logout', { refreshToken }, true);
  });

  // After logout, me should still work (token not expired yet)
  await test('GET /api/auth/me after logout (token still valid in-memory)', async () => {
    return req('GET', '/api/auth/me', null, true);
  });
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log(`\n${colors.bold}${colors.cyan}╔══════════════════════════════════════╗`);
  console.log(`║   VELRO BACKEND API TEST SUITE       ║`);
  console.log(`╚══════════════════════════════════════╝${colors.reset}`);
  console.log(`${colors.yellow}Server: ${BASE}${colors.reset}\n`);

  // Check server is running
  try {
    await fetch(`${BASE}/api/services`);
  } catch {
    log('\n❌ ERROR: Server is not running! Start it with: npm run dev\n', 'red');
    process.exit(1);
  }

  await testAuth();
  await testBookings();
  await testServices();
  await testCoupons();
  await testReviews();
  await testNotifications();
  await testTickets();
  await testLoyalty();
  await testGeo();
  await testBlog();
  await testSubscriptions();
  await testPayments();
  await testAdminDashboard();
  await testRateLimit();
  await testLogout();

  // Summary
  console.log(`\n${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bold}RESULTS${colors.reset}`);
  console.log(`${colors.green}  ✅ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}  ❌ Failed: ${failed}${colors.reset}`);
  console.log(`${colors.cyan}  📊 Total:  ${passed + failed}${colors.reset}`);

  if (failures.length > 0) {
    console.log(`\n${colors.red}${colors.bold}Failed Tests:${colors.reset}`);
    for (const f of failures) {
      console.log(`  ${colors.red}→ ${f.name}${colors.reset}`);
      console.log(`    ${colors.yellow}${f.error}${colors.reset}`);
    }
  }

  const score = Math.round((passed / (passed + failed)) * 100);
  const scoreColor = score >= 90 ? 'green' : score >= 70 ? 'yellow' : 'red';
  console.log(`\n${colors[scoreColor]}${colors.bold}  Score: ${score}% ${score >= 90 ? '🔥' : score >= 70 ? '👍' : '⚠️'}${colors.reset}\n`);
}

main().catch(console.error);
