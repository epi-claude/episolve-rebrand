
CREATE TABLE public.questionnaire_responses (
  form_key TEXT PRIMARY KEY CHECK (form_key IN ('owner_management','office_accounting','field_technician')),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_updated_by UUID,
  last_updated_by_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.questionnaire_responses TO authenticated;
GRANT ALL ON public.questionnaire_responses TO service_role;

ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read responses"
  ON public.questionnaire_responses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert responses"
  ON public.questionnaire_responses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update responses"
  ON public.questionnaire_responses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER update_questionnaire_responses_updated_at
  BEFORE UPDATE ON public.questionnaire_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.questionnaire_responses (form_key) VALUES
  ('owner_management'), ('office_accounting'), ('field_technician')
ON CONFLICT (form_key) DO NOTHING;

CREATE TABLE public.questionnaire_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_key TEXT NOT NULL,
  data JSONB NOT NULL,
  updated_by UUID,
  updated_by_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.questionnaire_revisions TO authenticated;
GRANT ALL ON public.questionnaire_revisions TO service_role;

ALTER TABLE public.questionnaire_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read revisions"
  ON public.questionnaire_revisions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert revisions"
  ON public.questionnaire_revisions FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX idx_questionnaire_revisions_form_key ON public.questionnaire_revisions(form_key, created_at DESC);
