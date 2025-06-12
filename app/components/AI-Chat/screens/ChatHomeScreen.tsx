/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';

import AIChatStyles from '@components/AI-Chat/styles/AIChatStyle.module.scss';
import UserChatInput from '@components/AI-Chat/components/Input/UserChatInput';
import { SocketPayload } from '@components/AI-Chat/types/aiChat.types';
import { sendSocketMessage } from '@/app/services/WebSocketService';
import { useAppDispatch } from '@/app/redux/hooks';
import {
  clearChunks,
  createNewThread,
  setActiveThread,
  setIsStreaming,
} from '@/app/redux/slices/Chat';
import { useRouter } from 'next/navigation';
import { clearPageHeaderData } from '@/app/redux/slices/login';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import LogModel from '../../LogModel/LogModel';
// import Image from 'next/image';

export default function ChatHomeScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const CHAT_PROMPS = [
    'Upload a document - AI will summarize and organize it for you.',
    'How do I respond to this message?',
  ];

  const CHAT_TITLES = [
    'Ask me anything',
    'What do you need help with today?',
    'Got something to upload, log, or respond to?',
    'What are we documenting today?',
    'Start by uploading a file or asking a question.',
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [randomTitle, setRandomTitle] = useState<string | null>(null);

  const [openModel, setOpenModel] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState([]);

  const openLogIncidentModel = () => {
    setOpenModel(true);
  };

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

  const handlePromptClick = (prompText: string) => {
    setSelectedPrompt(prompText);
  };

  useEffect(() => {
    // Clearing Page data and the thread details
    dispatch(setActiveThread(null));
    dispatch(clearPageHeaderData());
    dispatch(setIsStreaming(false));
    dispatch(clearChunks([]));
  }, []);

  const getRandomTitle = () => {
    const index = Math.floor(Math.random() * CHAT_TITLES.length);
    return CHAT_TITLES[index];
  };

  useEffect(() => {
    const randomTitleString = getRandomTitle();
    setRandomTitle(randomTitleString);
  }, []);

  // Drag and Drop file upload
  // const [isDragging, setIsDragging] = useState(false);

  // const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setIsDragging(true);
  // };

  // const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   // Only hide if actually leaving the main container
  //   if (e.target === e.currentTarget) {
  //     setIsDragging(false);
  //   }
  // };

  // const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault(); // Needed to allow dropping
  //   e.stopPropagation();
  // };

  // const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setIsDragging(false);

  //   const files = Array.from(e.dataTransfer.files);
  //   setDroppedFiles(files);
  //   console.log('Dropped files:', files);
  //   // Handle files here
  // };

  // Drag and Drop file upload

  return (
    <>
      <div
        className={AIChatStyles.chatBoarbMain}
        // onDragEnter={handleDragEnter}
        // onDragLeave={handleDragLeave}
        // onDragOver={handleDragOver}
        // onDrop={handleDrop}
      >
        {/* Drag and Drop file upload */}
        {/* {isDragging && (
          <div className={AIChatStyles.dropOverlay}>
            <Box className={AIChatStyles.dropOverlayInner}>
              <Image
                src="/images/Upload-img.png"
                alt="Upload-img"
                width={88}
                height={94}
              />
              <Typography gutterBottom>
                Drag your documents here to upload
              </Typography>
              <Typography gutterBottom>
                You can upload upto 10 documents together.
              </Typography>
            </Box>
          </div>
        )} */}
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
            <Grid
              container
              spacing={{ xs: 2, md: 4 }}
              justifyContent="center"
              alignItems="stretch"
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                className={AIChatStyles.gridBoxInner}
              >
                <div
                  className={`${AIChatStyles.chatGridBox} ${AIChatStyles.chatLogIncident}`}
                  onClick={openLogIncidentModel}
                >
                  <div className={AIChatStyles.chatBox}>
                    <Typography variant="body1">
                      Log an incident - document what happened today.
                    </Typography>
                    <Button
                      type="button"
                      variant="contained"
                      className={`btn btn-primary-arrow ${AIChatStyles.gridBoxButton}`}
                      color="primary"
                      fullWidth
                    >
                      Log Incident
                      <span className="incident"></span>
                    </Button>
                  </div>
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                className={AIChatStyles.gridBoxInner}
              >
                <div className={AIChatStyles.chatGridBox}>
                  <div className={AIChatStyles.chatBox}>
                    <Typography variant="body1">{CHAT_PROMPS[0]}</Typography>
                    <Button
                      type="button"
                      variant="contained"
                      className={`btn btn-primary-arrow ${AIChatStyles.gridBoxButton}`}
                      color="primary"
                      fullWidth
                      onClick={() => handlePromptClick(CHAT_PROMPS[0])}
                    >
                      Start with this question
                      <span className="arrow"></span>
                    </Button>
                  </div>
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                className={AIChatStyles.gridBoxInner}
              >
                <div className={AIChatStyles.chatGridBox}>
                  <div className={AIChatStyles.chatBox}>
                    <Typography variant="body1">{CHAT_PROMPS[1]}</Typography>
                    <Button
                      type="button"
                      variant="contained"
                      className={`btn btn-primary-arrow ${AIChatStyles.gridBoxButton}`}
                      color="primary"
                      fullWidth
                      onClick={() => handlePromptClick(CHAT_PROMPS[1])}
                    >
                      Start with this question
                      <span className="arrow"></span>
                    </Button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Box>

          {/* <div className={AIChatStyles.chatHeader}>
          <Image
            src="/images/new-incident.svg"
            alt="new-incident"
            width={130}
            height={130}
            className={AIChatStyles.chatHeaderImage}
          />
          <Typography variant="h2" className={AIChatStyles.chatTitle}>
            Anything unusual happened?
          </Typography>
          <Typography variant="body1" className={AIChatStyles.chatSubtitle}>
            This is the place to log all the unusual incident happened. Start
            typing your incident below.
          </Typography>
        </div> */}
        </Box>
        <Box component="section" className={AIChatStyles.chatHeading}>
          <div className={AIChatStyles.chatHeader}>
            <Typography variant="h2" className={AIChatStyles.chatTitle}>
              {randomTitle}
            </Typography>
            <Typography
              variant="body1"
              className={AIChatStyles.chatSubtitle}
              sx={{ maxWidth: '500px' }}
            >
              Type your question or upload a message below—ExFiles will do the
              heavy lifting.
            </Typography>
          </div>

          <UserChatInput
            droppedFiles={droppedFiles}
            sendMessage={(payloadData) => handleNewSendMessage(payloadData)}
            isLoadingProp={isLoading}
            selectedPrompt={selectedPrompt}
          />
        </Box>
      </div>
      <LogModel
        open={openModel}
        handleClose={() => setOpenModel(false)}
        editedData={null}
      />
    </>
  );
}
