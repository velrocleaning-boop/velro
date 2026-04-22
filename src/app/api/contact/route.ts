import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('contacts')
      .insert([
        { name, email, phone, message }
      ]);

    if (dbError) {
      console.error('Supabase error:', dbError);
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
