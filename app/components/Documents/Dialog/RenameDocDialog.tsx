'use client';

import React, { useState } from 'react';
import styles from './style.module.scss';
import Image from 'next/image';
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
import { useAppDispatch } from '@/app/redux/hooks';
import { setLoader } from '@/app/redux/slices/loader';
import * as Yup from 'yup';
import { showToast } from '@/app/shared/toast/ShowToast';
import { renameDocuments } from '@/app/redux/slices/documentByCategory';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Background-Color)',
    margin: '0px',
    border: '1px solid var(--Stroke-Color)',
    borderRadius: '16px',
    minWidth: '600px',
    maxWidth: '90vw',
    '@media (max-width: 768px)': {
      maxWidth: '80vw',
      minWidth: '550px',
    },
    '@media (max-width: 580px)': {
      maxWidth: '80vw',
      minWidth: '450px',
    },
    '@media (max-width: 480px)': {
      maxWidth: '95vw',
      minWidth: '90%',
    },
  },
}));

type DocumentRenameProps = {
  onClose: () => void;
  open: boolean;
  document: { file_name: string; uuid: number | string } | null;
  getCategoryDocument?: () => void;
};

export interface DocumentRenameFormValues {
  file_name: string;
  uuid: number | string;
}

const DocumentRenameDialog = ({
  open,
  onClose,
  document,
  getCategoryDocument,
}: DocumentRenameProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  if (!document) return null;

  const initialValues: DocumentRenameFormValues = {
    file_name: document.file_name,
    uuid: document.uuid,
  };

  const validationSchema = Yup.object({
    file_name: Yup.string()
      .trim()
      .max(50, 'Document name must be at most 50 characters')
      .required('Document name is required'),
  });

  const documentRenameFunction = async (values: DocumentRenameFormValues) => {
    setLoading(true);
    dispatch(setLoader(true));
    await dispatch(
      renameDocuments({ uuid: values.uuid, file_name: values.file_name })
    )
      .unwrap()
      .then((res) => {
        if (res) {
          showToast('success', 'Document Renamed Successfully.');
          getCategoryDocument?.();
          setTimeout(() => {
            setLoading(false);
            onClose();
            dispatch(setLoader(false));
          }, 1000);
        }
      })
      .catch((error) => {
        showToast('error', error.file_name[0]);
        setTimeout(() => {
          setLoading(false);
          dispatch(setLoader(false));
        }, 1000);
      });
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
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
                src="/images/rename-thread.svg"
                alt="logout"
                width={28}
                height={28}
              />
            </Box>
            <Box>
              <Typography variant="h6" className={styles.dialogTitle}>
                Rename Document
              </Typography>
              <Typography variant="body1" className={styles.dialogSemiTitle}>
                Change the name of document according to your needs
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
          validationSchema={validationSchema}
          onSubmit={documentRenameFunction}
        >
          {({ errors, touched, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Box component="div" className={styles.dialogInput}>
                <Field
                  as={TextField}
                  fullWidth
                  type="text"
                  id="file_name"
                  name="file_name"
                  placeholder="Enter Document Name here"
                  error={Boolean(errors.file_name && touched.file_name)}
                  sx={{
                    marginTop: '5px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      borderWidth: '0px',
                      color: 'var(--Primary-Text-Color)',
                      backgroundColor: 'var(--Input-Box-Colors)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        top: '0 !important',
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
                      legend: {
                        display: 'none',
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color:
                        errors.file_name && touched.file_name
                          ? 'var(--Red-Color)'
                          : 'var(--Placeholder-Text)',
                    },
                  }}
                />
                <ErrorMessage
                  name="file_name"
                  component="div"
                  className="error-input-field"
                />
              </Box>
              <DialogContent dividers className={styles.dialogBody}>
                <Box component="div" className={styles.dialogFormButtonBox}>
                  <Button className={styles.formCancelBtn} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    className="btn btn-primary"
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Save'
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
};

export default DocumentRenameDialog;
