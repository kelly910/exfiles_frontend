import DocUploadStyles from '@components/AI-Chat-Module/styles/DocumentUploadModal.module.scss';
import React, { ChangeEvent, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  Typography,
} from '@mui/material';
import { ALLOWED_FILE_TYPES } from '@/app/utils/constants';
import UploadFileItem from '@/app/components/AI-Chat-Module/common/file-upload/UploadFileItem';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { createNewThread, uploadActualDocs } from '@/app/redux/slices/Chat';
import { showToast } from '@/app/shared/toast/ShowToast';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { useRouter } from 'next/navigation';
import {
  removeUploadFile,
  resetUploadedFiles,
  selectUserUploadedFiles,
  updateFileDescription,
} from '@/app/redux/slices/fileUpload';
import { useChunkedFileUpload } from '../hooks/useChunkedFileUpload';
import { gtagEvent } from '@/app/utils/functions';
import { useThemeMode } from '@/app/utils/ThemeContext';

interface DocumentUploadModalProps {
  userInputText?: string;
  open: boolean;
  handleClose: () => void;
  threadId?: string | null;
  handleFileUploadSubmit?: () => void;
}

export default function FileUploadDialog({
  userInputText,
  open,
  handleClose,
  threadId,
  handleFileUploadSubmit,
}: DocumentUploadModalProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { handleFiles } = useChunkedFileUpload();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadedFiles = useAppSelector(selectUserUploadedFiles);

  const [isLoading, setIsLoading] = useState(false);

  const handleOpenUserFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLElement>
  ) => {
    if ('dataTransfer' in event) {
      handleFiles(event.dataTransfer.files);
    } else {
      handleFiles((event.target as HTMLInputElement).files);
    }

    // to trigger inputChange when same file gets uploaded again
    const target = event.target as HTMLInputElement;
    target.value = '';
  };

  const handleDrop = async (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    handleFileChange(event);
  };

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

  const uploadActualDocuments = async (
    threadUUID: string,
    payloadData: {
      temp_doc: number;
      description: string;
    }[]
  ) => {
    setIsLoading(true);
    const resultData = await dispatch(
      uploadActualDocs({
        thread_uuid: threadUUID,
        data: payloadData,
        ...(userInputText && { user_message: userInputText }),
      })
    );
    gtagEvent({
      action: 'upload_document',
      category: 'File Upload',
      label: 'Document uploaded',
    });
    setIsLoading(false);

    if (uploadActualDocs.fulfilled.match(resultData)) {
      showToast(
        'success',
        resultData.payload?.messages[0] || 'Document uploaded successfully.'
      );

      if (threadId) {
        if (handleFileUploadSubmit) {
          handleFileUploadSubmit();
        }
      } else {
        // Need to redirect user to that Thread page
        router.push(`/ai-chats/${threadUUID}/`); // Navigate to thread page
      }
      dispatch(resetUploadedFiles());

      handleClose();
      return;
    }

    if (uploadActualDocs.rejected.match(resultData)) {
      handleError(resultData.payload as ErrorResponse);
      console.error('failed:', resultData.payload);
      return;
    }
  };

  const handleContinue = async () => {
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
  };

  const { theme } = useThemeMode();

  return (
    <BootstrapDialog
      onClose={isLoading ? undefined : handleClose} // Prevents calling handleClose when isLoading is true
      aria-labelledby="customized-dialog-title"
      open={open}
      className={DocUploadStyles.dialogBox}
      sx={{
        background: 'rgb(17 16 27 / 0%)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <Box component="div" className={DocUploadStyles.dialogHeader}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Documents Upload
        </DialogTitle>
        <IconButton
          className={isLoading ? '' : DocUploadStyles.closeIcon}
          aria-label="close"
          onClick={isLoading ? undefined : handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
            cursor: isLoading ? 'not-allowed' : 'pointer', // Change cursor
            pointerEvents: isLoading ? 'none' : 'auto', // Prevent click when loading
          })}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.1 18.3C6.7134 18.6866 6.0866 18.6866 5.7 18.3C5.3134 17.9134 5.3134 17.2866 5.7 16.9L9.89289 12.7071C10.2834 12.3166 10.2834 11.6834 9.89289 11.2929L5.7 7.1C5.3134 6.7134 5.3134 6.0866 5.7 5.7C6.0866 5.3134 6.7134 5.3134 7.1 5.7L11.2929 9.89289C11.6834 10.2834 12.3166 10.2834 12.7071 9.89289L16.9 5.7C17.2866 5.3134 17.9134 5.3134 18.3 5.7C18.6866 6.0866 18.6866 6.7134 18.3 7.1L14.1071 11.2929C13.7166 11.6834 13.7166 12.3166 14.1071 12.7071L18.3 16.9C18.6866 17.2866 18.6866 17.9134 18.3 18.3C17.9134 18.6866 17.2866 18.6866 16.9 18.3L12.7071 14.1071C12.3166 13.7166 11.6834 13.7166 11.2929 14.1071L7.1 18.3Z"
              fill="var(--Primary-Text-Color)"
            />
          </svg>
        </IconButton>
      </Box>
      <DialogContent dividers className={DocUploadStyles.dialogBody}>
        {uploadedFiles && uploadedFiles?.length == 0 && (
          <Box
            className={`${DocUploadStyles.dialogContent}`}
            role="button"
            tabIndex={0}
            style={{
              cursor: 'pointer',
              userSelect: 'none',
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleOpenUserFileInput();
              }
            }}
            onDrop={(e) => handleDrop(e)}
            onDragOver={(event) => event.preventDefault()}
            onClick={() => handleOpenUserFileInput()}
          >
            <Box>
              <Image
                src={
                  theme === 'dark'
                    ? '/images/upload-img-new-light.png'
                    : '/images/upload-img-new.png'
                }
                alt="Upload-img"
                width={88}
                height={94}
              />
              <Typography gutterBottom>
                Drag your documents here to upload or <span>Click here</span> to
                upload
              </Typography>
              <Typography gutterBottom>
                You can upload upto 10 documents together.
              </Typography>
            </Box>
          </Box>
        )}

        <VisuallyHiddenInput
          id="chat-file-uploads"
          type="file"
          name="file-uploads"
          accept={ALLOWED_FILE_TYPES.join(',')}
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <Box component="div" className={DocUploadStyles.fileBoxBody}>
          {uploadedFiles.map((upload, index) => (
            <UploadFileItem
              isShowDescField={true}
              key={index}
              fileName={upload.file.name}
              fileId={upload.fileId}
              fileSize={upload.file.size}
              progress={upload.progress}
              isUploading={upload.isUploading}
              hasUploaded={upload.hasUploaded}
              fileErrorMsg={upload.fileErrorMsg}
              fileDesc={upload.docDesc}
              hasError={upload.hasError}
              onRemove={() => removeFile(upload.fileId)}
              handleFileDesc={handleFileDesc}
            />
          ))}
        </Box>
        <Box className={`${DocUploadStyles.dialogButtonBox}`} role="button">
          <>
            <Button
              variant="contained"
              className={DocUploadStyles.uploadBtn}
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleOpenUserFileInput}
              disabled={isLoading}
            >
              <Image
                src="/images/add-icon.svg"
                alt="Upload-img"
                width={20}
                height={20}
                className={DocUploadStyles.addIcon}
                style={{
                  filter:
                    theme === 'dark' ? 'brightness(0) invert(0.5)' : 'unset',
                }}
              />
              Add More
            </Button>
          </>
          <Button
            variant="contained"
            className="btn btn-primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isLoading}
            onClick={() => handleContinue()}
          >
            {isLoading ? (
              <CircularProgress
                size={20}
                style={{ color: 'var(--Txt-On-Gradient)' }}
              />
            ) : (
              'Continue'
            )}
          </Button>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  );
}

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    minWidth: '650px',
    maxHeight: '550px',
    border: '1px solid var(--Stroke-Color)',
    borderRadius: '12px',
    // Responsive styles
    '@media (max-width: 768px)': {
      width: '90vw', // Use width instead of minWidth for better responsiveness
      minWidth: '580px',
      maxHeight: '550px',
    },
    '@media (max-width: 600px)': {
      width: '90vw',
      minWidth: '80vw',
      maxHeight: '550px',
    },
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
