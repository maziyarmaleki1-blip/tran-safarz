
-- Drop foreign key constraint on user_roles temporarily for testing
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
