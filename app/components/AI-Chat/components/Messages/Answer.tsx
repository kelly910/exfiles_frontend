import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import chatMessagesStyles from '@components/AI-Chat/styles/ChatMessagesStyle.module.scss';

import Image from 'next/image';
import { ChatMessage } from '@store/slices/Chat/chatTypes';
import { formatTo12HourTimeManually } from '@/app/utils/functions';

const processText = (text: string) => {
  if (text) {
    // Step 1: Double asterisk to bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Step 2: Single asterisk to bullet points
    // text = text.replace(/\*(.*?)\*/g, "- $1");
    text = text.replace(/\*(.*?)/g, '- $1');
    // text = text.replace(/^\* (.*)/gm, "- $1"); // Replace with dash bullet points
    // Alternatively, to replace with dot bullet points, use:
    // text = text.replace(/^\* (.*)/gm, '. $1');

    // Step 4: Hashes to heading tags
    text = text.replace(/^###### (.*)/gm, '<h6>$1</h6>');
    text = text.replace(/^##### (.*)/gm, '<h5>$1</h5>');
    text = text.replace(/^#### (.*)/gm, '<h4>$1</h4>');
    text = text.replace(/^### (.*)/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*)/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*)/gm, '<h1>$1</h1>');

    // Step 3: Newline to <br>
    text = text.replace(/\\n/g, '<br>');
    text = text.replace(/\n/g, '<br>');
  }

  return text;
};

export default function Answer({ messageObj }: { messageObj: ChatMessage }) {
  return (
    <>
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
          {(messageObj.message == 'Generating combined summary' ||
            messageObj.message == 'Generating summaries for documents') &&
          !messageObj.combined_summary_data ? (
            <>
              <Typography
                variant="body1"
                className={chatMessagesStyles.chatAlContentText}
              >
                Hold on a second...
              </Typography>
              <Box
                component="div"
                className={chatMessagesStyles.chatAlCategory}
              >
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
            </>
          ) : (
            <Typography
              variant="body1"
              className={chatMessagesStyles.chatAlContentText}
            >
              {messageObj.combined_summary_data ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: processText(
                      messageObj.combined_summary_data.summary
                    ),
                  }}
                />
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: processText(messageObj.message),
                  }}
                />
              )}
            </Typography>
          )}
          <span className={chatMessagesStyles.chatTime}>
            {formatTo12HourTimeManually(messageObj.created)}
          </span>
          <Box component="div" className={chatMessagesStyles.chatAlIcon}>
            <Button>
              <Image
                src="/images/chat-like.svg"
                alt="Reply"
                width={18}
                height={18}
              />
            </Button>
            <Button>
              <Image
                src="/images/chat-dlike.svg"
                alt="Reply"
                width={18}
                height={18}
              />
            </Button>
            <Button>
              <Image
                src="/images/chat-copy.svg"
                alt="Reply"
                width={18}
                height={18}
              />
            </Button>
            <Button>
              <Image
                src="/images/chat-edit.svg"
                alt="Reply"
                width={18}
                height={18}
              />
            </Button>
            <Button>
              <Image
                src="/images/chat-pin.svg"
                alt="Reply"
                width={18}
                height={18}
              />
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
