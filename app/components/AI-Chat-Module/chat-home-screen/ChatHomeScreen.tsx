/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import AIChatStyles from '@components/AI-Chat-Module/styles/AIChatStyle.module.scss';
import ChatInputBox from '@/app/components/AI-Chat-Module/common/chat-input-box/ChatInputBox';
// Custom Types
import { SocketPayload } from '@components/AI-Chat-Module/types/aiChat.types';
import { sendSocketMessage } from '@/app/services/WebSocketService';
import { useAppDispatch } from '@/app/redux/hooks';
import {
  clearChunks,
  createNewThread,
  setActiveThread,
  setIsStreaming,
} from '@/app/redux/slices/Chat';
import { useRouter } from 'next/navigation';
import {
  clearPageHeaderData,
  selectFetchedUser,
} from '@/app/redux/slices/login';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import PromptsSuggestions from './components/PromptsSuggestions';
import DraggingUI from './components/DraggingUI';
import DynamicLowerHeader from './components/DynamicLowerHeader';
import { resetUploadedFiles } from '@/app/redux/slices/fileUpload';
import PlanExpiredMG from '../../Plan-Expired-MG/PlanExpiredMG';
import { useSelector } from 'react-redux';

export default function ChatHomeScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<{
    text: string;
    version: number;
  } | null>(null);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  const fetchedUser = useSelector(selectFetchedUser);
  const expiredStatus = fetchedUser?.active_subscription?.status;

  const handleNewSendMessage = async (payloadData: SocketPayload) => {
    setIsLoading(true);
    // Before sending a message we will create a new thread
    const resultData = await dispatch(
      createNewThread({
        // name: payloadData.message.trim().slice(0, 200),
      })
    );

    if (createNewThread.rejected.match(resultData)) {
      setIsLoading(false);
      handleError(resultData.payload as ErrorResponse);
      console.error('createNewThread failed:', resultData.payload);
      return;
    }

    const createdThreadID = resultData.payload?.uuid;
    setIsLoading(false);

    if (!createdThreadID) return;
    sendSocketMessage({ ...payloadData, thread_uuid: createdThreadID });
    dispatch(setIsStreaming(true));
    router.push(`/ai-chats/${createdThreadID}/`);
  };

  const handlePromptClick = (promptText: string) => {
    setSelectedPrompt({ text: promptText, version: Date.now() });
  };

  useEffect(() => {
    // Clearing Page data and the thread details
    dispatch(setActiveThread(null));
    dispatch(clearPageHeaderData());
    dispatch(setIsStreaming(false));
    dispatch(clearChunks([]));
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetUploadedFiles());
    };
  }, []);

  // Drag and Drop file upload
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only hide if actually leaving the main container
    // if (e.target === e.currentTarget) {
    //   setIsDragging(false);
    // }
    setDragCounter((prev) => {
      const newCount = prev - 1;
      if (newCount === 0) {
        setIsDragging(false);
      }
      return newCount;
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Needed to allow dropping
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    setDroppedFiles(files);
    // // to trigger inputChange when same file gets uploaded again
    // const target = e.target as HTMLInputElement;
    // target.value = '';
    // console.log('Dropped files:', files);
    // Handle files here
  };

  return (
    <>
      <div
        className={AIChatStyles.chatBoarbMain}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {expiredStatus === 0 && <PlanExpiredMG />}
        {/* Drag and Drop file upload */}
        {isDragging && <DraggingUI />}
        {/* Drag and Drop file upload */}

        <Box component="section" className={AIChatStyles.chatHeading}>
          <div className={AIChatStyles.chatHeader}>
            <Typography variant="h2" className={AIChatStyles.chatTitle}>
              What Can ExFiles Help You Do Today?
            </Typography>
            <Typography variant="body1" className={AIChatStyles.chatSubtitle}>
              Start with a common task below or ask your own question.
            </Typography>
          </div>

          <Box className={AIChatStyles.gridBox} component="div">
            <PromptsSuggestions handlePromptClick={handlePromptClick} />
          </Box>
        </Box>
        <Box component="section" className={AIChatStyles.chatHeading}>
          <DynamicLowerHeader />

          <ChatInputBox
            droppedFiles={droppedFiles}
            sendMessage={(payloadData) => handleNewSendMessage(payloadData)}
            isLoadingProp={isLoading}
            selectedPrompt={selectedPrompt}
          />
        </Box>
      </div>
    </>
  );
}
