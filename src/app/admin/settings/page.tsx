"use client";
import { useState, useEffect } from 'react';

const SETTINGS_SECTIONS = [
  {
    key: 'business',
    label: 'Business Info',
    icon: '🏢',
    fields: [
      { key: 'business_name', label: 'Business Name', type: 'text', default: 'Velro Services' },
      { key: 'business_phone', label: 'Phone', type: 'text', default: '+966 59 484 7866' },
      { key: 'business_email', label: 'Email', type: 'email', default: 'hello@velro.services' },
      { key: 'business_address', label: 'Address', type: 'text', default: 'Riyadh, Saudi Arabia' },
      { key: 'vat_number', label: 'VAT Number', type: 'text', default: '314418368500003' },
      { key: 'vat_rate', label: 'VAT Rate (%)', type: 'number', default: '15' },
    ],
  },
  {
    key: 'booking',
    label: 'Booking Rules',
    icon: '📅',
    fields: [
      { key: 'booking_lead_hours', label: 'Min Lead Time (hours)', type: 'number', default: '3' },
      { key: 'booking_max_days_ahead', label: 'Max Days Ahead', type: 'number', default: '30' },
      { key: 'booking_slot_duration', label: 'Slot Duration (minutes)', type: 'number', default: '60' },
      { key: 'booking_start_hour', label: 'Service Start Hour (24h)', type: 'number', default: '8' },
      { key: 'booking_end_hour', label: 'Service End Hour (24h)', type: 'number', default: '20' },
      { key: 'cancellation_window_hours', label: 'Free Cancellation Window (hours)', type: 'number', default: '24' },
    ],
  },
  {
    key: 'pricing',
    label: 'Pricing',
    icon: '💰',
    fields: [
      { key: 'currency', label: 'Currency', type: 'text', default: 'SAR' },
      { key: 'min_booking_amount', label: 'Min Booking Amount', type: 'number', default: '50' },
      { key: 'loyalty_points_per_sar', label: 'Points per SAR spent', type: 'number', default: '1' },
      { key: 'loyalty_sar_per_point', label: 'SAR value per point', type: 'number', default: '0.01' },
      { key: 'referral_bonus_points', label: 'Referral Bonus (points)', type: 'number', default: '500' },
    ],
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: '🔔',
    fields: [
      { key: 'notify_admin_email', label: 'Admin Alert Email', type: 'email', default: 'admin@velro.services' },
      { key: 'notify_booking_sms', label: 'Booking SMS', type: 'toggle', default: 'true' },
      { key: 'notify_booking_email', label: 'Booking Email', type: 'toggle', default: 'true' },
      { key: 'notify_review_request', label: 'Auto Review Request', type: 'toggle', default: 'true' },
      { key: 'notify_whatsapp', label: 'WhatsApp Notifications', type: 'toggle', default: 'false' },
    ],
  },
  {
    key: 'maintenance',
    label: 'System',
    icon: '⚙️',
    fields: [
      { key: 'maintenance_mode', label: 'Maintenance Mode', type: 'toggle', default: 'false' },
      { key: 'new_registrations', label: 'Allow New Registrations', type: 'toggle', default: 'true' },
      { key: 'max_bookings_per_day', label: 'Max Bookings Per Day', type: 'number', default: '100' },
      { key: 'max_bookings_per_slot', label: 'Max Bookings Per Slot', type: 'number', default: '5' },
    ],
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('business');
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const section = SETTINGS_SECTIONS.find(s => s.key === activeSection)!;

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(res => {
        if (res.data) {
          const loaded: Record<string, string> = {};
          for (const [k, v] of Object.entries(res.data as Record<string, { value: unknown }>)) {
            loaded[k] = String((v as { value: unknown }).value ?? '');
          }
          setValues(loaded);
        }
      })
      .catch(() => {});
  }, []);

  const getValue = (key: string, def: string) => values[key] ?? def;

  const handleChange = (key: string, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const updates: Record<string, string> = {};
    for (const field of section.fields) {
      updates[field.key] = getValue(field.key, field.default);
    }
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Settings</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.875rem' }}>Configure your platform</p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <div style={{ width: '200px', flexShrink: 0, background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {SETTINGS_SECTIONS.map(s => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.875rem',
                borderRadius: '0.6rem', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
                background: activeSection === s.key ? '#eff6ff' : 'transparent',
                color: activeSection === s.key ? '#1d4ed8' : '#374151',
                fontWeight: activeSection === s.key ? 700 : 500,
                fontSize: '0.875rem',
              }}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{section.icon} {section.label}</div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '0.65rem 1.5rem', borderRadius: '0.6rem', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '0.875rem',
                background: saved ? '#10b981' : '#6366f1',
                color: 'white',
                transition: 'background 0.2s',
              }}
            >
              {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {section.fields.map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>
                  {field.label}
                </label>
                {field.type === 'toggle' ? (
                  <div
                    onClick={() => handleChange(field.key, getValue(field.key, field.default) === 'true' ? 'false' : 'true')}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: '44px', height: '24px', borderRadius: '12px', position: 'relative',
                      background: getValue(field.key, field.default) === 'true' ? '#6366f1' : '#e2e8f0',
                      transition: 'background 0.2s',
                    }}>
                      <div style={{
                        position: 'absolute', top: '3px',
                        left: getValue(field.key, field.default) === 'true' ? '23px' : '3px',
                        width: '18px', height: '18px', borderRadius: '50%', background: 'white',
                        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {getValue(field.key, field.default) === 'true' ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    value={getValue(field.key, field.default)}
                    onChange={e => handleChange(field.key, e.target.value)}
                    style={{
                      width: '100%', padding: '0.65rem 1rem', borderRadius: '0.6rem',
                      border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#6366f1'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
                  />
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', fontSize: '0.78rem', color: '#94a3b8' }}>
            Changes apply immediately. Some settings (maintenance mode, VAT rate) may require a page refresh.
          </div>
        </div>
      </div>
    </div>
  );
}
