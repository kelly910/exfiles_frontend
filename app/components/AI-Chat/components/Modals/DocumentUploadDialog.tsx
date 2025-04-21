import DocUploadStyles from '@components/AI-Chat/styles/DocumentUploadModal.module.scss';
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
import {
  ALLOWED_FILE_TYPES,
  FILE_UPLOAD_CHUNK_SIZE,
} from '@/app/utils/constants';
import UploadFileItem from '@/app/components/AI-Chat/components/FileUpload/UploadFileItem';
import { computeChecksum } from '@/app/utils/functions';
import { useAppDispatch } from '@/app/redux/hooks';
import { createNewThread, uploadActualDocs } from '@/app/redux/slices/Chat';
import { showToast } from '@/app/shared/toast/ShowToast';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { useRouter } from 'next/navigation';

interface DocumentUploadModalProps {
  open: boolean;
  handleClose: () => void;
  threadId?: string | null;
  handleFileUploadSubmit?: () => void;
}

interface UploadFiles {
  file: File;
  progress: number;
  docDesc: string;
  isUploading: boolean;
  hasUploaded: boolean;
  fileId: string;
  controller?: AbortController;
  fileErrorMsg: string;
  hasError: boolean;
  uploadedFileId: string | number | null;
}

type successChunkResponseType = {
  uploadedFileId: number | string;
  is_completed: boolean;
} | null;

export default function DocumentUploadDialog({
  open,
  handleClose,
  threadId,
  handleFileUploadSubmit,
}: DocumentUploadModalProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadFiles, setUploadFiles] = useState<Array<UploadFiles> | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const storedUser = localStorage.getItem('loggedInUser');

  const handleOpenUserFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadFileInChunks = async (
    fileData: UploadFiles,
    onProgress: (progress: number) => void
  ) => {
    const { file, controller } = fileData;
    const totalChunks = Math.ceil(file.size / FILE_UPLOAD_CHUNK_SIZE);

    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const token: string | null = parsedUser?.data?.token || null;
    let uploadedSize = 0;

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/upload-temporary-document/`;

    let documentId: string | null = null; // Store the document ID after the first request
    let successChunkResponse: successChunkResponseType = null;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * FILE_UPLOAD_CHUNK_SIZE;
      const end = Math.min(start + FILE_UPLOAD_CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      // Generate SHA-256 checksum for each chunk
      const checkSUM = await computeChecksum(chunk);
      const filename = file.name.split('.')[0];
      const fileParts = file.name.split('.');
      const fileExtension = (fileParts.pop() || '').toLowerCase();

      const formData = new FormData();
      formData.append('document', chunk);
      formData.append('extension', fileExtension);
      formData.append('file_name', filename);
      formData.append('chunk_index', chunkIndex.toString());
      formData.append('total_index', totalChunks.toString());
      formData.append('file_size', file.size.toString());
      formData.append('checksum', checkSUM);

      try {
        const apiURI: string = documentId ? `${apiUrl}${documentId}/` : apiUrl; // If `documentId` exists, append it to the request URL
        const response = await fetch(apiURI, {
          method: chunkIndex === 0 ? 'POST' : 'PUT',
          body: formData,
          signal: controller?.signal,
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();

        // Extract document ID after the first request
        if (chunkIndex === 0) {
          if (data.id) {
            documentId = data.id; // ✅ Store ID for next chunks
          } else {
            throw new Error('Failed to get document ID');
          }
        }

        uploadedSize += chunk.size;
        const progress = Math.round((uploadedSize / file.size) * 100);
        onProgress(progress);

        // Check if `is_completed` is true, update state with `uploadedFileId`
        if (data.is_completed) {
          successChunkResponse = {
            uploadedFileId: data.id,
            is_completed: data.is_completed,
          };

          // Return the last chunk response when `is_completed` is true
          return successChunkResponse;
        }
      } catch (error) {
        // Need to handle the Chunk api error- Set the error into
        console.error(
          `Error uploading chunk ${chunkIndex} for ${file.name}:`,
          error
        );
        return false;
      }
    }

    return true; // Ensure function always returns a boolean or response
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles: File[] = Array.from(files);

    const newUploads: Array<UploadFiles> = newFiles.map((file) => {
      const fileParts = file.name.split('.');
      const isSingleExtension = fileParts.length === 2; // Ensures only one dot
      const fileExtension = '.' + fileParts.pop()?.toLowerCase();
      const isValidExtension =
        isSingleExtension && ALLOWED_FILE_TYPES.includes(fileExtension);

      return {
        file,
        progress: 0,
        isUploading: isValidExtension, // False if invalid
        hasUploaded: false,
        controller: new AbortController(), // Adding this to stop chunk api calls if user cancel the uploading
        fileId: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        docDesc: '',
        uploadedFileId: null,
        fileErrorMsg: isValidExtension ? '' : 'Invalid file extension',
        hasError: !isValidExtension, // True if invalid
      };
    });
    // Update original state
    setUploadFiles((prev) => [...newUploads, ...prev]);

    // Upload only valid files (hasError: false)
    newUploads
      .filter((file) => !file.hasError) // Filter out invalid files
      .forEach((fileData) => {
        uploadFileInChunks(fileData, (progress) => {
          setUploadFiles((prev) =>
            prev.map((f) =>
              f.fileId === fileData.fileId ? { ...f, progress } : f
            )
          );
        }).then((response) => {
          if (
            response &&
            typeof response === 'object' &&
            response.is_completed
          ) {
            setUploadFiles((prev) =>
              prev.map((f) =>
                f.fileId === fileData.fileId
                  ? {
                      ...f,
                      hasUploaded: true,
                      uploadedFileId: response.uploadedFileId,
                    }
                  : f
              )
            );
          }
        });
      });
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
    setUploadFiles((prevFiles) =>
      prevFiles.map((prevFile) =>
        prevFile.fileId === fileId
          ? {
              ...prevFile,
              docDesc: e.target.value,
            }
          : prevFile
      )
    );
  };

  const removeFile = (fileNum: string) => {
    setUploadFiles((prev) => {
      // Find the file with the matching fileId and abort its controller if it exists
      prev.find(({ fileId }) => fileId === fileNum)?.controller?.abort();

      // Return a new array excluding the file with the matching fileId
      return prev.filter(({ fileId }) => fileId !== fileNum);
    });
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
      })
    );
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
    const payloadDocs = uploadFiles
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
          <Image
            src="/images/close.svg"
            alt="close-icon"
            width={24}
            height={24}
          />
        </IconButton>
      </Box>
      <DialogContent dividers className={DocUploadStyles.dialogBody}>
        {uploadFiles && uploadFiles?.length == 0 && (
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
                src="/images/Upload-img.png"
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
          {uploadFiles.map((upload, index) => (
            <UploadFileItem
              key={index}
              fileName={upload.file.name}
              fileId={upload.fileId}
              fileSize={upload.file.size}
              progress={upload.progress}
              isUploading={upload.isUploading}
              hasUploaded={upload.hasUploaded}
              fileErrorMsg={upload.fileErrorMsg}
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
              <CircularProgress size={20} style={{ color: 'white' }} />
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
