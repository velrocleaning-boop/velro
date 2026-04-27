-- ============================================================
-- VELRO SERVICES - COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor (safe to run multiple times)
-- ============================================================

-- ============================================================
-- USERS TABLE (Customer accounts)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  password_hash text,
  first_name text,
  last_name text,
  role text DEFAULT 'customer' NOT NULL CHECK (role IN ('customer','staff','admin','super_admin')),
  avatar_url text,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  loyalty_points integer DEFAULT 0,
  referral_code text UNIQUE,
  referred_by uuid REFERENCES public.users(id),
  wallet_balance numeric(10,2) DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  last_login_at timestamptz,
  vip_level text DEFAULT 'none' CHECK (vip_level IN ('none','silver','gold','platinum')),
  customer_segment text DEFAULT 'regular',
  lifetime_value numeric(10,2) DEFAULT 0,
  fraud_flags integer DEFAULT 0,
  push_token text
);

-- ============================================================
-- STAFF TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.staff (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  employee_id text UNIQUE,
  specializations text[] DEFAULT '{}',
  availability_zones text[] DEFAULT '{}',
  rating numeric(3,2) DEFAULT 0,
  total_jobs integer DEFAULT 0,
  is_available boolean DEFAULT true,
  hourly_rate numeric(10,2),
  current_location jsonb,
  bio text,
  profile_image_url text,
  joined_date date,
  total_earnings numeric(10,2) DEFAULT 0
);

-- ============================================================
-- SERVICE ZONES (Geo-based coverage)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.service_zones (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  name_ar text,
  slug text UNIQUE NOT NULL,
  polygon jsonb,
  center_lat numeric(10,7),
  center_lng numeric(10,7),
  is_active boolean DEFAULT true,
  base_price_multiplier numeric(4,2) DEFAULT 1.0,
  surge_multiplier numeric(4,2) DEFAULT 1.0,
  blackout boolean DEFAULT false,
  delivery_fee numeric(10,2) DEFAULT 0
);

-- ============================================================
-- DYNAMIC SERVICES CATALOG
-- ============================================================
CREATE TABLE IF NOT EXISTS public.services_catalog (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  name_ar text,
  description text,
  description_ar text,
  base_price numeric(10,2) NOT NULL,
  price_unit text DEFAULT 'flat' CHECK (price_unit IN ('flat','per_room','per_hour','per_sqm')),
  min_price numeric(10,2),
  max_price numeric(10,2),
  category text DEFAULT 'cleaning' CHECK (category IN ('cleaning','deep','specialty','maintenance')),
  duration_minutes integer DEFAULT 120,
  is_active boolean DEFAULT true,
  image_url text,
  sort_order integer DEFAULT 0,
  features text[] DEFAULT '{}',
  requirements text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- ============================================================
-- SERVICE ADD-ONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.service_addons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id uuid REFERENCES public.services_catalog(id) ON DELETE CASCADE,
  name text NOT NULL,
  name_ar text,
  description text,
  price numeric(10,2) NOT NULL,
  duration_extra_minutes integer DEFAULT 0,
  is_active boolean DEFAULT true
);

-- ============================================================
-- PRICING RULES (Dynamic pricing engine)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('time_surge','zone_surge','demand_surge','tier','seasonal','bulk_discount')),
  conditions jsonb NOT NULL DEFAULT '{}',
  multiplier numeric(4,2) DEFAULT 1.0,
  flat_adjustment numeric(10,2) DEFAULT 0,
  priority integer DEFAULT 0,
  is_active boolean DEFAULT true,
  valid_from timestamptz,
  valid_until timestamptz
);

-- ============================================================
-- EXTEND BOOKINGS TABLE
-- ============================================================
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.users(id);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS staff_id uuid REFERENCES public.staff(id);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service_id uuid REFERENCES public.services_catalog(id);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS addons jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS total_price numeric(10,2);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS base_price numeric(10,2);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS discount_amount numeric(10,2) DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS coupon_code text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','refunded','partial_refund','failed'));
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_method text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_id uuid;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS recurring_frequency text CHECK (recurring_frequency IN ('weekly','biweekly','monthly'));
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS parent_booking_id uuid REFERENCES public.bookings(id);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS zone_id uuid REFERENCES public.service_zones(id);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS coordinates jsonb;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cancellation_reason text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS confirmed_at timestamptz;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS assigned_at timestamptz;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS started_at timestamptz;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS completed_at timestamptz;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS is_priority boolean DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS tier text DEFAULT 'standard' CHECK (tier IN ('standard','premium','deep'));
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS property_size_sqm numeric(8,2);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS duration_minutes integer;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS proof_images text[] DEFAULT '{}';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_signature_url text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS internal_notes text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cancellation_fee numeric(10,2) DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS reschedule_count integer DEFAULT 0;

-- ============================================================
-- SLOTS (Availability calendar)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.slots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL,
  time_slot text NOT NULL,
  staff_id uuid REFERENCES public.staff(id),
  zone_id uuid REFERENCES public.service_zones(id),
  is_available boolean DEFAULT true,
  booking_id uuid REFERENCES public.bookings(id),
  locked_until timestamptz,
  locked_by text,
  UNIQUE(date, time_slot, staff_id)
);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  booking_id uuid REFERENCES public.bookings(id),
  user_id uuid REFERENCES public.users(id),
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'SAR',
  status text DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded','partial_refund','chargeback')),
  gateway text DEFAULT 'manual' CHECK (gateway IN ('stripe','paypal','tamara','tabby','mada','stc_pay','apple_pay','manual')),
  gateway_transaction_id text,
  gateway_response jsonb,
  refund_amount numeric(10,2) DEFAULT 0,
  refund_reason text,
  refunded_at timestamptz,
  tax_amount numeric(10,2) DEFAULT 0,
  fee_amount numeric(10,2) DEFAULT 0,
  net_amount numeric(10,2),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- ============================================================
-- SAVED PAYMENT METHODS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('card','mada','apple_pay','stc_pay','paypal')),
  last4 text,
  brand text,
  exp_month integer,
  exp_year integer,
  gateway_method_id text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- ============================================================
-- SUBSCRIPTIONS (Recurring plans)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  plan_name text NOT NULL CHECK (plan_name IN ('basic','premium','business')),
  service_id uuid REFERENCES public.services_catalog(id),
  frequency text NOT NULL CHECK (frequency IN ('weekly','biweekly','monthly')),
  price_per_session numeric(10,2) NOT NULL,
  next_billing_date date,
  next_service_date date,
  status text DEFAULT 'active' CHECK (status IN ('active','paused','cancelled','expired')),
  gateway_subscription_id text,
  rooms integer DEFAULT 1,
  bathrooms integer DEFAULT 1,
  district text,
  cancelled_at timestamptz,
  cancel_reason text,
  total_sessions integer DEFAULT 0,
  total_paid numeric(10,2) DEFAULT 0
);

-- ============================================================
-- COUPONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('percentage','flat','free_service','loyalty_multiplier')),
  value numeric(10,2) NOT NULL,
  min_order_amount numeric(10,2) DEFAULT 0,
  max_discount_amount numeric(10,2),
  usage_limit integer,
  usage_count integer DEFAULT 0,
  user_limit integer DEFAULT 1,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  applicable_services text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  is_first_order_only boolean DEFAULT false,
  user_specific_id uuid REFERENCES public.users(id),
  campaign_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- ============================================================
-- COUPON USAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.coupon_usages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id uuid REFERENCES public.coupons(id),
  user_id uuid REFERENCES public.users(id),
  booking_id uuid REFERENCES public.bookings(id),
  discount_amount numeric(10,2) NOT NULL,
  used_at timestamptz DEFAULT now() NOT NULL
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  booking_id uuid REFERENCES public.bookings(id) UNIQUE,
  user_id uuid REFERENCES public.users(id),
  staff_id uuid REFERENCES public.staff(id),
  service_id uuid REFERENCES public.services_catalog(id),
  overall_rating integer NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  cleanliness_rating integer CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  punctuality_rating integer CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
  professionalism_rating integer CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
  comment text,
  is_verified boolean DEFAULT true,
  status text DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','flagged')),
  admin_response text,
  sentiment_score numeric(3,2),
  is_featured boolean DEFAULT false,
  media_urls text[] DEFAULT '{}',
  helpful_count integer DEFAULT 0
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  channel text[] DEFAULT '{inapp}',
  is_read boolean DEFAULT false,
  read_at timestamptz,
  sent_at timestamptz
);

-- ============================================================
-- PUSH NOTIFICATION TOKENS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.push_tokens (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  token text NOT NULL,
  platform text CHECK (platform IN ('ios','android','web')),
  device_id text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- ============================================================
-- SUPPORT TICKETS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  user_id uuid REFERENCES public.users(id),
  booking_id uuid REFERENCES public.bookings(id),
  ticket_number text UNIQUE NOT NULL,
  subject text NOT NULL,
  category text DEFAULT 'inquiry' CHECK (category IN ('billing','service_quality','complaint','inquiry','refund','other')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  status text DEFAULT 'open' CHECK (status IN ('open','in_progress','waiting_customer','resolved','closed')),
  assigned_to_id uuid REFERENCES public.users(id),
  resolved_at timestamptz,
  resolution_notes text,
  satisfaction_rating integer CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5)
);

-- ============================================================
-- TICKET MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  ticket_id uuid REFERENCES public.tickets(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES public.users(id),
  sender_role text CHECK (sender_role IN ('customer','admin','system')),
  message text NOT NULL,
  attachments text[] DEFAULT '{}'
);

-- ============================================================
-- BLOG / CMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  title_ar text,
  excerpt text,
  content text NOT NULL,
  content_ar text,
  author_id uuid REFERENCES public.users(id),
  cover_image_url text,
  tags text[] DEFAULT '{}',
  category text,
  status text DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at timestamptz,
  meta_title text,
  meta_description text,
  schema_markup jsonb,
  view_count integer DEFAULT 0,
  read_time_minutes integer DEFAULT 3
);

-- ============================================================
-- LOYALTY POINTS TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.bookings(id),
  type text NOT NULL CHECK (type IN ('earned','redeemed','bonus','expired','adjusted','referral')),
  points integer NOT NULL,
  balance_after integer NOT NULL,
  description text,
  expires_at timestamptz
);

-- ============================================================
-- REFERRALS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  referrer_id uuid REFERENCES public.users(id),
  referred_id uuid REFERENCES public.users(id) UNIQUE,
  referral_code text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','qualified','rewarded')),
  reward_given boolean DEFAULT false,
  reward_points integer DEFAULT 0,
  reward_amount numeric(10,2),
  qualified_at timestamptz
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  user_id uuid REFERENCES public.users(id),
  action text NOT NULL,
  resource_type text,
  resource_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- ============================================================
-- JWT REFRESH TOKENS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.refresh_tokens (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  token_hash text UNIQUE NOT NULL,
  device_info text,
  ip_address text,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  revoked_at timestamptz,
  is_revoked boolean DEFAULT false
);

-- ============================================================
-- SYSTEM SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.system_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  category text DEFAULT 'general',
  description text,
  updated_at timestamptz DEFAULT now() NOT NULL,
  updated_by uuid REFERENCES public.users(id)
);

-- ============================================================
-- ANALYTICS EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  event_name text NOT NULL,
  user_id uuid REFERENCES public.users(id),
  session_id text,
  properties jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text
);

-- ============================================================
-- CAMPAIGNS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('email','sms','push','coupon')),
  status text DEFAULT 'draft' CHECK (status IN ('draft','scheduled','sent','cancelled')),
  target_segment jsonb DEFAULT '{}'::jsonb,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  scheduled_at timestamptz,
  sent_at timestamptz,
  stats jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES public.users(id)
);

-- ============================================================
-- WEBHOOKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.webhooks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  url text NOT NULL,
  events text[] NOT NULL,
  secret text NOT NULL,
  is_active boolean DEFAULT true,
  last_triggered_at timestamptz,
  failure_count integer DEFAULT 0,
  description text
);

-- ============================================================
-- WALLET TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('credit','debit','refund')),
  amount numeric(10,2) NOT NULL,
  balance_after numeric(10,2) NOT NULL,
  description text,
  reference_id text,
  reference_type text
);

-- ============================================================
-- CRM: CUSTOMER NOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.crm_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.users(id),
  note text NOT NULL,
  is_private boolean DEFAULT true
);

-- ============================================================
-- CRM: INTERACTION LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.crm_interactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  user_id uuid REFERENCES public.users(id),
  type text NOT NULL CHECK (type IN ('call','email','chat','visit','whatsapp')),
  direction text CHECK (direction IN ('inbound','outbound')),
  summary text,
  outcome text,
  follow_up_date date,
  logged_by uuid REFERENCES public.users(id)
);

-- ============================================================
-- SEED DEFAULT SETTINGS
-- ============================================================
INSERT INTO public.system_settings (key, value, category, description) VALUES
  ('tax_rate', '0.15', 'billing', 'VAT rate (15% for Saudi Arabia)'),
  ('currency', '"SAR"', 'billing', 'Default currency'),
  ('booking_cancellation_hours', '24', 'bookings', 'Hours before booking when free cancellation ends'),
  ('cancellation_fee_percentage', '0.2', 'bookings', 'Fee charged for late cancellations (20%)'),
  ('loyalty_points_per_sar', '1', 'loyalty', 'Loyalty points earned per SAR spent'),
  ('loyalty_points_redeem_rate', '0.01', 'loyalty', 'SAR value per loyalty point'),
  ('referral_reward_points', '500', 'loyalty', 'Points awarded for successful referral'),
  ('min_booking_amount', '50', 'bookings', 'Minimum booking amount in SAR'),
  ('max_advance_booking_days', '60', 'bookings', 'Max days in advance a booking can be made'),
  ('priority_booking_fee', '50', 'bookings', 'Extra fee for priority/emergency booking in SAR'),
  ('site_name', '"Velro Cleaning Services"', 'general', 'Site display name'),
  ('support_email', '"support@velro.sa"', 'general', 'Support email address'),
  ('support_phone', '"+966500000000"', 'general', 'Support phone number'),
  ('whatsapp_number', '"+966500000000"', 'general', 'WhatsApp number'),
  ('business_hours_start', '"08:00"', 'operations', 'Business hours start time'),
  ('business_hours_end', '"21:00"', 'operations', 'Business hours end time'),
  ('slot_duration_minutes', '30', 'operations', 'Duration of each time slot in minutes'),
  ('max_concurrent_bookings', '10', 'operations', 'Max concurrent bookings per time slot'),
  ('surge_threshold_percentage', '0.8', 'pricing', 'Booking capacity % that triggers surge pricing'),
  ('surge_multiplier', '1.3', 'pricing', 'Price multiplier during surge')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- SEED DEFAULT ZONES
-- ============================================================
INSERT INTO public.service_zones (name, name_ar, slug, is_active, base_price_multiplier) VALUES
  ('Al Olaya', 'العليا', 'al-olaya', true, 1.0),
  ('Al Malqa', 'الملقا', 'al-malqa', true, 1.0),
  ('Hittin', 'حطين', 'hittin', true, 1.0),
  ('As Sulimaniyah', 'السليمانية', 'as-sulimaniyah', true, 1.1),
  ('Al Yasmin', 'الياسمين', 'al-yasmin', true, 1.0),
  ('An Narjis', 'النرجس', 'an-narjis', true, 1.0),
  ('Ar Rabi', 'الربيع', 'ar-rabi', true, 1.0),
  ('Al Sahafah', 'الصحافة', 'al-sahafah', true, 1.0),
  ('Al Aqiq', 'العقيق', 'al-aqiq', true, 1.0),
  ('Al Malaz', 'الملز', 'al-malaz', true, 0.95),
  ('Al Murabba', 'المربع', 'al-murabba', true, 0.95)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- DISABLE RLS (using Service Role Key in backend)
-- ============================================================
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_zones DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_catalog DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_addons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.refresh_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_interactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;
