'use client';

import {
  Box,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { Button } from '@mui/material';
import styles from './login.module.scss';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginValidationSchema } from '@/app/utils/validationSchema/formValidationSchemas';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { loginUser, socialGoogleLogin } from '@/app/redux/slices/login';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { setLoader } from '@/app/redux/slices/loader';
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

  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
      return match ? match[2] : null;
    };

    const token = getCookie('accessToken');
    if (token) {
      router.push('/dashboard');
    }
  }, []);

  const loginUserClick = async (values: LoginFormValues): Promise<void> => {
    try {
      setLoadingLogin(true);
      dispatch(setLoader(true));
      setTimeout(async () => {
        try {
          const response = await dispatch(loginUser(values)).unwrap();
          if (response && response.data && response.data.token) {
            localStorage.setItem('loggedInUser', JSON.stringify(response));
            const token: string | null = response?.data?.token || null;
            if (token) {
              document.cookie = `accessToken=${token}; path=/; max-age=3600`;
              router.push('/dashboard');
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
        localStorage.setItem('loggedInUser', JSON.stringify(response));
        const token: string | null = response?.data?.token || null;
        if (token) {
          document.cookie = `accessToken=${token}; path=/; max-age=3600`;
          router.push('/dashboard');
          await dispatch(setLoader(false));
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
    <main>
      <div className={styles.authSection}>
        <div className={styles.authContainer}>
          <Container maxWidth="lg" disableGutters>
            <Box component="section" className={styles.boxLoginHeading}>
              <div className={styles.formLogo}>
                <Image
                  src="/images/logo.svg"
                  alt="logo"
                  width={290}
                  height={63}
                />
              </div>
            </Box>

            <Box component="section">
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
                            fontSize: '16px',
                            color:
                              errors.email && touched.email
                                ? '#ff4d4d'
                                : '#898B94',
                            fontWeight: 400,
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
                                color: '#fff',
                                backgroundColor: '#252431',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  top: '-10px !important',
                                },
                                '& .MuiOutlinedInput-input': {
                                  fontSize: '16px',
                                  color: '#fff',
                                  padding: '14px 16px',
                                  fontWeight: 500,
                                  borderRadius: '12px',
                                  '&::placeholder': {
                                    color: '#888',
                                    fontWeight: 400,
                                  },
                                },
                                '& fieldset': {
                                  borderColor: '#3A3948',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#fff',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#fff',
                                  borderWidth: '1px',
                                  color: '#fff',
                                },
                              },
                              '& .MuiFormHelperText-root': {
                                color:
                                  errors.email && touched.email
                                    ? '#ff4d4d'
                                    : '#b0b0b0',
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
                            fontSize: '16px',
                            color:
                              errors.password && touched.password
                                ? '#ff4d4d'
                                : '#898B94',
                            fontWeight: 500,
                          }}
                        >
                          Password
                        </Typography>
                        <div style={{ marginBottom: '32px' }}>
                          <Field
                            as={TextField}
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="Choose a strong Password"
                            error={Boolean(errors.password && touched.password)}
                            sx={{
                              marginTop: '8px',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                borderWidth: '0px',
                                color: '#fff',
                                backgroundColor: '#252431',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  top: '-10px !important',
                                },
                                '& .MuiOutlinedInput-input': {
                                  fontSize: '16px',
                                  color: '#fff',
                                  padding: '14px 16px',
                                  fontWeight: 500,
                                  borderRadius: '12px',
                                  '&::placeholder': {
                                    color: '#888',
                                    fontWeight: 400,
                                  },
                                },
                                '& fieldset': {
                                  borderColor: '#3A3948',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#fff',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#fff',
                                  borderWidth: '1px',
                                  color: '#fff',
                                },
                              },
                              '& .MuiFormHelperText-root': {
                                color:
                                  errors.password && touched.password
                                    ? '#ff4d4d'
                                    : '#b0b0b0',
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
                                      <Visibility sx={{ color: '#b0b0b0' }} />
                                    ) : (
                                      <VisibilityOff
                                        sx={{ color: '#b0b0b0' }}
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
                        </div>

                        <Box
                          className={styles.btnGroup}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Link
                            href="#"
                            className="link-primary"
                            onClick={() => router.push('/forgot-password')}
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
                  Lorem Ipsum dolor sit amet
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
  );
};

export default Page;
