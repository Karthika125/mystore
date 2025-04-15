'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/src/lib/supabase';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the verification token from the URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        if (type === 'email_change' || type === 'recovery') {
          // Handle other auth types if needed
          router.push('/auth');
          return;
        }

        // Handle signup verification
        if (!token) {
          setVerificationState('error');
          setErrorMessage('Verification token is missing');
          return;
        }

        // Verify the user's email using the token
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        });

        if (error) {
          console.error('Verification error:', error);
          setVerificationState('error');
          setErrorMessage(error.message);
          toast({
            title: 'Verification failed',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }

        setVerificationState('success');
        toast({
          title: 'Email verified',
          description: 'Your email has been successfully verified!',
        });
        
        // Wait 2 seconds before redirecting to allow toast to be seen
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (error: any) {
        console.error('Unexpected error during verification:', error);
        setVerificationState('error');
        setErrorMessage(error?.message || 'An unexpected error occurred');
        toast({
          title: 'Verification error',
          description: error?.message || 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    };

    handleEmailVerification();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
      {verificationState === 'loading' && (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h1 className="text-2xl font-bold mb-2">Verifying your email...</h1>
          <p className="text-gray-500 mb-8">This may take a moment.</p>
        </>
      )}

      {verificationState === 'success' && (
        <>
          <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
          <p className="text-gray-500 mb-8">Your account has been successfully verified.</p>
          <p className="text-gray-500">You will be redirected shortly...</p>
        </>
      )}

      {verificationState === 'error' && (
        <>
          <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
          <p className="text-gray-500 mb-8">{errorMessage || 'Something went wrong during verification.'}</p>
          <Button onClick={() => router.push('/auth')}>
            Back to Sign In
          </Button>
        </>
      )}
    </div>
  );
} 