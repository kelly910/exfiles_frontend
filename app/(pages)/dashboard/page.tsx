import dynamic from 'next/dynamic';

const DynamicDashboardComponent = dynamic(
  () => import('@components/Dashboard/Dashboard')
);

export default function Page() {
  return (
    <main>
      <DynamicDashboardComponent />
    </main>
  );
}
