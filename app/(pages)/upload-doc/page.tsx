import dynamic from 'next/dynamic';

const DynamicUploadDocumentComponent = dynamic(
  () => import('@/app/components/Upload-Doc/UploadDoc')
);

export default function Page() {
  return (
    <main>
      <DynamicUploadDocumentComponent />
    </main>
  );
}
