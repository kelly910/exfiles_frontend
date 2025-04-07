'use client';

import { useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import { fetchThreadMessagesByThreadId } from '@/app/redux/slices/Chat';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import UploadFilesStatusMessage from './UploadFilesStatusMessage';
import { Box, Container } from '@mui/material';
import chatMessagesStyles from '@components/AI-Chat/styles/ChatMessagesStyle.module.scss';
import { RootState } from '@/app/redux/store';
import Question from './Question';
import Answer from './Answer';
import LoadingGenerateSummary from './LoadingGenerateSummary';

export default function ChatMessagesComponent({
  threadId,
}: {
  threadId: string;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(true);

  const [messagesList, setMessagesList] = useState([]);
  const loggedInUser = useAppSelector(
    (state: RootState) => state.login.loggedInUser
  );

  // const sidebarRef = useRef<HTMLInputElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const groupByDate = (results) => {
    if (results && results?.length > 0) {
      return results?.reduce((acc, item) => {
        const date = dayjs(item.created).format('DD-MM-YYYY');
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {});
    }
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

    if (fetchThreadMessagesByThreadId.fulfilled.match(resultData)) {
      if (resultData.payload?.results?.length > 0) {
        setMessagesList(resultData.payload);
      }
    }

    setIsMessagesLoading(false);
  };

  const groupedData = groupByDate(messagesList?.results);

  useEffect(() => {
    if (threadId) {
      getThreadMessagesDetails(threadId);
    }
  }, [threadId]);

  return (
    <>
      <main className="chat-body">
        <Container maxWidth="lg" disableGutters>
          {groupedData &&
            Object.keys(groupedData).map((date) => {
              return (
                <>
                  <Box component="div" className={chatMessagesStyles.chatDate}>
                    <span> {date}</span>
                  </Box>
                  <Box
                    component="div"
                    className={chatMessagesStyles.chatWindow}
                  >
                    {groupedData[date].map((record) => (
                      <>
                        <UploadFilesStatusMessage
                          messageObj={record}
                          userDetails={loggedInUser}
                        />
                        <LoadingGenerateSummary />
                        <Question
                          userDetails={loggedInUser}
                          messageObj={record}
                        />
                        <Answer messageObj={record} />
                      </>
                    ))}
                  </Box>
                </>
              );
            })}
        </Container>
      </main>
    </>
  );
}
