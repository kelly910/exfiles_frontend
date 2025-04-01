'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const ClientAuthCheck = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const getCookie = (name: string): string | null => {
        const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
        return match ? match[2] : null;
      };
      const token = getCookie('accessToken');
      if (token) {
        router.push('/ai-chats');
      }
    };

    checkAuth();

    const onPopState = () => {
      checkAuth();
    };

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [pathname, router]);

  return <>{children}</>;
};

export default ClientAuthCheck;
