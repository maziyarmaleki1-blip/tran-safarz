-- Add refund tracking columns to reservations table
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS refund_status text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS refund_amount numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS refund_method text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS refund_by uuid DEFAULT NULL,
ADD COLUMN IF NOT EXISTS refund_at timestamp with time zone DEFAULT NULL,
ADD COLUMN IF NOT EXISTS refund_card_number text DEFAULT NULL;