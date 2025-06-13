'use client';

import React from 'react';
import styles from './style.module.scss';
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
import Image from 'next/image';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#11101b',
    margin: '0px',
    border: '1px solid #3a3948',
    borderRadius: '16px',
    minWidth: '650px',
    maxWidth: '90vw',
    // Responsive styles
    [theme.breakpoints.down('md')]: {
      minWidth: '550px',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '70vw',
    },
  },
}));

interface HelpDeskDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function HelpDeskDialog({ open, onClose }: HelpDeskDialogProps) {
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className={styles.headerDialogBox}
        sx={{
          background: 'rgb(17 16 27 / 0%)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <Box component="div" className={styles.dialogHeader}>
          <DialogTitle
            sx={{ m: 0, p: 0 }}
            id="customized-dialog-title"
            className={styles.dialogHeaderInner}
          >
            <Box component="div" className={styles.dialogIcon}>
              <Image
                src="/images/report-info.svg"
                alt="report-info"
                width={28}
                height={28}
              />
            </Box>
            <Box>
              <Typography variant="h6" className={styles.dialogTitle}>
                Need Help? Watch a Quick Tour
              </Typography>
              <Typography variant="body1" className={styles.dialogSemiTitle}>
                Export Summaries and Log Incident
              </Typography>
            </Box>
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onClose}
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
        <DialogContent dividers className={styles.dialogBody}>
          <Box component="div" className={styles.dialogFormBox}>
            <video
              controls
              width="100%"
              className={styles.feedbackVideo}
              style={{ borderRadius: '12px' }}
            >
              <source src="/gif/Upload_Video.webm" type="video/webm" />
            </video>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
