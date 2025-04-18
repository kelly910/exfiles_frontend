/* eslint-disable  @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import {
  fetchThreadMessagesByThreadId,
  getThreadDetailsById,
  selectIsStreaming,
  selectMessageList,
  selectMessagesChunks,
  setActiveThread,
  setIsStreaming,
} from '@/app/redux/slices/Chat';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import UploadFilesStatusMessage from './UploadFilesStatusMessage';
import { Box, Container } from '@mui/material';
import chatMessagesStyles from '@components/AI-Chat/styles/ChatMessagesStyle.module.scss';
import { RootState } from '@/app/redux/store';
import { ChatMessage, UploadedDocument } from '@store/slices/Chat/chatTypes';
import Question from './Question';
import UserChatInput from '../Input/UserChatInput';
import Answer from './Answer';
import AIChatStyles from '@components/AI-Chat/styles/AIChatStyle.module.scss';
import ShowGeneratedSummariesDocs from './ShowGeneratedSummariesDocs';
import { useSelector } from 'react-redux';
import { SocketPayload } from '../../types/aiChat.types';
import { sendSocketMessage } from '@/app/services/WebSocketService';
import StreamingResponse from './StreamingResponse';
import { setPageHeaderData } from '@/app/redux/slices/login';
import MessageLoading from './MessageLoading';

export default function ChatMessagesComponent({
  threadId,
}: {
  threadId: string;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const messagesList = useSelector(selectMessageList);
  const isStreamingMessages = useSelector(selectIsStreaming);
  const messagesChunks = useSelector(selectMessagesChunks);
  const chatElementRef = useRef<HTMLInputElement>(null);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const [isMessagesLoading, setIsMessagesLoading] = useState(true);

  const loggedInUser = useAppSelector(
    (state: RootState) => state.login.loggedInUser
  );

  // const sidebarRef = useRef<HTMLInputElement>(null);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen((prev) => !prev);
  // };

  const groupByDate = (results: ChatMessage[] | []) => {
    if (results && results?.length > 0) {
      return results?.reduce((acc: any, item: any) => {
        const date = dayjs(item.created).format('DD-MM-YYYY');
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {});
    }
  };

  const handleDocCategoryClick = (msgObj: UploadedDocument) => {
    router.push(`/documents/${msgObj.category_data.id}`);
  };

  const handleDocSummaryClick = (msgObj: UploadedDocument) => {
    router.push(`/documents/${msgObj.category_data.id}?docId=${msgObj.uuid}`);
  };

  const getThreadMessagesDetails = async (thread: string) => {
    // setIsMessagesLoading(true);
    const resultData = await dispatch(
      fetchThreadMessagesByThreadId({
        thread_uuid: thread,
      })
    );

    if (fetchThreadMessagesByThreadId.fulfilled.match(resultData)) {
      if (resultData.payload?.results?.length > 0) {
        // setMessagesList(resultData.payload);
      }
    }

    // setIsMessagesLoading(false);
  };

  const getThreadDetails = async (thread: string) => {
    // setIsMessagesLoading(true);
    const resultData = await dispatch(
      getThreadDetailsById({
        thread_uuid: thread,
      })
    );

    if (getThreadDetailsById.fulfilled.match(resultData)) {
      dispatch(setActiveThread(resultData.payload));
      const threadCreatedDate = dayjs(resultData.payload.created).format(
        'DD-MM-YYYY'
      );
      dispatch(
        setPageHeaderData({
          title: resultData.payload.name,
          subTitle: `Created On : ${threadCreatedDate}`,
        })
      );
    }
  };

  const groupedData = groupByDate(messagesList?.results || []);

  useEffect(() => {
    if (threadId) {
      getThreadMessagesDetails(threadId);
      getThreadDetails(threadId);
    }
  }, [threadId]);

  const handleSendMessage = (payloadData: SocketPayload) => {
    dispatch(setIsStreaming(true));
    sendSocketMessage({ ...payloadData, thread_uuid: threadId });
  };

  const jumpToLastMessage = () => {
    if (chatElementRef.current) {
      chatElementRef.current.scrollTo({
        top: chatElementRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    jumpToLastMessage();
  }, [messagesList]);

  return (
    <>
      {/* <Box component="div" className={AIChatStyles.categoryBox}>
        <Box className={AIChatStyles.categoryBoxInner}>
          <Button
            // onClick={() => handleOpenCategoryDrawer(true)}
            className={AIChatStyles.backButton}
            sx={{ marginBottom: '24px' }}
          >
            <Image
              src="/images/arrow-left.svg"
              alt="user"
              width={16}
              height={16}
            />
          </Button>
          <Typography variant="body1" className={AIChatStyles.categoriesTitle}>
            How to optimize images in WordPress for faster loading (complete
            guide)
          </Typography>
        </Box>
        <Typography
          variant="body1"
          className={AIChatStyles.categoriesSemiTitle}
        >
          Created On : <span>25-02-2025</span>
        </Typography>
      </Box> */}
      <div className={AIChatStyles.chatContainer} ref={chatElementRef}>
        <Container maxWidth="lg" disableGutters>
          {groupedData &&
            Object.keys(groupedData).map((date) => {
              return (
                <React.Fragment key={date}>
                  <Box component="div" className={chatMessagesStyles.chatDate}>
                    <span> {date}</span>
                  </Box>
                  <Box
                    component="div"
                    className={chatMessagesStyles.chatWindow}
                  >
                    {groupedData[date].map((record: ChatMessage) => (
                      <React.Fragment key={record.uuid}>
                        {loggedInUser &&
                        loggedInUser.data.id == record.sender ? (
                          <>
                            {record.uploaded_documents?.length > 0 && (
                              <UploadFilesStatusMessage
                                messageObj={record}
                                userDetails={loggedInUser}
                              />
                            )}

                            {record.message && (
                              <Question
                                userDetails={loggedInUser}
                                messageObj={record}
                              />
                            )}
                          </>
                        ) : (
                          <>
                            {record.summary_documents &&
                            record.summary_documents.length > 0 &&
                            !record.combined_summary_data ? (
                              <ShowGeneratedSummariesDocs
                                handleDocCategoryClick={(documentItem) =>
                                  handleDocCategoryClick(documentItem)
                                }
                                handleDocSummaryClick={(documentItem) =>
                                  handleDocSummaryClick(documentItem)
                                }
                                handleGenerateCombinedSummary={(payloadData) =>
                                  handleSendMessage(payloadData)
                                }
                                messageObj={record}
                              />
                            ) : (
                              <Answer messageObj={record} />
                            )}
                          </>
                        )}
                      </React.Fragment>
                    ))}
                  </Box>
                </React.Fragment>
              );
            })}

          {isStreamingMessages &&
            messagesChunks &&
            (messagesChunks.length > 2 ? (
              <StreamingResponse
                isStreaming={isStreamingMessages}
                inputText={messagesChunks.join('')}
              />
            ) : (
              <MessageLoading />
            ))}
        </Container>
      </div>
      <div
        style={{ padding: '0 16px 20px 16px', position: 'sticky', bottom: 0 }}
      >
        <Container maxWidth="lg" disableGutters>
          <UserChatInput
            handleOpenDocUploadModal={() => {}}
            sendMessage={(payloadData) => handleSendMessage(payloadData)}
            isLoadingProp={isStreamingMessages}
          />
        </Container>
      </div>
    </>
  );
}
