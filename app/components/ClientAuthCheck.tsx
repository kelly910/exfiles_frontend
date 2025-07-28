'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const ClientAuthCheck = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
      return match ? match[2] : null;
    };

    const token = getCookie('accessToken');

    // Define routes that should NOT be accessible to authenticated users
    const authRoutes = ['/login', '/signup'];

    if (token && authRoutes.includes(pathname)) {
      router.push('/upload-doc'); // Redirect only if on an auth page
    }
  }, [pathname, router]);

  return <>{children}</>;
};

export default ClientAuthCheck;
