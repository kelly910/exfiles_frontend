'use client';

import {
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '@components/SettingDialog/setting.module.scss';
import { Field, Form, Formik } from 'formik';
import { setLoader } from '@/app/redux/slices/loader';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { showToast } from '@/app/shared/toast/ShowToast';
import { useAppDispatch } from '@/app/redux/hooks';
import { useRouter } from 'next/navigation';
import { deleteAccount } from '@/app/redux/slices/profileSetting';
import { RootState } from '@/app/redux/store';
import { useSelector } from 'react-redux';
import { sendOtp } from '@/app/redux/slices/register';

const RESEND_TIME = 59;

const DeleteAccount = ({ closeDialog }: { closeDialog: () => void }) => {
  const [showNextSlide, setShowNextSlide] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const otpLength = 4;
  const [otp, setOtp] = useState<string[]>(new Array(otpLength).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(RESEND_TIME);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingContinue, setLoadingContinue] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const loggedInUser = useSelector(
    (state: RootState) => state.login.loggedInUser
  );
  const loggedInUserEmail = loggedInUser?.data?.email;

  const handleContinueClick = async () => {
    if (inputValue === 'DELETE') {
      setLoadingContinue(true);
      setTimeout(async () => {
        await dispatch(
          sendOtp({
            email: loggedInUserEmail as string,
            otp_type: 'delete_account',
          })
        );
        await showToast('success', 'OTP sent successfully.');
        setLoadingContinue(false);
        await setShowNextSlide(true);
      }, 1000);
    }
  };

  const handleBackClick = () => {
    setShowNextSlide(false);
    setInputValue('');
  };

  const resendOtp = async () => {
    await dispatch(
      sendOtp({
        email: loggedInUserEmail as string,
        otp_type: 'delete_account',
      })
    );
    showToast('success', 'OTP sent successfully.');
    if (!isResendDisabled) {
      setIsResendDisabled(true);
      setTimer(RESEND_TIME);
    }
  };

  useEffect(() => {
    if (showNextSlide) {
      if (timer > 0) {
        const interval = setInterval(() => {
          setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
      } else {
        setIsResendDisabled(false);
      }
    } else {
      setTimer(RESEND_TIME);
    }
  }, [timer, showNextSlide]);

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

  const deleteAccountClick = async () => {
    setLoading(true);
    dispatch(setLoader(true));
    if (!otpVerificationValue) {
      showToast('error', 'Please enter OTP');
      setLoading(false);
      dispatch(setLoader(false));
      return;
    }
    const otpValue = Number(otp.join(''));
    const payload = { otp: otpValue };

    try {
      const response = await dispatch(deleteAccount(payload)).unwrap();
      setTimeout(async () => {
        showToast('success', response);
        localStorage.removeItem('loggedInUser');
        document.cookie = `accessToken=; path=/; max-age=0`;
        closeDialog();
        router.push('/login');
        await setLoading(false);
        await dispatch(setLoader(false));
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
    <>
      <div className={styles.headerDialogBox}>
        {!showNextSlide ? (
          <form className={styles.dialogFormBox}>
            <Box component="div" className={styles.dialogFormContent}>
              <Box>
                <Typography className={styles.accountDeletTitle}>
                  Delete Your Account
                </Typography>
                <Typography
                  variant="body1"
                  className={styles.accountFormDetails}
                >
                  This action will delete all your files, chats and information
                  from Exfiles servers. This action can not be Undone. If you
                  want to continue please type “DELETE” in the text box below.
                </Typography>
              </Box>
              <div className={styles.dialogFormInner}>
                <div
                  className={`${styles.dialogFormGroup} ${styles.dialogFormFull}`}
                >
                  <TextField
                    fullWidth
                    type="text"
                    id="first_name"
                    name="first_name"
                    placeholder=""
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    sx={{
                      marginTop: '0px',
                      padding: '0',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        borderWidth: '0px',
                        color: '#DADAE1',
                        backgroundColor: '#252431',
                        '& .MuiOutlinedInput-notchedOutline': {
                          top: '-10px !important',
                        },
                        '& .MuiOutlinedInput-input': {
                          fontSize: '14px',
                          color: '#DADAE1',
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
                    }}
                  />
                </div>
              </div>
            </Box>
            {inputValue === 'DELETE' && (
              <Box component="div" className={styles.dialogFormButtonBox}>
                <Button
                  onClick={handleContinueClick}
                  className={styles.formSaveBtn}
                  disabled={loadingContinue}
                >
                  {loadingContinue ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    'Continue'
                  )}
                </Button>
              </Box>
            )}
          </form>
        ) : (
          <Formik
            initialValues={{
              otp: ['', '', '', ''],
            }}
            enableReinitialize={true}
            onSubmit={deleteAccountClick}
          >
            {({ handleSubmit }) => {
              return (
                <Form onSubmit={handleSubmit} className={styles.dialogFormBox}>
                  <Box component="div" className={styles.dialogFormContent}>
                    <Box>
                      <Typography className={styles.accountDeletTitle}>
                        Delete Your Account
                      </Typography>
                      <Typography
                        variant="body1"
                        className={styles.accountFormDetails}
                      >
                        We have sent you an OTP on your registered mobile
                        number. Please enter OTP below to continue.
                      </Typography>
                    </Box>
                    <div
                      className={`${styles.dialogFormInner} ${styles.dialogFormOpt}`}
                    >
                      {otp.map((digit, index) => (
                        <Field
                          as={TextField}
                          key={index}
                          variant="outlined"
                          type="text"
                          value={digit}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(index, e)
                          }
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
                    </div>
                    <Link
                      href="#"
                      className="link-primary"
                      onClick={resendOtp}
                      style={{
                        cursor: 'pointer',
                        color: isResendDisabled ? '#888' : '#007bff',
                        pointerEvents: isResendDisabled ? 'none' : 'auto',
                        textDecoration: 'underline',
                        marginTop: '32px',
                        display: 'inline-block',
                      }}
                    >
                      {isResendDisabled
                        ? `Resend OTP? (00:${timer < 10 ? `0${timer}` : timer})`
                        : 'Resend OTP'}
                    </Link>
                  </Box>
                  <Box
                    component="div"
                    className={`${styles.dialogFormButtonBox} ${styles.dialogDeletButtonBox}`}
                  >
                    <Button
                      className={styles.formBackBtn}
                      onClick={handleBackClick}
                    >
                      <Image
                        src="/images/arrow-left.svg"
                        alt="left arrow"
                        width={16}
                        height={16}
                      />{' '}
                      Back
                    </Button>
                    <Button
                      className={`${styles.formSaveBtn} ${styles.formDeletBtn}`}
                      disabled={loading}
                      type="submit"
                    >
                      {loading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        'Delete Account'
                      )}
                    </Button>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        )}
      </div>
    </>
  );
};

export default DeleteAccount;
