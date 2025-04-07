'use client';

import React, { useState } from 'react';
import styles from './rename.module.scss';
import Image from 'next/image';
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

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: '#11101b',
    margin: '0px',
    border: '1px solid #3a3948',
    borderRadius: '16px',
    minWidth: '450px',
    maxWidth: '90vw',
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

export default function RenameDialogs() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button>
      <BootstrapDialog
        onClose={handleClose}
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
                src="/images/logout.svg"
                alt="logout"
                width={28}
                height={28}
              />
            </Box>
            <Box>
              <Typography variant="h6" className={styles.dialogTitle}>
                Log out
              </Typography>
              <Typography variant="body1" className={styles.dialogSemiTitle}>
                Are you sure you want to log out?
              </Typography>
            </Box>
          </DialogTitle>
          <IconButton
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
        <Box component="div" className={styles.dialogInput}>
          <TextField
            // as={TextField}
            fullWidth
            type="text"
            id="email"
            name="email"
            placeholder="Enter Category Name here"
            // error={Boolean(errors.email && touched.email)}
            sx={{
              marginTop: '5px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                borderWidth: '0px',
                color: 'var(--Primary-Text-Color)',
                backgroundColor: 'var(--Input-Box-Colors)',
                '& .MuiOutlinedInput-notchedOutline': {
                  top: '-10px !important',
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: 'var(--SubTitle-2)',
                  color: 'var(--Primary-Text-Color)',
                  padding: '14px 16px',
                  fontWeight: 'var(--Medium)',
                  borderRadius: '12px',
                  '&::placeholder': {
                    color: 'var(Placeholder-Text)',
                    fontWeight: 'var(--Regular)',
                  },
                },
                '& fieldset': {
                  borderColor: 'var(--Stroke-Color)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--Primary-Text-Color)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--Primary-Text-Color)',
                  borderWidth: '1px',
                  color: 'var(--Primary-Text-Color)',
                },
              },
              '& .MuiFormHelperText-root': {
                // color: errors.email && touched.email ? '#ff4d4d' : '#b0b0b0',
              },
            }}
          />
        </Box>
        <DialogContent dividers className={styles.dialogBody}>
          <Box component="div" className={styles.dialogFormButtonBox}>
            <Button className={styles.formCancelBtn} onClick={handleClose}>
              Cancel
            </Button>
            <Button className="btn btn-primary">Save</Button>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
