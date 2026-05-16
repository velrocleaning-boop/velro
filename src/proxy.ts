import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET ||
    process.env.SUPABASE_JWT_SECRET ||
    'fallback-secret-change-in-production'
  );

const ROLE_HIERARCHY: Record<string, number> = {
  customer: 0,
  staff: 1,
  admin: 2,
  super_admin: 3,
};

async function verifyToken(token: string): Promise<{ userId: string; role: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET());
    return payload as { userId: string; role: string; email: string };
  } catch {
    return null;
  }
}

function hasRole(userRole: string, minRole: string): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 0);
}

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.pathname;

  // ─── Admin UI protection ──────────────────────────────────────────────────
  if (url.startsWith('/admin') && !url.startsWith('/admin/login')) {
    const adminToken = request.cookies.get('admin_token');
    const accessToken = request.cookies.get('access_token');

    if (adminToken?.value === 'authenticated') {
      return NextResponse.next();
    }

    if (accessToken?.value) {
      const payload = await verifyToken(accessToken.value);
      if (payload && hasRole(payload.role, 'admin')) {
        return NextResponse.next();
      }
    }

    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // ─── Markdown content negotiation ─────────────────────────────────────────
  const acceptHeader = request.headers.get('accept');
  if (acceptHeader?.includes('text/markdown')) {
    const urlPath = request.nextUrl.pathname;

    const markdownMap: Record<string, string> = {
      '/': `# Velro Cleaning Service - Riyadh\n\nVelro is Riyadh's #1 rated home cleaning service.\n\n## Services\n- Standard Cleaning from 50 SAR/hr\n- Deep Cleaning from 250 SAR\n- Move-in/Move-out from 400 SAR`,
      '/how-it-works': `# How It Works\n1. Book in 60 seconds online.\n2. We match you with a vetted professional.\n3. We clean, you relax.\n4. Pay securely after the service.`,
      '/services': `# Our Services\n- Standard Cleaning (50 SAR/hr)\n- Deep Cleaning (250+ SAR)\n- Move-in/Move-out (400+ SAR)\n- Sofa & Carpet Steam Cleaning\n- AC Duct Cleaning\n- Marble Polishing`,
    };

    const content = markdownMap[urlPath] || `# Velro Cleaning\n\nInformation about ${urlPath}.`;

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'x-markdown-tokens': 'true',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
