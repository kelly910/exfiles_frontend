import { Box, IconButton, Typography } from '@mui/material';
import chatMessagesStyles from '@components/AI-Chat/styles/ChatMessagesStyle.module.scss';

import Image from 'next/image';
import { useThemeMode } from '@/app/utils/ThemeContext';

export default function MessageLoading() {
  const { theme } = useThemeMode();
  return (
    <Box component="div" className={chatMessagesStyles.chatAl}>
      <Box component="div" className={chatMessagesStyles.chatAlImg}>
        <IconButton sx={{ p: 0 }}>
          <Image
            src="/images/close-sidebar-logo.svg"
            alt="Logo"
            width={40}
            height={40}
            style={{
              filter: theme === 'dark' ? 'brightness(0) invert(0)' : '',
            }}
          />
        </IconButton>
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
            className={`${chatMessagesStyles.chatAlCategoryInner} ${chatMessagesStyles.bgAnimation}`}
          >
            <Image
              src="/gif/infinite-loader.gif"
              alt="loading-gif"
              width={18}
              height={18}
              unoptimized
              style={{ scale: 3 }}
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
