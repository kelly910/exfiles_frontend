'use client';

import { useEffect, useState } from 'react';

import { Container, useMediaQuery } from '@mui/material';
import PageHeader from '@components/Common/PageHeader';
import Sidebar from '@components/Common/Sidebar';

import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { fetchThreadMessagesByThreadId } from '@/app/redux/slices/Chat';
import { useAppDispatch } from '@/app/redux/hooks';
import { PinnedAnswerMessage } from '@/app/redux/slices/Chat/chatTypes';

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

  const isSmallScreen = useMediaQuery('(max-width:1100px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(isSmallScreen);

  const [isMessagesLoading, setIsMessagesLoading] = useState(true);

  // const sidebarRef = useRef<HTMLInputElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleThreadClick = (thread: string) => {
    router.push(`/ai-chats/${thread}`); // Navigate to thread page
  };

  const handlePinnedAnswerClick = (selectedMessage: PinnedAnswerMessage) => {
    if (selectedMessage.thread && selectedMessage.uuid) {
      router.push(
        `/ai-chats/${selectedMessage.thread.uuid}/?message=${selectedMessage.uuid}`
      );
    }
  };

  // New code
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth <= 1100) {
  //       setIsSidebarOpen(false);
  //     } else {
  //       setIsSidebarOpen(true);
  //     }
  //   };

  //   handleResize(); // Call on mount to ensure it sets correctly
  //   window.addEventListener('resize', handleResize);

  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  const getThreadMessagesDetails = async (thread: string) => {
    setIsMessagesLoading(true);
    const resultData = await dispatch(
      fetchThreadMessagesByThreadId({
        thread_uuid: threadId,
      })
    );
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
          handlePinnedAnswerClick={handlePinnedAnswerClick}
          title=""
        />
        <section className="main-body">
          <PageHeader
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            title=""
          />

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
