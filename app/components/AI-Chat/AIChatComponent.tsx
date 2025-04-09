'use client';

import { useEffect, useState } from 'react';

import { Container } from '@mui/material';
import PageHeader from '@components/Common/PageHeader';
import ChatWindows from '@/app/components/Chat-Windows/ChatWindows';
import Sidebar from '@/app/components/Common/Sidebar';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const DynamicChatHomeScreen = dynamic(
  () => import('@components/AI-Chat/ChatHomeScreen')
);

export default function AIChatComponent() {
  const router = useRouter();
  const { threadId } = useParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Set initial state based on screen width
    return window.innerWidth <= 1024;
  });
  // const sidebarRef = useRef<HTMLInputElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleThreadClick = (threadId: string) => {
    router.push(`/ai-chats/${threadId}`); // Navigate to thread page
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

  console.log('sidebar', isSidebarOpen);
  // New code

  return (
    <>
      <main className="chat-body">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleThreadClick={handleThreadClick}
          title=""
        />
        <section className="main-body">
          <PageHeader
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            title=""
          />

          <Container maxWidth="lg" disableGutters>
            {!threadId ? <DynamicChatHomeScreen /> : <ChatWindows />}
          </Container>
        </section>
      </main>
    </>
  );
}
