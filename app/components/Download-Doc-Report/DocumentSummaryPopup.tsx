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
import { convertDateFormat, processTextSummary } from '@/app/utils/constants';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid #3a3948',
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
}

export default function DocumentSummaryPopup({
  open,
  onClose,
  passDocumentSummary,
  docType,
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
              <Typography variant="h6" className={LogStyle.dialogTitle}>
                {passDocumentSummary?.file_name}
              </Typography>
              {/* <Typography variant="body1" className={LogStyle.dialogSemiTitle}>
                {passDocumentSummary?.file_name}
              </Typography> */}
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
            <Image
              src="/images/close.svg"
              alt="close-icon"
              width={24}
              height={24}
            />
          </IconButton>
        </Box>

        <DialogContent className={LogStyle.dialogFormContentDetailsBox}>
          {/* <Typography variant="body1" className={LogStyle.logTitle}>
            Test
          </Typography> */}
          <Box component="div" className={LogStyle.logListBody}>
            {passDocumentSummary?.tags?.map((tag, index) => (
              <Box className={LogStyle.logListBodyTag} key={index}>
                <Typography
                  variant="body1"
                  className={LogStyle.logListBodyTagTitle}
                >
                  {tag.name}
                </Typography>
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
                        passDocumentSummary?.ai_description || '-'
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
                      passDocumentSummary?.summary || '-'
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
