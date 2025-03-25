import dynamic from 'next/dynamic';

const DynamicNewPasswordComponent = dynamic(
  () => import('@components/New-Password/NewPassword')
);

export default function Page() {
  return (
    <main>
      <DynamicNewPasswordComponent />
    </main>
  );
}
