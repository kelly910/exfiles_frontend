'use client';

import React, { useState } from 'react';
import styles from './feedBack.module.scss';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { feedbackValidation } from '@/app/utils/validationSchema/formValidationSchemas';
import { useAppDispatch } from '@/app/redux/hooks';
import { setLoader } from '@/app/redux/slices/loader';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { showToast } from '@/app/shared/toast/ShowToast';
import { feedback } from '@/app/redux/slices/feedback';
import { useThemeMode } from '@/app/utils/ThemeContext';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid var(--Stroke-Color)',
    borderRadius: '16px',
    minWidth: '650px',
    maxWidth: '90vw',
    // Responsive styles
    [theme.breakpoints.down('md')]: {
      minWidth: '550px',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '70vw',
    },
  },
}));

interface FeedbackDialogProps {
  openFeedbackDialogProps: boolean;
  onClose: () => void;
}

export interface FeedbackFormValues {
  body: string;
}

export default function FeedbackDialog({
  openFeedbackDialogProps,
  onClose,
}: FeedbackDialogProps) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const initialValues: FeedbackFormValues = {
    body: '',
  };

  const userFeedbackClick = async (
    values: FeedbackFormValues
  ): Promise<void> => {
    setLoading(true);
    dispatch(setLoader(true));
    try {
      const response = await dispatch(feedback(values)).unwrap();
      setTimeout(() => {
        if (response?.messages?.length) {
          showToast('success', response?.messages[0]);
        }
        dispatch(setLoader(false));
        setLoading(false);
        onClose();
      }, 1000);
    } catch (error: unknown) {
      setTimeout(() => {
        handleError(error as ErrorResponse);
        dispatch(setLoader(false));
        setLoading(false);
      }, 1000);
    }
  };

  const { theme } = useThemeMode();

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={openFeedbackDialogProps}
        className={styles.headerDialogBox}
        sx={{
          background: 'rgb(17 16 27 / 0%)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <Box component="div" className={styles.dialogHeader}>
          <DialogTitle
            sx={{ m: 0, p: 0 }}
            id="customized-dialog-title"
            className={styles.dialogHeaderInner}
          >
            <Box component="div" className={styles.dialogIcon}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.833 2.83496H8.16634C4.66634 2.83496 2.33301 5.16829 2.33301 8.66829V15.6683C2.33301 19.1683 4.66634 21.5016 8.16634 21.5016V23.9866C8.16634 24.92 9.20468 25.48 9.97468 24.955L15.1663 21.5016H19.833C23.333 21.5016 25.6663 19.1683 25.6663 15.6683V8.66829C25.6663 5.16829 23.333 2.83496 19.833 2.83496ZM13.9997 17.0333C13.5097 17.0333 13.1247 16.6366 13.1247 16.1583C13.1247 15.68 13.5097 15.2833 13.9997 15.2833C14.4897 15.2833 14.8747 15.68 14.8747 16.1583C14.8747 16.6366 14.4897 17.0333 13.9997 17.0333ZM15.4697 12.1916C15.0147 12.495 14.8747 12.6933 14.8747 13.02V13.265C14.8747 13.7433 14.478 14.14 13.9997 14.14C13.5213 14.14 13.1247 13.7433 13.1247 13.265V13.02C13.1247 11.6666 14.1163 11.0016 14.4897 10.745C14.9213 10.4533 15.0613 10.255 15.0613 9.95163C15.0613 9.36829 14.583 8.88996 13.9997 8.88996C13.4163 8.88996 12.938 9.36829 12.938 9.95163C12.938 10.43 12.5413 10.8266 12.063 10.8266C11.5847 10.8266 11.188 10.43 11.188 9.95163C11.188 8.39996 12.448 7.13996 13.9997 7.13996C15.5513 7.13996 16.8113 8.39996 16.8113 9.95163C16.8113 11.2816 15.8313 11.9466 15.4697 12.1916Z"
                  fill={
                    theme === 'dark'
                      ? 'url(#paint0_linear_1_47407)'
                      : 'var(--Primary-Text-Color)'
                  }
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_1_47407"
                    x1="2.33301"
                    y1="13.996"
                    x2="25.6663"
                    y2="13.996"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#2A1AD8" />
                    <stop offset="0.25" stop-color="#4E26E2" />
                    <stop offset="0.5" stop-color="#7231EC" />
                    <stop offset="0.75" stop-color="#953DF5" />
                    <stop offset="1" stop-color="#B948FF" />
                  </linearGradient>
                </defs>
              </svg>
            </Box>
            <Box>
              <Typography variant="h6" className={styles.dialogTitle}>
                Give Feedback
              </Typography>
              <Typography variant="body1" className={styles.dialogSemiTitle}>
                Your thoughts are valuable in helping improve our products.
              </Typography>
            </Box>
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.1 18.3C6.7134 18.6866 6.0866 18.6866 5.7 18.3C5.3134 17.9134 5.3134 17.2866 5.7 16.9L9.89289 12.7071C10.2834 12.3166 10.2834 11.6834 9.89289 11.2929L5.7 7.1C5.3134 6.7134 5.3134 6.0866 5.7 5.7C6.0866 5.3134 6.7134 5.3134 7.1 5.7L11.2929 9.89289C11.6834 10.2834 12.3166 10.2834 12.7071 9.89289L16.9 5.7C17.2866 5.3134 17.9134 5.3134 18.3 5.7C18.6866 6.0866 18.6866 6.7134 18.3 7.1L14.1071 11.2929C13.7166 11.6834 13.7166 12.3166 14.1071 12.7071L18.3 16.9C18.6866 17.2866 18.6866 17.9134 18.3 18.3C17.9134 18.6866 17.2866 18.6866 16.9 18.3L12.7071 14.1071C12.3166 13.7166 11.6834 13.7166 11.2929 14.1071L7.1 18.3Z"
                fill="var(--Primary-Text-Color)"
              />
            </svg>
          </IconButton>
        </Box>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={feedbackValidation}
          onSubmit={userFeedbackClick}
        >
          {({ errors, touched, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <DialogContent dividers className={styles.dialogBody}>
                <Box component="div" className={styles.dialogFormBox}>
                  <Field
                    as={TextField}
                    fullWidth
                    id="body"
                    name="body"
                    placeholder="Write your feedback"
                    multiline
                    minRows={4}
                    maxRow={6}
                    error={Boolean(errors.body && touched.body)}
                    sx={{
                      marginTop: '0px',
                      padding: '0',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        borderWidth: '0px',
                        color: 'var(--Primary-Text-Color)',
                        backgroundColor:
                          theme === 'dark'
                            ? 'var(--Background-Color)'
                            : 'var(--Input-Box-Colors)',
                        padding: '14px 16px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          top: '-10px !important',
                        },
                        '& .MuiOutlinedInput-input': {
                          fontSize: 'var(--SubTitle-3)',
                          color: 'var(--Primary-Text-Color)',
                          fontWeight: 'var(--Regular)',
                          borderRadius: '12px',
                          padding: '2px',
                          maxHeight: '200px',
                          overflowY: 'auto !important',
                          '&::placeholder': {
                            color: 'var(--Placeholder-Text)',
                            fontWeight: 'var(--Lighter)',
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
                          errors.body && touched.body
                            ? 'var(--Red-Color)'
                            : 'var(--Placeholder-Text)',
                      },
                    }}
                  />
                  <ErrorMessage
                    name="body"
                    component="div"
                    className="error-input-field"
                  />
                </Box>
                <Box component="div" className={styles.dialogFormButtonBox}>
                  <Button className={styles.formCancelBtn} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    className={styles.formSaveBtn}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </Box>
              </DialogContent>
            </Form>
          )}
        </Formik>
      </BootstrapDialog>
    </React.Fragment>
  );
}
