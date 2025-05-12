import dynamic from 'next/dynamic';

// Dynamic Custom Modal imports
const DynamicAIChatComponent = dynamic(
  () => import('@components/AI-Chat/AIChatComponent')
);

const AIChatComponent = dynamic(
  () => import('@components/AI-Chat-Module/AIChatComponent')
);

export default function Page() {
  return (
    // <DynamicAIChatComponent />
    <AIChatComponent />
  );
}
