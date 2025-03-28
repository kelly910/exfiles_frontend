'use client';

import React from 'react';
import styles from './feedBack.module.scss';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  TextField,
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

interface FeedbackDialogProps {
  openFeedbackDialogProps: boolean;
  onClose: () => void;
}

export default function FeedbackDialog({
  openFeedbackDialogProps,
  onClose,
}: FeedbackDialogProps) {
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={openFeedbackDialogProps}
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
                src="/images/message-question.svg"
                alt="feedback"
                width={28}
                height={28}
              />
            </Box>
            <Box>
              <Typography variant="h6" className={styles.dialogTitle}>
                Give Feedback
              </Typography>
              <Typography variant="body1" className={styles.dialogSemiTitle}>
                Your thoughts are valuable in helping improve our products.
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
            <TextField
              fullWidth
              id="first_name"
              name="first_name"
              placeholder="samsepiol@ecorp.com"
              multiline
              minRows={4}
              sx={{
                marginTop: '0px',
                padding: '0',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  borderWidth: '0px',
                  color: '#DADAE1',
                  backgroundColor: '#252431',
                  padding: '14px 16px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    top: '-10px !important',
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: '14px',
                    color: '#DADAE1',
                    // padding: '14px 16px',
                    fontWeight: 500,
                    borderRadius: '12px',
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
              }}
            />
          </Box>
          <Box component="div" className={styles.dialogFormButtonBox}>
            <Button className={styles.formCancelBtn} onClick={onClose}>
              Cancel
            </Button>
            <Button className={styles.formSaveBtn}>Submit</Button>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
