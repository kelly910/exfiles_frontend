'use client';

import React from 'react';
import Style from '@components/Limit-Over/LimitOver.module.scss';
import { Box, Button, Dialog, styled, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid var(--Stroke-Color)',
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

interface LimitDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  totalNumber: string;
  usedNumber: string;
}

export default function LimitOver({
  open,
  onClose,
  title,
  subtitle,
  totalNumber,
  usedNumber,
}: LimitDialogProps) {
  const router = useRouter();
  return (
    <>
      <React.Fragment>
        <BootstrapDialog
          open={open}
          onClose={onClose}
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
                    {usedNumber} <span>/{totalNumber}</span>
                  </p>
                  <p className={Style.dialogTimerStoreName}>{subtitle}</p>
                </Box>
              </Box>
            </Box>
            <Typography variant="h2">{title}</Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sitamet consectetur Purus lacus sagittis
              facilisi fringilla purus lacus
            </Typography>
            <Box component="div" className={Style.dialogFormButtonBox}>
              <Button className={Style.formCancelBtn} onClick={onClose}>
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
