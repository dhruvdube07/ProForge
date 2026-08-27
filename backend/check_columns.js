import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://akmxwwxdxgrymbwrhwec.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrbXh3d3hkeGdyeW1id3Jod2VjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTkxODc5NywiZXhwIjoyMTAxNDk0Nzk3fQ.3uzDCpKX9YlPJ1wPdnz2xGdQvWsbWoamXeVM4zoWzUQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'profiles' });
  if (error) {
    // If RPC doesn't exist, try querying a system catalog or running a simple select error trick
    console.log('RPC error, trying raw select trick...');
    const { data: dummy, error: selectError } = await supabase.from('profiles').select('contact_email').limit(1);
    console.log('Can select contact_email?', { success: !selectError, error: selectError });
  } else {
    console.log('Columns:', data);
  }
}
main();
