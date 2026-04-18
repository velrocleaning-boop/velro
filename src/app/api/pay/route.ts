import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'Payment Required' },
    {
      status: 402,
      headers: {
        'x402-facilitator': 'https://api.x402.org',
        'x402-wallet': '0x1234567890abcdef1234567890abcdef12345678'
      }
    }
  );
}
