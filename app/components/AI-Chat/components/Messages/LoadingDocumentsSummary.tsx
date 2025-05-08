import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import chatMessagesStyles from '@components/AI-Chat/styles/ChatMessagesStyle.module.scss';
import { ChatMessage } from '@store/slices/Chat/chatTypes';
import { formatTo12HourTimeManually } from '@/app/utils/functions';

export default function LoadingDocumentsSummary({
  messageObj,
}: {
  messageObj: ChatMessage;
}) {
  return (
    <Box component="div" className={chatMessagesStyles.chatAl}>
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
          Hold on a second...
        </Typography>
        <Box component="div" className={chatMessagesStyles.chatAlCategory}>
          <Box
            component="div"
            className={chatMessagesStyles.chatAlCategoryInner}
          >
            <Image
              src="/images/category.svg"
              alt="category"
              width={14}
              height={14}
            />
            <Typography
              variant="body1"
              className={chatMessagesStyles.chatAlText}
            >
              {messageObj.message || 'Generating Summary Links'}
            </Typography>
          </Box>
        </Box>
        <span className={chatMessagesStyles.chatTime}>
          {formatTo12HourTimeManually(messageObj.created)}
        </span>
      </Box>
    </Box>
  );
}
