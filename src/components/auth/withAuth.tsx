'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuthLoading from './AuthLoading';

type Role = 'user' | 'organizer' | 'admin';

interface WithAuthProps {
  requiredRole?: Role | Role[];
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { requiredRole }: WithAuthProps = {}
) {
  return function WithAuthComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
      return <AuthLoading />;
    }

    if (!session) {
      router.replace('/auth/signin');
      return null;
    }

    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!roles.includes(session.user.role as Role)) {
        router.replace('/');
        return null;
      }
    }

    return <WrappedComponent {...props} />;
  };
}
