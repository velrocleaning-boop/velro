'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2, X, Save } from 'lucide-react';

export default function EditBookingModal({ booking }: { booking: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(booking);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      } else {
        alert('Failed to update booking');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating booking');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          color: '#3b82f6',
          cursor: 'pointer',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Edit Booking"
      >
        <Edit2 size={16} />
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '1.5rem', right: '1.5rem',
                background: 'none', border: 'none',
                cursor: 'pointer', color: '#6b7280'
              }}
            >
              <X size={24} />
            </button>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Edit Booking</h2>
            
            <form onSubmit={handleSave} style={{ display: 'grid', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Name</label>
                  <input 
                    type="text" 
                    value={formData.name || ''} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Phone</label>
                  <input 
                    type="text" 
                    value={formData.phone || ''} 
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Email</label>
                <input 
                  type="email" 
                  value={formData.email || ''} 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>District</label>
                  <input 
                    type="text" 
                    value={formData.district || ''} 
                    onChange={e => setFormData({...formData, district: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Service</label>
                  <select 
                    value={formData.service || ''} 
                    onChange={e => setFormData({...formData, service: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                  >
                    <option value="Standard Cleaning">Standard Cleaning</option>
                    <option value="Deep Cleaning">Deep Cleaning</option>
                    <option value="Move-in/out">Move-in/out</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Rooms</label>
                  <input 
                    type="number" 
                    value={formData.rooms || 1} 
                    onChange={e => setFormData({...formData, rooms: parseInt(e.target.value)})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Bathrooms</label>
                  <input 
                    type="number" 
                    value={formData.bathrooms || 1} 
                    onChange={e => setFormData({...formData, bathrooms: parseInt(e.target.value)})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Date</label>
                  <input 
                    type="date" 
                    value={formData.date || ''} 
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Time</label>
                  <input 
                    type="time" 
                    value={formData.time || ''} 
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary, #3b82f6)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
