import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ghomfxzntlqvpgnuxubk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdob21meHpudGxxdnBnbnV4dWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwOTYwMzcsImV4cCI6MjA4MTY3MjAzN30.zBMYTWU2PJfIwwnclpgeid6668GsadAGTMtpxmV25iw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
