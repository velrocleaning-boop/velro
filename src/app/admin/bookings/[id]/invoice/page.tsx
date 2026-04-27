import { supabaseAdmin } from '@/lib/supabase-admin';
import { notFound } from 'next/navigation';
import InvoiceEditor from './InvoiceEditor';

export const revalidate = 0;

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !booking) return notFound();

  return <InvoiceEditor booking={booking} type="invoice" />;
}
