import DocUploadStyles from '@components/AI-Chat/Modals/DocumentUploadModal.module.scss';
import React, { useRef } from 'react';
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

const handleFileChange = (
  event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLElement>
) => {
  if ('dataTransfer' in event) {
    console.log(event.dataTransfer.files); // Safe to access
  } else {
    console.log((event.target as HTMLInputElement).files); // Safe to access
  }
};

interface DocumentUploadModalProps {
  open: boolean;
  handleClose: () => void;
}

export default function DocumentUploadDialog({
  open,
  handleClose,
}: DocumentUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // const [selectedFiles, setSelectedFiles] = useState([]);

  const handleOpenUserFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   // onFileSelect(event.target.files);
  // };

  const handleDrop = async (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    handleFileChange(event);
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      className={DocUploadStyles.dialogBox}
      sx={{
        background: 'rgb(17 16 27 / 0%)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <Box component="div" className={DocUploadStyles.dialogHeader}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Documents Upload
        </DialogTitle>
        <IconButton
          className={DocUploadStyles.closeIcon}
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
      <DialogContent dividers className={DocUploadStyles.dialogBody}>
        {/* <Box component="div" className={DocUploadStyles.dialogContent}>
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
          className={`${DocUploadStyles.dialogContent}`}
          role="button"
          tabIndex={0}
          style={{
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleOpenUserFileInput();
            }
          }}
          onDrop={(e) => handleDrop(e)}
          onClick={() => handleOpenUserFileInput()}
        >
          <Box>
            <Image
              src="/images/Upload-img.png"
              alt="Upload-img"
              width={148}
              height={117}
            />
            <Typography gutterBottom>
              Drag your documents here to upload or <span>Click here</span> to
              upload
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
        <Box component="div" className={DocUploadStyles.fileBoxBody}>
          {/* <FileCard />
          <FileCard />
          <FileCard />
          <FileCard />
          <FileCard />
          <FileCard />
          <FileCard />
          <FileCard />
          <FileCard /> */}
        </Box>
        <Box className={`${DocUploadStyles.dialogButtonBox}`} role="button">
          <>
            <Button
              variant="contained"
              className={DocUploadStyles.uploadBtn}
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleOpenUserFileInput}
            >
              <Image
                src="/images/add-icon.svg"
                alt="Upload-img"
                width={20}
                height={20}
                className={DocUploadStyles.addIcon}
              />
              Add More
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </>
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
  );
}

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: '#11101b',
    margin: '0px',
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
