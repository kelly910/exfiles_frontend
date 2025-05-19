/* eslint-disable @typescript-eslint/no-unused-vars */
import dynamic from 'next/dynamic';

import AIChatStyles from '@components/AI-Chat-Module/styles/AIChatStyle.module.scss';
import {
  Box,
  Button,
  CircularProgress,
  Input,
  InputAdornment,
  Typography,
} from '@mui/material';
// import InputUploadFileItem from '@components/AI-Chat/components/FileUpload/InputUploadFileItem'; // Adjusted the path to the correct location
import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { QUESTION_TYPES } from '@/app/utils/constants';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  removeUploadFile,
  resetUploadedFiles,
  selectUserUploadedFiles,
  updateFileDescription,
} from '@/app/redux/slices/fileUpload';
import UploadFileItem from '@/app/components/AI-Chat-Module/common/file-upload/UploadFileItem';
// Custom Types
import { SocketPayload } from '@components/AI-Chat-Module/types/aiChat.types';
import { useChunkedFileUpload } from '@/app/components/AI-Chat-Module/hooks/useChunkedFileUpload';
import { createNewThread, uploadActualDocs } from '@/app/redux/slices/Chat';
import { showToast } from '@/app/shared/toast/ShowToast';
import { useRouter } from 'next/navigation';
import { ErrorResponse, handleError } from '@/app/utils/handleError';

const DynamicDocUploadModal = dynamic(
  () => import('@components/AI-Chat-Module/modals/FileUploadDialog')
);

interface UserChatInputProps {
  droppedFiles?: File[] | null;
  sendMessage: (payloadMsg: SocketPayload) => void;
  isLoadingProp?: boolean;
  selectedPrompt?: string | null;
  handleFileUploadSubmit?: () => void;
  threadId?: string | null;
}

export default function ChatInputBox({
  droppedFiles,
  sendMessage,
  isLoadingProp,
  selectedPrompt,
  threadId,
  handleFileUploadSubmit,
}: UserChatInputProps) {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const uploadedFiles = useAppSelector(selectUserUploadedFiles);

  const { handleFiles } = useChunkedFileUpload();
  const [text, setText] = useState('');
  const [isOpenDocUpload, setIsOpenDocUpload] = useState(false);

  const isSendDisabled =
    isLoadingProp ||
    (!text?.trim() && (!uploadedFiles || uploadedFiles.length === 0));

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

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    const files: File[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file && file.type.startsWith('image/')) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      event.preventDefault();
      handleFiles(files);
    }
  };

  const uploadActualDocuments = async (
    threadUUID: string,
    payloadData: {
      temp_doc: number;
      description: string;
    }[]
  ) => {
    // setIsLoading(true);
    const resultData = await dispatch(
      uploadActualDocs({
        thread_uuid: threadUUID,
        data: payloadData,
        ...(text && { user_message: text }),
      })
    );
    // setIsLoading(false);

    if (uploadActualDocs.fulfilled.match(resultData)) {
      showToast(
        'success',
        resultData.payload?.messages[0] || 'Document uploaded successfully.'
      );

      if (threadId) {
        if (handleFileUploadSubmit) {
          setText('');
          handleFileUploadSubmit();
        }
      } else {
        // Need to redirect user to that Thread page
        router.push(`/ai-chats/${threadUUID}/`); // Navigate to thread page
      }
      dispatch(resetUploadedFiles());
      // handleClose();
      return;
    }

    if (uploadActualDocs.rejected.match(resultData)) {
      handleError(resultData.payload as ErrorResponse);
      console.error('failed:', resultData.payload);
      return;
    }
  };

  const handleMessageSending = async () => {
    if (uploadedFiles && uploadedFiles?.length > 0) {
      const payloadDocs = uploadedFiles
        .filter(({ uploadedFileId }) => typeof uploadedFileId === 'number')
        .map(({ uploadedFileId, docDesc }) => ({
          temp_doc: uploadedFileId as number,
          description: docDesc,
        }));

      if (payloadDocs.length === 0) return false; // Exit early if no valid files

      let createdThreadID;

      if (threadId) {
        createdThreadID = threadId;
      } else {
        // Create New Thread
        const resultData = await dispatch(createNewThread({}));

        if (createNewThread.rejected.match(resultData)) {
          showToast('error', 'Something went wrong. Please try again!');
          console.error('createNewThread failed:', resultData.payload);
          return;
        }

        createdThreadID = resultData.payload?.uuid;
      }

      if (!createdThreadID) return;

      // Upload documents
      uploadActualDocuments(createdThreadID, payloadDocs);
    } else {
      const message = {
        message_type: QUESTION_TYPES.QUESTION,
        message: text,
      };
      sendMessage(message);
      setText('');
    }
  };

  const handleFileUploadInExistingThread = () => {
    if (handleFileUploadSubmit) {
      setText('');

      return handleFileUploadSubmit();
    }
  };

  useEffect(() => {
    if (selectedPrompt) {
      setText(selectedPrompt);
    }
  }, [selectedPrompt]);

  useEffect(() => {
    if (droppedFiles && droppedFiles?.length > 0) {
      handleFiles(droppedFiles);
    }
  }, [droppedFiles]);

  const handleFileDesc = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fileId: string
  ) => {
    dispatch(
      updateFileDescription({ fileId: fileId, docDesc: e.target.value })
    );
  };

  const removeFile = (fileNum: string) => {
    dispatch(removeUploadFile({ fileId: fileNum }));
  };

  return (
    <Box component="div" className={AIChatStyles.chatBoard}>
      <Box className={AIChatStyles.fileInput}>
        {uploadedFiles && uploadedFiles?.length > 0 && (
          <Box component="div" className={AIChatStyles.fileBoxDrag}>
            {uploadedFiles.map((fileData) => (
              <UploadFileItem
                key={fileData.fileId}
                fileName={fileData.file.name}
                fileSize={fileData.file.size}
                progress={fileData.progress}
                hasUploaded={fileData.hasUploaded}
                fileErrorMsg={fileData.fileErrorMsg}
                hasError={fileData.hasError}
                fileId={fileData.fileId}
                fileDesc={fileData.docDesc}
                onRemove={() => removeFile(fileData.fileId)}
                handleFileDesc={handleFileDesc}
              />
            ))}
          </Box>
        )}
        <Input
          id="input-with-icon-adornment"
          className={AIChatStyles.fileInputInner}
          placeholder="Write your question here"
          value={text}
          onChange={handleText}
          onKeyDown={handleKeyUp}
          onPaste={handlePaste}
          multiline
          minRows={1}
          maxRows={3}
          disabled={false}
          style={{ width: '100%' }}
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
      </Box>

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
