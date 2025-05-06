/* eslint-disable @typescript-eslint/no-unused-vars */

import Image from 'next/image';
import debounce from 'lodash.debounce';

import DocUploadStyles from '@components/AI-Chat/styles/DocumentUploadModal.module.scss';
import { Box, LinearProgress, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
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
  type?: string;
  handleFileDesc: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fileId: string
  ) => void;
}

export default function InputUploadFileItem({
  fileSize,
  fileName,
  progress,
  hasUploaded,
  fileErrorMsg,
  hasError,
  fileId,
  onRemove,
  type,
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

  // State to manage the dropped files
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  // Handle file drop event
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files);
    setDroppedFiles(files); // Update state with dropped files
  };

  // Handle drag over event (to allow file drop)
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Box
      component="div"
      className={`${DocUploadStyles.fileBoxInner} ${DocUploadStyles.fileBoxDragInner}`}
    >
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
            {type !== 'LogIncident' && (
              <span>{formatFileSizeLabel(fileSize)}</span>
            )}
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
        {/* {hasUploaded && type !== 'LogIncident' && ( */}
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
          }}
        />
        {/* )} */}

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
      </div>
    </Box>
  );
}
