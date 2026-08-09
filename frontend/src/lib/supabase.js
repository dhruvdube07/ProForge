import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://akmxwwxdxgrymbwrhwec.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrbXh3d3hkeGdyeW1id3Jod2VjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTkxODc5NywiZXhwIjoyMTAxNDk0Nzk3fQ.3uzDCpKX9YlPJ1wPdnz2xGdQvWsbWoamXeVM4zoWzUQ';

// Create and export Supabase client for client-side use
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
