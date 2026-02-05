-- Add private_compartment and foreign_national columns to reservations table
ALTER TABLE public.reservations 
ADD COLUMN private_compartment BOOLEAN DEFAULT false,
ADD COLUMN foreign_national BOOLEAN DEFAULT false;