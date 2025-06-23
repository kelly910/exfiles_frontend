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
  CircularProgress,
} from '@mui/material';
import { Button } from '@mui/material';
import styles from './register.module.scss';
import Image from 'next/image';
import { registrationValidationSchema } from '@/app/utils/validationSchema/formValidationSchemas';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { registerUser } from '../../redux/slices/register';
import { useAppDispatch } from '@/app/redux/hooks';
import { useRouter } from 'next/navigation';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { showToast } from '@/app/shared/toast/ShowToast';
import { useGoogleLogin } from '@react-oauth/google';
import { socialGoogleLogin } from '@/app/redux/slices/login';
import { setLoader } from '@/app/redux/slices/loader';
import Link from 'next/link';

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
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
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
      setLoadingSignup(true);
      dispatch(setLoader(true));
      const payload = {
        ...values,
        contact_number: countryCode + values.contact_number,
      };
      setTimeout(async () => {
        try {
          const response = await dispatch(registerUser(payload)).unwrap();
          if (response?.id && response?.is_email_verified === false) {
            showToast('success', 'User register successful.');
            // await dispatch(
            //   sendOtp({
            //     email: values.email,
            //     otp_type: 'user_register',
            //   })
            // );
            router.push(`/quick-verification?email=${values.email}`);
          }
        } catch (error) {
          handleError(error as ErrorResponse);
          dispatch(setLoader(false));
        } finally {
          setLoadingSignup(false);
          dispatch(setLoader(false));
        }
      }, 1000);
    } catch (error) {
      handleError(error as ErrorResponse);
      setLoadingSignup(false);
      dispatch(setLoader(false));
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: { access_token: string }) => {
      try {
        const response = await dispatch(
          socialGoogleLogin({ access_token: tokenResponse.access_token })
        ).unwrap();
        localStorage.setItem('loggedInUser', JSON.stringify(response));
        const token: string | null = response?.data?.token || null;
        if (token) {
          document.cookie = `accessToken=${token}; path=/; max-age=86400`;
          router.push('/ai-chats');
        }
      } catch (error) {
        handleError(error as ErrorResponse);
      }
    },
    onError: (error) => {
      handleError(error as ErrorResponse);
    },
  });

  return (
    <main>
      <div className={styles.authSection}>
        <div className={styles.authContainer}>
          <Container
            maxWidth="lg"
            disableGutters
            className={styles.authContainerInner}
          >
            <Box component="section" className={styles.boxLoginHeading}>
              <div className={styles.formLogo}>
                <Link href={process.env.NEXT_PUBLIC_REDIRECT_URL!}>
                  <Image
                    src="/images/logo.svg"
                    alt="logo"
                    width={290}
                    height={63}
                  />
                </Link>
              </div>
            </Box>

            <Box component="section" className={styles.authMain}>
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
                            fontSize: 'var(--SubTitle-2)',
                            color:
                              errors.first_name && touched.first_name
                                ? 'var(--Red-Color)'
                                : 'var(--Placeholder-Text)',
                            fontWeight: 'var(--Regular)',
                          }}
                        >
                          First Name
                        </Typography>
                        <div style={{ marginBottom: '32px' }}>
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

                        <Typography
                          variant="body2"
                          component="label"
                          htmlFor="last_name"
                          sx={{
                            display: 'block',
                            fontSize: 'var(--SubTitle-2)',
                            color:
                              errors.last_name && touched.last_name
                                ? 'var(--Red-Color)'
                                : 'var(--Placeholder-Text)',
                            fontWeight: 'var(--Regular)',
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
                            error={Boolean(
                              errors.last_name && touched.last_name
                            )}
                            sx={{
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

                        <Typography
                          variant="body2"
                          component="label"
                          htmlFor="email"
                          sx={{
                            display: 'block',
                            fontSize: 'var(--SubTitle-2)',
                            color:
                              errors.email && touched.email
                                ? 'var(--Red-Color)'
                                : 'var(--Placeholder-Text)',
                            fontWeight: 'var(--Regular)',
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
                              '& .MuiFormHelperText-root': {
                                color:
                                  errors.email && touched.email
                                    ? 'var(--Red-Color)'
                                    : 'var(--Placeholder-Text)',
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
                            fontSize: 'var(--SubTitle-2)',
                            color:
                              errors.contact_number && touched.contact_number
                                ? 'var(--Red-Color)'
                                : 'var(--Placeholder-Text)',
                            fontWeight: 'var(--Regular)',
                          }}
                        >
                          Mobile Number
                        </Typography>
                        <div
                          style={{ marginBottom: '24px' }}
                          className={styles.mobileInputBox}
                        >
                          <Field
                            as={TextField}
                            fullWidth
                            type="text"
                            id="contact_number"
                            name="contact_number"
                            placeholder="Enter Mobile Number here"
                            className={styles.mobileInput}
                            error={Boolean(
                              errors.contact_number && touched.contact_number
                            )}
                            inputProps={{
                              maxLength: 10,
                            }}
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
                                paddingLeft: '5px',
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
                              '& .MuiFormHelperText-root': {
                                color:
                                  errors.contact_number &&
                                  touched.contact_number
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
                                    onChange={(e) =>
                                      setCountryCode(e.target.value)
                                    }
                                    MenuProps={{
                                      disableScrollLock: true,
                                    }}
                                    sx={{
                                      padding: '0px',
                                      color: 'var(--Placeholder-Text)',
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

                        <Typography
                          variant="body2"
                          component="label"
                          htmlFor="password"
                          sx={{
                            display: 'block',
                            fontSize: 'var(--SubTitle-2)',
                            color:
                              errors.password && touched.password
                                ? 'var(--Red-Color)'
                                : 'var(--Placeholder-Text)',
                            fontWeight: 'var(--Regular)',
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
                              '& .MuiFormHelperText-root': {
                                color:
                                  errors.password && touched.password
                                    ? 'var(--Red-Color)'
                                    : 'var(--Placeholder-Text)',
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
                                      <Visibility
                                        sx={{
                                          color: 'var(--Primary-Text-Color)',
                                        }}
                                      />
                                    ) : (
                                      <VisibilityOff
                                        sx={{
                                          color: 'var(--Primary-Text-Color)',
                                        }}
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
                            fontSize: 'var(--SubTitle-2)',
                            color:
                              errors.confirm_password &&
                              touched.confirm_password
                                ? 'var(--Red-Color)'
                                : 'var(--Placeholder-Text)',
                            fontWeight: 'var(--Regular)',
                          }}
                        >
                          Confirm Password
                        </Typography>
                        <Box
                          sx={{
                            marginBottom: '32px', // Default (above 550px)
                            '@media (max-width:550px)': {
                              marginBottom: '24px', // When screen is 550px or smaller
                            },
                          }}
                        >
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
                              '& .MuiFormHelperText-root': {
                                color:
                                  errors.confirm_password &&
                                  touched.confirm_password
                                    ? 'var(--Red-Color)'
                                    : 'var(--Placeholder-Text)',
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
                                      <Visibility
                                        sx={{
                                          color: 'var(--Primary-Text-Color)',
                                        }}
                                      />
                                    ) : (
                                      <VisibilityOff
                                        sx={{
                                          color: 'var(--Primary-Text-Color)',
                                        }}
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
                        </Box>

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
                            disabled={loadingSignup}
                          >
                            {loadingSignup ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              'Signup'
                            )}
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
                      onClick={() => googleLogin()}
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
                <Typography
                  variant="h4"
                  gutterBottom
                  className={styles.signupMember}
                >
                  Already a Member?
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                  Login now to access your account.
                </Typography>
              </div>
              <Button
                variant="contained"
                className={`btn btn-secondary `}
                onClick={() => {
                  setLoadingLogin(true);
                  dispatch(setLoader(true));
                  setTimeout(() => {
                    router.push('/login');
                    dispatch(setLoader(false));
                  }, 1000);
                }}
                disabled={loadingLogin}
              >
                {loadingLogin ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Click Here to Login'
                )}
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
