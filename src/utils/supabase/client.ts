import { createClient } from '@supabase/supabase-js';

// Using Vite's import.meta.env for environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

// Validate the Supabase URL format
const isValidUrl = (url: string) => {
  try {
    // Check if URL is a valid HTTP/HTTPS URL
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

// Validate the anon key format (starts with 'ey' and has 3 parts when split by '.')
const isValidAnonKey = (key: string) => {
  const parts = key.split('.');
  return key.startsWith('ey') && parts.length === 3;
};

// Validate environment variables
if (!supabaseUrl || !isValidUrl(supabaseUrl)) {
  const errorMessage = `
    ================================================
    ❌ Invalid or missing Supabase URL.
    Please check your .env file and make sure it contains:
    VITE_SUPABASE_URL=https://your-project-ref.supabase.co
    ================================================
  `;
  console.error(errorMessage);
  throw new Error('Invalid Supabase URL configuration');
}

if (!supabaseAnonKey || !isValidAnonKey(supabaseAnonKey)) {
  const errorMessage = `
    ================================================
    ❌ Invalid or missing Supabase anon key.
    Please check your .env file and make sure it contains:
    VITE_SUPABASE_ANON_KEY=your-anon-key-here
    ================================================
  `;
  console.error(errorMessage);
  throw new Error('Invalid Supabase anon key configuration');
}

// Create the Supabase client
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  // Test the connection in the background
  (async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').limit(1);
      if (error) {
        console.warn('Supabase connection test failed:', error.message);
      } else {
        console.log('✅ Successfully connected to Supabase');
      }
    } catch (e) {
      console.error('Supabase connection test failed:', e);
    }
  })();
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  throw error;
}

export { supabase };
export default supabase;
