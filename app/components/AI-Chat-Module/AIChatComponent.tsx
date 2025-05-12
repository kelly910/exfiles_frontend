'use client';
import dynamic from 'next/dynamic';
// Dynamic Custom Component imports
const DynamicChatHomeScreen = dynamic(
  () =>
    import('@/app/components/AI-Chat-Module/chat-home-screen/ChatHomeScreen')
);
const DynamicChatMessagesComponent = dynamic(
  () =>
    import('@/app/components/AI-Chat/components/Messages/ChatMessagesComponent')
);

export default function AIChatComponent({ threadId }: { threadId?: string }) {
  return (
    <>
      {!threadId ? (
        <DynamicChatHomeScreen />
      ) : (
        <DynamicChatMessagesComponent threadId={threadId} />
      )}
    </>
  );
}
