import React, { useState } from 'react';
import Style from '@components/Devices-Limit/DevicesLimit.module.scss';
import { Box, Button, CircularProgress, Dialog, styled } from '@mui/material';
import Image from 'next/image';
import { LoginFormValues } from '../Login/Login';
import { setLoader } from '@/app/redux/slices/loader';
import { loginUser } from '@/app/redux/slices/login';
import { useRouter } from 'next/navigation';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { useAppDispatch } from '@/app/redux/hooks';

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

interface DevicesLimitDialogProps {
  open: boolean;
  onClose: () => void;
  loginDetails?: LoginFormValues | null;
}

export default function DevicesLimit({
  open,
  onClose,
  loginDetails,
}: DevicesLimitDialogProps) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLoginContinue = async () => {
    if (!loginDetails) return;
    try {
      setLoading(true);
      dispatch(setLoader(true));
      setTimeout(async () => {
        try {
          const response = await dispatch(loginUser(loginDetails)).unwrap();
          if (response && response.data && response.data.token) {
            onClose();
            localStorage.setItem('loggedInUser', JSON.stringify(response));
            const token: string | null = response?.data?.token || null;
            if (token) {
              document.cookie = `accessToken=${token}; path=/; max-age=86400`;
              window.opener?.postMessage(
                { type: 'LOGIN_SUCCESS', user: response.data },
                process.env.NEXT_PUBLIC_REDIRECT_URL
              );
              router.push('/ai-chats');
            }
          }
        } catch (error) {
          handleError(error as ErrorResponse);
        } finally {
          setLoading(false);
          dispatch(setLoader(false));
        }
      }, 1000);
    } catch (error) {
      handleError(error as ErrorResponse);
      setLoading(false);
      dispatch(setLoader(false));
    }
  };

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
              <Button className={Style.formCancelBtn} onClick={onClose}>
                Not Now
              </Button>
              <Button
                className={Style.formContinueBtn}
                onClick={handleLoginContinue}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  'Yes, Continue'
                )}
              </Button>
            </Box>
          </Box>
        </BootstrapDialog>
      </React.Fragment>
    </>
  );
}
