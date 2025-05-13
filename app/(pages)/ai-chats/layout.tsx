'use client';

import WebSocketInitializer from '@services/WebSocketInitializer';
import PageHeader from '@components/Common/PageHeader';
import Sidebar from '@components/Common/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PinnedAnswerMessage } from '@/app/redux/slices/Chat/chatTypes';

export default function AiChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1100) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Call on mount to ensure it sets correctly
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <WebSocketInitializer />
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
            title="New Thread"
          />
          {children}
        </section>
      </main>
    </>
  );
}
