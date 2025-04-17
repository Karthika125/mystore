import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Verify database connection and table structure
export const verifyDatabaseSetup = async () => {
  try {
    // Test connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('cart_items')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('Database connection error:', connectionError);
      return false;
    }

    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database verification failed:', error);
    return false;
  }
}; 