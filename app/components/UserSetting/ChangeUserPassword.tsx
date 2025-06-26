'use client';

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import styles from '@components/SettingDialog/setting.module.scss';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { changePasswordUserLoginValidationSchema } from '@/app/utils/validationSchema/formValidationSchemas';
import { setLoader } from '@/app/redux/slices/loader';
import { useAppDispatch } from '@/app/redux/hooks';
import { showToast } from '@/app/shared/toast/ShowToast';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { changeUserPassword } from '@/app/redux/slices/changePassword';
import { useThemeMode } from '@/app/utils/ThemeContext';

export interface ChangePasswordFormValues {
  old_password: string;
  new_password1: string;
  new_password2: string;
}

const ChangeUserPassword = ({
  closeDialog,
  mobileView,
}: {
  closeDialog: () => void;
  mobileView: boolean;
}) => {
  const [currentPassword, setCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [repeatNewPassword, setRepeatNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const initialValues: ChangePasswordFormValues = {
    old_password: '',
    new_password1: '',
    new_password2: '',
  };
  const [isFieldFilled, setIsFieldFilled] = useState(false);

  const handleInputChange = (values: ChangePasswordFormValues) => {
    const isAnyFieldFilled =
      values.old_password.trim() !== '' ||
      values.new_password1.trim() !== '' ||
      values.new_password2.trim() !== '';
    setIsFieldFilled(isAnyFieldFilled);
  };

  const changePasswordClick = async (
    values: ChangePasswordFormValues
  ): Promise<void> => {
    setLoading(true);
    dispatch(setLoader(true));
    try {
      const response = await dispatch(changeUserPassword(values)).unwrap();
      setTimeout(() => {
        if (response?.detail) {
          showToast('success', response.detail);
        }
        dispatch(setLoader(false));
        setLoading(false);
        closeDialog();
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
    <>
      <div className={styles.headerDialogBox}>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={changePasswordUserLoginValidationSchema}
          onSubmit={changePasswordClick}
        >
          {({ values, errors, touched, handleSubmit, handleChange }) => (
            <Form onSubmit={handleSubmit} className={styles.dialogFormBox}>
              <Box component="div" className={styles.dialogFormContent}>
                <div className={styles.dialogFormInner}>
                  <div className={styles.dialogFormGroup}>
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="old_password"
                      sx={{
                        display: 'block',
                        fontSize: 'var(--SubTitle-3)',
                        color:
                          errors.old_password && touched.old_password
                            ? 'var(--Red-Color)'
                            : 'var(--Placeholder-Text)',
                        fontWeight: 'var(--Regular)',
                      }}
                    >
                      Current Password
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      type={currentPassword ? 'text' : 'password'}
                      id="old_password"
                      name="old_password"
                      placeholder="Your Current Password"
                      error={Boolean(
                        errors.old_password && touched.old_password
                      )}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        handleInputChange({
                          ...values,
                          old_password: e.target.value,
                        });
                      }}
                      sx={{
                        marginTop: '4px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          borderWidth: '0px',
                          color: 'var(--Primary-Text-Color)',
                          backgroundColor:
                            theme === 'dark'
                              ? 'var(--Txt-On-Gradient)'
                              : 'var(--Input-Box-Colors)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            top: '-10px !important',
                          },
                          '& .MuiOutlinedInput-input': {
                            fontSize: 'var(--SubTitle-3)',
                            color: 'var(--Primary-Text-Color)',
                            padding: '12px',
                            fontWeight: 'var(--Regular)',
                            borderRadius: '12px',
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
                            color: 'var(--Txt-On-Gradient)',
                          },
                        },
                        '& .MuiFormHelperText-root': {
                          color:
                            errors.old_password && touched.old_password
                              ? 'var(--Red-Color)'
                              : 'var(--Placeholder-Text)',
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setCurrentPassword((prev) => !prev)
                              }
                              edge="end"
                              sx={{
                                padding: '0',
                                width: '20px',
                                margin: '0',
                              }}
                            >
                              {currentPassword ? (
                                <Visibility
                                  sx={{
                                    color: 'var(--Primary-Text-Color)',
                                    width: '20px',
                                    height: '20px',
                                  }}
                                />
                              ) : (
                                <VisibilityOff
                                  sx={{
                                    color: 'var(--Primary-Text-Color)',
                                    width: '20px',
                                    height: '20px',
                                  }}
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <ErrorMessage
                      name="old_password"
                      component="div"
                      className="error-input-field"
                    />
                  </div>
                  {!mobileView ? <br /> : <></>}
                  <div className={styles.dialogFormGroup}>
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="new_password1"
                      sx={{
                        display: 'block',
                        fontSize: 'var(--SubTitle-3)',
                        color:
                          errors.new_password1 && touched.new_password1
                            ? 'var(--Red-Color)'
                            : 'var(--Placeholder-Text)',
                        fontWeight: 'var(--Regular)',
                      }}
                    >
                      New Password*
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      type={newPassword ? 'text' : 'password'}
                      id="new_password1"
                      name="new_password1"
                      placeholder="Choose a strong Password"
                      error={Boolean(
                        errors.new_password1 && touched.new_password1
                      )}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        handleInputChange({
                          ...values,
                          new_password1: e.target.value,
                        });
                      }}
                      sx={{
                        marginTop: '4px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          borderWidth: '0px',
                          color: 'var(--Primary-Text-Color)',
                          backgroundColor:
                            theme === 'dark'
                              ? 'var(--Txt-On-Gradient)'
                              : 'var(--Input-Box-Colors)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            top: '-10px !important',
                          },
                          '& .MuiOutlinedInput-input': {
                            fontSize: 'var(--SubTitle-3)',
                            color: 'var(--Primary-Text-Color)',
                            padding: '12px',
                            fontWeight: 'var(--Regular)',
                            borderRadius: '12px',
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
                            color: 'var(--Txt-On-Gradient)',
                          },
                        },
                        '& .MuiFormHelperText-root': {
                          color:
                            errors.new_password1 && touched.new_password1
                              ? 'var(--Red-Color)'
                              : 'var(--Placeholder-Text)',
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setNewPassword((prev) => !prev)}
                              edge="end"
                              sx={{
                                padding: '0',
                                width: '20px',
                                margin: '0',
                              }}
                            >
                              {newPassword ? (
                                <Visibility
                                  sx={{
                                    color: 'var(--Primary-Text-Color)',
                                    width: '20px',
                                    height: '20px',
                                  }}
                                />
                              ) : (
                                <VisibilityOff
                                  sx={{
                                    color: 'var(--Primary-Text-Color)',
                                    width: '20px',
                                    height: '20px',
                                  }}
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <ErrorMessage
                      name="new_password1"
                      component="div"
                      className="error-input-field"
                    />
                  </div>
                  <div className={styles.dialogFormGroup}>
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="new_password2"
                      sx={{
                        display: 'block',
                        fontSize: 'var(--SubTitle-3)',
                        color:
                          errors.new_password2 && touched.new_password2
                            ? 'var(--Red-Color)'
                            : 'var(--Placeholder-Text)',
                        fontWeight: 'var(--Regular)',
                      }}
                    >
                      Repeat New Password*
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      type={repeatNewPassword ? 'text' : 'password'}
                      id="new_password2"
                      name="new_password2"
                      placeholder="Repeat your password"
                      error={Boolean(
                        errors.new_password2 && touched.new_password2
                      )}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        handleInputChange({
                          ...values,
                          new_password2: e.target.value,
                        });
                      }}
                      sx={{
                        marginTop: '4px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          borderWidth: '0px',
                          color: 'var(--Primary-Text-Color)',
                          backgroundColor:
                            theme === 'dark'
                              ? 'var(--Txt-On-Gradient)'
                              : 'var(--Input-Box-Colors)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            top: '-10px !important',
                          },
                          '& .MuiOutlinedInput-input': {
                            fontSize: 'var(--SubTitle-3)',
                            color: 'var(--Primary-Text-Color)',
                            padding: '12px',
                            fontWeight: 'var(--Regular)',
                            borderRadius: '12px',
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
                            color: 'var(--Txt-On-Gradient)',
                          },
                        },
                        '& .MuiFormHelperText-root': {
                          color:
                            errors.new_password2 && touched.new_password2
                              ? 'var(--Red-Color)'
                              : 'var(--Placeholder-Text)',
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setRepeatNewPassword((prev) => !prev)
                              }
                              edge="end"
                              sx={{
                                padding: '0',
                                width: '20px',
                                margin: '0',
                              }}
                            >
                              {repeatNewPassword ? (
                                <Visibility
                                  sx={{
                                    color: 'var(--Primary-Text-Color)',
                                    width: '20px',
                                    height: '20px',
                                  }}
                                />
                              ) : (
                                <VisibilityOff
                                  sx={{
                                    color: 'var(--Primary-Text-Color)',
                                    width: '20px',
                                    height: '20px',
                                  }}
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <ErrorMessage
                      name="new_password2"
                      component="div"
                      className="error-input-field"
                    />
                  </div>
                </div>
              </Box>
              {isFieldFilled && (
                <Box component="div" className={styles.dialogFormButtonBox}>
                  <Button
                    className={styles.formSaveBtn}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </Box>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ChangeUserPassword;
