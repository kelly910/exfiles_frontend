import dynamic from 'next/dynamic';

const DynamicSignupComponent = dynamic(
  () => import('@components/Signup/Signup')
);

export default function Page() {
  return (
    <main>
      <h1>SignUp page</h1>
      <DynamicSignupComponent />
    </main>
  );
}
