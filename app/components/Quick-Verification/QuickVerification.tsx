'use client';
import {
  Box,
  Container,
  Link,
  TextField,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Button } from '@mui/material';
import styles from './quickVerification.module.scss';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { sendOtp, verifyOtp } from '@/app/redux/slices/register';
import { useAppDispatch } from '@/app/redux/hooks';
import { showToast } from '@/app/shared/toast/ShowToast';
import { Field, Form, Formik } from 'formik';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { setLoader } from '@/app/redux/slices/loader';

export interface OtpVerificationFormValues {
  otp: number;
  email: string;
  otp_type: string;
}

const RESEND_TIME = 59;

const Page = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const otpLength = 4;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(otpLength).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(RESEND_TIME);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const resendOtp = async () => {
    await dispatch(
      sendOtp({
        email: email as string,
        otp_type: 'user_register',
      })
    );
    showToast('success', 'OTP sent successfully.');
    if (!isResendDisabled) {
      setIsResendDisabled(true);
      setTimer(RESEND_TIME);
    }
  };

  const otpVerificationValue = useMemo(() => otp, [otp]);

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/\D/g, '');
    if (!value) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to the next input field
    if (index < otpLength - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Backspace') {
      event.preventDefault();

      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
      } else if (index > 0) {
        newOtp[index - 1] = '';
        inputRefs.current[index - 1]?.focus();
      }
      setOtp(newOtp);
    }
  };

  const otpVerificationClick = async () => {
    setLoading(true);
    dispatch(setLoader(true));
    if (otpVerificationValue) {
      const otpValue = Number(otp.join(''));
      const payload: OtpVerificationFormValues = {
        otp: otpValue,
        email: email as string,
        otp_type: 'user_register',
      };

      try {
        const response = await dispatch(verifyOtp(payload)).unwrap();
        const otpVerified = response?.messages?.length
          ? response.messages[0].otp_verified
          : false;

        setTimeout(() => {
          if (otpVerified) {
            showToast('success', 'OTP verified successfully!');
            router.push('/account-created');
          } else {
            showToast('error', 'OTP verification failed. Please try again.');
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
                    A Quick Verification
                  </Typography>
                  <Typography variant="body1" className={styles.formSubtitle}>
                    We have sent you a One Time Password (OTP) on registered
                    Email Address. Enter that OTP here and we are good to go
                  </Typography>
                </div>

                <Box className={styles.authForm}>
                  <Formik
                    initialValues={{
                      otp: ['', '', '', ''],
                      email: email,
                      otp_type: 'user_register',
                    }}
                    enableReinitialize={true}
                    onSubmit={otpVerificationClick}
                  >
                    {({ handleSubmit }) => {
                      return (
                        <Form onSubmit={handleSubmit}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              flexWrap: 'nowrap',
                              justifyContent: 'center',
                              flexDirection: 'row',
                              maxWidth: '300px',
                              margin: '0 auto 30px auto',
                              gap: '24px',
                            }}
                          >
                            {otp.map((digit, index) => (
                              <Field
                                as={TextField}
                                key={index}
                                variant="outlined"
                                type="text"
                                value={digit}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => handleChange(index, e)}
                                onKeyDown={(
                                  e: React.KeyboardEvent<HTMLInputElement>
                                ) => handleKeyDown(index, e)}
                                inputRef={(el: HTMLInputElement | null) =>
                                  (inputRefs.current[index] = el)
                                }
                                sx={{
                                  height: '48px',
                                  width: '48px',
                                  textAlign: 'center',
                                  fontSize: '20px',
                                  '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'transparent',
                                    color: '#ffffff',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    '& fieldset': { borderColor: '#3A3948' },
                                    '&:hover fieldset': {
                                      borderColor: '#ffffff',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#fff',
                                      borderWidth: '2px',
                                    },
                                  },
                                }}
                                inputProps={{
                                  maxLength: 1,
                                  style: { textAlign: 'center' },
                                }}
                              />
                            ))}
                          </Box>

                          <Box
                            className={styles.btnGroup}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              mt: 2,
                            }}
                          >
                            <Link
                              href="#"
                              className="link-primary"
                              onClick={resendOtp}
                              style={{
                                cursor: 'pointer',
                                pointerEvents: isResendDisabled
                                  ? 'none'
                                  : 'auto',
                                color: isResendDisabled ? '#888' : '#007bff',
                              }}
                            >
                              {isResendDisabled
                                ? `Resend OTP? (00:${timer < 10 ? `0${timer}` : timer})`
                                : 'Resend OTP'}
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
                      );
                    }}
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
