-- Create saved_passengers table for reusable passenger data
CREATE TABLE public.saved_passengers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  national_id TEXT NOT NULL,
  birth_date DATE NOT NULL,
  is_foreign BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_passengers ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own saved passengers" 
ON public.saved_passengers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved passengers" 
ON public.saved_passengers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved passengers" 
ON public.saved_passengers 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved passengers" 
ON public.saved_passengers 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_saved_passengers_updated_at
BEFORE UPDATE ON public.saved_passengers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_saved_passengers_user_id ON public.saved_passengers(user_id);