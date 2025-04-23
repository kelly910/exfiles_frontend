import AIChatStyles from '@components/AI-Chat/styles/AIChatStyle.module.scss';
import {
  Box,
  Button,
  CircularProgress,
  Input,
  InputAdornment,
} from '@mui/material';
import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { SocketPayload } from '../../types/aiChat.types';
import { QUESTION_TYPES } from '@/app/utils/constants';
interface UserChatInputProps {
  handleOpenDocUploadModal: () => void;
  sendMessage: (payloadMsg: SocketPayload) => void;
  isLoadingProp?: boolean;
  selectedPrompt?: string | null;
}

export default function UserChatInput({
  handleOpenDocUploadModal,
  sendMessage,
  isLoadingProp,
  selectedPrompt,
}: UserChatInputProps) {
  const [text, setText] = useState('');
  const isSendDisabled = isLoadingProp || !text?.trim();

  const handleKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const key = event.key.toLowerCase();
      if (key === 'enter' && !event.shiftKey) {
        event.preventDefault();
        handleMessageSending();
      }
    },
    [text]
  );

  const handleText = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.trim() || value === '') {
      setText(value);
    }
  }, []);

  const handleMessageSending = () => {
    const message = {
      message_type: QUESTION_TYPES.QUESTION,
      message: text,
    };
    sendMessage(message);
    setText('');
  };

  useEffect(() => {
    if (selectedPrompt) {
      setText(selectedPrompt);
    }
  }, [selectedPrompt]);

  return (
    <Box component="div" className={AIChatStyles.chatBoard}>
      <Input
        id="input-with-icon-adornment"
        className={AIChatStyles.fileInput}
        placeholder="Write your question here"
        value={text}
        onChange={handleText}
        onKeyDown={handleKeyUp}
        multiline
        minRows={1}
        maxRows={3}
        disabled={false}
        endAdornment={
          <InputAdornment
            position="end"
            className={AIChatStyles.fileIcon}
            onClick={handleOpenDocUploadModal}
          >
            <span className={AIChatStyles.clip}></span>
          </InputAdornment>
        }
      />
      <Button
        type="button"
        variant="contained"
        className={`btn-arrow`}
        color="primary"
        fullWidth
        onClick={handleMessageSending}
        disabled={isSendDisabled}
      >
        {isLoadingProp ? (
          <CircularProgress size={18} sx={{ color: '#fff' }} />
        ) : (
          <span className="arrow"></span>
        )}
      </Button>
    </Box>
  );
}
