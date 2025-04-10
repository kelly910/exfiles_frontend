import Image from 'next/image';
import debounce from 'lodash.debounce';

import DocUploadStyles from '@components/AI-Chat/styles/DocumentUploadModal.module.scss';
import { Box, LinearProgress, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useMemo } from 'react';
import { formatFileSizeLabel } from '@/app/utils/functions';

interface FileItemProps {
  fileName: string;
  fileSize: number;
  progress: number;
  isUploading?: boolean;
  hasUploaded: boolean;
  fileErrorMsg?: string;
  hasError: boolean;
  fileId: string;
  onRemove: (fileId: string) => void;
  handleFileDesc: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fileId: string
  ) => void;
}

export default function UploadFileItem({
  fileSize,
  fileName,
  progress,
  hasUploaded,
  fileErrorMsg,
  hasError,
  fileId,
  onRemove,
  handleFileDesc,
}: FileItemProps) {
  const debouncedHandleFileDesc = useMemo(
    () =>
      debounce(
        (
          event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          fileId: string
        ) => {
          handleFileDesc(event, fileId);
        },
        300
      ),
    [handleFileDesc]
  );

  // Clean up the debounced function when component unmounts or handleFileDesc changes
  useEffect(() => {
    return () => {
      debouncedHandleFileDesc.cancel();
    };
  }, [debouncedHandleFileDesc]);

  return (
    <Box component="div" className={DocUploadStyles.fileBoxInner}>
      <div className={DocUploadStyles.fileGridBox}>
        <div className={DocUploadStyles.fileBox}>
          <span className={DocUploadStyles.fileIcon}>
            <Image
              src="/images/pdf.svg"
              alt="pdf"
              width={14}
              height={16}
              className={DocUploadStyles.pdfImg}
            />
          </span>
          <Typography variant="body1" className={DocUploadStyles.fileTitle}>
            {fileName}
            <span>{formatFileSizeLabel(fileSize)}</span>
          </Typography>
          {hasUploaded ? (
            <Image
              src="/images/trash.svg"
              alt="more"
              width={16}
              height={16}
              className={DocUploadStyles.trashImg}
              onClick={() => onRemove(fileId)}
            />
          ) : (
            <Image
              src="/images/cancel-icon.svg"
              alt="cross-icon"
              width={16}
              height={16}
              className={DocUploadStyles.trashImg}
              onClick={() => onRemove(fileId)}
            />
          )}
        </div>

        {/* Show Progress bar for loading if the file is uploading */}
        {!hasUploaded && !hasError && (
          <Box component="div" className={DocUploadStyles.chatAlProgress}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}

        {/* Show Description field if the file is uploaded successfully */}
        {hasUploaded && (
          <TextField
            fullWidth
            placeholder="Add Description of this file"
            className={DocUploadStyles.fileInput}
            onChange={(e) => debouncedHandleFileDesc(e, fileId)}
            sx={{
              marginTop: '5px',
              padding: '0',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                borderWidth: '0px',
                color: '#fff',
                backgroundColor: 'var(--Card-Color)',
                '& .MuiOutlinedInput-input': {
                  fontSize: '16px',
                  color: '#fff',
                  padding: '8px 12px',
                  fontWeight: 500,
                  borderRadius: '12px',
                  // backgroundColor: '#252431',
                  '&::placeholder': {
                    color: '#888',
                    fontWeight: 400,
                  },
                },
                '& fieldset': {
                  borderColor: '#3A3948',
                },
                '&:hover fieldset': {
                  borderColor: '#fff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fff',
                  borderWidth: '1px',
                  color: '#fff',
                },
              },
              '& .MuiFormHelperText-root': {
                // color: error ? '#ff4d4d' : '#b0b0b0',
              },
            }}
          />
        )}

        {/* Show File Error messages */}
        {(fileErrorMsg || hasError) && (
          <div className={DocUploadStyles.fileErrorBox}>
            <Image
              src="/images/upload-error.svg"
              alt="upload-error"
              width={14}
              height={14}
              className={DocUploadStyles.trashImg}
            />
            <Typography variant="body1">{fileErrorMsg}</Typography>
          </div>
        )}

        {/* {fileErrorMsg && (
          <div className={DocUploadStyles.fileSemiTitle}>
            <Typography variant="body1">
              <Image
                src="/images/cancel-icon.svg"
                alt="cross-icon"
                width={16}
                height={16}
                className={DocUploadStyles.trashImg}
              />
              {fileErrorMsg}
            </Typography>
          </div>
        )} */}
      </div>
    </Box>
  );
}
