-- Add columns to store selected filters from search page
ALTER TABLE public.reservations
ADD COLUMN IF NOT EXISTS selected_wagon_types text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS selected_time_slots text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS price_range_min numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS price_range_max numeric DEFAULT NULL;