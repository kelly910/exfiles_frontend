/* eslint-disable  @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import {
  clearChunks,
  clearMessagesList,
  fetchThreadMessagesByThreadId,
  getThreadDetailsById,
  selectIsStreaming,
  selectMessageList,
  selectMessagesChunks,
  setActiveThread,
  setIsStreaming,
} from '@/app/redux/slices/Chat';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { Box, Container } from '@mui/material';
import chatMessagesStyles from '@components/AI-Chat-Module/styles/ChatMessagesStyle.module.scss';
import AIChatStyles from '@components/AI-Chat-Module/styles/AIChatStyle.module.scss';
import { RootState } from '@/app/redux/store';
import { ChatMessage, UploadedDocument } from '@store/slices/Chat/chatTypes';
import { useSelector } from 'react-redux';
import { sendSocketMessage } from '@/app/services/WebSocketService';

// Custom Types
import { SocketPayload } from '@components/AI-Chat-Module/types/aiChat.types';

// Custom component
import ChatInputBox from '@/app/components/AI-Chat-Module/common/chat-input-box/ChatInputBox';
import DraggingUIConversation from '@/app/components/AI-Chat-Module/chat-conversation-screen/components/DraggingUIConversation';
import StreamingAnswerComponent from '@/app/components/AI-Chat-Module/chat-conversation-screen/components/StreamingAnswer';
import QuestionComponent from '@/app/components/AI-Chat-Module/chat-conversation-screen/components/QuestionComponent';
import QuestionCardWithFiles from '@/app/components/AI-Chat-Module/chat-conversation-screen/components/QuestionCardWithFiles';
import AnswerComponent from '@/app/components/AI-Chat-Module/chat-conversation-screen/components/AnswerComponent';
import ShowGeneratedSummariesDocs from '@/app/components/AI-Chat-Module/chat-conversation-screen/components/ShowGeneratedSummariesDocs';

import {
  clearPageHeaderData,
  setPageHeaderData,
} from '@/app/redux/slices/login';
import Image from 'next/image';
import { resetUploadedFiles } from '@/app/redux/slices/fileUpload';
import { showToast } from '@/app/shared/toast/ShowToast';

// Dynamic Custom Component imports
const DynamicMessageLoading = dynamic(
  () =>
    import(
      '@/app/components/AI-Chat-Module/chat-conversation-screen/components/AnswerLoading'
    )
);

export default function Conversation({ threadId }: { threadId: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const messagesList = useSelector(selectMessageList);
  const isStreamingMessages = useSelector(selectIsStreaming);
  const messagesChunks = useSelector(selectMessagesChunks);
  const chatElementRef = useRef<HTMLInputElement>(null);
  const [chatStartTime] = useState(Date.now()); // Track when user enters conversation

  const [page, setPage] = useState(1);
  const [droppedFiles, setDroppedFiles] = useState<File[] | null>([]);
  // Drag and Drop file upload
  const [isDragging, setIsDragging] = useState(false);

  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetchingPreviousMessages, setIsFetchingPreviousMessages] =
    useState(false);
  const [hasMore, setHasMore] = useState(
    messagesList.results?.length < messagesList.count
  );
  const previousScrollTopRef = useRef(0); // Ref to store the previous scroll position
  const previousScrollHeightRef = useRef(0); // Store the scroll height before data append

  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const [isMessagesLoading, setIsMessagesLoading] = useState(true);

  const loggedInUser = useAppSelector(
    (state: RootState) => state.login.loggedInUser
  );

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

  const getThreadMessagesDetails = async (thread: string, pageVal: number) => {
    if (pageVal === 1) {
      setIsInitialLoading(true);
    } else {
      setIsFetchingPreviousMessages(true);
    }

    const resultData = await dispatch(
      fetchThreadMessagesByThreadId({
        thread_uuid: thread,
        page: pageVal,
      })
    );

    if (fetchThreadMessagesByThreadId.fulfilled.match(resultData)) {
      if (resultData.payload?.results?.length > 0) {
        setIsFetchingPreviousMessages(false);
        // setMessagesList(resultData.payload);
      }
    }

    if (pageVal === 1) {
      setIsInitialLoading(false);
    } else {
      setIsFetchingPreviousMessages(false);
    }
  };

  const getThreadDetails = async (thread: string) => {
    const resultData = await dispatch(
      getThreadDetailsById({
        thread_uuid: thread,
      })
    );

    if (getThreadDetailsById.fulfilled.match(resultData)) {
      dispatch(setActiveThread(resultData.payload));
      const threadCreatedDate = dayjs(resultData.payload.created).format(
        'MM-DD-YYYY'
      );
      dispatch(
        setPageHeaderData({
          title: resultData.payload.name || 'New Thread',
          subTitle: `Created On : ${threadCreatedDate}`,
        })
      );
    }

    if (getThreadDetailsById.rejected.match(resultData)) {
      router.push('/ai-chats');
      showToast('error', 'Unable to load conversation.');
    }
  };

  const groupedData = groupByDate(messagesList?.results || []);

  useEffect(() => {
    if (threadId) {
      getThreadMessagesDetails(threadId, page);
      getThreadDetails(threadId);
    }
  }, [threadId]);

  const handleSendMessage = (payloadData: SocketPayload) => {
    dispatch(setIsStreaming(true));
    dispatch(clearChunks([]));
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

  const handleFileUploadSubmit = () => {
    // need to call the messages list API to get the uplaoded document data
    getThreadMessagesDetails(threadId, 1);
  };

  useEffect(() => {
    return () => {
      dispatch(setActiveThread(null));
      dispatch(setIsStreaming(false));
      dispatch(clearChunks([]));
      dispatch(clearMessagesList());
      dispatch(clearPageHeaderData());
      dispatch(resetUploadedFiles());
    };
  }, []);

  useEffect(() => {
    setHasMore(messagesList.results.length < messagesList.count);
    if (page === 1) {
      jumpToLastMessage();
    }
  }, [messagesList.results.length, messagesList.count]);

  const handleScroll = async () => {
    const el = chatElementRef.current;
    if (!el || isFetchingPreviousMessages || !hasMore) return;

    if (el.scrollTop === 0) {
      setIsFetchingPreviousMessages(true);

      try {
        const { scrollTop, scrollHeight } = chatElementRef.current;
        // Save the current scroll position before making the API call
        previousScrollTopRef.current = scrollTop;
        previousScrollHeightRef.current = scrollHeight;

        const nextPage = page + 1;
        setPage(nextPage);
        await getThreadMessagesDetails(threadId, nextPage);
      } catch (e) {
        console.error(e);
      } finally {
        setIsFetchingPreviousMessages(false);

        // Scroll back to the previous position after the API call finishes
        const container = chatElementRef.current;

        if (container) {
          // Wait until DOM updates to restore scroll position
          setTimeout(() => {
            const scrollHeightDifference =
              container.scrollHeight - previousScrollHeightRef.current;

            container.scrollTo({
              top: previousScrollTopRef.current + scrollHeightDifference,
              behavior: 'smooth',
            });
          }, 0); // This can be adjusted if necessary
        }
      }
    }
  };
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only hide if actually leaving the main container
    if (e.target === e.currentTarget) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Needed to allow dropping
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    setDroppedFiles(files);
    // // to trigger inputChange when same file gets uploaded again
    // const target = e.target as HTMLInputElement;
    // target.value = '';
    // console.log('Dropped files:', files);
    // Handle files here
  };

  // Track time spent when user leaves the conversation
  useEffect(() => {
    return () => {
      const chatDuration = (Date.now() - chatStartTime) / 1000; // Convert to seconds
      window.gtag?.('event', 'chat_duration', {
        event_category: 'User Engagement',
        event_label: 'Chat Conversation',
        value: Math.round(chatDuration),
        thread_id: threadId, // Track which conversation thread
      });
    };
  }, [chatStartTime, threadId]);

  return (
    <>
      <div
        className={AIChatStyles.chatContainer}
        ref={chatElementRef}
        onScroll={handleScroll}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Drag and Drop file upload */}
        {isDragging && <DraggingUIConversation />}
        {/* Drag and Drop file upload */}
        {isInitialLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <Image
              src="/gif/infinite-loader.gif"
              alt="loading-gif"
              width={18}
              height={18}
              unoptimized
              style={{ scale: 10 }}
            />
          </div>
        )}
        <Container maxWidth="lg" disableGutters>
          {isFetchingPreviousMessages && !isInitialLoading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '35px',
                padding: '35px',
              }}
            >
              <Image
                src="/gif/infinite-loader.gif"
                alt="loading-gif"
                width={18}
                height={18}
                unoptimized
                style={{ scale: 5 }}
              />
            </div>
          )}
          {groupedData &&
            Object.keys(groupedData).map((date) => {
              return (
                <React.Fragment key={date}>
                  <Box component="div" className={chatMessagesStyles.chatDate}>
                    <span>
                      {' '}
                      {dayjs(date, 'DD-MM-YYYY').format('MM-DD-YYYY')}
                    </span>
                  </Box>
                  <Box
                    component="div"
                    className={chatMessagesStyles.chatWindow}
                  >
                    {groupedData[date].map((record: ChatMessage) => (
                      <React.Fragment key={record.uuid}>
                        {loggedInUser &&
                        loggedInUser.data?.id == record.sender ? (
                          <>
                            {record.uploaded_documents?.length > 0 ? (
                              <QuestionCardWithFiles
                                messageObj={record}
                                userDetails={loggedInUser}
                              />
                            ) : (
                              <QuestionComponent
                                userDetails={loggedInUser}
                                messageObj={record}
                              />
                            )}

                            {/* {record.message && (
                              <QuestionComponent
                              userDetails={loggedInUser}
                              messageObj={record}
                            />
                            )} */}
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
                              <AnswerComponent messageObj={record} />
                            )}
                          </>
                        )}
                      </React.Fragment>
                    ))}
                  </Box>
                </React.Fragment>
              );
            })}

          <Box
            sx={{ padding: '0 16px' }}
            className={chatMessagesStyles.chatWindow}
          >
            {isStreamingMessages &&
              messagesChunks &&
              (messagesChunks.length > 2 ? (
                <StreamingAnswerComponent
                  isStreaming={isStreamingMessages}
                  inputText={messagesChunks.join('')}
                />
              ) : (
                <DynamicMessageLoading />
              ))}
          </Box>
        </Container>
      </div>
      <div
        style={{
          padding: '0 16px 20px 16px',
          position: 'sticky',
          bottom: 0,
          width: '100%',
        }}
      >
        <Container maxWidth="lg" disableGutters>
          {/* <UserChatInput
            handleFileUploadSubmit={() => handleFileUploadSubmit()}
            threadId={threadId}
            sendMessage={(payloadData) => handleSendMessage(payloadData)}
            isLoadingProp={isStreamingMessages}
          /> */}
          <ChatInputBox
            droppedFiles={droppedFiles}
            threadId={threadId}
            handleFileUploadSubmit={() => handleFileUploadSubmit()}
            sendMessage={(payloadData) => handleSendMessage(payloadData)}
            isLoadingProp={isStreamingMessages}
          />
        </Container>
      </div>
    </>
  );
}
