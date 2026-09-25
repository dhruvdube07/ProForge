import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from both root and backend directory
dotenv.config();
dotenv.config({ path: path.join(__dirname, '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client = null;
if (SUPABASE_URL && SUPABASE_URL.startsWith('http') && SUPABASE_SERVICE_ROLE_KEY) {
  try {
    client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  } catch (err) {
    console.warn('Notice: Supabase client initialization skipped. Using localStore.');
  }
}

// Fallback proxy prevents runtime crashes when Supabase is unconfigured/offline on Vercel
export const supabase = client || new Proxy({}, {
  get(target, prop) {
    if (prop === 'auth') {
      return {
        admin: {
          listUsers: async () => ({ data: { users: [] }, error: new Error('Supabase unconfigured') }),
          createUser: async () => ({ data: null, error: new Error('Supabase unconfigured') }),
          updateUserById: async () => ({ data: null, error: new Error('Supabase unconfigured') })
        },
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase unconfigured') })
      };
    }
    if (prop === 'from') {
      return () => ({
        select: () => ({ 
          eq: () => ({ 
            eq: () => ({ 
              gt: () => ({ 
                limit: async () => ({ data: [] }) 
              }) 
            }) 
          }) 
        }),
        insert: async () => ({ data: null, error: new Error('Supabase unconfigured') }),
        delete: () => ({ eq: async () => ({ data: null }) }),
        update: () => ({ eq: async () => ({ data: null }) })
      });
    }
    return () => ({ data: null, error: new Error('Supabase unconfigured') });
  }
});
