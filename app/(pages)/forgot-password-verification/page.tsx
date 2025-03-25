import dynamic from 'next/dynamic';

const DynamicForgotPasswordVerificationComponent = dynamic(
  () => import('@/app/components/forgot-password-verification/ForgotPasswordVerification')
);

export default function Page() {
  return (
    <main>
      <DynamicForgotPasswordVerificationComponent />
    </main>
  );
}