-- جدول تعریف قطارها
CREATE TABLE public.trains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  train_number text,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- جدول برنامه و قیمت قطارها (پر می‌شود توسط ربات)
CREATE TABLE public.train_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  train_id uuid REFERENCES public.trains(id) ON DELETE CASCADE,
  origin text NOT NULL,
  destination text NOT NULL,
  departure_date date NOT NULL,
  departure_time text,
  arrival_time text,
  duration text,
  wagon_type text,
  raja_price numeric NOT NULL DEFAULT 0,
  available_seats integer DEFAULT 0,
  is_available boolean DEFAULT true,
  last_synced_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- جدول کارمزد خدمات (فقط ادمین می‌تواند تغییر دهد)
CREATE TABLE public.service_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'کارمزد خدمات جستجو',
  fee_type text NOT NULL DEFAULT 'fixed' CHECK (fee_type IN ('fixed', 'percentage')),
  amount numeric NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  updated_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.train_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_fees ENABLE ROW LEVEL SECURITY;

-- Policies for trains (public read, admin write)
CREATE POLICY "Anyone can view active trains"
ON public.trains FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage trains"
ON public.trains FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Policies for train_schedules (public read, admin/staff write)
CREATE POLICY "Anyone can view train schedules"
ON public.train_schedules FOR SELECT
USING (true);

CREATE POLICY "Staff can manage train schedules"
ON public.train_schedules FOR ALL
USING (is_staff(auth.uid()));

-- Policies for service_fees (public read, admin only write)
CREATE POLICY "Anyone can view service fees"
ON public.service_fees FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage service fees"
ON public.service_fees FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_trains_updated_at
BEFORE UPDATE ON public.trains
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_train_schedules_updated_at
BEFORE UPDATE ON public.train_schedules
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_fees_updated_at
BEFORE UPDATE ON public.service_fees
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default service fee
INSERT INTO public.service_fees (name, fee_type, amount, is_active)
VALUES ('کارمزد خدمات جستجو', 'fixed', 15000, true);