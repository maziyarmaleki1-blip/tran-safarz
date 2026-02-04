-- Add column to store multiple assigned employees
ALTER TABLE public.reservations
ADD COLUMN assigned_employees uuid[] DEFAULT '{}';

-- Migrate existing single assignments to the new array column
UPDATE public.reservations
SET assigned_employees = ARRAY[assigned_to]
WHERE assigned_to IS NOT NULL;