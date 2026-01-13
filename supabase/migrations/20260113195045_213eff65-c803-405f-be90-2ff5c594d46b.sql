-- Add unique constraint on user_roles for user_id + role combination
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_unique UNIQUE (user_id, role);

-- Create function to get all admin users with their profiles
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE (
  user_id uuid,
  email text,
  full_name text,
  role app_role,
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
    ur.user_id,
    p.email,
    p.full_name,
    ur.role,
    ur.created_at
  FROM user_roles ur
  LEFT JOIN profiles p ON ur.user_id = p.user_id
  WHERE ur.role = 'admin'::app_role
  ORDER BY ur.created_at DESC;
END;
$$;

-- Create function to add an admin user
CREATE OR REPLACE FUNCTION public.add_admin_user(target_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
  result json;
BEGIN
  -- Check if caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  -- Get user_id from profiles by email
  SELECT user_id INTO target_user_id
  FROM profiles
  WHERE email = target_email;
  
  IF target_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'User not found. They must sign up first.');
  END IF;
  
  -- Insert admin role (will fail silently if already exists due to unique constraint)
  INSERT INTO user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN json_build_object('success', true, 'message', 'Admin role granted successfully.');
END;
$$;

-- Create function to remove admin role from a user
CREATE OR REPLACE FUNCTION public.remove_admin_user(target_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  -- Prevent removing own admin access
  IF target_user_id = auth.uid() THEN
    RETURN json_build_object('success', false, 'message', 'You cannot remove your own admin access.');
  END IF;
  
  -- Delete admin role
  DELETE FROM user_roles
  WHERE user_id = target_user_id AND role = 'admin';
  
  RETURN json_build_object('success', true, 'message', 'Admin role removed successfully.');
END;
$$;