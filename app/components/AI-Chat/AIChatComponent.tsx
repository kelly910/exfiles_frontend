'use client';

import { useEffect, useState } from 'react';

import { Container } from '@mui/material';
import PageHeader from '@components/Common/PageHeader';
import ChatWindows from '@/app/components/Chat-Windows/ChatWindows';
import Sidebar from '@/app/components/Common/Sidebar';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { fetchThreadMessagesByThreadId } from '@/app/redux/slices/Chat';
import { useAppDispatch } from '@/app/redux/hooks';

const DynamicChatHomeScreen = dynamic(
  () => import('@/app/components/AI-Chat/screens/ChatHomeScreen')
);
const DynamicChatMessagesComponent = dynamic(
  () =>
    import('@/app/components/AI-Chat/components/Messages/ChatMessagesComponent')
);

export default function AIChatComponent({ threadId }: { threadId: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(true);

  // const sidebarRef = useRef<HTMLInputElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleThreadClick = (thread: string) => {
    router.push(`/ai-chats/${thread}`); // Navigate to thread page
  };

  const getThreadMessagesDetails = async (thread: string) => {
    setIsMessagesLoading(true);
    const resultData = await dispatch(
      fetchThreadMessagesByThreadId({
        thread_uuid: threadId,
      })
    );
    console.log(resultData, 'resultData');
    setIsMessagesLoading(false);
  };

  useEffect(() => {
    if (threadId) {
      getThreadMessagesDetails(threadId);
    }
  }, [threadId]);

  return (
    <>
      <main className="chat-body">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleThreadClick={handleThreadClick}
        />
        <section className="main-body">
          <PageHeader threadId={threadId} />

          <Container maxWidth="lg" disableGutters>
            {!threadId ? (
              <DynamicChatHomeScreen />
            ) : (
              <DynamicChatMessagesComponent threadId={threadId} />
            )}
          </Container>
        </section>
      </main>
    </>
  );
}
