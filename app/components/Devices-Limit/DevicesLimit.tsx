import React from 'react';
import Style from '@components/Devices-Limit/DevicesLimit.module.scss';
import { Box, Button, Dialog, styled } from '@mui/material';
import Image from 'next/image';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid #3a3948',
    borderRadius: '24px',
    minWidth: '450px',
    width: '520px',
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

export default function DevicesLimit() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button onClick={handleClickOpen}>Test</Button>
      <React.Fragment>
        <BootstrapDialog
          open={open}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          className={Style.headerDialogBox}
          sx={{
            background: 'rgb(17 16 27 / 0%)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <Box component="div" className={Style.dialogHeader}>
            <figure>
              <Image
                src="/images/DevicesLimit.svg"
                alt="DevicesLimit"
                width={120}
                height={100}
              />
            </figure>
            <h2>Login Devices Limit Exceeded</h2>
            <p>
              You have reached maximum limit of device login. Do you want to
              Logout other Device and continue?
            </p>
            <Box component="div" className={Style.dialogFormButtonBox}>
              <Button className={Style.formCancelBtn} onClick={handleClose}>
                Not Now
              </Button>
              <Button className={Style.formContinueBtn} onClick={handleClose}>
                Yes, Continue
              </Button>
            </Box>
          </Box>
        </BootstrapDialog>
      </React.Fragment>
    </>
  );
}
