import dynamic from 'next/dynamic';

// Dynamic Custom Component imports
// const DynamicAIChatComponent = dynamic(
//   () => import('@components/AI-Chat/AIChatComponent')
// );

const AIChatComponent = dynamic(
  () => import('@components/AI-Chat-Module/AIChatComponent')
);

export default async function Page({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  return <AIChatComponent threadId={threadId} />;
}
