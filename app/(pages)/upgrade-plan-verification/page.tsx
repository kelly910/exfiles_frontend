import dynamic from 'next/dynamic';

const DynamicUpgradePlanVerificationComponent = dynamic(
  () => import('@/app/components/Upgrade-Plan-Verification/UpgradePlanVerification')
);

export default function Page() {
  return (
    <main>
      <DynamicUpgradePlanVerificationComponent />
    </main>
  );
}
