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
