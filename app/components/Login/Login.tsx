'use client';

import {
  Box,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { Button } from '@mui/material';
import styles from './login.module.scss';
import Image from 'next/image';
import { useState } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginValidationSchema } from '@/app/utils/validationSchema/formValidationSchemas';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { loginUser, socialGoogleLogin } from '@/app/redux/slices/login';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { setLoader } from '@/app/redux/slices/loader';
import Link from 'next/link';
import DevicesLimit from '../Devices-Limit/DevicesLimit';
import PlanExpired from '../Plan-Expired/PlanExpired';

export interface LoginFormValues {
  email: string;
  password: string;
}

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const router = useRouter();
  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };
  const dispatch = useAppDispatch();
  const [exceedLimitDialog, setExceedLimitDialog] = useState(false);
  const [openExpiredDialog, setOpenExpiredDialog] = useState(false);
  const [loginDetails, setLoginDetails] = useState<LoginFormValues | null>(
    null
  );

  const loginUserClick = async (values: LoginFormValues): Promise<void> => {
    try {
      setLoadingLogin(true);
      dispatch(setLoader(true));
      setTimeout(async () => {
        try {
          const response = await dispatch(loginUser(values)).unwrap();
          if (response.messages[0] === 'LimitExceeded') {
            setLoginDetails(values);
            setExceedLimitDialog(true);
          } else {
            if (response && response.data && response.data.token) {
              localStorage.setItem('loggedInUser', JSON.stringify(response));
              const token: string | null = response?.data?.token || null;
              if (token) {
                const bc = new BroadcastChannel('react-auth-channel');
                bc.postMessage({ type: 'LOGIN_SUCCESS', user: response.data });
                document.cookie = `accessToken=${token}; path=/; max-age=86400`;
                window.opener?.postMessage(
                  { type: 'LOGIN_SUCCESS', user: response.data },
                  process.env.NEXT_PUBLIC_REDIRECT_URL
                );
              }
              setLoadingLogin(false);
              if (response.data.active_subscription?.status === 0) {
                setOpenExpiredDialog(true);
              } else {
                router.push('/ai-chats');
              }
            }
          }
        } catch (error) {
          handleError(error as ErrorResponse);
        } finally {
          setLoadingLogin(false);
          dispatch(setLoader(false));
        }
      }, 1000);
    } catch (error) {
      handleError(error as ErrorResponse);
      setLoadingLogin(false);
      dispatch(setLoader(false));
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: { access_token: string }) => {
      try {
        await dispatch(setLoader(true));
        const response = await dispatch(
          socialGoogleLogin({ access_token: tokenResponse.access_token })
        ).unwrap();
        if (response.messages[0] === 'LimitExceeded') {
          setExceedLimitDialog(true);
        } else {
          localStorage.setItem('loggedInUser', JSON.stringify(response));
          const token: string | null = response?.data?.token || null;
          if (token) {
            document.cookie = `accessToken=${token}; path=/; max-age=86400`;
            await dispatch(setLoader(false));
          }
          if (response.data.active_subscription?.status === 0) {
            setOpenExpiredDialog(true);
          } else {
            router.push('/ai-chats');
          }
        }
      } catch (error) {
        handleError(error as ErrorResponse);
        dispatch(setLoader(false));
      }
    },
    onError: (error) => {
      handleError(error as ErrorResponse);
      dispatch(setLoader(false));
    },
  });

  return (
    <>
      <main>
        <div className={styles.authSection}>
          <div className={styles.authContainer}>
            <Container
              maxWidth="lg"
              disableGutters
              className={styles.authContainerInner}
            >
              <Box component="section" className={styles.boxLoginHeading}>
                <div className={styles.formLogo}>
                  <Link href={process.env.NEXT_PUBLIC_REDIRECT_URL!}>
                    <Image
                      src="/images/logo.svg"
                      alt="logo"
                      width={290}
                      height={63}
                    />
                  </Link>
                </div>
              </Box>

              <Box component="section" className={styles.authMain}>
                <div className={styles.formCard}>
                  <div className={styles.formHeader}>
                    <Typography variant="h2" className={styles.formTitle}>
                      Welcome to Exfiles
                    </Typography>
                    <Typography variant="body1" className={styles.formSubtitle}>
                      Please login to continue using Exfiles.
                    </Typography>
                  </div>

                  <Box className={styles.authForm}>
                    <Formik
                      initialValues={initialValues}
                      enableReinitialize={true}
                      validationSchema={loginValidationSchema}
                      onSubmit={loginUserClick}
                    >
                      {({ errors, touched, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                          <Typography
                            variant="body2"
                            component="label"
                            htmlFor="email"
                            sx={{
                              display: 'block',
                              fontSize: 'var(--SubTitle-2)',
                              color:
                                errors.email && touched.email
                                  ? 'var(--Red-Color)'
                                  : 'var(--Placeholder-Text)',
                              fontWeight: 'var(--Regular)',
                            }}
                          >
                            Email Address
                          </Typography>
                          <div style={{ marginBottom: '24px' }}>
                            <Field
                              as={TextField}
                              fullWidth
                              type="text"
                              id="email"
                              name="email"
                              placeholder="Enter Email Address here"
                              error={Boolean(errors.email && touched.email)}
                              sx={{
                                marginTop: '5px',
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  borderWidth: '0px',
                                  color: 'var(--Primary-Text-Color)',
                                  backgroundColor: 'var(--Input-Box-Colors)',
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    top: '-10px !important',
                                  },

                                  '& .MuiOutlinedInput-input': {
                                    fontSize: 'var(--SubTitle-2)',
                                    color: 'var(--Primary-Text-Color)',
                                    padding: '14px 16px',
                                    fontWeight: 'var(--Medium)',
                                    borderRadius: '12px',
                                    '&::placeholder': {
                                      color: 'var(Placeholder-Text)',
                                      fontWeight: 'var(--Regular)',
                                    },
                                  },
                                  '& fieldset': {
                                    borderColor: 'var(--Stroke-Color)',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: 'var(--Primary-Text-Color)',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'var(--Primary-Text-Color)',
                                    borderWidth: '1px',
                                    color: 'var(--Primary-Text-Color)',
                                  },
                                },
                                '& .MuiFormHelperText-root': {
                                  color:
                                    errors.email && touched.email
                                      ? 'var(--Red-Color)'
                                      : 'var(--Placeholder-Text)',
                                },
                              }}
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="error-input-field"
                            />
                          </div>

                          <Typography
                            variant="body2"
                            component="label"
                            htmlFor="password"
                            sx={{
                              display: 'block',
                              fontSize: 'var(--SubTitle-2)',
                              color:
                                errors.password && touched.password
                                  ? 'var(--Red-Color)'
                                  : 'var(--Placeholder-Text)',
                              fontWeight: 'var(--Medium)',
                            }}
                          >
                            Password
                          </Typography>
                          <Box
                            sx={{
                              marginBottom: '32px', // Default (above 550px)
                              '@media (max-width:550px)': {
                                marginBottom: '24px', // When screen is 550px or smaller
                              },
                            }}
                          >
                            <Field
                              as={TextField}
                              fullWidth
                              type={showPassword ? 'text' : 'password'}
                              id="password"
                              name="password"
                              placeholder="Enter Password here"
                              error={Boolean(
                                errors.password && touched.password
                              )}
                              sx={{
                                marginTop: '8px',
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  borderWidth: '0px',
                                  color: 'var(--Primary-Text-Color)',
                                  backgroundColor: 'var(--Input-Box-Colors)',
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    top: '-10px !important',
                                  },
                                  '& .MuiOutlinedInput-input': {
                                    fontSize: 'var(--SubTitle-2)',
                                    color: 'var(--Primary-Text-Color)',
                                    padding: '14px 16px',
                                    fontWeight: 'var(--Medium)',
                                    borderRadius: '12px',
                                    '&::placeholder': {
                                      color: 'var(Placeholder-Text)',
                                      fontWeight: 'var(--Regular)',
                                    },
                                  },
                                  '& fieldset': {
                                    borderColor: 'var(--Stroke-Color)',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: 'var(--Primary-Text-Color)',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'var(--Primary-Text-Color)',
                                    borderWidth: '1px',
                                    color: 'var(--Primary-Text-Color)',
                                  },
                                },
                                '& .MuiFormHelperText-root': {
                                  color:
                                    errors.password && touched.password
                                      ? 'var(--Red-Color)'
                                      : 'var(--Placeholder-Text)',
                                },
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() =>
                                        setShowPassword((prev) => !prev)
                                      }
                                      edge="end"
                                    >
                                      {showPassword ? (
                                        <Visibility
                                          sx={{
                                            color: 'var(--Primary-Text-Color)',
                                          }}
                                        />
                                      ) : (
                                        <VisibilityOff
                                          sx={{
                                            color: 'var(--Primary-Text-Color)',
                                          }}
                                        />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="error-input-field"
                            />
                          </Box>

                          <Box
                            className={styles.btnGroup}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Link
                              href="/forgot-password"
                              className="link-primary"
                            >
                              Need Help Logging In?
                            </Link>
                            <Button
                              type="submit"
                              variant="contained"
                              className={`btn btn-primary`}
                              color="primary"
                              fullWidth
                              disabled={loadingLogin}
                            >
                              {loadingLogin ? (
                                <CircularProgress size={24} color="inherit" />
                              ) : (
                                'Login'
                              )}
                            </Button>
                          </Box>
                        </Form>
                      )}
                    </Formik>

                    <Box className={styles.googleLogin}>
                      <Typography
                        variant="body2"
                        className={styles.textSecondary}
                      >
                        You Can also Continue with
                      </Typography>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => googleLogin()}
                        className={`btn btn-tertiary ${styles.googleBtn}`}
                        startIcon={
                          <Image
                            src="/images/google-icon.svg"
                            alt="google-icon"
                            width={24}
                            height={24}
                            className={styles.googleBtnIcon}
                          />
                        }
                        fullWidth
                      >
                        Google
                      </Button>
                    </Box>
                  </Box>
                </div>
              </Box>

              <Box
                component="section"
                className={styles.alreadyLogin}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div className="">
                  <Typography variant="h4" gutterBottom>
                    Not a Member yet?
                  </Typography>
                  <Typography variant="body1" component="p" gutterBottom>
                    Sign up now to get started with Exfiles.
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  className={`btn btn-secondary `}
                  onClick={() => {
                    setLoadingRegister(true);
                    dispatch(setLoader(true));
                    setTimeout(() => {
                      router.push('/signup');
                      dispatch(setLoader(false));
                    }, 1000);
                  }}
                  disabled={loadingRegister}
                >
                  {loadingRegister ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Click Here to Join'
                  )}
                </Button>
              </Box>
            </Container>
          </div>
          <div className={styles.before}>
            <Image src="/images/before.svg" alt="-" height={500} width={500} />
          </div>

          <div className={styles.after}>
            <Image src="/images/after.svg" alt="-" height={306} width={947} />
          </div>
        </div>
      </main>
      <DevicesLimit
        open={exceedLimitDialog}
        onClose={() => setExceedLimitDialog(false)}
        loginDetails={loginDetails}
      />
      <PlanExpired
        open={openExpiredDialog}
        onClose={() => setOpenExpiredDialog(false)}
      />
    </>
  );
};

export default Page;
