import React, { useState } from 'react';
import Style from '@components/Devices-Limit/DevicesLimit.module.scss';
import { Box, Button, CircularProgress, Dialog, styled } from '@mui/material';
import Image from 'next/image';
import { LoginFormValues, LoginToken } from '../Login/Login';
import { setLoader } from '@/app/redux/slices/loader';
import { loginUser, socialGoogleLogin } from '@/app/redux/slices/login';
import { useRouter } from 'next/navigation';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { useAppDispatch } from '@/app/redux/hooks';
import PlanExpired from '../Plan-Expired/PlanExpired';
import { useGoogleLogin } from '@react-oauth/google';
import UpgradeTime from '../Upgrade-Time/UpgradeTime';

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
  tokenResponse?: LoginToken | null;
}

export default function DevicesLimit({
  open,
  onClose,
  loginDetails,
  tokenResponse,
}: DevicesLimitDialogProps) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [openExpiredDialog, setOpenExpiredDialog] = useState(false);
  const [openCountDownDialog, setOpenCountDownDialog] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: { access_token: string }) => {
      try {
        await dispatch(setLoader(true));
        const response = await dispatch(
          socialGoogleLogin({
            access_token: tokenResponse.access_token,
            logout_device: true,
          })
        ).unwrap();
        onClose();
        localStorage.setItem('loggedInUser', JSON.stringify(response));
        const token: string | null = response?.data?.token || null;
        if (token) {
          document.cookie = `accessToken=${token}; path=/; max-age=86400`;
        }
        if (response.data.active_subscription?.status === 0) {
          setOpenExpiredDialog(true);
        } else if (
          response.data.remaining_days === 1 ||
          response.data.remaining_days === 2
        ) {
          setOpenCountDownDialog(true);
        } else {
          router.push('/ai-chats');
        }
      } catch (error) {
        handleError(error as ErrorResponse);
      } finally {
        dispatch(setLoader(false));
      }
    },
    onError: (error) => {
      handleError(error as ErrorResponse);
      dispatch(setLoader(false));
    },
  });

  const handleLoginContinue = async () => {
    if (!loginDetails && !tokenResponse) return;
    if (loginDetails) {
      const loginPayload = { ...loginDetails, logout_device: true };
      try {
        setLoading(true);
        dispatch(setLoader(true));
        setTimeout(async () => {
          try {
            const response = await dispatch(loginUser(loginPayload)).unwrap();
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
              }
              if (response.data.active_subscription?.status === 0) {
                setOpenExpiredDialog(true);
              } else if (
                response.data.remaining_days === 1 ||
                response.data.remaining_days === 2
              ) {
                setOpenCountDownDialog(true);
              } else {
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
    } else if (tokenResponse) {
      googleLogin();
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
      <PlanExpired
        open={openExpiredDialog}
        onClose={() => setOpenExpiredDialog(false)}
      />
      <UpgradeTime
        open={openCountDownDialog}
        onClose={() => setOpenCountDownDialog(false)}
        type={'login'}
      />
    </>
  );
}
