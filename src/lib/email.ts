const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_VxhtdQtF_92qU1FzHCYDsQpA7LHevWeaS';
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'velrocleaning@gmail.com';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function baseTemplate(title: string, content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f5f5;padding:20px">
  <div style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
    <div style="background:#0f172a;padding:24px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:24px">Velro Cleaning</h1>
      <p style="color:#94a3b8;margin:4px 0 0">Premium Cleaning Services - Riyadh</p>
    </div>
    <div style="padding:32px">
      ${content}
    </div>
    <div style="background:#f8fafc;padding:16px;text-align:center;font-size:12px;color:#94a3b8">
      <p>Velro Cleaning Services | Riyadh, Saudi Arabia</p>
      <p>WhatsApp: +966 59 484 7866 | support@velro.sa</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendBookingConfirmation(
  to: string,
  booking: {
    name: string;
    service: string;
    date: string;
    time: string;
    district: string;
    total?: number;
    bookingId?: string;
  }
): Promise<boolean> {
  const html = baseTemplate(
    'Booking Confirmed',
    `<h2 style="color:#0f172a">Booking Confirmed! ✅</h2>
    <p>Hello <strong>${booking.name}</strong>, your booking has been confirmed.</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0">
      <tr style="background:#f8fafc"><td style="padding:12px;font-weight:bold">Service</td><td style="padding:12px">${booking.service}</td></tr>
      <tr><td style="padding:12px;font-weight:bold">Date</td><td style="padding:12px">${booking.date}</td></tr>
      <tr style="background:#f8fafc"><td style="padding:12px;font-weight:bold">Time</td><td style="padding:12px">${booking.time}</td></tr>
      <tr><td style="padding:12px;font-weight:bold">Location</td><td style="padding:12px">${booking.district}</td></tr>
      ${booking.total ? `<tr style="background:#f8fafc"><td style="padding:12px;font-weight:bold">Total</td><td style="padding:12px;color:#0f172a;font-weight:bold">${booking.total} SAR</td></tr>` : ''}
    </table>
    <p>We'll assign a professional cleaner and notify you. You can track your booking in your dashboard.</p>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://velro.sa'}/dashboard" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:16px">View Dashboard</a>`
  );

  return sendEmail({ to, subject: 'Booking Confirmed - Velro Cleaning', html });
}

export async function sendBookingStatusUpdate(
  to: string,
  name: string,
  status: string,
  bookingId: string
): Promise<boolean> {
  const statusMessages: Record<string, string> = {
    Confirmed: 'Your booking has been confirmed ✅',
    Assigned: 'A professional cleaner has been assigned to your booking 🧹',
    'In Progress': 'Your cleaning service is now in progress 🏠',
    Completed: 'Your cleaning service has been completed! Hope you love it ⭐',
    Cancelled: 'Your booking has been cancelled',
  };

  const html = baseTemplate(
    `Booking ${status}`,
    `<h2 style="color:#0f172a">Booking Update</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p style="font-size:18px">${statusMessages[status] || `Your booking status: ${status}`}</p>
    ${status === 'Completed' ? `<p>Please leave a review to help us improve!</p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://velro.sa'}/dashboard" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none">Leave a Review</a>` : ''}`
  );

  return sendEmail({ to, subject: `Booking ${status} - Velro Cleaning`, html });
}

export async function sendPasswordReset(to: string, resetLink: string): Promise<boolean> {
  const html = baseTemplate(
    'Reset Your Password',
    `<h2 style="color:#0f172a">Reset Your Password</h2>
    <p>You requested a password reset. Click the button below to set a new password.</p>
    <p>This link expires in <strong>1 hour</strong>.</p>
    <a href="${resetLink}" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin:20px 0">Reset Password</a>
    <p style="color:#94a3b8;font-size:13px">If you didn't request this, ignore this email.</p>`
  );

  return sendEmail({ to, subject: 'Reset Your Velro Password', html });
}

export async function sendWelcomeEmail(to: string, name: string, referralCode: string): Promise<boolean> {
  const html = baseTemplate(
    'Welcome to Velro',
    `<h2 style="color:#0f172a">Welcome to Velro, ${name}! 🎉</h2>
    <p>Your account has been created. Experience Riyadh's finest cleaning service.</p>
    <p>Your referral code: <strong style="font-size:20px;color:#0f172a">${referralCode}</strong></p>
    <p>Share it and earn 500 loyalty points for each friend who books!</p>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://velro.sa'}/book" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:16px">Book Your First Clean</a>`
  );

  return sendEmail({ to, subject: 'Welcome to Velro Cleaning!', html });
}

export async function sendNewBookingAlert(booking: Record<string, unknown>): Promise<boolean> {
  const html = baseTemplate(
    'New Booking Received',
    `<h2>New Booking #${(booking.id as string)?.slice(0, 8)}</h2>
    <table style="width:100%;border-collapse:collapse">
      ${Object.entries(booking)
        .filter(([k]) => !['id', 'created_at'].includes(k))
        .map(([k, v], i) => `<tr style="background:${i % 2 ? '#f8fafc' : '#fff'}"><td style="padding:10px;font-weight:bold">${k}</td><td style="padding:10px">${v}</td></tr>`)
        .join('')}
    </table>`
  );

  return sendEmail({ to: ADMIN_EMAIL, subject: 'New Booking - Velro', html });
}

export async function sendInvoiceEmail(
  to: string,
  booking: {
    name: string; phone?: string; district?: string; email?: string;
    service?: string; date?: string; time?: string; id: string;
    coupon_code?: string; payment_status?: string;
  },
  items: { description: string; qty: number; unitPrice: number }[],
  totals: { subtotal: number; vat: number; discount: number; total: number },
  notes?: string
): Promise<boolean> {
  const invoiceNumber = `INV-${booking.id.split('-')[0].toUpperCase()}`;
  const itemRows = items.map((item, i) =>
    `<tr style="background:${i % 2 === 0 ? '#fff' : '#f8fafc'}">
      <td style="padding:12px 16px;color:#111827">${item.description}</td>
      <td style="padding:12px 16px;text-align:center;color:#4b5563">${item.qty}</td>
      <td style="padding:12px 16px;text-align:right;color:#4b5563">SAR ${item.unitPrice.toFixed(2)}</td>
      <td style="padding:12px 16px;text-align:right;font-weight:600;color:#111827">SAR ${(item.qty * item.unitPrice).toFixed(2)}</td>
    </tr>`
  ).join('');

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Tax Invoice ${invoiceNumber}</title></head>
<body style="font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:20px">
<div style="max-width:700px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
  <!-- Header -->
  <div style="background:#0f172a;padding:32px 40px;display:flex;justify-content:space-between">
    <div>
      <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-1px">VELRO</div>
      <div style="color:#94a3b8;font-size:13px;margin-top:4px">Cleaning Services · Riyadh, KSA</div>
      <div style="color:#64748b;font-size:12px;margin-top:2px">VAT Reg: 300000000000003</div>
    </div>
    <div style="text-align:right">
      <div style="color:#94a3b8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px">Tax Invoice</div>
      <div style="color:#fff;font-size:22px;font-weight:800;margin-top:4px">${invoiceNumber}</div>
      <div style="color:#94a3b8;font-size:13px;margin-top:4px">${new Date().toLocaleDateString('en-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      <div style="margin-top:8px"><span style="background:${booking.payment_status === 'paid' ? '#10b981' : '#f59e0b'};color:#fff;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700">${(booking.payment_status || 'UNPAID').toUpperCase()}</span></div>
    </div>
  </div>

  <div style="padding:32px 40px">
    <!-- Bill To / Service Details -->
    <table style="width:100%;margin-bottom:32px"><tr>
      <td style="vertical-align:top;width:50%">
        <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px">Bill To</div>
        <div style="font-size:18px;font-weight:700;color:#111827">${booking.name}</div>
        ${booking.phone ? `<div style="color:#4b5563;margin-top:4px">${booking.phone}</div>` : ''}
        ${booking.email ? `<div style="color:#4b5563;margin-top:2px">${booking.email}</div>` : ''}
        ${booking.district ? `<div style="color:#4b5563;margin-top:2px">${booking.district}, Riyadh</div>` : ''}
      </td>
      <td style="vertical-align:top;width:50%;padding-left:32px">
        <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px">Service Details</div>
        <div style="color:#111827;font-weight:600">${booking.service || 'Cleaning Service'}</div>
        ${booking.date ? `<div style="color:#4b5563;margin-top:4px">Date: ${booking.date}</div>` : ''}
        ${booking.time ? `<div style="color:#4b5563;margin-top:2px">Time: ${booking.time}</div>` : ''}
      </td>
    </tr></table>

    <!-- Line Items -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <thead>
        <tr style="background:#f8fafc;border-bottom:2px solid #e5e7eb">
          <th style="padding:12px 16px;text-align:left;font-size:12px;color:#374151;font-weight:700;text-transform:uppercase">Description</th>
          <th style="padding:12px 16px;text-align:center;font-size:12px;color:#374151;font-weight:700;text-transform:uppercase">Qty</th>
          <th style="padding:12px 16px;text-align:right;font-size:12px;color:#374151;font-weight:700;text-transform:uppercase">Unit Price</th>
          <th style="padding:12px 16px;text-align:right;font-size:12px;color:#374151;font-weight:700;text-transform:uppercase">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <!-- Totals -->
    <table style="width:100%;margin-bottom:24px"><tr><td style="width:55%"></td><td>
      <table style="width:100%">
        <tr><td style="padding:6px 0;color:#4b5563">Subtotal</td><td style="text-align:right;color:#4b5563">SAR ${totals.subtotal.toFixed(2)}</td></tr>
        ${totals.discount > 0 ? `<tr><td style="padding:6px 0;color:#10b981">Discount${booking.coupon_code ? ` (${booking.coupon_code})` : ''}</td><td style="text-align:right;color:#10b981">−SAR ${totals.discount.toFixed(2)}</td></tr>` : ''}
        <tr style="border-bottom:2px solid #111827"><td style="padding:6px 0;color:#4b5563">VAT (15%)</td><td style="text-align:right;color:#4b5563">SAR ${totals.vat.toFixed(2)}</td></tr>
        <tr><td style="padding:10px 0 0;font-size:20px;font-weight:900;color:#111827">Total</td><td style="padding:10px 0 0;text-align:right;font-size:20px;font-weight:900;color:#111827">SAR ${totals.total.toFixed(2)}</td></tr>
      </table>
    </td></tr></table>

    ${notes ? `<div style="background:#f8fafc;border-left:4px solid #e2e8f0;padding:16px;border-radius:6px;margin-bottom:24px"><div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px">Notes</div><p style="color:#4b5563;margin:0">${notes}</p></div>` : ''}
  </div>

  <!-- Footer -->
  <div style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb">
    <p style="color:#94a3b8;margin:0;font-size:13px">Thank you for choosing Velro Cleaning Services.</p>
    <p style="color:#94a3b8;margin:4px 0 0;font-size:12px">Payment due upon completion · velro.services</p>
  </div>
</div>
</body></html>`;

  return sendEmail({ to, subject: `Tax Invoice ${invoiceNumber} - Velro Cleaning`, html });
}

export async function sendQuotationEmail(
  to: string,
  booking: {
    name: string; phone?: string; district?: string; email?: string;
    service?: string; date?: string; time?: string; id: string;
  },
  items: { description: string; qty: number; unitPrice: number }[],
  totals: { subtotal: number; vat: number; discount: number; total: number },
  validUntil: string,
  notes?: string
): Promise<boolean> {
  const quoteNumber = `QTE-${booking.id.split('-')[0].toUpperCase()}`;
  const itemRows = items.map((item, i) =>
    `<tr style="background:${i % 2 === 0 ? '#fff' : '#f8fafc'}">
      <td style="padding:12px 16px;color:#111827">${item.description}</td>
      <td style="padding:12px 16px;text-align:center;color:#4b5563">${item.qty}</td>
      <td style="padding:12px 16px;text-align:right;color:#4b5563">SAR ${item.unitPrice.toFixed(2)}</td>
      <td style="padding:12px 16px;text-align:right;font-weight:600;color:#111827">SAR ${(item.qty * item.unitPrice).toFixed(2)}</td>
    </tr>`
  ).join('');

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Quotation ${quoteNumber}</title></head>
<body style="font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:20px">
<div style="max-width:700px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
  <div style="background:#1e3a5f;padding:32px 40px">
    <div>
      <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-1px">VELRO</div>
      <div style="color:#93c5fd;font-size:13px;margin-top:4px">Cleaning Services · Riyadh, KSA</div>
    </div>
    <div style="margin-top:16px;border-top:1px solid rgba(255,255,255,0.15);padding-top:16px">
      <div style="color:#93c5fd;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px">Quotation</div>
      <div style="color:#fff;font-size:22px;font-weight:800;margin-top:4px">${quoteNumber}</div>
      <div style="color:#93c5fd;font-size:13px;margin-top:4px">Valid Until: <strong style="color:#fff">${validUntil}</strong></div>
    </div>
  </div>

  <div style="padding:32px 40px">
    <table style="width:100%;margin-bottom:32px"><tr>
      <td style="vertical-align:top;width:50%">
        <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px">Prepared For</div>
        <div style="font-size:18px;font-weight:700;color:#111827">${booking.name}</div>
        ${booking.phone ? `<div style="color:#4b5563;margin-top:4px">${booking.phone}</div>` : ''}
        ${booking.email ? `<div style="color:#4b5563;margin-top:2px">${booking.email}</div>` : ''}
        ${booking.district ? `<div style="color:#4b5563;margin-top:2px">${booking.district}, Riyadh</div>` : ''}
      </td>
      <td style="vertical-align:top;width:50%;padding-left:32px">
        <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px">Service Requested</div>
        <div style="color:#111827;font-weight:600">${booking.service || 'Cleaning Service'}</div>
        ${booking.date ? `<div style="color:#4b5563;margin-top:4px">Preferred Date: ${booking.date}</div>` : ''}
        ${booking.time ? `<div style="color:#4b5563;margin-top:2px">Preferred Time: ${booking.time}</div>` : ''}
      </td>
    </tr></table>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <thead>
        <tr style="background:#f8fafc;border-bottom:2px solid #e5e7eb">
          <th style="padding:12px 16px;text-align:left;font-size:12px;color:#374151;font-weight:700;text-transform:uppercase">Description</th>
          <th style="padding:12px 16px;text-align:center;font-size:12px;color:#374151;font-weight:700;text-transform:uppercase">Qty</th>
          <th style="padding:12px 16px;text-align:right;font-size:12px;color:#374151;font-weight:700;text-transform:uppercase">Unit Price</th>
          <th style="padding:12px 16px;text-align:right;font-size:12px;color:#374151;font-weight:700;text-transform:uppercase">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <table style="width:100%;margin-bottom:24px"><tr><td style="width:55%"></td><td>
      <table style="width:100%">
        <tr><td style="padding:6px 0;color:#4b5563">Subtotal</td><td style="text-align:right;color:#4b5563">SAR ${totals.subtotal.toFixed(2)}</td></tr>
        ${totals.discount > 0 ? `<tr><td style="padding:6px 0;color:#10b981">Discount</td><td style="text-align:right;color:#10b981">−SAR ${totals.discount.toFixed(2)}</td></tr>` : ''}
        <tr style="border-bottom:2px solid #111827"><td style="padding:6px 0;color:#4b5563">VAT (15%)</td><td style="text-align:right;color:#4b5563">SAR ${totals.vat.toFixed(2)}</td></tr>
        <tr><td style="padding:10px 0 0;font-size:20px;font-weight:900;color:#111827">Total</td><td style="padding:10px 0 0;text-align:right;font-size:20px;font-weight:900;color:#1e3a5f">SAR ${totals.total.toFixed(2)}</td></tr>
      </table>
    </td></tr></table>

    ${notes ? `<div style="background:#f8fafc;border-left:4px solid #93c5fd;padding:16px;border-radius:6px;margin-bottom:24px"><div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px">Notes</div><p style="color:#4b5563;margin:0">${notes}</p></div>` : ''}

    <div style="background:#eff6ff;border-radius:8px;padding:16px;text-align:center">
      <p style="color:#1e3a5f;font-weight:700;margin:0">To accept this quotation, reply to this email or WhatsApp us.</p>
      <p style="color:#3b82f6;font-size:13px;margin:4px 0 0">This quotation is valid until ${validUntil}</p>
    </div>
  </div>

  <div style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb">
    <p style="color:#94a3b8;margin:0;font-size:13px">Velro Cleaning Services · Riyadh, Saudi Arabia</p>
    <p style="color:#94a3b8;margin:4px 0 0;font-size:12px">velro.services · velrocleaning@gmail.com</p>
  </div>
</div>
</body></html>`;

  return sendEmail({ to, subject: `Quotation ${quoteNumber} - Velro Cleaning`, html });
}

export async function sendTicketReply(
  to: string,
  name: string,
  ticketNumber: string,
  message: string
): Promise<boolean> {
  const html = baseTemplate(
    'Support Update',
    `<h2>Support Ticket Update - #${ticketNumber}</h2>
    <p>Hello <strong>${name}</strong>, here's a reply from our team:</p>
    <div style="background:#f8fafc;border-left:4px solid #0f172a;padding:16px;margin:20px 0;border-radius:4px">
      <p style="margin:0">${message}</p>
    </div>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://velro.sa'}/dashboard/tickets/${ticketNumber}" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none">View Ticket</a>`
  );

  return sendEmail({ to, subject: `Support Reply - Ticket #${ticketNumber}`, html });
}
