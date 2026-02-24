
-- Create deposit settings table for configuring deposit amounts per wagon type
CREATE TABLE public.deposit_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wagon_type text NOT NULL UNIQUE,
  amount numeric NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.deposit_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view active deposit settings
CREATE POLICY "Anyone can view deposit settings"
  ON public.deposit_settings FOR SELECT
  USING (true);

-- Only admins can manage
CREATE POLICY "Admins can manage deposit settings"
  ON public.deposit_settings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_deposit_settings_updated_at
  BEFORE UPDATE ON public.deposit_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default wagon types
INSERT INTO public.deposit_settings (wagon_type, amount) VALUES
  ('5_star', 200000),
  ('4_star', 150000),
  ('6_berth', 100000),
  ('4_berth', 120000),
  ('seated', 80000),
  ('economy', 50000);
