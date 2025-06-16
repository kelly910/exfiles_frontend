'use client';

import React, { useEffect, useState } from 'react';
import styles from './logout.module.scss';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/redux/hooks';
import { logout } from '@/app/redux/slices/profileSetting';
import { setLoader } from '@/app/redux/slices/loader';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
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

interface LogoutDialogProps {
  openLogoutDialogProps: boolean;
  onClose: () => void;
}

export default function LogoutDialog({
  openLogoutDialogProps,
  onClose,
}: LogoutDialogProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const loggedInUser = useSelector(
    (state: RootState) => state.login.loggedInUser
  );

  const loggedInUserToken = loggedInUser?.data?.token ?? '';

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.origin !== 'https://exfiles.trooinbounddevs.com') return;
      if (event.data.type === 'LOGOUT') {
        console.log(event.data.type, 'inside if');
        logoutUser();
      }
    });

    return () => {
      window.removeEventListener('message', () => {});
    };
  }, []);

  const logoutUser = async () => {
    setLoading(true);
    await dispatch(setLoader(true));
    setTimeout(async () => {
      await dispatch(logout(loggedInUserToken));
      window.opener?.postMessage(
        { type: 'LOGOUT_SUCCESS' },
        'https://exfiles.trooinbounddevs.com'
      );
      setLoading(false);
      dispatch(setLoader(false));
      localStorage.removeItem('loggedInUser');
      document.cookie = `accessToken=; path=/; max-age=0`;
      router.push('/login');
    }, 1000);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={openLogoutDialogProps}
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
            onClick={onClose}
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
          <Box component="div" className={styles.dialogFormButtonBox}>
            <Button className={styles.formCancelBtn} onClick={onClose}>
              Cancel
            </Button>
            <Button
              className={styles.formSaveBtn}
              onClick={logoutUser}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                'Logout'
              )}
            </Button>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
