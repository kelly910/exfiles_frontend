import dynamic from 'next/dynamic';

const DynamicForgotPasswordVerificationComponent = dynamic(
  () =>
    import(
      '@/app/components/Forgot-Password-Verification/ForgotPasswordVerification'
    )
);

export default function Page() {
  return (
    <main>
      <DynamicForgotPasswordVerificationComponent />
    </main>
  );
}
