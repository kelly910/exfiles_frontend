'use client';

import React, { useState } from 'react';
import styles from './rename.module.scss';
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
import {
  fetchCategories,
  renameCategory,
} from '@/app/redux/slices/categoryListing';
import * as Yup from 'yup';
import { showToast } from '@/app/shared/toast/ShowToast';

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

type RenameProps = {
  onClose: () => void;
  open: boolean;
  category: { name: string; id: number } | null;
};

export interface CategoryRenameFormValues {
  name: string;
  id: number;
}

const RenameDialog = ({ open, onClose, category }: RenameProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  if (!category) return null;

  const initialValues: CategoryRenameFormValues = {
    name: category.name,
    id: category.id,
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .max(50, 'Category must be at most 50 characters')
      .required('Category is required'),
  });

  const categoryRenameFunction = async (values: CategoryRenameFormValues) => {
    setLoading(true);
    dispatch(setLoader(true));
    await dispatch(renameCategory({ id: values.id, name: values.name }))
      .unwrap()
      .then((res) => {
        if (res) {
          showToast('success', 'Category Renamed Successfully.');
          dispatch(fetchCategories({ page: 1 }));
          setTimeout(() => {
            setLoading(false);
            onClose();
            dispatch(setLoader(false));
          }, 1000);
        }
      })
      .catch((error) => {
        setTimeout(() => {
          showToast('error', error?.category_id[0]);
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
                Rename Category
              </Typography>
              <Typography variant="body1" className={styles.dialogSemiTitle}>
                Change the name of category according to your needs
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
          validationSchema={validationSchema}
          onSubmit={categoryRenameFunction}
        >
          {({ errors, touched, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Box component="div" className={styles.dialogInput}>
                <Field
                  as={TextField}
                  fullWidth
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter Category Name here"
                  error={Boolean(errors.name && touched.name)}
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
                        errors.name && touched.name
                          ? 'var(--Red-Color)'
                          : 'var(--Placeholder-Text)',
                    },
                  }}
                />
                <ErrorMessage
                  name="name"
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

export default RenameDialog;
