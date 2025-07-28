'use client';

import Image from 'next/image';
import styles from './style.module.scss';
import { Box, LinearProgress, TextField } from '@mui/material';
import Link from 'next/link';
import { useThemeMode } from '@/app/utils/ThemeContext';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { formatFileSizeLabel, getDocumentImage } from '@/app/utils/functions';

interface FileItemProps {
  isShowDescField?: boolean;
  fileName: string;
  fileSize: number;
  progress: number;
  isUploading?: boolean;
  hasUploaded: boolean;
  fileErrorMsg?: string;
  hasError: boolean;
  fileId: string;
  fileDesc: string;
  onRemove: (fileId: string) => void;
  handleFileDesc: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fileId: string
  ) => void;
}

export default function UploadFileItem({
  isShowDescField,
  fileSize,
  fileName,
  progress,
  hasUploaded,
  fileErrorMsg,
  hasError,
  fileId,
  onRemove,
  fileDesc,
  handleFileDesc,
}: FileItemProps) {
  const [description, setDescription] = useState(fileDesc || '');
  const { theme } = useThemeMode();

  useEffect(() => {
    setDescription(fileDesc);
  }, [fileDesc]);

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

  useEffect(() => {
    return () => {
      debouncedHandleFileDesc.cancel();
    };
  }, [debouncedHandleFileDesc]);

  return (
    <>
      <div className={styles['upload-files-card']}>
        <div className={styles['upload-files-left']}>
          <span className={styles['upload-files-span']}>
            {fileName && (
              <Image
                src={getDocumentImage(
                  fileName.split('.').pop()?.toLowerCase() || 'pdf'
                )}
                alt="pdf"
                width={27}
                height={33}
              />
            )}
          </span>
          <div className={styles['upload-files-info']}>
            <h4>{fileName}</h4>
            <p>{formatFileSizeLabel(fileSize)}</p>
          </div>
        </div>
        <div className={styles['upload-files-right']}>
          <div className={styles['upload-file-input']}>
            {!hasUploaded && !hasError && (
              <Box component="div" className={styles.chatAlProgress}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
            )}

            {hasUploaded && isShowDescField && (
              <TextField
                fullWidth
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  debouncedHandleFileDesc(e, fileId);
                }}
                placeholder="Add Description of this file"
                sx={{
                  margin: 0,
                  padding: 0,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'transparent !important',
                    '& .MuiOutlinedInput-input': {
                      fontSize: '16px',
                      color: 'var(--Primary-Text-Color)',
                      padding: '12px 8px',
                      fontWeight: 'var(--Regular)',
                      borderRadius: '12px',
                      background: 'var(--White-color)',
                      '&::placeholder': {
                        color: 'var(--Primary-Text-Color)',
                        fontWeight: 'var(--Lighter)',
                      },
                    },
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    // optional styling for helper text
                  },
                }}
              />
            )}

            {(fileErrorMsg || hasError) && (
              <div className={styles['upload-file-failed']}>
                <Image
                  src="/images/up-fail.svg"
                  alt="pdf"
                  width={16}
                  height={16}
                />
                <div className={styles['upload-fail-text']}>
                  <p>Upload Failed</p>
                  <span>{fileErrorMsg}</span>
                </div>
              </div>
            )}
          </div>
          <Link href="#" className={styles['upload-file-trash']}>
            {hasUploaded ? (
              <Image
                src="/images/trash.svg"
                alt="pdf"
                width={24}
                height={24}
                onClick={() => onRemove(fileId)}
              />
            ) : (
              <Image
                src="/images/close-icon.svg"
                alt="pdf"
                width={24}
                height={24}
                onClick={() => onRemove(fileId)}
                style={{
                  filter:
                    theme === 'dark' ? 'brightness(0) invert(0)' : 'invert(1)',
                }}
              />
            )}
          </Link>
        </div>
      </div>
    </>
  );
}
