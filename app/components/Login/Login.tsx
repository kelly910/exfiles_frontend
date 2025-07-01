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
import UpgradeTime from '../Upgrade-Time/UpgradeTime';
import { useThemeMode } from '@/app/utils/ThemeContext';
import { showToast } from '@/app/shared/toast/ShowToast';

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginToken {
  access_token?: string;
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
  const [openCountDownDialog, setOpenCountDownDialog] = useState(false);
  const [loginDetails, setLoginDetails] = useState<LoginFormValues | null>(
    null
  );
  const [access_token, setToken] = useState<LoginToken | null>(null);

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
                console.log('📤 Broadcasting login to auth channel');
                bc.postMessage({ type: 'LOGIN_SUCCESS', user: response.data });
                document.cookie = `accessToken=${token}; path=/; max-age=86400`;
                window.opener?.postMessage(
                  { type: 'LOGIN_SUCCESS', user: response.data },
                  process.env.NEXT_PUBLIC_REDIRECT_URL
                );
              }
              setLoadingLogin(false);
              showToast('success', 'Login is successfully.');
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
          setToken({ access_token: tokenResponse.access_token });
          setExceedLimitDialog(true);
          dispatch(setLoader(false));
        } else {
          localStorage.setItem('loggedInUser', JSON.stringify(response));
          const token: string | null = response?.data?.token || null;
          if (token) {
            const bc = new BroadcastChannel('react-auth-channel');
            console.log('📤 Broadcasting login to auth channel');
            bc.postMessage({ type: 'LOGIN_SUCCESS', user: response.data });
            document.cookie = `accessToken=${token}; path=/; max-age=86400`;
            window.opener?.postMessage(
              { type: 'LOGIN_SUCCESS', user: response.data },
              process.env.NEXT_PUBLIC_REDIRECT_URL
            );
            await dispatch(setLoader(false));
          }
          showToast('success', 'Google Login is successfully.');
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
        dispatch(setLoader(false));
      }
    },
    onError: (error) => {
      handleError(error as ErrorResponse);
      dispatch(setLoader(false));
    },
  });

  const { theme } = useThemeMode();

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
                                  backgroundColor:
                                    theme === 'dark'
                                      ? 'var(--Txt-On-Gradient)'
                                      : 'var(--Input-Box-Colors)',
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
                                  backgroundColor:
                                    theme === 'dark'
                                      ? 'var(--Txt-On-Gradient)'
                                      : 'var(--Input-Box-Colors)',
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
            {/* <Image src="/images/before.svg" alt="-" height={500} width={500} /> */}
            <svg
              width="500"
              height="500"
              viewBox="0 0 399 230"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-66.7144 113.614C-56.9574 108.681 -38.5654 103.664 -19.8811 89.9357C-1.19691 76.2072 1.8405 59.6358 22.97 47.7168C44.0995 35.7978 60.7748 45.2737 81.5404 32.7245C102.306 20.1752 101.334 -0.91575 122.645 -12.5196C143.956 -24.1235 162.221 -11.8955 183.835 -22.9742C205.45 -34.0529 205.205 -53.8834 226.395 -65.6973C247.586 -77.5113 264.176 -68.1824 285.548 -79.6812C306.92 -91.1801 319.933 -112.306 328.981 -120.892"
                stroke="var(--Primary-Text-Color)"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                d="M-3.9214 222.376C5.83552 217.443 24.2276 212.427 42.9118 198.698C61.5961 184.97 64.6335 168.398 85.763 156.479C106.892 144.56 123.568 154.036 144.333 141.487C165.099 128.938 164.127 107.847 185.438 96.2429C206.749 84.639 225.014 96.8671 246.628 85.7884C268.243 74.7097 267.998 54.8792 289.188 43.0652C310.378 31.2513 326.969 40.5802 348.341 29.0813C369.713 17.5825 382.726 -3.54369 391.774 -12.1292"
                stroke="var(--Primary-Text-Color)"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                d="M-24.8526 186.122C-15.0956 181.189 3.29643 176.173 21.9807 162.444C40.6649 148.716 43.7023 132.144 64.8318 120.225C85.9613 108.306 102.637 117.782 123.402 105.233C144.168 92.6838 143.195 71.5928 164.507 59.9889C185.818 48.385 204.082 60.6131 225.697 49.5344C247.312 38.4557 247.067 18.6252 268.257 6.81122C289.447 -5.00275 306.038 4.32615 327.41 -7.1727C348.782 -18.6715 361.795 -39.7977 370.843 -48.3833"
                stroke="var(--Primary-Text-Color)"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                d="M-45.7837 149.868C-36.0268 144.935 -17.6347 139.919 1.04951 126.19C19.7338 112.462 22.7712 95.8901 43.9007 83.9711C65.0302 72.0521 81.7055 81.528 102.471 68.9788C123.237 56.4295 122.264 35.3385 143.576 23.7346C164.887 12.1307 183.151 24.3588 204.766 13.2801C226.381 2.20141 226.136 -17.6291 247.326 -29.4431C268.516 -41.257 285.107 -31.9281 306.479 -43.427C327.851 -54.9258 340.863 -76.052 349.912 -84.6375"
                stroke="var(--Primary-Text-Color)"
                stroke-width="3"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <div className={styles.after}>
            {/* <Image src="/images/after.svg" alt="-" height={306} width={947} /> */}
            <svg
              width="947"
              height="306"
              viewBox="0 0 825 476"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.0083 499.78C35.1097 489.617 73.0015 479.282 111.495 450.998C149.989 422.714 156.247 388.573 199.778 364.017C243.31 339.462 277.665 358.984 320.446 333.13C363.228 307.276 361.225 263.823 405.131 239.917C449.037 216.01 486.666 241.203 531.197 218.378C575.728 195.554 575.224 154.698 618.88 130.359C662.536 106.019 696.716 125.239 740.748 101.549C784.779 77.8587 811.588 34.334 830.23 16.6459"
                stroke="var(--Primary-Text-Color)"
                stroke-width="6"
                stroke-linecap="round"
              />
              <path
                d="M144.378 723.855C164.479 713.692 202.371 703.357 240.865 675.073C279.358 646.789 285.616 612.649 329.148 588.093C372.679 563.537 407.034 583.06 449.816 557.205C492.598 531.351 490.594 487.899 534.5 463.992C578.407 440.086 616.035 465.278 660.566 442.454C705.097 419.629 704.593 378.774 748.249 354.434C791.906 330.095 826.086 349.314 870.117 325.624C914.148 301.934 940.957 258.409 959.599 240.721"
                stroke="var(--Primary-Text-Color)"
                stroke-width="6"
                stroke-linecap="round"
              />
              <path
                d="M101.255 649.163C121.356 639 159.248 628.665 197.742 600.381C236.235 572.098 242.493 537.957 286.025 513.401C329.556 488.845 363.911 508.368 406.693 482.513C449.475 456.659 447.471 413.207 491.378 389.3C535.284 365.394 572.912 390.586 617.443 367.762C661.974 344.937 661.47 304.082 705.127 279.742C748.783 255.403 782.963 274.623 826.994 250.932C871.026 227.242 897.834 183.718 916.477 166.03"
                stroke="var(--Primary-Text-Color)"
                stroke-width="6"
                stroke-linecap="round"
              />
              <path
                d="M58.1318 574.472C78.2332 564.309 116.125 553.974 154.619 525.69C193.112 497.406 199.37 463.265 242.902 438.709C286.433 414.154 320.788 433.676 363.57 407.822C406.352 381.968 404.348 338.515 448.255 314.609C492.161 290.702 529.789 315.895 574.32 293.07C618.851 270.246 618.347 229.39 662.004 205.051C705.66 180.711 739.84 199.931 783.871 176.241C827.902 152.551 854.711 109.026 873.354 91.3379"
                stroke="var(--Primary-Text-Color)"
                stroke-width="6"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
      </main>
      <DevicesLimit
        open={exceedLimitDialog}
        onClose={() => setExceedLimitDialog(false)}
        loginDetails={loginDetails}
        tokenResponse={access_token}
      />
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
};

export default Page;
