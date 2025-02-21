'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'You do not have permission to sign in.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      default:
        return 'An error occurred during authentication.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="max-w-md w-full space-y-8 p-8 bg-base-100 rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-error">Authentication Error</h2>
          <p className="mt-4 text-base-content/70">
            {error ? getErrorMessage(error) : 'An unknown error occurred.'}
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link href="/auth/signin" className="btn btn-primary">
            Try Again
          </Link>
          <Link href="/" className="btn btn-ghost">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
