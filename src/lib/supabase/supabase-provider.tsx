'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface SupabaseContext {
  supabase: SupabaseClient;
}

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createClient(supabaseUrl, supabaseAnonKey));

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {});
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <Context.Provider value={{ supabase }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}; 