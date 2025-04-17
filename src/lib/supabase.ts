'use client';

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

console.log('Initializing Supabase client with:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey
});

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
});

// Test the connection immediately
async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  try {
    console.log('📊 Attempting to query products table...');
    const { data: productsCount, error: productsError } = await supabase
      .from('products')
      .select('count')
      .limit(1)
      .single();

    if (productsError) {
      console.error('❌ Products query failed:', {
        message: productsError.message,
        details: productsError.details,
        hint: productsError.hint
      });
      return;
    }

    console.log('✅ Products table query successful');
    
    // Test categories table
    console.log('📊 Attempting to query categories table...');
    const { data: categoriesCount, error: categoriesError } = await supabase
      .from('categories')
      .select('count')
      .limit(1)
      .single();

    if (categoriesError) {
      console.error('❌ Categories query failed:', {
        message: categoriesError.message,
        details: categoriesError.details,
        hint: categoriesError.hint
      });
      return;
    }

    console.log('✅ Categories table query successful');
    console.log('🎉 All connection tests passed successfully');
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Connection test failed with error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } else {
      console.error('❌ Connection test failed with unknown error:', error);
    }
  }
}

testConnection();

export default supabase; 