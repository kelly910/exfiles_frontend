'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (typeof window.gtag === 'function' && gaId) {
      window.gtag('config', gaId, {
        page_path: pathname,
      });
    }
  }, [pathname]);

  useEffect(() => {
    window.onerror = function (message, source, lineno, colno) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'js_error', {
          event_category: 'JavaScript Error',
          event_label: `${message} at ${source}:${lineno}:${colno}`,
        });
      }
    };
  }, []);

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
