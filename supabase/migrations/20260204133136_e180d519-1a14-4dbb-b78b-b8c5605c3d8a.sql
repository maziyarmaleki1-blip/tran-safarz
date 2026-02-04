
-- Drop the foreign key constraint temporarily for testing
ALTER TABLE public.reservations DROP CONSTRAINT IF EXISTS reservations_user_id_fkey;

-- Make user_id nullable temporarily
ALTER TABLE public.reservations ALTER COLUMN user_id DROP NOT NULL;
