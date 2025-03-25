import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import ToastProvider from './shared/toast/ToastProvider';
import { ReduxProvider } from './provider';
import ThemeRegistry from './providers/ThemeRegistry';
import { GoogleOAuthProvider } from '@react-oauth/google';

const fustatFont = localFont({
  src: './fonts/Fustat-VariableFont_wght.woff',
  variable: '--font-fustat',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Exfiles - AI',
  description: 'Exfiles - Artificial Intelligence',
  icons: '/images/exfile-logo.svg',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fustatFont.className}>
      <body className={fustatFont.variable}>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}
        >
          <ReduxProvider>
            <ThemeRegistry>
              <ToastProvider>{children}</ToastProvider>
            </ThemeRegistry>
          </ReduxProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
