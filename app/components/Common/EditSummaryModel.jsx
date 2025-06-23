import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../ReName/rename.module.scss';
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
    backgroundColor: 'var(--Background-Color)',
    margin: '0px',
    border: '1px solid var(--Stroke-Color)',
    borderRadius: '16px',
    minWidth: '600px',
    maxWidth: '90vw',
    '@media (max-width: 768px)': {
      maxWidth: '80vw',
      minWidth: '550px',
    },
    '@media (max-width: 580px)': {
      maxWidth: '80vw',
      minWidth: '450px',
    },
    '@media (max-width: 480px)': {
      maxWidth: '95vw',
      minWidth: '90%',
    },
  },
}));

export default function EditSummaryModel() {
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
        Edit dialog
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
                src="/images/edit-model.svg"
                alt="edit-model"
                width={28}
                height={28}
              />
            </Box>
            <Box>
              <Typography variant="h6" className={styles.dialogTitle}>
                Editing Combined Summary
              </Typography>
              <Typography variant="body1" className={styles.dialogSemiTitleTag}>
                <span>RekamanProspek.pdf</span>
                <span>RekamanProspek.pdf</span>
                <span>+2</span>
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
            id="body"
            name="body"
            placeholder="Edit your Summary"
            multiline
            minRows={4}
            maxRow={6}
            // error={Boolean(errors.body && touched.body)}
            sx={{
              marginTop: '0px',
              padding: '0',
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                borderWidth: '0px',
                color: 'var(--Primary-Text-Color)',
                backgroundColor: 'var(--Input-Box-Colors)',
                padding: '14px 16px',
                '& .MuiOutlinedInput-notchedOutline': {
                  top: '-10px !important',
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: 'var(--SubTitle-3)',
                  color: 'var(--Primary-Text-Color)',
                  fontWeight: 'var(--Regular)',
                  borderRadius: '12px',
                  padding: '2px',
                  maxHeight: '200px',
                  overflowY: 'auto !important',
                  '&::placeholder': {
                    color: 'var(--Placeholder-Text)',
                    fontWeight: 'var(--Lighter)',
                  },
                },
                '& fieldset': {
                  borderColor: 'var(--Stroke-Color)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--Txt-On-Gradient)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--Txt-On-Gradient)',
                  borderWidth: '1px',
                  color: 'var(--Txt-On-Gradient)',
                },
              },
              // '& .MuiFormHelperText-root': {
              //   color: errors.body && touched.body ? '#ff4d4d' : '#b0b0b0',
              // },
            }}
          />
        </Box>
        <DialogContent dividers className={styles.dialogBody}>
          <Box component="div" className={styles.dialogFormButtonBox}>
            <Button className={styles.formCancelBtn} onClick={handleClose}>
              Cancel
            </Button>
            <Button className="btn btn-primary">Save Changes</Button>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
