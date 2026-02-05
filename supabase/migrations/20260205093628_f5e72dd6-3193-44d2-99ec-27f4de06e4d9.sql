-- Add starring and internal notes columns to reservations
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS is_starred boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS internal_notes text;