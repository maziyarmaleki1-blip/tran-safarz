-- Create storage bucket for tickets
INSERT INTO storage.buckets (id, name, public)
VALUES ('tickets', 'tickets', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policy: Staff can upload/update tickets
CREATE POLICY "Staff can upload tickets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'tickets' AND
  is_staff(auth.uid())
);

CREATE POLICY "Staff can update tickets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'tickets' AND
  is_staff(auth.uid())
);

CREATE POLICY "Staff can delete tickets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'tickets' AND
  is_staff(auth.uid())
);

-- RLS policy: Users can view their own tickets (based on reservation id in path)
CREATE POLICY "Users can view their tickets"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'tickets' AND
  (
    is_staff(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.reservations
      WHERE id::text = (storage.foldername(name))[1]
      AND user_id = auth.uid()
    )
  )
);

-- Add ticket_file column to reservations
ALTER TABLE public.reservations
ADD COLUMN IF NOT EXISTS ticket_file_path text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ticket_uploaded_at timestamp with time zone DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ticket_uploaded_by uuid DEFAULT NULL;