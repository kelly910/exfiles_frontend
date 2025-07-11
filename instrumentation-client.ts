import * as Sentry from '@sentry/nextjs';

if (process.env.NEXT_PUBLIC_ENVIRONMENT_SERVER === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT_SERVER,
  });
}
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
