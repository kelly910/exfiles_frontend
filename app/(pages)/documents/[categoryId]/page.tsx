import dynamic from 'next/dynamic';

const DynamicDocumentsComponent = dynamic(
  () => import('@components/Documents/DocumentListComponent')
);

export default async function Page({
  params,
}: {
  params: Promise<{ categoryId: number }>;
}) {
  const { categoryId } = await params;

  return <DynamicDocumentsComponent catId={categoryId} />;
}
