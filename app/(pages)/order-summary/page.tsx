import dynamic from 'next/dynamic';

const DynamicMyPlanComponent = dynamic(
  () => import('@components/Order-Summary/OrderSummary')
);

export default function Page() {
  return (
    <main>
      <DynamicMyPlanComponent />
    </main>
  );
}
