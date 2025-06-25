import type { Metadata } from 'next';
// import localFont from 'next/font/local';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './globals.css';
import ToastProvider from './shared/toast/ToastProvider';
import { ReduxProvider } from './provider';
import ThemeRegistry from './providers/ThemeRegistry';
import { GoogleOAuthProvider } from '@react-oauth/google';
import FullPageLoader from './components/Full-Page-Loader/FullPageLoader';
import ClientAuthCheck from './components/ClientAuthCheck';
import { SearchProvider } from './components/AI-Chat-Module/context/SearchContext';
import GoogleAnalytics from './components/GoogleAnalytics';
import { ThemeProviderMode } from '@/app/utils/ThemeContext';

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
  const isProduction =
    process.env.NEXT_PUBLIC_ENVIRONMENT_SERVER === 'production';

  return (
    <html lang="en">
      <ThemeProviderMode>
        <body>
          {isProduction && <GoogleAnalytics />}
          <SearchProvider>
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
          </SearchProvider>
        </body>
      </ThemeProviderMode>
    </html>
  );
}
