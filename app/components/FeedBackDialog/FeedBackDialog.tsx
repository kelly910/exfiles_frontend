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
    backgroundColor: '#11101b',
    margin: '0px',
    border: '1px solid #3a3948',
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
              <Image
                src="/images/message-question.svg"
                alt="feedback"
                width={28}
                height={28}
              />
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
            <Image
              src="/images/close.svg"
              alt="close-icon"
              width={24}
              height={24}
            />
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
                        color: '#DADAE1',
                        backgroundColor: '#252431',
                        padding: '14px 16px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          top: '-10px !important',
                        },
                        '& .MuiOutlinedInput-input': {
                          fontSize: '14px',
                          color: '#DADAE1',
                          fontWeight: 500,
                          borderRadius: '12px',
                          padding: '2px',
                          maxHeight: '350px',
                          overflowY: 'auto !important',
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
                          errors.body && touched.body ? '#ff4d4d' : '#b0b0b0',
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
