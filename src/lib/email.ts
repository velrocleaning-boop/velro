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
      <p>WhatsApp: +966 50 000 0000 | support@velro.sa</p>
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
