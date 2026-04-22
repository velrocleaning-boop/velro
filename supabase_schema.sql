-- Run this script in your Supabase SQL Editor

-- 1. Create the bookings table
CREATE TABLE public.bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  district text,
  service text,
  rooms integer DEFAULT 1,
  bathrooms integer DEFAULT 1,
  date text,
  time text,
  status text DEFAULT 'Pending'::text
);

-- 2. Create the contacts table
CREATE TABLE public.contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL
);

-- Optional: Disable Row Level Security (RLS) since you are using the Service Role Key in the backend.
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;
