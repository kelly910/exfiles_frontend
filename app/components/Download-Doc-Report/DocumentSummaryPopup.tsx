'use client';

import React from 'react';
import LogStyle from './documentPopup.module.scss';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { DocumentSummary } from './DownloadDocReport';
import { getDocumentImage } from '@/app/utils/functions';
import {
  convertDateFormat,
  highlightText,
  processTextSummary,
} from '@/app/utils/constants';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid var(--Stroke-Color)',
    borderRadius: '16px',
    minWidth: '606px',
    maxHeight: '95dvh',
    '@media (max-width: 768px)': {
      maxWidth: '80vw',
      minWidth: '480px',
    },
    '@media (max-width: 500px)': {
      maxWidth: '80vw',
      minWidth: '450px',
    },
    '@media (max-width: 480px)': {
      maxWidth: '95vw',
      minWidth: '90%',
    },
  },
}));

interface DetailsDialogProps {
  open: boolean;
  onClose: () => void;
  passDocumentSummary: DocumentSummary | null;
  docType: string;
  searchParams?: string;
}

export default function DocumentSummaryPopup({
  open,
  onClose,
  passDocumentSummary,
  docType,
  searchParams,
}: DetailsDialogProps) {
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className={LogStyle.headerDialogBox}
        sx={{
          background: 'rgb(17 16 27 / 0%)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <Box className={LogStyle.dialogHeader}>
          <DialogTitle
            sx={{ m: 0, p: 2 }}
            id="customized-dialog-title"
            className={LogStyle.dialogHeaderInner}
          >
            <Box component="div" className={LogStyle.dialogIcon}>
              <Image
                src={getDocumentImage(docType)}
                alt="docType"
                width={28}
                height={28}
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                className={LogStyle.dialogTitle}
                dangerouslySetInnerHTML={{
                  __html: highlightText(
                    passDocumentSummary?.file_name || '',
                    searchParams || ''
                  ),
                }}
              />
            </Box>
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={(theme) => ({
              position: 'absolute',
              right: '24px',
              top: '16px',
              padding: '0',
              color: theme.palette.grey[500],
              [theme.breakpoints.down('sm')]: {
                right: '16px',
              },
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

        <DialogContent className={LogStyle.dialogFormContentDetailsBox}>
          <Box component="div" className={LogStyle.logListBody}>
            {passDocumentSummary?.tags?.map((tag, index) => (
              <Box className={LogStyle.logListBodyTag} key={index}>
                <Typography
                  variant="body1"
                  className={LogStyle.logListBodyTagTitle}
                  dangerouslySetInnerHTML={{
                    __html: highlightText(tag.name || '', searchParams || ''),
                  }}
                />
              </Box>
            ))}
          </Box>
          <Box component="div" className={LogStyle.logListFooter}>
            <Typography variant="body1" className={LogStyle.logListFooterTitle}>
              Uploaded On:
            </Typography>
            <Typography
              variant="body1"
              className={LogStyle.logListFooterDetails}
            >
              {convertDateFormat(passDocumentSummary?.upload_on || '') || '-'}
            </Typography>
          </Box>
          <Box component="div" className={LogStyle.logDetailsList}>
            {passDocumentSummary?.ai_description && (
              <Box component="div" className={LogStyle.logDetailsListInner}>
                <Typography
                  variant="body1"
                  className={LogStyle.logDetailsListTitle}
                >
                  Description:
                </Typography>
                <Box component="div" className={LogStyle.logDetailsListDetails}>
                  <Typography
                    variant="body1"
                    className={LogStyle.logDetailsListDetailsInner}
                    dangerouslySetInnerHTML={{
                      __html: processTextSummary(
                        highlightText(
                          passDocumentSummary?.ai_description || '-',
                          searchParams || ''
                        )
                      ),
                    }}
                  />
                </Box>
              </Box>
            )}
            <Box component="div" className={LogStyle.logDetailsListInner}>
              <Typography
                variant="body1"
                className={LogStyle.logDetailsListTitle}
              >
                Summary Generated:
              </Typography>
              <Box component="div" className={LogStyle.logDetailsListDetails}>
                <Typography
                  variant="body1"
                  className={LogStyle.logDetailsListDetailsInner}
                  dangerouslySetInnerHTML={{
                    __html: processTextSummary(
                      highlightText(
                        passDocumentSummary?.summary || '-',
                        searchParams || ''
                      )
                    ),
                  }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
