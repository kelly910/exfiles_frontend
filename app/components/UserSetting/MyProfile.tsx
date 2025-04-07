'use client';

import { useEffect, useState } from 'react';
import styles from '@components/SettingDialog/setting.module.scss';
import {
  MenuItem,
  Avatar,
  Box,
  InputAdornment,
  Select,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { updateUserValidationSchema } from '@/app/utils/validationSchema/formValidationSchemas';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { useAppDispatch } from '@/app/redux/hooks';
import { setLoader } from '@/app/redux/slices/loader';
import { showToast } from '@/app/shared/toast/ShowToast';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { getUserById, updateProfile } from '@/app/redux/slices/login';

export interface UpdateUserFormValues {
  contact_number: string;
  first_name: string;
  last_name: string;
  id: number;
}

const MyProfile = ({ closeDialog }: { closeDialog: () => void }) => {
  const [countryCode, setCountryCode] = useState('+91');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const loggedInUser = useSelector(
    (state: RootState) => state.login.loggedInUser
  );
  const firstName = loggedInUser?.data?.first_name;
  const lastName = loggedInUser?.data?.last_name;

  useEffect(() => {
    if (!loggedInUser?.data?.id) return;
    dispatch(getUserById(loggedInUser.data.id));
  }, [dispatch, loggedInUser?.data?.id]);

  const initialValues: UpdateUserFormValues = {
    first_name: loggedInUser?.data?.first_name ?? '',
    last_name: loggedInUser?.data?.last_name ?? '',
    contact_number: loggedInUser?.data?.contact_number
      ? loggedInUser.data.contact_number.replace('+91', '')
      : '',
    id: Number(loggedInUser?.data?.id) ?? '',
  };

  const updateUserClick = async (
    values: UpdateUserFormValues
  ): Promise<void> => {
    setLoading(true);
    dispatch(setLoader(true));
    const payload = {
      ...values,
      contact_number: countryCode + values.contact_number,
    };
    try {
      const response = await dispatch(updateProfile(payload)).unwrap();
      setTimeout(() => {
        console.log(response, 'response');
        if (response?.id) {
          showToast('success', 'Profile updated successfully.');
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

  return (
    <div className={styles.headerDialogBox}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={updateUserValidationSchema}
        onSubmit={updateUserClick}
      >
        {({ errors, touched, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className={styles.dialogFormBox}>
            <Box component="div" className={styles.dialogFormContent}>
              <Box>
                <Avatar
                  alt="abbreviation"
                  sx={{
                    backgroundColor: '#DADAE1',
                    color: '#1B1A25',
                    fontSize: '24px',
                    fontWeight: 600,
                    padding: '13px 15px',
                    lineHeight: '140%',
                    marginBottom: '28px',
                    width: '60px',
                    height: '60px',
                    textTransform: 'capitalize',
                  }}
                >
                  {firstName?.[0]}
                  {lastName?.[0]}
                </Avatar>
              </Box>
              <form className={styles.dialogFormInner}>
                <div className={styles.dialogFormGroup}>
                  <Typography
                    variant="body2"
                    component="label"
                    htmlFor="first_name"
                    sx={{
                      display: 'block',
                      fontSize: '14px',
                      color:
                        errors.first_name && touched.first_name
                          ? '#ff4d4d'
                          : '#676972',
                      fontWeight: 500,
                    }}
                  >
                    First Name
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    type="text"
                    id="first_name"
                    name="first_name"
                    error={Boolean(errors.first_name && touched.first_name)}
                    sx={{
                      marginTop: '4px',
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
                      '& .MuiFormHelperText-root': {
                        color:
                          errors.first_name && touched.first_name
                            ? '#ff4d4d'
                            : '#b0b0b0',
                      },
                    }}
                  />
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="error-input-field"
                  />
                </div>
                <div className={styles.dialogFormGroup}>
                  <Typography
                    variant="body2"
                    component="label"
                    htmlFor="last_name"
                    sx={{
                      display: 'block',
                      fontSize: '14px',
                      color:
                        errors.last_name && touched.last_name
                          ? '#ff4d4d'
                          : '#676972',
                      fontWeight: 500,
                    }}
                  >
                    Last Name
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    type="text"
                    id="last_name"
                    name="last_name"
                    error={Boolean(errors.last_name && touched.last_name)}
                    sx={{
                      marginTop: '4px',
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
                      '& .MuiFormHelperText-root': {
                        color:
                          errors.last_name && touched.last_name
                            ? '#ff4d4d'
                            : '#b0b0b0',
                      },
                    }}
                  />
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    className="error-input-field"
                  />
                </div>
                <div className={styles.dialogFormGroup}>
                  <Typography
                    variant="body2"
                    component="label"
                    htmlFor="email"
                    className={styles.formLabel}
                  >
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    type="text"
                    id="email"
                    name="email"
                    disabled={true}
                    value={loggedInUser?.data?.email ?? ''}
                    sx={{
                      marginTop: '4px',
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
                      '& .Mui-disabled': {
                        color: '#DADAE1',
                        WebkitTextFillColor: '#DADAE1',
                      },
                    }}
                  />
                </div>
                <div
                  className={`${styles.dialogFormGroup} ${styles.mobileInputBox}`}
                >
                  <Typography
                    variant="body2"
                    component="label"
                    htmlFor="contact_number"
                    sx={{
                      display: 'block',
                      fontSize: '14px',
                      color:
                        errors.contact_number && touched.contact_number
                          ? '#ff4d4d'
                          : '#676972',
                      fontWeight: 500,
                    }}
                  >
                    Mobile No
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    type="text"
                    id="contact_number"
                    name="contact_number"
                    className={styles.mobileInput}
                    error={Boolean(
                      errors.contact_number && touched.contact_number
                    )}
                    sx={{
                      marginTop: '5px',
                      '& .MuiSelect-select': {
                        padding: 0,
                      },
                      '& .MuiInputBase-input': {
                        padding: '14px 15px !important',
                        whiteSpace: 'unset !important',
                        overflow: 'hidden !important',
                        textOverflow: 'unset !important',
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        borderWidth: '0px',
                        color: 'var(--Primary-Text-Color)',
                        backgroundColor: 'var(--Input-Box-Colors)',
                        paddingLeft: '0',
                        '& .MuiOutlinedInput-notchedOutline': {
                          top: '-10px !important',
                        },
                        '& .MuiOutlinedInput-input': {
                          fontSize: 'var(--SubTitle-3)',
                          color: 'var(--Primary-Text-Color)',
                          padding: '14px 16px',
                          fontWeight: 'var(--Regular)',
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
                      '& .MuiFormHelperText-root': {
                        color:
                          errors.contact_number && touched.contact_number
                            ? '#ff4d4d'
                            : '#b0b0b0',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Select
                            value={countryCode}
                            className={styles.selectNew}
                            onChange={(e) => setCountryCode(e.target.value)}
                            MenuProps={{
                              disableScrollLock: true,
                            }}
                            sx={{
                              padding: '0px',
                              color: '#b0b0b0',
                              fontWeight: 'bold',
                              width: '60px',
                              background: 'transparent',
                              paddingRight: '15px !important',
                              '& .MuiSelect-icon': {
                                color: '#fff',
                                position: 'absolute',
                                right: '0px',
                              },
                            }}
                          >
                            <MenuItem value="+91">+91</MenuItem>
                            <MenuItem value="+1">+1</MenuItem>
                            <MenuItem value="+44">+44</MenuItem>
                            <MenuItem value="+61">+61</MenuItem>
                          </Select>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <ErrorMessage
                    name="contact_number"
                    component="div"
                    className="error-input-field"
                  />
                </div>
              </form>
            </Box>
            <Box component="div" className={styles.dialogFormButtonBox}>
              <Button className={styles.formCancelBtn} onClick={closeDialog}>
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
                  'Save Changes'
                )}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MyProfile;
