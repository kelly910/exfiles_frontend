/* eslint-disable  @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import {
  fetchThreadMessagesByThreadId,
  selectMessageList,
  setActiveThreadId,
} from '@/app/redux/slices/Chat';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import UploadFilesStatusMessage from './UploadFilesStatusMessage';
import { Box, Container } from '@mui/material';
import chatMessagesStyles from '@components/AI-Chat/styles/ChatMessagesStyle.module.scss';
import { RootState } from '@/app/redux/store';
import { ChatMessage, UploadedDocument } from '@store/slices/Chat/chatTypes';
import Question from './Question';
import UserChatInput from '../Input/UserChatInput';
// import Answer from './Answer';
import AIChatStyles from '@components/AI-Chat/styles/AIChatStyle.module.scss';
import LoadingDocumentsSummary from './LoadingDocumentsSummary';
import ShowGeneratedSummariesDocs from './ShowGeneratedSummariesDocs';
import { useSelector } from 'react-redux';
import GeneratingCombinedSummary from './GeneratingCombinedSummary';
import ShowGeneratedCombinedSummaries from './ShowGeneratedCombinedSummaries';
import { SocketPayload } from '../../types/aiChat.types';
import { sendSocketMessage } from '@/app/services/WebSocketService';

export default function ChatMessagesComponent({
  threadId,
}: {
  threadId: string;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const messagesList = useSelector(selectMessageList);

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

  const groupedData = groupByDate(messagesList?.results || []);

  useEffect(() => {
    if (threadId) {
      getThreadMessagesDetails(threadId);
      setActiveThreadId(threadId);
    }
  }, [threadId]);

  const handleSendMessage = (payloadData: SocketPayload) => {
    sendSocketMessage({ ...payloadData, thread_uuid: threadId });
  };

  return (
    <>
      <div className={AIChatStyles.chatContainer}>
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
                    {groupedData[date].map((record: ChatMessage) => (
                      <>
                        {loggedInUser &&
                        loggedInUser.data.id == record.sender ? (
                          <>
                            {record.uploaded_documents.length > 0 && (
                              <UploadFilesStatusMessage
                                messageObj={record}
                                userDetails={loggedInUser}
                              />
                            )}

                            {record.uploaded_documents.length == 0 && (
                              <Question
                                userDetails={loggedInUser}
                                messageObj={record}
                              />
                            )}

                            {record.uploaded_documents.length == 0 && (
                              <GeneratingCombinedSummary
                                userDetails={loggedInUser}
                                messageObj={record}
                              />
                            )}
                          </>
                        ) : (
                          <>
                            {!record.uploaded_documents &&
                              !record.combined_summary_data?.length && (
                                <LoadingDocumentsSummary messageObj={record} />
                              )}
                            {record.summary_documents &&
                              record.summary_documents.length > 0 &&
                              !record.combined_summary_data && (
                                <ShowGeneratedSummariesDocs
                                  handleDocCategoryClick={(documentItem) =>
                                    handleDocCategoryClick(documentItem)
                                  }
                                  handleDocSummaryClick={(documentItem) =>
                                    handleDocSummaryClick(documentItem)
                                  }
                                  handleGenerateCombinedSummary={(
                                    payloadData
                                  ) => handleSendMessage(payloadData)}
                                  messageObj={record}
                                />
                              )}
                            {
                              <ShowGeneratedCombinedSummaries
                                messageObj={record}
                              />
                            }
                          </>
                        )}

                        {/* <LoadingGenerateSummary />
                        <Question
                          userDetails={loggedInUser}
                          messageObj={record}
                        />
                        <Answer messageObj={record} /> */}
                      </>
                    ))}
                  </Box>
                </>
              );
            })}
        </Container>
      </div>
      <div style={{ padding: '0 10px 20px 10px' }}>
        <Container maxWidth="lg" disableGutters>
          <UserChatInput
            handleOpenDocUploadModal={() => {}}
            sendMessage={(payloadData) => handleSendMessage(payloadData)}
          />
        </Container>
      </div>
    </>
  );
}
