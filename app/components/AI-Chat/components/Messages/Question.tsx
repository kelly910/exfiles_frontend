import { Box, Typography } from '@mui/material';
import chatMessagesStyles from '@components/AI-Chat/styles/ChatMessagesStyle.module.scss';

import NameAvatar from './NameAvatar';

export default function Question({ userDetails }: { userDetails: any }) {
  return (
    <Box
      component="div"
      className={`${chatMessagesStyles.chatAl} ${chatMessagesStyles.chatAlUser}`}
    >
      <Box component="div" className={chatMessagesStyles.chatAlContent}>
        <Typography
          variant="body1"
          className={chatMessagesStyles.chatAlContentText}
        >
          If you had $40,000 to build your own business, what would you do?
        </Typography>
        <span className={chatMessagesStyles.chatTime}>04:57 AM</span>
      </Box>
      <Box component="div" className={chatMessagesStyles.chatAlImg}>
        <NameAvatar
          fullName={`${userDetails?.data?.first_name} ${userDetails?.data?.last_name}`}
        />
      </Box>
    </Box>
  );
}
