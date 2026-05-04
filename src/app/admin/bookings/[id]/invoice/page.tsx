import { supabaseAdmin } from '@/lib/supabase-admin';
import { notFound } from 'next/navigation';
import InvoiceEditor from './InvoiceEditor';

export const revalidate = 0;

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [{ data: booking, error }, { data: vatSetting }] = await Promise.all([
    supabaseAdmin.from('bookings').select('*').eq('id', id).single(),
    supabaseAdmin.from('system_settings').select('value').eq('key', 'vat_number').single(),
  ]);

  if (error || !booking) return notFound();

  const vatNumber = (vatSetting?.value as string) || '314418368500003';

  return <InvoiceEditor booking={booking} type="invoice" vatNumber={vatNumber} />;
}
