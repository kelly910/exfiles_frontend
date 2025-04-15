import { Box, Typography } from '@mui/material';
import chatMessagesStyles from '@components/AI-Chat/styles/ChatMessagesStyle.module.scss';

import NameAvatar from './NameAvatar';
import { ChatMessage } from '@store/slices/Chat/chatTypes';
import { LoginResponse } from '@store/slices/login';
import { formatTo12HourTimeManually } from '@/app/utils/functions';

export default function Question({
  messageObj,
  userDetails,
}: {
  messageObj: ChatMessage;
  userDetails: LoginResponse;
}) {
  const extractFileNames = (text: string): string[] => {
    const matches = text.match(/\[([^\]]+)\]/);
    return matches
      ? matches[1].split(',').map((f) => f.trim().replace(/^'|'$/g, ''))
      : [];
  };
  const fileList = extractFileNames(messageObj.message);

  return (
    <Box
      component="div"
      className={`${chatMessagesStyles.chatAl} ${chatMessagesStyles.chatAlUser}`}
    >
      <Box component="div" className={chatMessagesStyles.chatAlContent}>
        {fileList && fileList?.length > 0 ? (
          <>
            <Typography
              variant="body1"
              className={chatMessagesStyles.chatAlContentText}
            >
              {messageObj.message.split('[')?.[0]}
            </Typography>
            <Box
              component="div"
              className={chatMessagesStyles.chatAlGenerating}
            >
              {fileList.map((fileName) => (
                <span key={fileName}>{fileName}</span>
              ))}
            </Box>
          </>
        ) : (
          <Typography
            variant="body1"
            className={chatMessagesStyles.chatAlContentText}
          >
            {messageObj.message}
          </Typography>
        )}
        <span className={chatMessagesStyles.chatTime}>
          {formatTo12HourTimeManually(messageObj.created)}
        </span>
      </Box>
      <Box component="div" className={chatMessagesStyles.chatAlImg}>
        <NameAvatar
          fullName={`${userDetails?.data?.first_name} ${userDetails?.data?.last_name}`}
        />
      </Box>
    </Box>
  );
}
