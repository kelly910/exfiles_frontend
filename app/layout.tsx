import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import ToastProvider from './shared/toast/ToastProvider';
import { ReduxProvider } from './provider';
import ThemeRegistry from './providers/ThemeRegistry';
import { GoogleOAuthProvider } from '@react-oauth/google';
import FullPageLoader from './components/Full-Page-Loader/FullPageLoader';
import ClientAuthCheck from './components/ClientAuthCheck';

// const fustatFont = localFont({
//   src: './fonts/Fustat-VariableFont_wght.woff',
//   variable: '--font-fustat',
//   weight: '400',
// });

export const metadata: Metadata = {
  title: 'Exfiles - AI',
  description: 'Exfiles - Artificial Intelligence',
  icons: '/images/exfile-logo.svg',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientAuthCheck>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}
          >
            <ReduxProvider>
              <ThemeRegistry>
                <ToastProvider>
                  <FullPageLoader />
                  {children}
                </ToastProvider>
              </ThemeRegistry>
            </ReduxProvider>
          </GoogleOAuthProvider>
        </ClientAuthCheck>
      </body>
    </html>
  );
}
