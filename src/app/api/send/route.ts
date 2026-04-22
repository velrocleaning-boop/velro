import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, district, service, rooms, bathrooms, date, time } = body;

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('bookings')
      .insert([
        { 
          name, 
          email, 
          phone, 
          district, 
          service,
          rooms: rooms || 1,
          bathrooms: bathrooms || 1,
          date,
          time
        }
      ]);

    if (dbError) {
      console.error('Supabase error:', dbError);
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer re_VxhtdQtF_92qU1FzHCYDsQpA7LHevWeaS`,
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'velrocleaning@gmail.com',
        subject: `New Booking Request from ${name}`,
        html: `
          <h3>New Booking Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>District:</strong> ${district}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Property:</strong> ${rooms || 1} Rooms, ${bathrooms || 1} Bathrooms</p>
          <p><strong>Schedule:</strong> ${date} at ${time}</p>
        `,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    } else {
      const error = await res.text();
      return NextResponse.json({ error }, { status: res.status });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
