
-- Drop temporary public read policies
DROP POLICY IF EXISTS "Temp public read for testing" ON public.reservations;
DROP POLICY IF EXISTS "Temp public read profiles for testing" ON public.profiles;
DROP POLICY IF EXISTS "Temp public read user_roles for testing" ON public.user_roles;

-- Atomic balance increment (deposit / refund)
CREATE OR REPLACE FUNCTION public.increment_balance(_user_id uuid, _amount numeric)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_balance numeric;
BEGIN
  IF _amount IS NULL OR _amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  UPDATE public.profiles
  SET balance = COALESCE(balance, 0) + _amount,
      updated_at = now()
  WHERE id = _user_id
  RETURNING balance INTO new_balance;

  IF new_balance IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  RETURN new_balance;
END;
$$;

-- Atomic balance decrement (withdraw) with insufficient-balance guard
CREATE OR REPLACE FUNCTION public.decrement_balance(_user_id uuid, _amount numeric)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_balance numeric;
BEGIN
  IF _amount IS NULL OR _amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  UPDATE public.profiles
  SET balance = COALESCE(balance, 0) - _amount,
      updated_at = now()
  WHERE id = _user_id AND COALESCE(balance, 0) >= _amount
  RETURNING balance INTO new_balance;

  IF new_balance IS NULL THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  RETURN new_balance;
END;
$$;
