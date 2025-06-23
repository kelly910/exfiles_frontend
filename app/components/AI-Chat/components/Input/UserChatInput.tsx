/* eslint-disable @typescript-eslint/no-unused-vars */
import AIChatStyles from '@components/AI-Chat/styles/AIChatStyle.module.scss';
import {
  Box,
  Button,
  CircularProgress,
  Input,
  InputAdornment,
  Typography,
} from '@mui/material';
import InputUploadFileItem from '@components/AI-Chat/components/FileUpload/InputUploadFileItem'; // Adjusted the path to the correct location
import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { SocketPayload } from '../../types/aiChat.types';
import { QUESTION_TYPES } from '@/app/utils/constants';
import dynamic from 'next/dynamic';
interface UserChatInputProps {
  droppedFiles?: File[];
  handleFileUploadSubmit?: () => void;
  sendMessage: (payloadMsg: SocketPayload) => void;
  isLoadingProp?: boolean;
  selectedPrompt?: string | null;
  threadId?: string | null;
}

const DynamicDocUploadModal = dynamic(
  () =>
    import('@/app/components/AI-Chat/components/Modals/DocumentUploadDialog')
);

export default function UserChatInput({
  droppedFiles,
  sendMessage,
  isLoadingProp,
  selectedPrompt,
  threadId,
  handleFileUploadSubmit,
}: UserChatInputProps) {
  const [text, setText] = useState('');
  const isSendDisabled = isLoadingProp || !text?.trim();
  const [isOpenDocUpload, setIsOpenDocUpload] = useState(false);

  const handleOpenDocUploadModal = () => {
    setIsOpenDocUpload(true);
  };
  const handleCloseDocUploadModal = () => {
    setIsOpenDocUpload(false);
  };

  const handleKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const key = event.key.toLowerCase();
      if (key === 'enter' && !event.shiftKey && text?.length > 0) {
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

  // Drag and Drop file upload

  const [files, setFiles] = useState([]); // State to hold files and their upload status

  // Handle file removal
  const handleRemoveFile = (fileId: string) => {
    // setFiles((prevFiles) => prevFiles.filter((file) => file.fileId !== fileId));
  };

  // Handle file description
  const handleFileDesc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fileId: string
  ) => {
    console.log('File description for', fileId, ':', e.target.value);
  };

  // useEffect(() => {
  //   if (droppedFiles.length === 0) return; // No files dropped
  //   droppedFiles.forEach((file) => {
  //     const fileId = Date.now().toString(); // Use a unique file ID (e.g., timestamp)
  //     setFiles((prevFiles) => [
  //       ...prevFiles,
  //       {
  //         file,
  //         fileId,
  //         progress: 0,
  //         hasUploaded: false,
  //         hasError: false,
  //         fileErrorMsg: '',
  //       },
  //     ]);
  //   });
  // }, [droppedFiles]);

  // Drag and Drop file upload

  const handleFileUploadInExistingThread = () => {
    if (handleFileUploadSubmit) {
      setText('');
      return handleFileUploadSubmit();
    }
  };

  return (
    <Box component="div" className={AIChatStyles.chatBoard}>
      {/* Uploaded file items */}
      {/* {files.length === 0 ? (
        <></>
      ) : (
        <Box className={AIChatStyles.fileInput}>
          <Box component="div" className={AIChatStyles.fileBoxDrag}>
            {files.map((fileData) => (
              <InputUploadFileItem
                key={fileData.fileId}
                fileName={fileData.file.name}
                fileSize={fileData.file.size}
                progress={fileData.progress}
                hasUploaded={fileData.hasUploaded}
                fileErrorMsg={fileData.fileErrorMsg}
                hasError={fileData.hasError}
                fileId={fileData.fileId}
                onRemove={handleRemoveFile}
                handleFileDesc={handleFileDesc}
              />
            ))}
          </Box>
          <InputAdornment
            position="end"
            className={AIChatStyles.fileIcon}
            onClick={handleOpenDocUploadModal}
          >
            <span className={AIChatStyles.clip}></span>
          </InputAdornment>
        </Box>
      )} */}

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
          <CircularProgress
            size={18}
            sx={{ color: 'var(--Txt-On-Gradient)' }}
          />
        ) : (
          <span className="arrow"></span>
        )}
      </Button>

      {isOpenDocUpload && (
        <DynamicDocUploadModal
          handleFileUploadSubmit={
            handleFileUploadSubmit
              ? () => handleFileUploadInExistingThread()
              : () => {}
          }
          threadId={threadId}
          userInputText={text}
          open={isOpenDocUpload}
          handleClose={handleCloseDocUploadModal}
        />
      )}
    </Box>
  );
}
