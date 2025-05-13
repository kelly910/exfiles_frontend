import React, { useState } from 'react';
import LogStyle from './logmodel.module.scss';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  styled,
  Typography,
} from '@mui/material';
import Image from 'next/image';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid #3a3948',
    borderRadius: '16px',
    minWidth: '515px',
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

export default function LogSuccessfully() {
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
        Open dialog successfully
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className={LogStyle.headerDialogBox}
        sx={{
          background: 'rgb(17 16 27 / 0%)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <DialogContent className={LogStyle.dialogLogContentBox}>
          <Image
            src="/images/Log-success.png"
            alt="Log-success"
            width={148}
            height={117}
          />
          <Box>
            <Typography variant="h2" className={LogStyle.dialogIncidentHead}>
              Incident Logged successfully.
            </Typography>
            <Typography
              variant="body1"
              className={LogStyle.dialogIncidentDetails}
            >
              Let&rsquo;s keep the momentum going to resolve this together.
            </Typography>
          </Box>
          <Box className={LogStyle.dialogIncidentBtnBox}>
            <Button className="btn btn-primary" type="submit">
              Continue
            </Button>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
