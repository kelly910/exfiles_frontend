'use client';

import {
  Box,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Button } from '@mui/material';
import styles from './forgotPassword.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { forgotPasswordValidationSchema } from '@/app/utils/validationSchema/formValidationSchemas';
import { useAppDispatch } from '@/app/redux/hooks';
import { forgotPassword } from '@/app/redux/slices/login';
import { showToast } from '@/app/shared/toast/ShowToast';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { setLoader } from '@/app/redux/slices/loader';
import Link from 'next/link';

export interface ForgotPasswordFormValues {
  email: string;
  otp_type: string;
}

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const initialValues: ForgotPasswordFormValues = {
    email: '',
    otp_type: 'forgot_password',
  };
  const dispatch = useAppDispatch();

  const forgotPasswordClick = async (
    values: ForgotPasswordFormValues
  ): Promise<void> => {
    setLoading(true);
    dispatch(setLoader(true));
    try {
      const response = await dispatch(forgotPassword(values)).unwrap();
      setTimeout(() => {
        if (response?.messages?.length) {
          showToast('success', response.messages[0]);
          router.push(`/forgot-password-verification?email=${values.email}`);
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

            <Box component="section">
              <div className={styles.formCard}>
                <div className={styles.formHeader}>
                  <Typography variant="h2" className={styles.formTitle}>
                    Having Trouble Logging In?
                  </Typography>
                  <Typography variant="body1" className={styles.formSubtitle}>
                    Please enter the registered email address to receive
                    Password reset instructions.{' '}
                  </Typography>
                </div>

                <Box className={styles.authForm}>
                  <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validationSchema={forgotPasswordValidationSchema}
                    onSubmit={forgotPasswordClick}
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
                            fontWeight: 'var(--Medium)',
                          }}
                        >
                          Email Address
                        </Typography>
                        <div style={{ marginBottom: '32px' }}>
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

                        <Box
                          className={styles.btnGroup}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mt: 2,
                          }}
                        >
                          <Link href="/login" className="link-primary">
                            Back to Login
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
