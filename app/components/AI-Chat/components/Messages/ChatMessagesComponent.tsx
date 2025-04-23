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
import Image from 'next/image';

// Dynamic Custom Component imports
const DynamicMessageLoading = dynamic(
  () => import('@/app/components/AI-Chat/components/Messages/MessageLoading')
);
const DynamicDocUploadModal = dynamic(
  () =>
    import('@/app/components/AI-Chat/components/Modals/DocumentUploadDialog')
);

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
  const [isOpenDocUpload, setIsOpenDocUpload] = useState(false);

  const [page, setPage] = useState(1);

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

  const handleClickOpen = () => {
    setIsOpenDocUpload(true);
  };

  const handleClose = () => {
    setIsOpenDocUpload(false);
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

  return (
    <>
      {/* <Box component="div" className={AIChatStyles.chatResBox}>
        <Box className={AIChatStyles.chatResBoxInner}>
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
          <Typography variant="body1" className={AIChatStyles.chatResTitle}>
            How to optimize images in WordPress for faster loading (complete
            guide)
          </Typography>
        </Box>
        <Typography variant="body1" className={AIChatStyles.chatResSemiTitle}>
          Created On : <span>25-02-2025</span>
        </Typography>
      </Box> */}
      <div
        className={AIChatStyles.chatContainer}
        ref={chatElementRef}
        onScroll={handleScroll}
      >
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

          <Box sx={{ padding: '0 16px' }}>
            {isStreamingMessages &&
              messagesChunks &&
              (messagesChunks.length > 2 ? (
                <StreamingResponse
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
          <UserChatInput
            handleOpenDocUploadModal={handleClickOpen}
            sendMessage={(payloadData) => handleSendMessage(payloadData)}
            isLoadingProp={isStreamingMessages}
          />
        </Container>
      </div>
      {isOpenDocUpload && (
        <DynamicDocUploadModal
          open={isOpenDocUpload}
          handleClose={handleClose}
          threadId={threadId}
          handleFileUploadSubmit={() => handleFileUploadSubmit()}
        />
      )}
    </>
  );
}
