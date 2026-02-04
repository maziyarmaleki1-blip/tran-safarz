
-- TEMPORARY: Allow public read access for testing (REMOVE IN PRODUCTION!)
CREATE POLICY "Temp public read user_roles for testing"
ON public.user_roles
FOR SELECT
USING (true);

CREATE POLICY "Temp public read profiles for testing"
ON public.profiles
FOR SELECT
USING (true);
