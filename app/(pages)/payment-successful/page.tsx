import dynamic from 'next/dynamic';

const DynamicPaymentSuccessful = dynamic(
  () => import('@components/Payment-Successful/PaymentSuccessful')
);

export default function Page() {
  return (
    <main>
      <DynamicPaymentSuccessful />
    </main>
  );
}
