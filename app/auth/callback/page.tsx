'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
          router.push('/'); // Redirect to home page after successful login
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        router.push('/'); // Redirect to home page on error
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Logging you in...</h1>
        <p>Please wait while we complete the login process.</p>
      </div>
    </div>
  );
} 