import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { ChatMessage } from '@store/slices/Chat/chatTypes';
import chatMessagesStyles from '@components/AI-Chat/styles/ChatMessagesStyle.module.scss';
import Image from 'next/image';
import { formatTo12HourTimeManually } from '@/app/utils/functions';

export default function ShowGeneratedCombinedSummaries({
  messageObj,
}: {
  messageObj: ChatMessage;
}) {
  return (
    <Box component="div" className={chatMessagesStyles.chatAl}>
      <Box component="div" className={chatMessagesStyles.chatAlImg}>
        <Tooltip title="Open settings">
          <IconButton sx={{ p: 0 }}>
            <Image
              alt="Logo"
              width={40}
              height={40}
              src="/images/close-sidebar-logo.svg"
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Box component="div" className={chatMessagesStyles.chatAlContent}>
        <Typography
          variant="body1"
          className={chatMessagesStyles.chatAlContentText}
        >
          Here is your combined summary
        </Typography>
        <Box component="div" className={chatMessagesStyles.chatAlCombined}>
          <Box
            component="div"
            className={chatMessagesStyles.chatAlCombinedInner}
          >
            <Typography
              variant="body1"
              className={chatMessagesStyles.chatAlText}
            >
              As writing evolves in the digital age, the concept of paragraphs
              has extended beyond traditional print media. In online content,
              paragraphs are often shorter and more visually distinct to
              accommodate the shorter attention spans of digital readers.
              Additionally, the use of subheadings, bullet points, and numbered
              lists has become prevalent, allowing for easy scanning and
              navigation of online articles and blog posts. The advent of the
              internet and the rise of digital platforms have significantly
              influenced the way written content is consumed. Online readers
              tend to have shorter attention spans and engage with text
              differently compared to print readers. Consequently, paragraphs in
              digital writing have adapted to cater to these preferences. Online
              paragraphs are often shorter, consisting of only a few sentences.
              This brevity makes the content more accessible and digestible for
              readers who are accustomed to quickly scanning through online
              material.
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
