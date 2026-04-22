import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tlypwyvmsbivstfuzksk.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Since we might not have the service_role key to run ALTER TABLE via the REST API, 
  // actually Supabase JS client doesn't support raw SQL queries.
  // We can just try to do a test insert and print the error.
  const { data, error } = await supabase.from('bookings').insert([{
    name: 'Test',
    email: 'test@test.com',
    phone: '123',
    district: 'test',
    service: 'test',
    rooms: 1,
    bathrooms: 1,
    date: '2023-01-01',
    time: '10:00'
  }]);
  
  console.log('Result:', { data, error });
}

run();
