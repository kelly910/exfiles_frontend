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
import { ALLOWED_FILE_TYPES, QUESTION_TYPES } from '@/app/utils/constants';
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
import { useSelector } from 'react-redux';
import { selectFetchedUser } from '@/app/redux/slices/login';

const DynamicDocUploadModal = dynamic(
  () => import('@components/AI-Chat-Module/modals/FileUploadDialog')
);

interface UserChatInputProps {
  droppedFiles?: File[] | null;
  sendMessage: (payloadMsg: SocketPayload) => void;
  isLoadingProp?: boolean;
  selectedPrompt?: { text: string; version: number } | null;
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
  const fetchedUser = useSelector(selectFetchedUser);
  const expiredStatus = fetchedUser?.active_subscription?.status;

  const chatUsedCheck =
    fetchedUser?.chat_used?.split('/')[0] ===
      fetchedUser?.chat_used?.split('/')[1] &&
    fetchedUser?.is_grace_point_used === true;

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

        if (file) {
          const isAllowed = ALLOWED_FILE_TYPES.some((ext) =>
            file.name?.toLowerCase().endsWith(ext)
          );
          if (isAllowed) {
            files.push(file);
          }
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
      setText(selectedPrompt.text);
    }
  }, [selectedPrompt?.version]);

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
          placeholder={
            expiredStatus === 0
              ? 'Your Plan has Expired'
              : chatUsedCheck
                ? 'Your copilot Chats Limit is Over'
                : 'Write your question here'
          }
          value={text}
          onChange={handleText}
          onKeyDown={handleKeyUp}
          onPaste={handlePaste}
          multiline
          minRows={1}
          maxRows={3}
          disabled={expiredStatus === 0 || chatUsedCheck}
          style={{ width: '100%' }}
          sx={{
            '.Mui-disabled': {
              color: 'var(--Subtext-Color) !important',
              WebkitTextFillColor: 'var(--Subtext-Color) !important',
            },
          }}
          endAdornment={
            <InputAdornment
              position="end"
              className={`${AIChatStyles.fileIcon} ${expiredStatus === 0 || chatUsedCheck ? 'limitation-icon' : ''}`}
              onClick={handleOpenDocUploadModal}
              disablePointerEvents={expiredStatus === 0 || chatUsedCheck}
            >
              <span className={AIChatStyles.clip}></span>
            </InputAdornment>
          }
          startAdornment={
            (expiredStatus === 0 || chatUsedCheck) && (
              <InputAdornment position="start">
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.76 15.92L15.36 4.4C14.5 2.85 13.31 2 12 2C10.69 2 9.49998 2.85 8.63998 4.4L2.23998 15.92C1.42998 17.39 1.33998 18.8 1.98998 19.91C2.63998 21.02 3.91998 21.63 5.59998 21.63H18.4C20.08 21.63 21.36 21.02 22.01 19.91C22.66 18.8 22.57 17.38 21.76 15.92ZM11.25 9C11.25 8.59 11.59 8.25 12 8.25C12.41 8.25 12.75 8.59 12.75 9V14C12.75 14.41 12.41 14.75 12 14.75C11.59 14.75 11.25 14.41 11.25 14V9ZM12.71 17.71C12.66 17.75 12.61 17.79 12.56 17.83C12.5 17.87 12.44 17.9 12.38 17.92C12.32 17.95 12.26 17.97 12.19 17.98C12.13 17.99 12.06 18 12 18C11.94 18 11.87 17.99 11.8 17.98C11.74 17.97 11.68 17.95 11.62 17.92C11.56 17.9 11.5 17.87 11.44 17.83C11.39 17.79 11.34 17.75 11.29 17.71C11.11 17.52 11 17.26 11 17C11 16.74 11.11 16.48 11.29 16.29C11.34 16.25 11.39 16.21 11.44 16.17C11.5 16.13 11.56 16.1 11.62 16.08C11.68 16.05 11.74 16.03 11.8 16.02C11.93 15.99 12.07 15.99 12.19 16.02C12.26 16.03 12.32 16.05 12.38 16.08C12.44 16.1 12.5 16.13 12.56 16.17C12.61 16.21 12.66 16.25 12.71 16.29C12.89 16.48 13 16.74 13 17C13 17.26 12.89 17.52 12.71 17.71Z"
                      fill="#E72240"
                    />
                  </svg>
                </span>
              </InputAdornment>
            )
          }
        />
      </Box>

      <Button
        type="button"
        variant="contained"
        className={`btn-arrow ${expiredStatus === 0 || chatUsedCheck ? 'limitation' : ''}`}
        color="primary"
        fullWidth
        onClick={handleMessageSending}
        disabled={isSendDisabled || expiredStatus === 0 || chatUsedCheck}
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
