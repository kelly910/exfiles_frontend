'use client';

import styles from './style.module.scss';
import * as React from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Sidebar from '../Common/Sidebar';
import PageHeader from '../Common/PageHeader';
import { useState, useEffect } from 'react';
import { PinnedAnswerMessage } from '@/app/redux/slices/Chat/chatTypes';
import { useRouter } from 'next/navigation';
import ActivePlan from './ActivePlan';
import UpgradePlan from './UpgradePlan';
import PlanHistory from './PlanHistory';
import { useSelector } from 'react-redux';
import { selectFetchedUser, setPageHeaderData } from '@/app/redux/slices/login';
import { fetchPlanHistory } from '@/app/redux/slices/planHistory';
import { useAppDispatch } from '@/app/redux/hooks';

const MyPlan = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const fetchedUser = useSelector(selectFetchedUser);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    dispatch(
      setPageHeaderData({
        title: 'My Plan',
        subTitle: `${fetchedUser?.active_subscription?.plan?.name}  - ${fetchedUser?.active_subscription?.plan?.description}`,
      })
    );
    dispatch(fetchPlanHistory({ page_size: 'all' }));
  }, [dispatch]);

  const handlePinnedAnswerClick = (selectedMessage: PinnedAnswerMessage) => {
    if (selectedMessage.thread && selectedMessage.uuid) {
      router.push(
        `/ai-chats/${selectedMessage.thread.uuid}/?message=${selectedMessage.uuid}`
      );
    }
  };

  const handleThreadClick = (thread: string) => {
    router.push(`/ai-chats/${thread}`); // Navigate to thread page
  };

  return (
    <>
      <main className="chat-body">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleThreadClick={handleThreadClick}
          handlePinnedAnswerClick={handlePinnedAnswerClick}
          title="Download Report"
        />
        <section className="main-body">
          <PageHeader
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            title="Download Report"
            handleOpenSidebarFromLogIncident={() => setIsSidebarOpen(true)}
          />
          <Box className={styles['my-plan-container']}>
            <ActivePlan />
            <UpgradePlan />
            <PlanHistory />
          </Box>
        </section>
      </main>
    </>
  );
};

export default MyPlan;
