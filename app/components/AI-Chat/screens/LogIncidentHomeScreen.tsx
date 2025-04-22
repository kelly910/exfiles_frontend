import Image from 'next/image';
import AIChatStyles from '@components/AI-Chat/styles/AIChatStyle.module.scss';
import { Box, Container, Typography } from '@mui/material';
import UserChatInput from '../components/Input/UserChatInput';

export default function LogIncidentHomeScreen() {
  return (
    <>
      <div className={AIChatStyles.chatContainer}>
        <div className={AIChatStyles.chatBoarbMain}>
          <Box component="section" className={AIChatStyles.chatHeading}>
            <div className={AIChatStyles.chatHeader}>
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
                This is the place to log all the unusual incident happened.
                Start typing your incident below.
              </Typography>
            </div>
          </Box>
        </div>
      </div>
      <div
        style={{ padding: '0 16px 20px 16px', position: 'sticky', bottom: 0 }}
      >
        <Container maxWidth="lg" disableGutters>
          <UserChatInput
            handleOpenDocUploadModal={() => {}}
            sendMessage={() => {}}
            isLoadingProp={false}
          />
        </Container>
      </div>
    </>
  );
}
