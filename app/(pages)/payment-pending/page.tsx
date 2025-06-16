import dynamic from 'next/dynamic';

const DynamicPaymentPending = dynamic(
  () => import('@components/Payment-Pending/PaymentPending')
);

export default function Page() {
  return (
    <main>
      <DynamicPaymentPending />
    </main>
  );
}
