import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import chatMessagesStyles from '@components/AI-Chat/styles/ChatMessagesStyle.module.scss';

import Image from 'next/image';

export default function MessageLoading() {
  return (
    <Box component="div" className={chatMessagesStyles.chatAl}>
      <Box component="div" className={chatMessagesStyles.chatAlImg}>
        <Tooltip title="Open settings">
          <IconButton sx={{ p: 0 }}>
            <Image
              src="/images/close-sidebar-logo.svg"
              alt="Logo"
              width={40}
              height={40}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Box component="div" className={chatMessagesStyles.chatAlContent}>
        <Typography
          variant="body1"
          className={chatMessagesStyles.chatAlContentText}
        >
          Hold on a second...
        </Typography>
        <Box component="div" className={chatMessagesStyles.chatAlCategory}>
          <Box
            component="div"
            className={chatMessagesStyles.chatAlCategoryInner}
          >
            <Image
              src="/gif/infinite-loader.gif"
              alt="loading-gif"
              width={35}
              height={35}
              unoptimized
            />
            <Typography
              variant="body1"
              className={chatMessagesStyles.chatAlText}
            >
              Preparing your answer...
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
