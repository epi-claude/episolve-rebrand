CREATE TABLE public.njcelc_questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  respondent_name text,
  organization text,
  answers jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.njcelc_questionnaire_responses TO anon, authenticated;
GRANT ALL ON public.njcelc_questionnaire_responses TO service_role;
ALTER TABLE public.njcelc_questionnaire_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a response" ON public.njcelc_questionnaire_responses
  FOR INSERT TO anon, authenticated WITH CHECK (pg_column_size(answers) < 500000);