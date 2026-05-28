/**
 * One-time database setup script.
 * Creates the coop_inquiries table in Supabase with the correct schema and RLS policy.
 *
 * Usage:
 *   1. Get your DATABASE_URL from:
 *      Supabase Dashboard → your project → Settings → Database → Connection string → URI
 *      (make sure to use the "Direct connection" URI, not the pooler)
 *
 *   2. Run:
 *      DATABASE_URL="postgresql://postgres:[password]@db.ghomfxzntlqvpgnuxubk.supabase.co:5432/postgres" node scripts/setup-db.js
 *
 *   Or add DATABASE_URL to your .env and run:
 *      node scripts/setup-db.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const { Client } = require("pg");

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error(
    "\n❌  DATABASE_URL is not set.\n" +
      "    Get it from: Supabase Dashboard → Settings → Database → Connection string (URI)\n" +
      "    Then add it to your .env file or pass it inline:\n\n" +
      '    DATABASE_URL="postgresql://postgres:[password]@db.ghomfxzntlqvpgnuxubk.supabase.co:5432/postgres" node scripts/setup-db.js\n'
  );
  process.exit(1);
}

const SQL = `
-- ──────────────────────────────────────────────────────────────────
-- coop_inquiries table
-- ──────────────────────────────────────────────────────────────────
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

-- Enable Row Level Security
ALTER TABLE public.coop_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous INSERT (public form submissions via the anon key)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'coop_inquiries'
      AND policyname = 'Allow anonymous inserts'
  ) THEN
    CREATE POLICY "Allow anonymous inserts"
      ON public.coop_inquiries
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END $$;
`;

async function main() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  console.log("\n🔌  Connecting to database…");
  await client.connect();

  console.log("⚙️   Running migration…");
  await client.query(SQL);

  console.log("✅  coop_inquiries table is ready.\n");

  await client.end();
}

main().catch((err) => {
  console.error("\n❌  Migration failed:", err.message, "\n");
  process.exit(1);
});
