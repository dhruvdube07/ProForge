import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://akmxwwxdxgrymbwrhwec.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrbXh3d3hkeGdyeW1id3Jod2VjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTkxODc5NywiZXhwIjoyMTAxNDk0Nzk3fQ.3uzDCpKX9YlPJ1wPdnz2xGdQvWsbWoamXeVM4zoWzUQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  console.log('Testing connection to instance akmxwwxdxgrymbwrhwec.supabase.co...');
  try {
    const { data: otpsData, error: otpsError } = await supabase.from('otps').select('*').limit(1);
    console.log('otps table check:', { data: otpsData, error: otpsError });
  } catch (err) {
    console.error('otps error:', err);
  }

  try {
    const { data: profilesData, error: profilesError } = await supabase.from('profiles').select('*').limit(1);
    console.log('profiles table check:', { data: profilesData, error: profilesError });
  } catch (err) {
    console.error('profiles error:', err);
  }
}

main();
