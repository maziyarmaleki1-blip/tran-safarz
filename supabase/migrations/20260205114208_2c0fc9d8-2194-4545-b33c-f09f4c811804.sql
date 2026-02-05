-- Add ticket payment tracking fields to reservations
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS ticket_payment_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS ticket_payment_amount numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ticket_payment_link text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ticket_paid_at timestamp with time zone DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.reservations.ticket_payment_status IS 'Status of ticket payment: pending, paid';
COMMENT ON COLUMN public.reservations.ticket_payment_amount IS 'Amount to be paid for the ticket';
COMMENT ON COLUMN public.reservations.ticket_payment_link IS 'Payment link generated for the passenger';
COMMENT ON COLUMN public.reservations.ticket_paid_at IS 'Timestamp when ticket was paid';