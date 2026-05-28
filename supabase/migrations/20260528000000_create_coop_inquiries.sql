-- Create the co-op pricing inquiry submissions table
CREATE TABLE IF NOT EXISTS public.coop_inquiries (
  id               UUID                     DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  contact_name     TEXT                     NOT NULL,
  contact_email    TEXT                     NOT NULL,
  phone            TEXT,
  property_name    TEXT                     NOT NULL,
  role             TEXT,
  number_of_units  TEXT,
  timeline         TEXT,
  work_categories  TEXT[]                   NOT NULL DEFAULT '{}',
  message          TEXT
);

-- Enable Row Level Security so the table is protected by default
ALTER TABLE public.coop_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users (the public form) to INSERT rows
CREATE POLICY "Allow anonymous inserts"
  ON public.coop_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);
