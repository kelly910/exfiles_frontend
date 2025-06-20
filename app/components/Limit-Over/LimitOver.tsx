import React from 'react';
import Style from '@components/Limit-Over/LimitOver.module.scss';
import { Box, Button, Dialog, styled, Typography } from '@mui/material';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid #3a3948',
    borderRadius: '24px',
    minWidth: '450px',
    width: '515px',
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

export default function LimitOver() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button onClick={handleClickOpen}>LimitOver</Button>
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
            <Box component="div" className={Style.dialogTimer}>
              <Box component="div" className={Style.dialogTimerLog}>
                <Box component="div">
                  <p className={Style.dialogTimerStore}>
                    100 <span>/100</span>
                  </p>
                  <p className={Style.dialogTimerStoreName}>Summery</p>
                </Box>
              </Box>
            </Box>
            <Typography variant="h2">
              Your Summary Generation Limit is Over
            </Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sitamet consectetur Purus lacus sagittis
              facilisi fringilla purus lacus
            </Typography>
            <Box component="div" className={Style.dialogFormButtonBox}>
              <Button className={Style.formCancelBtn} onClick={handleClose}>
                Not Now
              </Button>
              <Button className={Style.formContinueBtn} onClick={handleClose}>
                Upgrade Now
              </Button>
            </Box>
          </Box>
        </BootstrapDialog>
      </React.Fragment>
    </>
  );
}
