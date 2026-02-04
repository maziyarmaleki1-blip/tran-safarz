
-- Add columns for tracking who is working on a reservation
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS assigned_to uuid,
ADD COLUMN IF NOT EXISTS assigned_at timestamp with time zone;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_reservations_assigned_to ON public.reservations(assigned_to);
