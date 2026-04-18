"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  color?: string;
}

const Breadcrumbs = ({ color = '#64748b' }: BreadcrumbsProps) => {
  const pathname = usePathname();
  
  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter((segment) => segment !== '');

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return { label, href };
  });

  return (
    <nav aria-label="Breadcrumb" style={{ padding: '0.5rem 0', backgroundColor: 'transparent' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: color, fontWeight: 500 }}>
        <Link 
          href="/" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: color, transition: 'color 0.2s', textDecoration: 'none' }}
        >
          <Home size={14} />
          <span>Home</span>
        </Link>
        
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <ChevronRight size={12} style={{ opacity: 0.6 }} />
            {index === breadcrumbs.length - 1 ? (
              <span style={{ fontWeight: 700, color: 'inherit', opacity: 1 }}>{crumb.label}</span>
            ) : (
              <Link 
                href={crumb.href}
                style={{ color: 'inherit', transition: 'color 0.2s', textDecoration: 'none', opacity: 0.8 }}
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumbs;
