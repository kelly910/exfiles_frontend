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
import Image from 'next/image';
import { feedbackValidation } from '@/app/utils/validationSchema/formValidationSchemas';
import { useAppDispatch } from '@/app/redux/hooks';
import { setLoader } from '@/app/redux/slices/loader';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { showToast } from '@/app/shared/toast/ShowToast';
import { feedback } from '@/app/redux/slices/feedback';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Background-Color)',
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
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 2.42993H7C4 2.42993 2 4.42993 2 7.42993V13.4299C2 16.4299 4 18.4299 7 18.4299V20.5599C7 21.3599 7.89 21.8399 8.55 21.3899L13 18.4299H17C20 18.4299 22 16.4299 22 13.4299V7.42993C22 4.42993 20 2.42993 17 2.42993ZM12 14.5999C11.58 14.5999 11.25 14.2599 11.25 13.8499C11.25 13.4399 11.58 13.0999 12 13.0999C12.42 13.0999 12.75 13.4399 12.75 13.8499C12.75 14.2599 12.42 14.5999 12 14.5999ZM13.26 10.4499C12.87 10.7099 12.75 10.8799 12.75 11.1599V11.3699C12.75 11.7799 12.41 12.1199 12 12.1199C11.59 12.1199 11.25 11.7799 11.25 11.3699V11.1599C11.25 9.99993 12.1 9.42993 12.42 9.20993C12.79 8.95993 12.91 8.78993 12.91 8.52993C12.91 8.02993 12.5 7.61993 12 7.61993C11.5 7.61993 11.09 8.02993 11.09 8.52993C11.09 8.93993 10.75 9.27993 10.34 9.27993C9.93 9.27993 9.59 8.93993 9.59 8.52993C9.59 7.19993 10.67 6.11993 12 6.11993C13.33 6.11993 14.41 7.19993 14.41 8.52993C14.41 9.66993 13.57 10.2399 13.26 10.4499Z"
                  fill="var(--Primary-Text-Color)"
                />
                <path
                  d="M17 2.42993H7C4 2.42993 2 4.42993 2 7.42993V13.4299C2 16.4299 4 18.4299 7 18.4299V20.5599C7 21.3599 7.89 21.8399 8.55 21.3899L13 18.4299H17C20 18.4299 22 16.4299 22 13.4299V7.42993C22 4.42993 20 2.42993 17 2.42993ZM12 14.5999C11.58 14.5999 11.25 14.2599 11.25 13.8499C11.25 13.4399 11.58 13.0999 12 13.0999C12.42 13.0999 12.75 13.4399 12.75 13.8499C12.75 14.2599 12.42 14.5999 12 14.5999ZM13.26 10.4499C12.87 10.7099 12.75 10.8799 12.75 11.1599V11.3699C12.75 11.7799 12.41 12.1199 12 12.1199C11.59 12.1199 11.25 11.7799 11.25 11.3699V11.1599C11.25 9.99993 12.1 9.42993 12.42 9.20993C12.79 8.95993 12.91 8.78993 12.91 8.52993C12.91 8.02993 12.5 7.61993 12 7.61993C11.5 7.61993 11.09 8.02993 11.09 8.52993C11.09 8.93993 10.75 9.27993 10.34 9.27993C9.93 9.27993 9.59 8.93993 9.59 8.52993C9.59 7.19993 10.67 6.11993 12 6.11993C13.33 6.11993 14.41 7.19993 14.41 8.52993C14.41 9.66993 13.57 10.2399 13.26 10.4499Z"
                  fill="transparent"
                />
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
                        backgroundColor: 'var(--Input-Box-Colors)',
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
