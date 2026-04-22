'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteRecordButton({ id, type }: { id: string, type: 'bookings' | 'contacts' }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${type === 'bookings' ? 'booking' : 'message'}?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/${type}/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting record');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      style={{
        background: 'none',
        border: 'none',
        color: '#ef4444',
        cursor: isDeleting ? 'wait' : 'pointer',
        opacity: isDeleting ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.25rem'
      }}
      title="Delete"
    >
      <Trash2 size={16} />
    </button>
  );
}
