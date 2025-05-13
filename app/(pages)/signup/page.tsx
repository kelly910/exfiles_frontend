import dynamic from 'next/dynamic';

const DynamicSignupComponent = dynamic(
  () => import('@components/Signup/Signup')
);

export default function Page() {
  return (
    <main>
      <DynamicSignupComponent />
    </main>
  );
}
