ALTER POLICY "Authenticated can read responses"
ON public.questionnaire_responses
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Authenticated can insert responses"
ON public.questionnaire_responses
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Authenticated can update responses"
ON public.questionnaire_responses
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Authenticated can read revisions"
ON public.questionnaire_revisions
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Authenticated can insert revisions"
ON public.questionnaire_revisions
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));