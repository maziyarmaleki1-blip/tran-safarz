-- Add cancel request columns to reservations
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS cancel_requested boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS cancel_requested_at timestamp with time zone;