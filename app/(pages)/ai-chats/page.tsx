import dynamic from 'next/dynamic';

// Dynamic Custom Component imports
const AIChatComponent = dynamic(
  () => import('@components/AI-Chat-Module/AIChatComponent')
);

export default function Page() {
  return <AIChatComponent />;
}
