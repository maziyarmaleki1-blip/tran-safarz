-- Add passenger type and breakdown columns to reservations table
ALTER TABLE public.reservations 
ADD COLUMN passenger_type TEXT DEFAULT 'normal',
ADD COLUMN adults_count INTEGER DEFAULT 1,
ADD COLUMN children_count INTEGER DEFAULT 0;