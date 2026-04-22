import { supabase } from '@/lib/supabase';
import DeleteRecordButton from '@/components/DeleteRecordButton';
import ContactsFilter from '@/components/ContactsFilter';
import { MessageCircle } from 'lucide-react';

export const revalidate = 0;

export default async function ContactsPage({ searchParams }: { searchParams: { search?: string } }) {
  let query = supabase.from('contacts').select('*').order('created_at', { ascending: false });

  if (searchParams.search) {
    query = query.or(`name.ilike.%${searchParams.search}%,email.ilike.%${searchParams.search}%,phone.ilike.%${searchParams.search}%`);
  }

  const { data: contacts, error } = await query;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>Contact Messages</h1>
      
      <ContactsFilter />

      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>Error loading contacts: {error.message}</p>}
      
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>Date</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>Name</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>Email</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>Phone</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>Message</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}></th>
            </tr>
          </thead>
          <tbody>
            {contacts?.map((contact: any) => (
              <tr key={contact.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem', color: '#6b7280', verticalAlign: 'top' }}>{new Date(contact.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '1rem', fontWeight: 500, verticalAlign: 'top' }}>{contact.name}</td>
                <td style={{ padding: '1rem', color: '#6b7280', verticalAlign: 'top' }}>{contact.email}</td>
                <td style={{ padding: '1rem', color: '#6b7280', verticalAlign: 'top' }}>
                  {contact.phone ? (
                    <a 
                      href={`https://wa.me/${contact.phone.replace(/\D/g,'')}?text=Hi ${encodeURIComponent(contact.name)}, regarding your message...`}
                      target="_blank"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#25D366', textDecoration: 'none', fontWeight: 600 }}
                      title="Chat on WhatsApp"
                    >
                      <MessageCircle size={16} />
                      {contact.phone}
                    </a>
                  ) : '-'}
                </td>
                <td style={{ padding: '1rem', color: '#6b7280', whiteSpace: 'pre-wrap', maxWidth: '400px' }}>{contact.message}</td>
                <td style={{ padding: '1rem', verticalAlign: 'top', textAlign: 'right' }}>
                  <DeleteRecordButton id={contact.id} type="contacts" />
                </td>
              </tr>
            ))}
            {(!contacts || contacts.length === 0) && !error && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No messages found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
