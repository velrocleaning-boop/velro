'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function ContactsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');

  // Debounce search update
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      
      router.push(`/admin/contacts?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, router]);

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
      <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
        <input 
          type="text" 
          placeholder="Search by name, email, or phone..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none' }}
        />
      </div>
    </div>
  );
}
