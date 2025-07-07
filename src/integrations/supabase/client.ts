import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ukgvvjardofvelpztguj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZ3Z2amFyZG9mdmVscHp0Z3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTg2NDEsImV4cCI6MjA2NTY3NDY0MX0.AEnG5gzgScuOMULX0A0vxw0KEG8t5n0XZazk3i4FNx4";

// Cache for authenticated clients
const clientCache = new Map<string, SupabaseClient<Database>>();

// Default headers for all requests
const defaultHeaders = {
  'Accept': 'application/json',
  'apikey': SUPABASE_PUBLISHABLE_KEY,
  'Content-Type': 'application/json',
  'X-Client-Info': 'ghaza-saver/1.0.0'
};

// Create the default client with proper configuration
type Schema = Database['public'];

export const supabase = createClient<Database, 'public', Schema>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'ghaza-saver-session',
      storage: window.localStorage
    },
    global: {
      headers: defaultHeaders
    }
  }
);

/**
 * Gets a Supabase client instance, either the default anonymous one
 * or an authenticated one if an access token is provided.
 * Uses a cache to prevent creating multiple client instances.
 */
export const getSupabaseClient = (accessToken?: string): SupabaseClient<Database> => {
  // Return default client if no access token is provided
  if (!accessToken) return supabase;
  
  // Return cached client if it exists
  if (clientCache.has(accessToken)) {
    return clientCache.get(accessToken)!;
  }

  // Create new authenticated client
  const client = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      global: {
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${accessToken}`
        }
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  // Cache the client
  clientCache.set(accessToken, client);
  
  // Set up cleanup when the client is no longer needed
  // This is a simple approach - in a real app, you might want to implement
  // a more sophisticated cleanup strategy based on token expiration
  setTimeout(() => {
    clientCache.delete(accessToken);
  }, 1000 * 60 * 30); // Clean up after 30 minutes

  return client;
};