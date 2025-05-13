import dynamic from 'next/dynamic';

const DynamicQuickVerificationComponent = dynamic(
  () => import('@/app/components/Quick-Verification/QuickVerification')
);

export default function Page() {
  return (
    <main>
      <DynamicQuickVerificationComponent />
    </main>
  );
}
