import dynamic from 'next/dynamic';

const DynamicAccountCreatedComponent = dynamic(
  () => import('@components/Account-Created/AccountCreated')
);

export default function Page() {
  return (
    <main>
      <DynamicAccountCreatedComponent />
    </main>
  );
}
