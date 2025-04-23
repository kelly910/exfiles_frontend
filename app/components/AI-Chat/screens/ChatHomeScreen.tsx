import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

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

// Dynamic Custom Component imports
const DynamicDocUploadModal = dynamic(
  () =>
    import('@/app/components/AI-Chat/components/Modals/DocumentUploadDialog')
);

export default function ChatHomeScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const CHAT_PROMPS = [
    'What did say as a kid when asked: What do you want to be when you grow up?',
    'When is the last time you can remember feeling totally at peace?',
  ];

  const [isOpenDocUpload, setIsOpenDocUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const handleClickOpen = () => {
    setIsOpenDocUpload(true);
  };
  const handleClose = () => {
    setIsOpenDocUpload(false);
  };

  const handleNewSendMessage = async (payloadData: SocketPayload) => {
    setIsLoading(true);
    // Before sending a message we will create a new thread
    const resultData = await dispatch(
      createNewThread({
        name: payloadData.message.trim(),
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

  return (
    <div className={AIChatStyles.chatBoarbMain}>
      <Box component="section" className={AIChatStyles.chatHeading}>
        <div className={AIChatStyles.chatHeader}>
          <Typography variant="h2" className={AIChatStyles.chatTitle}>
            Wondering What is ExFiles?
          </Typography>
          <Typography variant="body1" className={AIChatStyles.chatSubtitle}>
            Try clicking on below examples to get things going
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
              <div
                className={`${AIChatStyles.chatGridBox} ${AIChatStyles.chatLogIncident}`} //${AIChatStyles.chatLogIncident} use only Log Incident
              >
                <div className={AIChatStyles.chatBox}>
                  <Typography variant="body1">
                    Something Unexpected Happened?
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
            How can I help you with?
          </Typography>
          <Typography
            variant="body1"
            className={AIChatStyles.chatSubtitle}
            sx={{ maxWidth: '500px' }}
          >
            Ask me anything. Enter the queries you get in textbox below, and see
            the magic of ExFiles.
          </Typography>
        </div>

        <UserChatInput
          handleOpenDocUploadModal={handleClickOpen}
          sendMessage={(payloadData) => handleNewSendMessage(payloadData)}
          isLoadingProp={isLoading}
          selectedPrompt={selectedPrompt}
        />
      </Box>

      {isOpenDocUpload && (
        <DynamicDocUploadModal
          open={isOpenDocUpload}
          handleClose={handleClose}
        />
      )}
    </div>
  );
}
