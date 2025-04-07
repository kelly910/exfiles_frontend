import dynamic from 'next/dynamic';

const DynamicLogIncidentComponent = dynamic(
  () => import('@components/LogIncident/LogIncident')
);

export default function Page() {
  return (
    <main>
      <DynamicLogIncidentComponent />
    </main>
  );
}
