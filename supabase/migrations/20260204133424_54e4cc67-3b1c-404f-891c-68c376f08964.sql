
-- TEMPORARY: Allow public read access for testing (REMOVE IN PRODUCTION!)
CREATE POLICY "Temp public read for testing"
ON public.reservations
FOR SELECT
USING (true);
