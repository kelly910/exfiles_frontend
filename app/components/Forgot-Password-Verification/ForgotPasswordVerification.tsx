'use client';
import {
  Box,
  Container,
  TextField,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Button } from '@mui/material';
import styles from './forgotPasswordVerification.module.scss';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { sendOtp, verifyOtp } from '@/app/redux/slices/register';
import { useAppDispatch } from '@/app/redux/hooks';
import { showToast } from '@/app/shared/toast/ShowToast';
import { Field, Form, Formik } from 'formik';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { setLoader } from '@/app/redux/slices/loader';
import Link from 'next/link';

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
        otp_type: 'forgot_password',
      })
    );
    showToast('success', 'OTP sent successfully.');
    if (!isResendDisabled) {
      setIsResendDisabled(true);
      setTimer(RESEND_TIME);
    }
  };

  const otpVerificationValue = useMemo(() => otp, [otp]);

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasteData) return;
    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      if (i < otpLength) {
        newOtp[i] = pasteData[i];
      }
    }
    setOtp(newOtp);
    const lastFilledIndex = Math.min(pasteData.length, otpLength) - 1;
    inputRefs.current[lastFilledIndex]?.focus();
  };

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
        otp_type: 'forgot_password',
      };

      try {
        const response = await dispatch(verifyOtp(payload)).unwrap();
        const otpVerified = response?.messages?.length
          ? response.messages[0].otp_verified
          : false;

        setTimeout(() => {
          if (otpVerified) {
            showToast('success', 'OTP verified successfully!');
            router.push(`/new-password?email=${payload.email}&otp=${otpValue}`);
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
                    Check Your Mail Inbox
                  </Typography>
                  <Typography variant="body1" className={styles.formSubtitle}>
                    We have sent you a One Time Password (OTP) on the mentioned
                    Email Address. Enter that OTP here to recover your account
                  </Typography>
                </div>

                <Box className={styles.authForm}>
                  <Formik
                    initialValues={{
                      otp: ['', '', '', ''],
                      email: email,
                      otp_type: 'forgot_password',
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
                              margin: '0 auto 40px auto',
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
                                }}
                                inputProps={{
                                  maxLength: 1,
                                  style: { textAlign: 'center' },
                                  onPaste: handlePaste,
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
                                color: isResendDisabled
                                  ? 'var(--Placeholder-Text)'
                                  : 'var(--Subtext-Color)',
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
