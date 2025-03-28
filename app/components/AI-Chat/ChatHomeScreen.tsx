import { useState } from 'react';
import dynamic from 'next/dynamic';

import { Box, Button, Grid, Typography } from '@mui/material';

import AIChatStyles from '@components/AI-Chat/AIChatStyle.module.scss';
import UserChatInput from './UserChatInput';

// Dynamic Custom Component imports
const DynamicDocUploadModal = dynamic(
  () => import('@components/AI-Chat/Modals/DocumentUploadDialog')
);

export default function ChatHomeScreen() {
  const [isOpenDocUpload, setIsOpenDocUpload] = useState(false);

  const handleClickOpen = () => {
    setIsOpenDocUpload(true);
  };
  const handleClose = () => {
    setIsOpenDocUpload(false);
  };

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
            spacing={4}
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
                  <Typography variant="body1">
                    What did say as a kid when asked: What do you want to be
                    when you grow up?
                  </Typography>
                  <Button
                    type="button"
                    variant="contained"
                    className={`btn btn-primary-arrow ${AIChatStyles.gridBoxButton}`}
                    color="primary"
                    fullWidth
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
                  <Typography variant="body1">
                    If you could visit one planet, which would it be?
                  </Typography>
                  <Button
                    type="button"
                    variant="contained"
                    className={`btn btn-primary-arrow ${AIChatStyles.gridBoxButton}`}
                    color="primary"
                    fullWidth
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
                  <Typography variant="body1">
                    When is the last time you can remember feeling totally at
                    peace?
                  </Typography>
                  <Button
                    type="button"
                    variant="contained"
                    className={`btn btn-primary-arrow ${AIChatStyles.gridBoxButton}`}
                    color="primary"
                    fullWidth
                  >
                    Start with this question
                    <span className="arrow"></span>
                  </Button>
                </div>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box component="section" className={AIChatStyles.chatHeading}>
        <div className={AIChatStyles.chatHeader}>
          <Typography
            variant="h2"
            className={AIChatStyles.chatTitle}
            sx={{ opacity: 0.8 }}
          >
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

        <UserChatInput handleOpenDocUploadModal={handleClickOpen} />
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
