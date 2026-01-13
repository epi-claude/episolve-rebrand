-- Create audit log table for admin actions
CREATE TABLE public.admin_audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action text NOT NULL,
  target_user_id uuid NOT NULL,
  target_email text NOT NULL,
  performed_by_user_id uuid NOT NULL,
  performed_by_email text NOT NULL,
  details jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.admin_audit_log
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);
CREATE INDEX idx_admin_audit_log_target_user ON public.admin_audit_log(target_user_id);

-- Update add_admin_user function to log the action
CREATE OR REPLACE FUNCTION public.add_admin_user(target_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
  performer_email text;
  result json;
BEGIN
  -- Check if caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  -- Get performer's email
  SELECT email INTO performer_email FROM profiles WHERE user_id = auth.uid();
  
  -- Get user_id from profiles by email
  SELECT user_id INTO target_user_id
  FROM profiles
  WHERE email = target_email;
  
  IF target_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'User not found. They must sign up first.');
  END IF;
  
  -- Check if already admin
  IF EXISTS (SELECT 1 FROM user_roles WHERE user_id = target_user_id AND role = 'admin') THEN
    RETURN json_build_object('success', false, 'message', 'User is already an admin.');
  END IF;
  
  -- Insert admin role
  INSERT INTO user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Log the action
  INSERT INTO admin_audit_log (action, target_user_id, target_email, performed_by_user_id, performed_by_email, details)
  VALUES ('admin_granted', target_user_id, target_email, auth.uid(), COALESCE(performer_email, 'unknown'), 
          jsonb_build_object('action_type', 'grant_admin'));
  
  RETURN json_build_object('success', true, 'message', 'Admin role granted successfully.');
END;
$$;

-- Update remove_admin_user function to log the action
CREATE OR REPLACE FUNCTION public.remove_admin_user(target_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_email_addr text;
  performer_email text;
BEGIN
  -- Check if caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  -- Prevent removing own admin access
  IF target_user_id = auth.uid() THEN
    RETURN json_build_object('success', false, 'message', 'You cannot remove your own admin access.');
  END IF;
  
  -- Get target user's email
  SELECT email INTO target_email_addr FROM profiles WHERE user_id = target_user_id;
  
  -- Get performer's email
  SELECT email INTO performer_email FROM profiles WHERE user_id = auth.uid();
  
  -- Delete admin role
  DELETE FROM user_roles
  WHERE user_id = target_user_id AND role = 'admin';
  
  -- Log the action
  INSERT INTO admin_audit_log (action, target_user_id, target_email, performed_by_user_id, performed_by_email, details)
  VALUES ('admin_revoked', target_user_id, COALESCE(target_email_addr, 'unknown'), auth.uid(), COALESCE(performer_email, 'unknown'),
          jsonb_build_object('action_type', 'revoke_admin'));
  
  RETURN json_build_object('success', true, 'message', 'Admin role removed successfully.');
END;
$$;

-- Function to get audit logs
CREATE OR REPLACE FUNCTION public.get_admin_audit_logs(limit_count int DEFAULT 50)
RETURNS TABLE (
  id uuid,
  action text,
  target_user_id uuid,
  target_email text,
  performed_by_user_id uuid,
  performed_by_email text,
  details jsonb,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  RETURN QUERY
  SELECT 
    aal.id,
    aal.action,
    aal.target_user_id,
    aal.target_email,
    aal.performed_by_user_id,
    aal.performed_by_email,
    aal.details,
    aal.created_at
  FROM admin_audit_log aal
  ORDER BY aal.created_at DESC
  LIMIT limit_count;
END;
$$;