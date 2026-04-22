import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user && !error) {
      const cookieStore = await cookies();
      cookieStore.set('admin_token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: error?.message || 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
