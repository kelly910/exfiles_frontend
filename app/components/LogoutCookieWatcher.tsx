'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slices/profileSetting';

const getCookieValue = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

export default function LogoutCookieWatcher() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const loggedInUser = useSelector(
    (state: RootState) => state.login.loggedInUser
  );
  const loggedInUserToken = loggedInUser?.data?.token ?? '';

  useEffect(() => {
    const interval = setInterval(() => {
      const logoutValue = getCookieValue('logout');
      if (logoutValue === 'yes' && pathname !== '/login' && loggedInUserToken) {
        dispatch(logout(loggedInUserToken));
        window.opener?.postMessage(
          { type: 'LOGOUT_SUCCESS' },
          process.env.NEXT_PUBLIC_REDIRECT_URL
        );
        const bc = new BroadcastChannel('react-auth-channel');
        bc.postMessage({ type: 'LOGOUT_SUCCESS' });
        localStorage.removeItem('loggedInUser');
        document.cookie = `accessToken=; path=/; max-age=0; domain=.ex-files.ai; Secure; SameSite=None`;
        document.cookie = `isLogin=no; path=/; max-age=0; domain=.ex-files.ai; Secure; SameSite=None`;
        document.cookie = `userDataId=; path=/; max-age=0; domain=.ex-files.ai; Secure; SameSite=None`;
        router.replace('/login');
      }
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [router, pathname]);

  return null;
}
