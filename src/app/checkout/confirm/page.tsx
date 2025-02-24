'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = searchParams.get('reference');
        if (!reference) {
          setStatus('error');
          setMessage('Payment reference not found');
          return;
        }

        const response = await fetch(`/api/payments/paystack/verify?reference=${reference}`);
        const data = await response.json();

        if (response.ok && data.status === 'success') {
          setStatus('success');
          setMessage('Payment successful! Your tickets have been booked.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Payment verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while verifying your payment');
      }
    };

    if (session) {
      verifyPayment();
    }
  }, [session, searchParams]);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            {status === 'loading' && (
              <>
                <span className="loading loading-spinner loading-lg mx-auto"></span>
                <h2 className="text-xl font-bold mt-4">Verifying Payment</h2>
                <p className="text-base-content/70">Please wait while we confirm your payment...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="text-success text-5xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Payment Successful!</h2>
                <p className="text-base-content/70 mt-2">{message}</p>
                <div className="divider"></div>
                <div className="space-y-4">
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => router.push('/tickets')}
                  >
                    View My Tickets
                  </button>
                  <button
                    className="btn btn-outline w-full"
                    onClick={() => router.push('/')}
                  >
                    Back to Home
                  </button>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="text-error text-5xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-error">Payment Failed</h2>
                <p className="text-base-content/70 mt-2">{message}</p>
                <div className="divider"></div>
                <div className="space-y-4">
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => router.back()}
                  >
                    Try Again
                  </button>
                  <button
                    className="btn btn-outline w-full"
                    onClick={() => router.push('/')}
                  >
                    Back to Home
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
