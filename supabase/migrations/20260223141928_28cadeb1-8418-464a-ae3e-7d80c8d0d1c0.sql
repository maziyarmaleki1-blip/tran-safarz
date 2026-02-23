
-- Create route-based service fees table
CREATE TABLE public.route_fees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  fixed_fee NUMERIC NOT NULL DEFAULT 0,
  percentage_fee NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(origin, destination)
);

-- Enable RLS
ALTER TABLE public.route_fees ENABLE ROW LEVEL SECURITY;

-- Anyone can view active route fees
CREATE POLICY "Anyone can view route fees"
ON public.route_fees
FOR SELECT
USING (true);

-- Only admins can manage route fees
CREATE POLICY "Admins can manage route fees"
ON public.route_fees
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Auto-update updated_at
CREATE TRIGGER update_route_fees_updated_at
BEFORE UPDATE ON public.route_fees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
