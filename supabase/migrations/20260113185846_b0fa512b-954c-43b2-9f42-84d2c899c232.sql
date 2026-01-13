-- Explicitly deny public SELECT access to consultation bookings
CREATE POLICY "Deny public SELECT on consultation bookings"
ON public.consultation_bookings
FOR SELECT
USING (false);

-- Explicitly deny public SELECT access to contact submissions
CREATE POLICY "Deny public SELECT on contact submissions"
ON public.contact_submissions
FOR SELECT
USING (false);

-- Explicitly deny public SELECT access to newsletter subscribers
CREATE POLICY "Deny public SELECT on newsletter subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (false);