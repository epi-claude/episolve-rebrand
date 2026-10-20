CREATE TABLE public.contractor_intake_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  company_name text NOT NULL,
  client_email text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  email_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.contractor_intake_submissions TO service_role;
GRANT SELECT ON public.contractor_intake_submissions TO authenticated;
ALTER TABLE public.contractor_intake_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view contractor intake submissions" ON public.contractor_intake_submissions
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));