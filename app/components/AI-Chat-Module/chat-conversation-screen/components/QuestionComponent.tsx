import { Box, Typography } from '@mui/material';
import chatMessagesStyles from '@components/AI-Chat-Module/styles/ChatMessagesStyle.module.scss';
import { useSearch } from '../../context/SearchContext';
import { ChatMessage } from '@store/slices/Chat/chatTypes';
import { LoginResponse } from '@store/slices/login';
import {
  extractFileNames,
  formatTo12HourTimeManually,
} from '@/app/utils/functions';
import UserNameAvatar from '@components/AI-Chat-Module/chat-conversation-screen/components/UserNameAvatar';
import { highlightText } from '@/app/utils/constants';

export default function QuestionComponent({
  messageObj,
  userDetails,
}: {
  messageObj: ChatMessage;
  userDetails: LoginResponse;
}) {
  const fileList = extractFileNames(messageObj.message);
  const { searchingChat } = useSearch();
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
              dangerouslySetInnerHTML={{
                __html: highlightText(
                  messageObj.message.split('[')?.[0],
                  searchingChat
                ),
              }}
            />
            <Box
              component="div"
              className={chatMessagesStyles.chatAlGenerating}
            >
              {fileList.map((fileName) => (
                <span
                  key={fileName}
                  dangerouslySetInnerHTML={{
                    __html: highlightText(fileName, searchingChat),
                  }}
                ></span>
              ))}
            </Box>
          </>
        ) : (
          <Typography
            variant="body1"
            className={chatMessagesStyles.chatAlContentText}
            dangerouslySetInnerHTML={{
              __html: highlightText(messageObj.message, searchingChat),
            }}
          />
        )}
        <span className={chatMessagesStyles.chatTime}>
          {formatTo12HourTimeManually(messageObj.created)}
        </span>
      </Box>
      <Box component="div" className={chatMessagesStyles.chatAlImg}>
        <UserNameAvatar
          fullName={`${userDetails?.data?.first_name} ${userDetails?.data?.last_name}`}
        />
      </Box>
    </Box>
  );
}
