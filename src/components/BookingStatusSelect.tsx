'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingStatusSelect({ bookingId, initialStatus }: { bookingId: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus || 'Pending');
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Confirmed': return { bg: '#dcfce7', text: '#166534' };
      case 'Completed': return { bg: '#f3f4f6', text: '#374151' };
      case 'Cancelled': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#fef3c7', text: '#92400e' }; // Pending
    }
  };

  const colors = getStatusColor(status);

  return (
    <select
      value={status}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={isUpdating}
      style={{
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: colors.bg,
        color: colors.text,
        border: 'none',
        cursor: isUpdating ? 'wait' : 'pointer',
        outline: 'none',
        appearance: 'none',
      }}
    >
      <option value="Pending">Pending</option>
      <option value="Confirmed">Confirmed</option>
      <option value="Completed">Completed</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  );
}
