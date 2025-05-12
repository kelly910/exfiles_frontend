import { Box, IconButton, Typography } from '@mui/material';
import chatMessagesStyles from '@components/AI-Chat-Module/styles/ChatMessagesStyle.module.scss';

import Image from 'next/image';
import { processText } from '@/app/utils/constants';

interface StreamingResponseProps {
  inputText: string;
  isStreaming: boolean;
}

export default function StreamingAnswer(props: StreamingResponseProps) {
  const { inputText } = props;

  return (
    <Box
      component="div"
      className={`${chatMessagesStyles.chatAl} streaming-container`}
    >
      <Box component="div" className={chatMessagesStyles.chatAlImg}>
        <IconButton sx={{ p: 0 }}>
          <Image
            alt="Logo"
            width={40}
            height={40}
            src="/images/close-sidebar-logo.svg"
          />
        </IconButton>
      </Box>
      <Box component="div" className={chatMessagesStyles.chatAlContent}>
        <Typography
          variant="body1"
          className={chatMessagesStyles.chatAlContentText}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: processText(inputText),
            }}
          />
        </Typography>
      </Box>
    </Box>
  );
}
