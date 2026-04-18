import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const acceptHeader = request.headers.get('accept');

  if (acceptHeader && acceptHeader.includes('text/markdown')) {
    const url = request.nextUrl.pathname;
    
    let markdownContent = `# Velro Cleaning Service - Riyadh\n\n`;
    
    if (url === '/') {
      markdownContent += `## Home Page\nVelro is the #1 rated home cleaning service in Riyadh. We offer standard cleaning, deep cleaning, and move-in/out services starting at 50 SAR/hour.\n\n### Key Features:\n- Vetted Professionals\n- 100% Satisfaction Guarantee\n- No Upfront Payment`;
    } else if (url === '/how-it-works') {
      markdownContent += `## How It Works\n1. Book in 60 seconds online.\n2. We match you with a vetted pro.\n3. We clean, you relax.`;
    } else {
      markdownContent += `Information about ${url} on Velro. Visit https://velro.sa${url} for full details.`;
    }

    return new NextResponse(markdownContent, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'x-markdown-tokens': 'true'
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
