import dynamic from 'next/dynamic';

const DynamicMyPlanComponent = dynamic(
  () => import('@components/MyPlan/MyPlan')
);

export default function Page() {
  return (
    <main>
      <DynamicMyPlanComponent />
    </main>
  );
}
