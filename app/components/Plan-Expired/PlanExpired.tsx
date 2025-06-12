import React from 'react';
import Style from '@components/Plan-Expired/PlanExpired.module.scss';
import { Box, Button, Dialog, styled, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

interface PlanExpiredDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function PlanExpired({ open, onClose }: PlanExpiredDialogProps) {
  const router = useRouter();

  const notNow = () => {
    onClose();
    router.push('/ai-chats');
  };

  return (
    <>
      <React.Fragment>
        <BootstrapDialog
          open={open}
          onClose={(event, reason) => {
            console.log(event, 'evnet');
            if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
              onClose();
            }
          }}
          aria-labelledby="customized-dialog-title"
          className={Style.headerDialogBox}
          sx={{
            background: 'rgb(17 16 27 / 0%)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <Box component="div" className={Style.dialogHeader}>
            <Box component="figure" className={Style.dialogPlanExpired}>
              <Image
                src="/images/PlanExpired.svg"
                alt="DevicesLimit"
                width={40}
                height={40}
              />
            </Box>
            <Typography variant="h2">Your Plan has Expired</Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sitamet consectetur Purus lacus sagittis
              facilisi fringilla purus lacus
            </Typography>
            <Box component="div" className={Style.dialogFormButtonBox}>
              <Button className={Style.formCancelBtn} onClick={notNow}>
                Not Now
              </Button>
              <Button
                className={Style.formContinueBtn}
                onClick={() => router.push('/plans')}
              >
                Upgrade Now
              </Button>
            </Box>
          </Box>
        </BootstrapDialog>
      </React.Fragment>
    </>
  );
}
