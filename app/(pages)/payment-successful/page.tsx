import dynamic from 'next/dynamic';

const DynamicMyPlanComponent = dynamic(
  () => import('@components/Payment-Successful/PaymentSuccessful')
);

export default function Page() {
  return (
    <main>
      <DynamicMyPlanComponent />
    </main>
  );
}
