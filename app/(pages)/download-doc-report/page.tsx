import dynamic from 'next/dynamic';

const DynamicDownloadDocComponent = dynamic(
  () => import('@components/Download-Doc-Report/DownloadDocReport')
);

export default function Page() {
  return (
    <main>
      <DynamicDownloadDocComponent />
    </main>
  );
}
