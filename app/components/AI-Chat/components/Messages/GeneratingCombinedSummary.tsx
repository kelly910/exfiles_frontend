import { LoginResponse } from '@/app/redux/slices/login';
import { ChatMessage } from '@store/slices/Chat/chatTypes';
import chatMessagesStyles from '@components/AI-Chat/styles/ChatMessagesStyle.module.scss';
import { Box, Typography } from '@mui/material';
import { formatTo12HourTimeManually } from '@/app/utils/functions';
import NameAvatar from './NameAvatar';

export default function GeneratingCombinedSummary({
  messageObj,
  userDetails,
}: {
  messageObj: ChatMessage;
  userDetails: LoginResponse;
}) {
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
          Generating Combined summary using
        </Typography>
        <Box component="div" className={chatMessagesStyles.chatAlGenerating}>
          <span>RekamanProspek.pdf</span>
          <span>KartuNama.jpeg</span>
          <span>Company Profile.pdf</span>
          <span>Brosur Nusawork.pdf</span>
          <span>Brosur.pdf</span>
          <span>Nusawork.pdf</span>
          <span>Brosur.pdf</span>
          <span>Nusawork.pdf</span>
          <span>Brosur.pdf</span>
          <span>Nusawork.pdf</span>
          <span>Brosur.pdf</span>
          <span>Nusawork.pdf</span>
        </Box>
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
