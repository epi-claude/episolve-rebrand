
-- Drop RLS policies first
DROP POLICY IF EXISTS "Anyone can submit flight authorization" ON public.flight_authorizations;
DROP POLICY IF EXISTS "Admins can view flight authorizations" ON public.flight_authorizations;
DROP POLICY IF EXISTS "Deny public SELECT on flight authorizations" ON public.flight_authorizations;

DROP POLICY IF EXISTS "Anyone can submit credit card authorization" ON public.credit_card_authorizations;
DROP POLICY IF EXISTS "Admins can view credit card authorizations" ON public.credit_card_authorizations;
DROP POLICY IF EXISTS "Deny public SELECT on credit card authorizations" ON public.credit_card_authorizations;

DROP POLICY IF EXISTS "Anyone can submit travel profile" ON public.travel_profiles;
DROP POLICY IF EXISTS "Admins can view travel profiles" ON public.travel_profiles;
DROP POLICY IF EXISTS "Deny public SELECT on travel profiles" ON public.travel_profiles;

-- Drop tables
DROP TABLE IF EXISTS public.flight_authorizations;
DROP TABLE IF EXISTS public.credit_card_authorizations;
DROP TABLE IF EXISTS public.travel_profiles;
