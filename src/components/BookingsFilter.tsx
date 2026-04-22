'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function BookingsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');

  // Debounce search update
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status && status !== 'All') params.set('status', status);
      
      router.push(`/admin/bookings?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, status, router]);

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
        <input 
          type="text" 
          placeholder="Search by name or phone..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none' }}
        />
      </div>
      <select 
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', minWidth: '150px' }}
      >
        <option value="All">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
  );
}
