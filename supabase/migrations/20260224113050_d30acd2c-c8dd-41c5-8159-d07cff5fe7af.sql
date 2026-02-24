-- Add permissions array column to user_roles
-- Default: employees get 'reservations' only, admins get all
ALTER TABLE public.user_roles
ADD COLUMN permissions text[] NOT NULL DEFAULT ARRAY['reservations']::text[];

-- Update existing admin roles to have all permissions
UPDATE public.user_roles
SET permissions = ARRAY['reservations', 'support']
WHERE role = 'admin';