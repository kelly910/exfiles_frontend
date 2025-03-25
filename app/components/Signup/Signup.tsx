'use client';
import {
  Box,
  Container,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Button } from '@mui/material';
import styles from './register.module.scss';
import Image from 'next/image';
import { registrationValidationSchema } from '@/app/utils/validationSchema/formValidationSchemas';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { registerUser, sendOtp } from '../../redux/slices/register';
import { useAppDispatch } from '@/app/redux/hooks';
import { useRouter } from 'next/navigation';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { showToast } from '@/app/shared/toast/ShowToast';

export interface RegisterFormValues {
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  password: string;
  confirm_password: string;
}

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const router = useRouter();
  const initialValues: RegisterFormValues = {
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    password: '',
    confirm_password: '',
  };
  const dispatch = useAppDispatch();

  const registerUserClick = async (
    values: RegisterFormValues
  ): Promise<void> => {
    try {
      const payload = {
        ...values,
        contact_number: countryCode + values.contact_number,
      };
      const response = await dispatch(registerUser(payload)).unwrap();
      if (response?.id && response?.is_email_verified === false) {
        showToast('success', 'User register successfull.');
        await dispatch(
          sendOtp({
            email: values.email,
            otp_type: 'user_register',
          })
        );
        router.push(`/quick-verification?email=${values.email}`);
        return;
      }
    } catch (error) {
      handleError(error as ErrorResponse);
    }
  };

  return (
    <main>
      <div className={styles.authSection}>
        <div className={styles.authContainer}>
          <Container maxWidth="lg" disableGutters>
            <Box component="section" className={styles.boxLoginHeading}>
              <div className={styles.formLogo}>
                <Image
                  src="/images/logo.svg"
                  alt="logo"
                  width={290}
                  height={63}
                />
              </div>
            </Box>

            <Box component="section">
              <div className={styles.formCard}>
                <div className={styles.formHeader}>
                  <Typography variant="h2" className={styles.formTitle}>
                    Welcome to Exfiles
                  </Typography>
                  <Typography variant="body1" className={styles.formSubtitle}>
                    Please Signup to continue using Exfiles.
                  </Typography>
                </div>

                <Box className={styles.authForm}>
                  <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validationSchema={registrationValidationSchema}
                    onSubmit={registerUserClick}
                  >
                    {({ errors, touched, handleSubmit }) => (
                      <Form onSubmit={handleSubmit}>
                        <Typography
                          variant="body2"
                          component="label"
                          htmlFor="first_name"
                          sx={{
                            display: 'block',
                            fontSize: '16px',
                            color:
                              errors.first_name && touched.first_name
                                ? '#ff4d4d'
                                : '#676972',
                            fontWeight: 500,
                          }}
                        >
                          First Name
                        </Typography>
                        <div style={{ marginBottom: '24px' }}>
                          <Field
                            as={TextField}
                            fullWidth
                            type="text"
                            id="first_name"
                            name="first_name"
                            placeholder="Enter First Name here"
                            error={Boolean(
                              errors.first_name && touched.first_name
                            )}
                            sx={{
                              marginTop: '5px',
                              padding: '0',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                borderWidth: '0px',
                                color: '#fff',
                                backgroundColor: '#252431',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  top: '-10px !important',
                                },
                                '& .MuiOutlinedInput-input': {
                                  fontSize: '16px',
                                  color: '#fff',
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

                        <Typography
                          variant="body2"
                          component="label"
                          htmlFor="last_name"
                          sx={{
                            display: 'block',
                            fontSize: '16px',
                            color:
                              errors.last_name && touched.last_name
                                ? '#ff4d4d'
                                : '#676972',
                            fontWeight: 500,
                          }}
                        >
                          Last Name
                        </Typography>
                        <div style={{ marginBottom: '24px' }}>
                          <Field
                            as={TextField}
                            fullWidth
                            type="text"
                            id="last_name"
                            name="last_name"
                            placeholder="Enter Last Name here"
                            sx={{
                              marginTop: '5px',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                borderWidth: '0px',
                                color: '#fff',
                                backgroundColor: '#252431',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  top: '-10px !important',
                                },
                                '& .MuiOutlinedInput-input': {
                                  fontSize: '16px',
                                  color: '#fff',
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
                                color: '#b0b0b0',
                              },
                            }}
                          />
                        </div>

                        <Typography
                          variant="body2"
                          component="label"
                          htmlFor="email"
                          sx={{
                            display: 'block',
                            fontSize: '16px',
                            color:
                              errors.email && touched.email
                                ? '#ff4d4d'
                                : '#676972',
                            fontWeight: 500,
                          }}
                        >
                          Email Address
                        </Typography>
                        <div style={{ marginBottom: '24px' }}>
                          <Field
                            as={TextField}
                            fullWidth
                            type="text"
                            id="email"
                            name="email"
                            placeholder="Enter Email Address here"
                            error={Boolean(errors.email && touched.email)}
                            sx={{
                              marginTop: '5px',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                borderWidth: '0px',
                                color: '#fff',
                                backgroundColor: '#252431',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  top: '-10px !important',
                                },
                                '& .MuiOutlinedInput-input': {
                                  fontSize: '16px',
                                  color: '#fff',
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
                                  errors.email && touched.email
                                    ? '#ff4d4d'
                                    : '#b0b0b0',
                              },
                            }}
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="error-input-field"
                          />
                        </div>

                        <Typography
                          variant="body2"
                          component="label"
                          htmlFor="contact_number"
                          sx={{
                            display: 'block',
                            fontSize: '16px',
                            color:
                              errors.contact_number && touched.contact_number
                                ? '#ff4d4d'
                                : '#676972',
                            fontWeight: 500,
                          }}
                        >
                          Mobile Number
                        </Typography>
                        <div style={{ marginBottom: '24px' }}>
                          <Field
                            as={TextField}
                            fullWidth
                            type="text"
                            id="contact_number"
                            name="contact_number"
                            placeholder="Enter Mobile Number here"
                            error={Boolean(
                              errors.contact_number && touched.contact_number
                            )}
                            sx={{
                              marginTop: '5px',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                borderWidth: '0px',
                                color: '#fff',
                                backgroundColor: '#252431',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  top: '-10px !important',
                                },
                                '& .MuiOutlinedInput-input': {
                                  fontSize: '16px',
                                  color: '#fff',
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
                                  errors.contact_number &&
                                  touched.contact_number
                                    ? '#ff4d4d'
                                    : '#b0b0b0',
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Select
                                    value={countryCode}
                                    className="select-new"
                                    onChange={(e) =>
                                      setCountryCode(e.target.value)
                                    }
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
                                        right: '-10px',
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

                        <Typography
                          variant="body2"
                          component="label"
                          htmlFor="password"
                          sx={{
                            display: 'block',
                            fontSize: '16px',
                            color:
                              errors.password && touched.password
                                ? '#ff4d4d'
                                : '#676972',
                            fontWeight: 500,
                          }}
                        >
                          Password
                        </Typography>
                        <div style={{ marginBottom: '24px' }}>
                          <Field
                            as={TextField}
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="Choose a strong Password"
                            error={Boolean(errors.password && touched.password)}
                            sx={{
                              marginTop: '5px',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                borderWidth: '0px',
                                color: '#fff',
                                backgroundColor: '#252431',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  top: '-10px !important',
                                },
                                '& .MuiOutlinedInput-input': {
                                  fontSize: '16px',
                                  color: '#fff',
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
                                  errors.password && touched.password
                                    ? '#ff4d4d'
                                    : '#b0b0b0',
                              },
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowPassword((prev) => !prev)
                                    }
                                    edge="end"
                                  >
                                    {showPassword ? (
                                      <Visibility sx={{ color: '#b0b0b0' }} />
                                    ) : (
                                      <VisibilityOff
                                        sx={{ color: '#b0b0b0' }}
                                      />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="error-input-field"
                          />
                        </div>

                        <Typography
                          variant="body2"
                          component="label"
                          htmlFor="confirm_password"
                          sx={{
                            display: 'block',
                            fontSize: '16px',
                            color:
                              errors.confirm_password &&
                              touched.confirm_password
                                ? '#ff4d4d'
                                : '#676972',
                            fontWeight: 500,
                          }}
                        >
                          Confirm Password
                        </Typography>
                        <div style={{ marginBottom: '24px' }}>
                          <Field
                            as={TextField}
                            fullWidth
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirm_password"
                            name="confirm_password"
                            placeholder="Repeat your password"
                            error={Boolean(
                              errors.confirm_password &&
                                touched.confirm_password
                            )}
                            sx={{
                              marginTop: '5px',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                borderWidth: '0px',
                                color: '#fff',
                                backgroundColor: '#252431',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  top: '-10px !important',
                                },
                                '& .MuiOutlinedInput-input': {
                                  fontSize: '16px',
                                  color: '#fff',
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
                                  errors.confirm_password &&
                                  touched.confirm_password
                                    ? '#ff4d4d'
                                    : '#b0b0b0',
                              },
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowConfirmPassword((prev) => !prev)
                                    }
                                    edge="end"
                                  >
                                    {showConfirmPassword ? (
                                      <Visibility sx={{ color: '#b0b0b0' }} />
                                    ) : (
                                      <VisibilityOff
                                        sx={{ color: '#b0b0b0' }}
                                      />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                          <ErrorMessage
                            name="confirm_password"
                            component="div"
                            className="error-input-field"
                          />
                        </div>

                        <Box
                          className={styles.btnGroup}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'right',
                          }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            className={`btn btn-primary`}
                            color="primary"
                            fullWidth
                          >
                            Signup
                          </Button>
                        </Box>
                      </Form>
                    )}
                  </Formik>

                  <Box className={styles.googleLogin}>
                    <Typography
                      variant="body2"
                      className={styles.textSecondary}
                    >
                      You Can also Continue with
                    </Typography>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={`btn btn-tertiary ${styles.googleBtn}`}
                      startIcon={
                        <Image
                          src="/images/google-icon.svg"
                          alt="google-icon"
                          width={24}
                          height={24}
                          className={styles.googleBtnIcon}
                        />
                      }
                      fullWidth
                    >
                      Google
                    </Button>
                  </Box>
                </Box>
              </div>
            </Box>

            <Box
              component="section"
              className={styles.alreadyLogin}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div className="">
                <Typography variant="h4" gutterBottom>
                  Already a Member?
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                  Lorem Ipsum dolor sit amet
                </Typography>
              </div>
              <Button
                variant="contained"
                className={`btn btn-secondary `}
                onClick={() => router.push('/login')}
              >
                Click Here to Login
              </Button>
            </Box>
            {/* </form> */}
          </Container>
        </div>

        <div className={styles.before}>
          <Image src="/images/before.svg" alt="-" height={500} width={500} />
        </div>

        <div className={styles.after}>
          <Image src="/images/after.svg" alt="-" height={306} width={947} />
        </div>
      </div>
    </main>
  );
};

export default Page;
