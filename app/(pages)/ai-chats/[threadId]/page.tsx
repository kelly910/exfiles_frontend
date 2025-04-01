import dynamic from 'next/dynamic';

// Dynamic Custom Component imports
const DynamicAIChatComponent = dynamic(
  () => import('@components/AI-Chat/AIChatComponent')
);

// export default async function Page({
//   params,
// }: {
//   params: Promise<{ threadId: string }>;
// }) {
//   return <DynamicAIChatComponent />;
// }

export default async function Page() {
  return <DynamicAIChatComponent />;
}
