
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ukgvvjardofvelpztguj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZ3Z2amFyZG9mdmVscHp0Z3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTg2NDEsImV4cCI6MjA2NTY3NDY0MX0.AEnG5gzgScuOMULX0A0vxw0KEG8t5n0XZazk3i4FNx4";

// Cache for authenticated clients - using WeakMap to prevent memory leaks
const clientCache = new WeakMap<object, SupabaseClient<Database>>();

// Default headers for all requests
const defaultHeaders = {
  'Accept': 'application/json',
  'apikey': SUPABASE_PUBLISHABLE_KEY,
  'Content-Type': 'application/json',
  'X-Client-Info': 'ghaza-saver/1.0.0'
};

// Singleton instance for the default client
let singletonClient: SupabaseClient<Database> | null = null;

// Create the default client with proper configuration
type Schema = Database['public'];

export const supabase = (() => {
  if (!singletonClient) {
    singletonClient = createClient<Database, 'public', Schema>(
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
  }
  return singletonClient;
})();

/**
 * Gets a Supabase client instance, either the default anonymous one
 * or an authenticated one if an access token is provided.
 * Uses a cache to prevent creating multiple client instances.
 */
export const getSupabaseClient = (accessToken?: string): SupabaseClient<Database> => {
  // Return default client if no access token is provided
  if (!accessToken) return supabase;
  
  // Create a cache key object
  const cacheKey = { token: accessToken };
  
  // Return cached client if it exists
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!;
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
  clientCache.set(cacheKey, client);

  return client;
};
