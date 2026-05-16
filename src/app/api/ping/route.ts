import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase
      .from('bookings')
      .select('count')
      .limit(1)

    return NextResponse.json({
      status: 'alive',
      timestamp: new Date().toISOString(),
      error: error?.message || null,
    })
  } catch (err) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
