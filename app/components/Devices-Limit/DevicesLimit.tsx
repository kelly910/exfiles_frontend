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
import { useGoogleLogin } from '@react-oauth/google';
import UpgradeTime from '../Upgrade-Time/UpgradeTime';
import { showToast } from '@/app/shared/toast/ShowToast';
import { useThemeMode } from '@/app/utils/ThemeContext';
import { sendDataToWordPressForLogin } from '@/app/utils/functions';

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
  const [openCountDownDialog, setOpenCountDownDialog] = useState(false);

  const storedTheme = localStorage.getItem('theme');

  const productionServer = process.env.NEXT_PUBLIC_ENVIRONMENT_SERVER;

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
          const bc = new BroadcastChannel('react-auth-channel');
          bc.postMessage({
            type: 'LOGIN_SUCCESS',
            user: response.data,
            theme: storedTheme === 'light' ? 'light' : 'dark',
          });
          if (productionServer === 'production') {
            document.cookie = `accessToken=${token}; path=/; max-age=86400; domain=.ex-files.ai; Secure; SameSite=None`;
            document.cookie = `isLogin=yes; path=/; max-age=86400; domain=.ex-files.ai; Secure; SameSite=None`;
            document.cookie = `userDataId=${response.data.id}; path=/; max-age=86400; domain=.ex-files.ai; Secure; SameSite=None`;
            document.cookie =
              'logout=; path=/; max-age=0; domain=.ex-files.ai; Secure; SameSite=None';
          } else {
            document.cookie = `accessToken=${token}; path=/; max-age=86400`;
          }
          window.opener?.postMessage(
            {
              type: 'LOGIN_SUCCESS',
              user: response.data,
              theme: storedTheme === 'light' ? 'light' : 'dark',
            },
            process.env.NEXT_PUBLIC_REDIRECT_URL
          );
          await sendDataToWordPressForLogin(response.data);
        }
        showToast('success', 'Google Login is successfully.');
        if (
          (response.data.remaining_days === 1 ||
            response.data.remaining_days === 2) &&
          !response?.data?.staff_user
        ) {
          setOpenCountDownDialog(true);
        } else {
          router.push('/upload-doc');
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
                const bc = new BroadcastChannel('react-auth-channel');
                bc.postMessage({
                  type: 'LOGIN_SUCCESS',
                  user: response.data,
                  theme: storedTheme === 'light' ? 'light' : 'dark',
                });
                if (productionServer === 'production') {
                  document.cookie = `accessToken=${token}; path=/; max-age=86400; domain=.ex-files.ai; Secure; SameSite=None`;
                  document.cookie = `isLogin=yes; path=/; max-age=86400; domain=.ex-files.ai; Secure; SameSite=None`;
                  document.cookie = `userDataId=${response.data.id}; path=/; max-age=86400; domain=.ex-files.ai; Secure; SameSite=None`;
                  document.cookie =
                    'logout=; path=/; max-age=0; domain=.ex-files.ai; Secure; SameSite=None';
                } else {
                  document.cookie = `accessToken=${token}; path=/; max-age=86400`;
                }
                window.opener?.postMessage(
                  {
                    type: 'LOGIN_SUCCESS',
                    user: response.data,
                    theme: storedTheme === 'light' ? 'light' : 'dark',
                  },
                  process.env.NEXT_PUBLIC_REDIRECT_URL
                );
                await sendDataToWordPressForLogin(response.data);
              }
              showToast('success', 'Login is successfully.');
              if (
                (response.data.remaining_days === 1 ||
                  response.data.remaining_days === 2) &&
                !response?.data?.staff_user
              ) {
                setOpenCountDownDialog(true);
              } else {
                router.push('/upload-doc');
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

  const { theme } = useThemeMode();

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
              {theme === 'dark' ? (
                <Image
                  src="/images/DevicesLimitLite.svg"
                  alt="DevicesLimit"
                  width={120}
                  height={100}
                />
              ) : (
                <Image
                  src="/images/DevicesLimit.svg"
                  alt="DevicesLimit"
                  width={120}
                  height={100}
                />
              )}
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
      <UpgradeTime
        open={openCountDownDialog}
        onClose={() => setOpenCountDownDialog(false)}
        type={'login'}
      />
    </>
  );
}
