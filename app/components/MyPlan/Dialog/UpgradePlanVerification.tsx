import React, { useEffect, useMemo, useRef, useState } from 'react';
import Style from '@components/Plan-Expired/PlanExpired.module.scss';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import styles from '../../Quick-Verification/quickVerification.module.scss';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { setLoader } from '@/app/redux/slices/loader';
import { showToast } from '@/app/shared/toast/ShowToast';
import { sendOtp, upgradePlanVerification } from '@/app/redux/slices/register';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/redux/hooks';
import Link from 'next/link';
import { Field, Form, Formik } from 'formik';
import { getUserById, selectFetchedUser } from '@/app/redux/slices/login';
import { useSelector } from 'react-redux';

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

export interface PlanVerificationFormValues {
  otp: number;
  email: string;
  otp_type: string;
  new_plan_uuid?: string;
}

const RESEND_TIME = 59;

interface UpgradePlanVerificationDialogProps {
  open: boolean;
  onClose: () => void;
  pendingPlanData: {
    planSlug: string;
    email: string;
  } | null;
}

export default function UpgradePlanVerification({
  open,
  onClose,
  pendingPlanData,
}: UpgradePlanVerificationDialogProps) {
  const otpLength = 4;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(otpLength).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(RESEND_TIME);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const fetchedUser = useSelector(selectFetchedUser);

  useEffect(() => {
    if (pendingPlanData && open) {
      dispatch(
        sendOtp({
          email: pendingPlanData?.email as string,
          otp_type: 'plan_upgrade',
        })
      );
    }
  }, [dispatch, pendingPlanData, open]);

  useEffect(() => {
    if (pendingPlanData && open) {
      if (timer > 0) {
        const interval = setInterval(() => {
          setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
      } else {
        setIsResendDisabled(false);
      }
    }
  }, [timer, pendingPlanData, open]);

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

  const resendOtp = async () => {
    if (pendingPlanData) {
      await dispatch(
        sendOtp({
          email: pendingPlanData?.email as string,
          otp_type: 'plan_upgrade',
        })
      );
      showToast('success', 'OTP sent successfully.');
      if (!isResendDisabled) {
        setIsResendDisabled(true);
        setTimer(RESEND_TIME);
      }
    }
  };

  const upgradePlanVerificationValue = useMemo(() => otp, [otp]);

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
    if (upgradePlanVerificationValue) {
      const otpValue = Number(otp.join(''));
      const payload: PlanVerificationFormValues = {
        otp: otpValue,
        email: pendingPlanData?.email as string,
        otp_type: 'plan_upgrade',
        new_plan_uuid: pendingPlanData?.planSlug as string,
      };

      try {
        const response = await dispatch(
          upgradePlanVerification(payload)
        ).unwrap();
        const isSuccess = response?.messages?.length > 0;

        setTimeout(() => {
          if (isSuccess) {
            showToast('success', 'Plan upgrade successfully!');
            onClose();
            if (fetchedUser) {
              dispatch(getUserById(fetchedUser?.id));
            }
            router.push('/plans');
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
            <div className={styles.formHeader}>
              <Typography variant="h2" className={styles.formTitle}>
                An Upgrade Plan Verification
              </Typography>
              <Typography variant="body1" className={styles.formSubtitle}>
                We have sent you a One Time Password (OTP) on registered Email
                Address. Enter that OTP here and we are good to go
              </Typography>
            </div>

            <Box className={styles.authForm}>
              <Formik
                initialValues={{
                  otp: ['', '', '', ''],
                  email: pendingPlanData?.email,
                  otp_type: 'plan_upgrade',
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
                            pointerEvents: isResendDisabled ? 'none' : 'auto',
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
          </Box>
        </BootstrapDialog>
      </React.Fragment>
    </>
  );
}
