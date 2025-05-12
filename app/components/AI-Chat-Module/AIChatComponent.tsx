'use client';
import dynamic from 'next/dynamic';

// Dynamic Custom Component imports
const DynamicChatHomeScreen = dynamic(
  () =>
    import('@/app/components/AI-Chat-Module/chat-home-screen/ChatHomeScreen')
);
const DynamicConversationComponent = dynamic(
  () =>
    import(
      '@/app/components/AI-Chat-Module/chat-conversation-screen/Conversation'
    )
);

export default function AIChatComponent({ threadId }: { threadId?: string }) {
  return (
    <>
      {!threadId ? (
        <DynamicChatHomeScreen />
      ) : (
        <DynamicConversationComponent threadId={threadId} />
      )}
    </>
  );
}
