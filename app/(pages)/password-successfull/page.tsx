import dynamic from 'next/dynamic';

const DynamicPasswordSuccessfullComponent = dynamic(
  () => import('@components/Password-Successfull/PasswordSuccessfull')
);

export default function Page() {
  return (
    <main>
      <DynamicPasswordSuccessfullComponent />
    </main>
  );
}
