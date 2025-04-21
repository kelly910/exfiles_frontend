import Image from 'next/image';
import debounce from 'lodash.debounce';

import DocUploadStyles from '@components/AI-Chat/styles/DocumentUploadModal.module.scss';
import { Box, LinearProgress, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useMemo } from 'react';
import { formatFileSizeLabel, getDocumentImage } from '@/app/utils/functions';

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
            {fileName && (
              <Image
                src={getDocumentImage(
                  fileName.split('.').pop()?.toLowerCase() || 'pdf'
                )}
                alt="pdf"
                width={14}
                height={16}
                className={DocUploadStyles.pdfImg}
              />
            )}
          </span>
          <Typography variant="body1" className={DocUploadStyles.fileTitle}>
            <Typography variant="body1">{fileName}</Typography>
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
              marginTop: '12px',
              padding: '0',
              '& .MuiOutlinedInput-root': {
                borderRadius: '6px',
                borderWidth: '0px',
                color: 'var(--Primary-Text-Color)',
                backgroundColor: 'var(--Card-Color)',
                '& .MuiOutlinedInput-input': {
                  fontSize: 'var(--SubTitle-5)',
                  color: 'var(--Primary-Text-Color)',
                  padding: '12px 8px',
                  fontWeight: 500,
                  borderRadius: '6px',
                  background: 'var(--Card-Color)',
                  // backgroundColor: '#252431',
                  '&::placeholder': {
                    color: 'var(--Placeholder-Text)',
                    fontWeight: 400,
                  },
                },
                '& fieldset': {
                  top: '-10px',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--Primary-Text-Color)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--Primary-Text-Color)',
                  borderWidth: '0.5px',
                  color: 'var(--Primary-Text-Color)',
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
              width={10}
              height={9}
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
