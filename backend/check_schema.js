import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://akmxwwxdxgrymbwrhwec.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrbXh3d3hkeGdyeW1id3Jod2VjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTkxODc5NywiZXhwIjoyMTAxNDk0Nzk3fQ.3uzDCpKX9YlPJ1wPdnz2xGdQvWsbWoamXeVM4zoWzUQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  // Let's run a query to inspect the table schema
  // Since we cannot run raw sql directly without an RPC, let's try querying supabase postgrest openapi spec!
  // Postgrest provides / in the root URL which returns OpenAPI spec containing schema details
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY
      }
    });
    const spec = await res.json();
    const profileSchema = spec.definitions.profiles;
    console.log('Profiles table columns:', Object.keys(profileSchema.properties));
  } catch (err) {
    console.error('Error fetching spec:', err);
  }
}
main();
