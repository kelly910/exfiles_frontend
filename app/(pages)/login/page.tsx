import dynamic from 'next/dynamic';

const DynamicLoginComponent = dynamic(() => import('@components/Login/Login'));

export default function Page() {
  return (
    <main>
      <DynamicLoginComponent />
    </main>
  );
}
