
-- Flight Authorization submissions
CREATE TABLE public.flight_authorizations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  departure_airport text NOT NULL,
  destination_airport text NOT NULL,
  departure_date date NOT NULL,
  return_date date,
  num_travelers text NOT NULL,
  cabin_class text NOT NULL,
  preferred_airline text,
  specific_flight_numbers text,
  flexible_dates boolean DEFAULT false,
  budget_per_person text,
  special_requests text,
  company_name text,
  department text,
  trip_purpose text,
  travel_policy_link text,
  approved_by text,
  print_name text NOT NULL,
  signature_data text,
  authorization_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending'
);

-- Credit Card Authorization submissions
CREATE TABLE public.credit_card_authorizations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  cardholder_name text NOT NULL,
  card_type text NOT NULL,
  card_last_four text NOT NULL,
  expiration_month text NOT NULL,
  expiration_year text NOT NULL,
  billing_address text NOT NULL,
  billing_city text NOT NULL,
  billing_state text NOT NULL,
  billing_zip text NOT NULL,
  billing_country text NOT NULL DEFAULT 'US',
  authorized_amount text,
  authorization_purpose text,
  company_name text,
  print_name text NOT NULL,
  signature_data text,
  authorization_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending'
);

-- Travel Profile submissions
CREATE TABLE public.travel_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  date_of_birth date,
  gender text,
  passport_number text,
  passport_expiry date,
  passport_country text,
  known_traveler_number text,
  redress_number text,
  tsa_precheck text,
  global_entry text,
  seat_preference text,
  meal_preference text,
  frequent_flyer_programs text,
  emergency_contact_name text,
  emergency_contact_phone text,
  emergency_contact_relationship text,
  medical_conditions text,
  special_assistance text,
  status text NOT NULL DEFAULT 'active'
);

-- RLS: Anyone can insert (public forms)
ALTER TABLE public.flight_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_card_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit flight authorization" ON public.flight_authorizations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Deny public SELECT on flight authorizations" ON public.flight_authorizations FOR SELECT TO public USING (false);

CREATE POLICY "Anyone can submit credit card authorization" ON public.credit_card_authorizations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Deny public SELECT on credit card authorizations" ON public.credit_card_authorizations FOR SELECT TO public USING (false);

CREATE POLICY "Anyone can submit travel profile" ON public.travel_profiles FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Deny public SELECT on travel profiles" ON public.travel_profiles FOR SELECT TO public USING (false);

-- Admin read access
CREATE POLICY "Admins can view flight authorizations" ON public.flight_authorizations FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view credit card authorizations" ON public.credit_card_authorizations FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view travel profiles" ON public.travel_profiles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
