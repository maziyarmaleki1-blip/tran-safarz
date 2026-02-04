-- Add columns for pending status changes that need admin approval
ALTER TABLE public.reservations
ADD COLUMN pending_status text DEFAULT NULL,
ADD COLUMN pending_status_by uuid DEFAULT NULL,
ADD COLUMN pending_status_at timestamp with time zone DEFAULT NULL;