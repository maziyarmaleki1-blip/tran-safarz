
-- Create payment_methods table
CREATE TABLE public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('card_transfer', 'gateway', 'wallet')),
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  -- Card transfer fields
  card_number text,
  card_holder_name text,
  bank_name text,
  -- Gateway fields
  gateway_provider text,
  merchant_id text,
  -- Wallet fields
  min_balance numeric DEFAULT 0,
  -- Common
  description text,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active payment methods"
ON public.payment_methods FOR SELECT
USING (true);

CREATE POLICY "Admins can manage payment methods"
ON public.payment_methods FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_payment_methods_updated_at
BEFORE UPDATE ON public.payment_methods
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default wallet method
INSERT INTO public.payment_methods (type, name, description, is_active)
VALUES ('wallet', 'کیف پول', 'پرداخت از موجودی کیف پول', true);
