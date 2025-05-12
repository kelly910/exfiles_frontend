import { Box, IconButton, Typography } from '@mui/material';
import chatMessagesStyles from '@components/AI-Chat-Module/styles/ChatMessagesStyle.module.scss';

import Image from 'next/image';

interface StreamingResponseProps {
  inputText: string;
  isStreaming: boolean;
}

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
