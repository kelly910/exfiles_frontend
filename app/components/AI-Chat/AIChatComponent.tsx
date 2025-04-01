'use client';

import { useState } from 'react';

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

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const sidebarRef = useRef<HTMLInputElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleThreadClick = (threadId: string) => {
    router.push(`/ai-chats/${threadId}`); // Navigate to thread page
  };

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleThreadClick={handleThreadClick}
      />
      <section className="main-body">
        <PageHeader />

        <Container maxWidth="lg" disableGutters>
          {!threadId ? <DynamicChatHomeScreen /> : <ChatWindows />}
        </Container>
      </section>
    </>
  );
}
