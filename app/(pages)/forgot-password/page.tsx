import dynamic from 'next/dynamic';

const DynamicForgotPasswordComponent = dynamic(
  () => import('@components/Forgot-Password/ForgotPassword')
);

export default function Page() {
  return (
    <main>
      <DynamicForgotPasswordComponent />
    </main>
  );
}
