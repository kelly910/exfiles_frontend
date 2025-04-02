import DocUploadStyles from '@components/AI-Chat/Modals/DocumentUploadModal.module.scss';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import {
  Box,
  Button,
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
import UploadFileItem from '@components/AI-Chat/FileUpload/UploadFileItem';
import { computeChecksum, generateSHA256 } from '@/app/utils/functions';

interface DocumentUploadModalProps {
  open: boolean;
  handleClose: () => void;
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
}: DocumentUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadFiles, setUploadFiles] = useState<Array<UploadFiles> | []>([]);
  console.log(uploadFiles, 'uploadFiles');

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
    const { file, fileId, controller } = fileData;
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

      const formData = new FormData();
      formData.append('document', chunk);
      formData.append('extension', 'pdf');
      formData.append('file_name', file.name);
      formData.append('chunk_index', chunkIndex.toString());
      formData.append('total_index', totalChunks.toString());
      formData.append('file_size', file.size.toString());
      formData.append('checksum', checkSUM);

      try {
        let apiURI: string = documentId ? `${apiUrl}${documentId}/` : apiUrl; // If `documentId` exists, append it to the request URL
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
      const fileExtension = fileParts.pop()?.toLowerCase() || '';
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

  const handleFileDesc = (e: any, fileId: string) => {
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

  const handleContinue = () => {
    const userUploadedFiles = uploadFiles.filter((file) => file.uploadedFileId);
    const payloadDocUpload = userUploadedFiles.map(
      ({ uploadedFileId, docDesc }) => ({
        temp_doc: uploadedFileId,
        description: docDesc,
      })
    );
    console.log(payloadDocUpload, 'payloadDocUpload');
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
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
          className={DocUploadStyles.closeIcon}
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
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
                width={148}
                height={117}
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
          accept=".pdf"
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
            disabled={false}
            onClick={() => handleContinue()}
          >
            Continue
          </Button>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  );
}

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: '#11101b',
    margin: '0px',
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
