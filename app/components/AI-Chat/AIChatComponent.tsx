'use client';

import { useState } from 'react';

import { Container, useMediaQuery } from '@mui/material';
import PageHeader from '@components/Common/PageHeader';
import Sidebar from '@components/Common/Sidebar';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import { PinnedAnswerMessage } from '@/app/redux/slices/Chat/chatTypes';

const DynamicChatHomeScreen = dynamic(
  () => import('@/app/components/AI-Chat/screens/ChatHomeScreen')
);
const DynamicChatMessagesComponent = dynamic(
  () =>
    import('@/app/components/AI-Chat/components/Messages/ChatMessagesComponent')
);

export default function AIChatComponent({ threadId }: { threadId?: string }) {
  const router = useRouter();

  const isSmallScreen = useMediaQuery('(max-width:1100px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(isSmallScreen);

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
