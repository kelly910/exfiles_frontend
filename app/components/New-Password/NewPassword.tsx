'use client';
import {
  Box,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Link,
  CircularProgress,
} from '@mui/material';
import { Button } from '@mui/material';
import styles from './newPassword.module.scss';
import Image from 'next/image';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { changePasswordValidationSchema } from '@/app/utils/validationSchema/formValidationSchemas';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { showToast } from '@/app/shared/toast/ShowToast';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { resetPassword } from '@/app/redux/slices/login';
import { setLoader } from '@/app/redux/slices/loader';

export interface NewPasswordFormValues {
  email: string;
  new_password: string;
  confirm_password: string;
  otp: string;
  otp_type: string;
}

const Page = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const otpValue = searchParams.get('otp');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initialValues: NewPasswordFormValues = {
    email: email as string,
    otp: otpValue as string,
    otp_type: 'forgot_password',
    new_password: '',
    confirm_password: '',
  };

  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
      return match ? match[2] : null;
    };
    const token = getCookie('accessToken');
    if (token) {
      router.push('/ai-chats');
    }
  }, [router]);

  const newPasswordChangeClick = async (
    values: NewPasswordFormValues
  ): Promise<void> => {
    setLoading(true);
    dispatch(setLoader(true));
    try {
      const response = await dispatch(resetPassword(values)).unwrap();
      setTimeout(() => {
        if (response?.messages?.length) {
          showToast('success', response.messages[0]);
          router.push('/password-successfull');
        }
        setLoading(false);
        dispatch(setLoader(false));
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        handleError(error as ErrorResponse);
        setLoading(false);
        dispatch(setLoader(false));
      }, 1000);
    }
  };

  return (
    <main>
      <div className={styles.authSection}>
        <div className={styles.authContainer}>
          <Container maxWidth="lg" disableGutters>
            <Box component="section" className={styles.boxLoginHeading}>
              <div className={styles.formLogo}>
                <Link href=" https://exfiles.trooinbounddevs.com/">
                  <Image
                    src="/images/logo.svg"
                    alt="logo"
                    width={290}
                    height={63}
                  />
                </Link>
              </div>
            </Box>

            <Box component="section">
              <div className={styles.formCard}>
                <div className={styles.formHeader}>
                  <Typography variant="h2" className={styles.formTitle}>
                    Set a New Password
                  </Typography>
                  <Typography variant="body1" className={styles.formSubtitle}>
                    Password must be at least 8 characters long and must contain
                    1 special character, 1 capital letter, and 1 number
                  </Typography>
                </div>

                <Box className={styles.authForm}>
                  <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validationSchema={changePasswordValidationSchema}
                    onSubmit={newPasswordChangeClick}
                  >
                    {({ errors, touched, handleSubmit }) => (
                      <Form onSubmit={handleSubmit}>
                        <Typography
                          variant="body2"
                          component="label"
                          htmlFor="new_password"
                          sx={{
                            display: 'block',
                            fontSize: '16px',
                            color:
                              errors.new_password && touched.new_password
                                ? '#ff4d4d'
                                : '#676972',
                            fontWeight: 500,
                          }}
                        >
                          New Password
                        </Typography>
                        <div style={{ marginBottom: '24px' }}>
                          <Field
                            as={TextField}
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            id="new_password"
                            name="new_password"
                            placeholder="Choose a strong Password"
                            error={Boolean(
                              errors.new_password && touched.new_password
                            )}
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
                                  errors.new_password && touched.new_password
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
                            name="new_password"
                            component="div"
                            className="error-input-field"
                          />
                        </div>

                        <Typography
                          variant="body2"
                          component="label"
                          htmlFor="confirm_password"
                          sx={{
                            display: 'block',
                            fontSize: '16px',
                            color:
                              errors.confirm_password &&
                              touched.confirm_password
                                ? '#ff4d4d'
                                : '#676972',
                            fontWeight: 500,
                          }}
                        >
                          Confirm Password
                        </Typography>
                        <div style={{ marginBottom: '24px' }}>
                          <Field
                            as={TextField}
                            fullWidth
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirm_password"
                            name="confirm_password"
                            placeholder="Repeat your password"
                            error={Boolean(
                              errors.confirm_password &&
                                touched.confirm_password
                            )}
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
                                  errors.confirm_password &&
                                  touched.confirm_password
                                    ? '#ff4d4d'
                                    : '#b0b0b0',
                              },
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowConfirmPassword((prev) => !prev)
                                    }
                                    edge="end"
                                  >
                                    {showConfirmPassword ? (
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
                            name="confirm_password"
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
                            Back
                          </Link>
                          <Button
                            type="submit"
                            variant="contained"
                            className={`btn btn-primary`}
                            color="primary"
                            fullWidth
                            disabled={loading}
                          >
                            {loading ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              'Continue'
                            )}
                          </Button>
                        </Box>
                      </Form>
                    )}
                  </Formik>
                </Box>
              </div>
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
