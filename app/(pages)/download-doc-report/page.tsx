import dynamic from 'next/dynamic';

const DynamicDownloadDocComponent = dynamic<{ catId: number | null }>(
  () => import('@components/Download-Doc-Report/DownloadDocReport')
);

export default function Page() {
  return (
    <main>
      <DynamicDownloadDocComponent catId={3} />
    </main>
  );
}
