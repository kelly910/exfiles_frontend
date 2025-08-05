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
import { useAppDispatch } from '@/app/redux/hooks';
import { setLoader } from '@/app/redux/slices/loader';
import { showToast } from '@/app/shared/toast/ShowToast';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import {
  getUserById,
  selectFetchedUser,
  updateProfile,
} from '@/app/redux/slices/login';
import { useThemeMode } from '@/app/utils/ThemeContext';

export interface UpdateUserFormValues {
  contact_number: string;
  first_name: string;
  last_name: string;
  id: number;
  about_me: string;
}

const MyProfile = ({ closeDialog }: { closeDialog: () => void }) => {
  const [countryCode, setCountryCode] = useState('+91');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const fetchedUser = useSelector(selectFetchedUser);
  const firstName = fetchedUser?.first_name;
  const lastName = fetchedUser?.last_name;

  useEffect(() => {
    if (!fetchedUser?.id) return;
    dispatch(getUserById(fetchedUser?.id));
  }, [dispatch, fetchedUser?.id]);

  const initialValues: UpdateUserFormValues = {
    first_name: fetchedUser?.first_name ?? '',
    last_name: fetchedUser?.last_name ?? '',
    contact_number: fetchedUser?.contact_number
      ? fetchedUser?.contact_number.replace('+91', '')
      : '',
    id: Number(fetchedUser?.id) ?? '',
    about_me: fetchedUser?.about_me ?? '',
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

  // const handleInputChange = (values: UpdateUserFormValues) => {
  //   const current = {
  //     ...values,
  //     contact_number: `${countryCode}${values.contact_number}`,
  //   };
  //   const initial = {
  //     ...initialValues,
  //     contact_number: initialValues.contact_number
  //       ? `${countryCode}${initialValues.contact_number}`
  //       : '',
  //   };
  //   const isChanged = Object.keys(initial).some(
  //     (key) =>
  //       current[key as keyof UpdateUserFormValues] !==
  //       initial[key as keyof UpdateUserFormValues]
  //   );
  //   setIsFieldFilled(isChanged);
  // };

  const { theme } = useThemeMode();

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
                    backgroundColor: 'var(--Txt-On-Gradient)',
                    color: 'var(--Black-Color)',
                    fontSize: 'var(--Heading-2)',
                    fontWeight: 'var(--Medium)',
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
                      fontSize: 'var(--SubTitle-3)',
                      color:
                        errors.first_name && touched.first_name
                          ? 'var(--Red-Color)'
                          : 'var(--Placeholder-Text)',
                      fontWeight: 'var(--Regular)',
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
                          padding: '14px 16px',
                          fontWeight: 'var(--Regular)',
                          borderRadius: '12px',
                          '&::placeholder': {
                            color: 'var(--Placeholder-Texts)',
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
                          errors.first_name && touched.first_name
                            ? 'var(--Red-Color)'
                            : 'var(--Placeholder-Text)',
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
                      fontSize: 'var(--SubTitle-3)',
                      color:
                        errors.last_name && touched.last_name
                          ? 'var(--Red-Color)'
                          : 'var(--Placeholder-Text)',
                      fontWeight: 'var(--Regular)',
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
                          padding: '14px 16px',
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
                          errors.last_name && touched.last_name
                            ? 'var(--Red-Color)'
                            : 'var(--Placeholder-Text)',
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
                    value={fetchedUser?.email ?? ''}
                    sx={{
                      marginTop: '4px',
                      padding: '0',
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
                          padding: '14px 16px',
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
                      '& .Mui-disabled': {
                        color: 'var(--Primary-Text-Color)',
                        WebkitTextFillColor: 'var(--Primary-Text-Color)',
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
                      fontSize: 'var(--SubTitle-3)',
                      color:
                        errors.contact_number && touched.contact_number
                          ? 'var(--Red-Color)'
                          : 'var(--Placeholder-Text)',
                      fontWeight: 'var(--Regular)',
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
                    inputProps={{
                      maxLength: 10,
                    }}
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
                        backgroundColor:
                          theme === 'dark'
                            ? 'var(--Txt-On-Gradient)'
                            : 'var(--Input-Box-Colors)',
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
                          lineHeight: '20px',
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
                            ? 'var(--Red-Color)'
                            : 'var(--Placeholder-Text)',
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
                              color: 'var(--Txt-On-Gradient)',
                              fontWeight: 'var(--Bold)',
                              width: '60px',
                              background: 'transparent',
                              paddingRight: '15px !important',
                              '& .MuiSelect-icon': {
                                color: 'var(--Txt-On-Gradient)',
                                position: 'absolute',
                                right: '0px',
                              },
                            }}
                          >
                            <MenuItem value="+91">+91</MenuItem>
                            <MenuItem value="+1">+1</MenuItem>
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
                <div
                  className={`${styles.dialogFormGroup} ${styles.dialogFormGroupText}`}
                >
                  <Typography
                    variant="body2"
                    component="label"
                    htmlFor="about_me"
                    sx={{
                      display: 'block',
                      fontSize: 'var(--SubTitle-3)',
                      color:
                        errors.about_me && touched.about_me
                          ? 'var(--Red-Color)'
                          : 'var(--Placeholder-Text)',
                      fontWeight: 'var(--Regular)',
                    }}
                  >
                    About Me
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    rows={3}
                    multiline
                    type="text"
                    id="about_me"
                    name="about_me"
                    error={Boolean(errors.about_me && touched.about_me)}
                    sx={{
                      marginTop: '4px',
                      padding: '0',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        borderWidth: '0px',
                        color: 'var(--Primary-Text-Color)',
                        backgroundColor:
                          theme === 'dark'
                            ? 'var(--Background-Color)'
                            : 'var(--Input-Box-Colors)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          top: '-10px !important',
                        },
                        '& .MuiOutlinedInput-input': {
                          fontSize: 'var(--SubTitle-3)',
                          color: 'var(--Primary-Text-Color)',
                          padding: '0',
                          fontWeight: 'var(--Regular)',
                          borderRadius: '0',
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
                          color: 'var(--Txt-On-Gradient)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color:
                          errors.about_me && touched.about_me
                            ? 'var(--Red-Color)'
                            : 'var(--Placeholder-Text)',
                      },
                    }}
                  />
                  <ErrorMessage
                    name="about_me"
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
