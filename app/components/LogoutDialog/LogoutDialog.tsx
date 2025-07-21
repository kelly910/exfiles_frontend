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
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/redux/hooks';
import { logout } from '@/app/redux/slices/profileSetting';
import { setLoader } from '@/app/redux/slices/loader';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { useThemeMode } from '@/app/utils/ThemeContext';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid var(--Stroke-Color)',
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
      if (event.origin !== process.env.NEXT_PUBLIC_REDIRECT_URL) return;
      if (event.data.type === 'LOGOUT') {
        logoutUser();
      }
    });

    return () => {
      window.removeEventListener('message', () => {});
    };
  }, []);

  const productionServer = process.env.NEXT_PUBLIC_ENVIRONMENT_SERVER;

  const logoutUser = async () => {
    setLoading(true);
    await dispatch(setLoader(true));
    setTimeout(async () => {
      await dispatch(logout(loggedInUserToken));
      window.opener?.postMessage(
        { type: 'LOGOUT_SUCCESS' },
        process.env.NEXT_PUBLIC_REDIRECT_URL
      );
      const bc = new BroadcastChannel('react-auth-channel');
      bc.postMessage({ type: 'LOGOUT_SUCCESS' });
      if (productionServer === 'production') {
        document.cookie = `logout=yes; path=/; max-age=86400; domain=.ex-files.ai; Secure; SameSite=None`;
      }
      setLoading(false);
      dispatch(setLoader(false));
      localStorage.removeItem('loggedInUser');
      document.cookie = `accessToken=; path=/; max-age=0`;
      document.cookie = `isLogin=no; path=/; max-age=0`;
      document.cookie = `userDataId=; path=/; max-age=0`;
      router.replace('/login');
    }, 1000);
  };

  const { theme } = useThemeMode();

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
              <svg
                width="28"
                height="28"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.4 1.5H7.35C9.75 1.5 11.25 3 11.25 5.4V8.4375H6.5625C6.255 8.4375 6 8.6925 6 9C6 9.3075 6.255 9.5625 6.5625 9.5625H11.25V12.6C11.25 15 9.75 16.5 7.35 16.5H5.4075C3.0075 16.5 1.5075 15 1.5075 12.6V5.4C1.5 3 3 1.5 5.4 1.5Z"
                  fill={
                    theme === 'dark'
                      ? 'var(--Red-Color)'
                      : 'var(--Primary-Text-Color)'
                  }
                />
                <path
                  d="M14.5799 8.43738L13.0274 6.88488C12.9149 6.77238 12.8624 6.62988 12.8624 6.48738C12.8624 6.34488 12.9149 6.19488 13.0274 6.08988C13.2449 5.87238 13.6049 5.87238 13.8224 6.08988L16.3349 8.60238C16.5524 8.81988 16.5524 9.17988 16.3349 9.39738L13.8224 11.9099C13.6049 12.1274 13.2449 12.1274 13.0274 11.9099C12.8099 11.6924 12.8099 11.3324 13.0274 11.1149L14.5799 9.56238H11.2499V8.43738H14.5799Z"
                  fill={
                    theme === 'dark'
                      ? 'var(--Red-Color)'
                      : 'var(--Primary-Text-Color)'
                  }
                />
              </svg>
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
