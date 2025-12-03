'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

interface GoogleOAuthWrapperProps {
  children: ReactNode;
}

// Placeholder client ID used when the real one is not configured
// This prevents "must be used within GoogleOAuthProvider" errors
// The actual Google login will fail gracefully if used without a real client ID
const PLACEHOLDER_CLIENT_ID = 'not-configured';

export default function GoogleOAuthWrapper({
  children,
}: GoogleOAuthWrapperProps) {
  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || PLACEHOLDER_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
}
