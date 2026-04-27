import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { rateLimit, limits } from '@/lib/rate-limit';
import { getIP } from '@/lib/auth';
import { ok, badRequest, tooManyRequests, serverError } from '@/lib/response';

export async function POST(request: NextRequest) {
  const ip = getIP(request);
  const rl = rateLimit(`contact:${ip}`, limits.strict);
  if (!rl.allowed) return tooManyRequests('Too many contact requests. Please wait.');

  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !message) return badRequest('Name and message are required');
    if (!email && !phone) return badRequest('Email or phone is required');

    const { error } = await supabaseAdmin
      .from('contacts')
      .insert({ name, email: email || null, phone: phone || null, message });

    if (error) return serverError('Failed to save message', error);

    // Notify admin via email (non-blocking)
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
          to: process.env.ADMIN_EMAIL,
          subject: `New Contact Message from ${name}`,
          html: `<p><strong>From:</strong> ${name}</p><p><strong>Email:</strong> ${email || 'N/A'}</p><p><strong>Phone:</strong> ${phone || 'N/A'}</p><p><strong>Message:</strong><br/>${message}</p>`,
        }),
      }).catch(() => {});
    }

    return ok({ message: 'Message received. We will contact you shortly.' });
  } catch (err) {
    return serverError('Failed to process contact form', err);
  }
}
