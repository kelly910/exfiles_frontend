import dynamic from 'next/dynamic';

const DynamicPaymentFailed = dynamic(
  () => import('@components/Payment-Failed/PaymentFailed')
);

export default function Page() {
  return (
    <main>
      <DynamicPaymentFailed />
    </main>
  );
}
