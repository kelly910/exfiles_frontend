import React from 'react';
import styles from './dialog.module.scss';
import Image from 'next/image';
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

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: '#11101b',
    margin: '0px',
    minWidth: '650px',
    minHeight: '550px',
    // maxWidth: '90vw',
    // Responsive styles
    [theme.breakpoints.down('md')]: {
      maxWidth: '90vw',
      minWidth: '580px',
      minHeight: '450px',
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90vw',
      minWidth: '80vw',
      minHeight: 'auto',
    },
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event.target.files);
};

export default function DialogBox() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <React.Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
          Open dialog
        </Button>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          className={styles.dialogBox}
          sx={{
            background: 'rgb(17 16 27 / 0%)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <Box component="div" className={styles.dialogHeader}>
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              Documents Upload
            </DialogTitle>
            <IconButton
              className={styles.closeIcon}
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
          <DialogContent dividers className={styles.dialogBody}>
            {/* <Box component="div" className={styles.dialogContent}>
              <Image
                src="/images/Upload-img.png"
                alt="Upload-img"
                width={148}
                height={117}
              />
              <Typography gutterBottom>
                Drag your documents here to upload or Click here to upload
              </Typography>
              <Typography gutterBottom>
                You can upload upto 10 documents together.
              </Typography>
            </Box> */}
            <Box
              className={`${styles.dialogContent}`}
              role="button"
              tabIndex={0}
              style={{
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  document.getElementById('file-upload')?.click();
                }
              }}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Box>
                <Image
                  src="/images/Upload-img.png"
                  alt="Upload-img"
                  width={148}
                  height={117}
                />
                <Typography gutterBottom>
                  Drag your documents here to upload or <span>Click here</span>{' '}
                  to upload
                </Typography>
                <Typography gutterBottom>
                  You can upload upto 10 documents together.
                </Typography>
                <VisuallyHiddenInput
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  multiple
                />
              </Box>
            </Box>
            <Box component="div" className={styles.fileBoxBody}>
              <FileCard />
              <FileCard />
              <FileCard />
              <FileCard />
              <FileCard />
              <FileCard />
              <FileCard />
              <FileCard />
              <FileCard />
            </Box>
            <Box className={`${styles.dialogButtonBox}`} role="button">
              <Button
                variant="contained"
                className={styles.uploadBtn}
                fullWidth
                sx={{ mt: 2 }}
              >
                <Image
                  src="/images/add-icon.svg"
                  alt="Upload-img"
                  width={20}
                  height={20}
                  className={styles.addIcon}
                />
                Add More
              </Button>
              <Button
                variant="contained"
                className="btn btn-primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Continue
              </Button>
            </Box>
          </DialogContent>
        </BootstrapDialog>
      </React.Fragment>
    </>
  );
}

function FileCard() {
  return (
    <Box component="div" className={styles.fileBoxInner}>
      <div className={styles.fileGridBox}>
        <div className={styles.fileBox}>
          <span className={styles.fileIcon}>
            <Image
              src="/images/pdf.svg"
              alt="pdf"
              width={14}
              height={16}
              className={styles.pdfImg}
            />
          </span>
          <Typography variant="body1" className={styles.fileTitle}>
            Neon Insights
            <span>125 kb</span>
          </Typography>
          <Image
            src="/images/trash.svg"
            alt="more"
            width={16}
            height={16}
            className={styles.trashImg}
          />
        </div>
        <div className={styles.fileSemiTitle}>
          <Typography variant="body1">Refresh the instrument list</Typography>
        </div>
      </div>
    </Box>
  );
}
