import React, { useState } from 'react';
import styles from './style.module.scss';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Background-Color)',
    margin: '0px',
    border: '1px solid var(--Stroke-Color)',
    borderRadius: '16px',
    minWidth: '850px',
    minHeight: '550px',
    // maxWidth: '90vw',
    // Responsive styles
    [theme.breakpoints.down('md')]: {
      maxWidth: '90vw',
      minWidth: '580px',
      minHeight: '450px',
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90vw',
      minWidth: '80vw',
      minHeight: 'auto',
    },
  },
}));

export default function HeaderDialog() {
  const [open, setOpen] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [activeTab, setActiveTab] = useState('setting');

  const [showPassword, setShowPassword] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [showNextSlide, setShowNextSlide] = useState(false);

  const handleContinueClick = () => {
    if (inputValue === 'DELETE') {
      setShowNextSlide(true);
    } else {
      alert('Please type DELETE to proceed.');
    }
  };
  const handleBackClick = () => {
    setShowNextSlide(false); // Go back to input form
    setInputValue(''); // Reset input value
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Settings
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className={styles.headerDialogBox}
        sx={{
          background: 'rgb(17 16 27 / 0%)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <Box component="div" className={styles.dialogHeader}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Settings
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
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
        <DialogContent dividers className={styles.dialogBody}>
          <Box component="div" className={styles.dialogSidebar}>
            <Box component="div" className={styles.dialogSidebarHeader}>
              <Typography variant="h6" className={styles.dialogSemiTitle}>
                General settings
              </Typography>
              <Box component="div" className={styles.dialogSidebarContent}>
                <Button
                  onClick={() => setActiveTab('setting')}
                  className={` ${activeTab === 'setting' ? styles.active : ''}`}
                >
                  <Image
                    src="/images/setting.svg"
                    alt="setting.svg"
                    width={18}
                    height={18}
                    style={{ marginRight: '4px' }}
                  />
                  <Typography>My Profile</Typography>
                  <Image
                    src="/images/arrow-down-right.svg"
                    alt="user"
                    width={16}
                    height={16}
                  />
                </Button>
                <Button
                  onClick={() => setActiveTab('password')}
                  className={` ${activeTab === 'password' ? styles.active : ''}`}
                >
                  <Image
                    src="/images/setting.svg"
                    alt="setting.svg"
                    width={18}
                    height={18}
                    style={{ marginRight: '4px' }}
                  />
                  <Typography>Change Password</Typography>
                  <Image
                    src="/images/arrow-down-right.svg"
                    alt="user"
                    width={16}
                    height={16}
                  />
                </Button>
              </Box>
            </Box>
            <Box component="div" className={styles.dialogSidebarHeader}>
              <Typography variant="h6" className={styles.dialogSemiTitle}>
                Danger ZONe
              </Typography>
              <Box component="div" className={styles.dialogSidebarContent}>
                <Button
                  onClick={() => setActiveTab('delete')}
                  className={` ${activeTab === 'delete' ? styles.active : ''}`}
                >
                  <Image
                    src="/images/setting.svg"
                    alt="setting.svg"
                    width={18}
                    height={18}
                    style={{ marginRight: '4px' }}
                  />
                  <Typography>Delete Account</Typography>
                  <Image
                    src="/images/arrow-down-right.svg"
                    alt="user"
                    width={16}
                    height={16}
                  />
                </Button>
              </Box>
            </Box>
          </Box>

          <Box component="div" className={styles.dialogFormBox}>
            {activeTab === 'setting' && (
              <>
                <Box component="div" className={styles.dialogFormContent}>
                  <Box>
                    <Avatar
                      alt="Pravin Lagariya"
                      src="/static/images/avatar/2.jpg"
                      sx={{
                        backgroundColor: 'var(--Primary-Text-Color)',
                        color: 'var(--Card-Color)',
                        fontSize: 'var(--Heading-2)',
                        fontWeight: 'var(--Medium)',
                        padding: '13px 15px',
                        lineHeight: '140%',
                        marginBottom: '28px',
                        width: '60px',
                        height: '60px',
                      }}
                    />
                  </Box>
                  <form className={styles.dialogFormInner}>
                    <div className={styles.dialogFormGroup}>
                      <Typography
                        variant="body2"
                        component="label"
                        htmlFor="email"
                        className={styles.formLabel}
                        sx={
                          {
                            // color:
                            //   errors.email && touched.email
                            //     ? '#ff4d4d'
                            //     : 'var(--Subtext-Color)',
                          }
                        }
                      >
                        First Name
                      </Typography>
                      <TextField
                        // as={TextField}
                        fullWidth
                        type="text"
                        id="first_name"
                        name="first_name"
                        placeholder="Elliot"
                        // error={Boolean(errors.first_name && touched.first_name)}
                        sx={{
                          marginTop: '4px',
                          padding: '0',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            borderWidth: '0px',
                            color: 'var(--Primary-Text-Color)',
                            backgroundColor: 'var(--Input-Box-Colors)',
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
                              borderColor: '#fff',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#fff',
                              borderWidth: '1px',
                              color: '#fff',
                            },
                          },
                          // '& .MuiFormHelperText-root': {
                          //   color:
                          //     errors.first_name && touched.first_name
                          //       ? '#ff4d4d'
                          //       : '#b0b0b0',
                          // },
                        }}
                      />
                    </div>
                    <div className={styles.dialogFormGroup}>
                      <Typography
                        variant="body2"
                        component="label"
                        htmlFor="email"
                        className={styles.formLabel}
                        sx={
                          {
                            // color:
                            //   errors.email && touched.email
                            //     ? '#ff4d4d'
                            //     : 'var(--Subtext-Color)',
                          }
                        }
                      >
                        Last Name
                      </Typography>
                      <TextField
                        // as={TextField}
                        fullWidth
                        type="text"
                        id="first_name"
                        name="first_name"
                        placeholder="Elderson"
                        // error={Boolean(errors.first_name && touched.first_name)}
                        sx={{
                          marginTop: '4px',
                          padding: '0',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            borderWidth: '0px',
                            color: 'var(--Primary-Text-Color)',
                            backgroundColor: 'var(--Input-Box-Colors)',
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
                              borderColor: '#fff',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#fff',
                              borderWidth: '1px',
                              color: '#fff',
                            },
                          },
                          // '& .MuiFormHelperText-root': {
                          //   color:
                          //     errors.first_name && touched.first_name
                          //       ? '#ff4d4d'
                          //       : '#b0b0b0',
                          // },
                        }}
                      />
                    </div>
                    <div className={styles.dialogFormGroup}>
                      <Typography
                        variant="body2"
                        component="label"
                        htmlFor="email"
                        className={styles.formLabel}
                        sx={
                          {
                            // color:
                            //   errors.email && touched.email
                            //     ? '#ff4d4d'
                            //     : 'var(--Subtext-Color)',
                          }
                        }
                      >
                        Email Address
                      </Typography>
                      <TextField
                        // as={TextField}
                        fullWidth
                        type="text"
                        id="first_name"
                        name="first_name"
                        placeholder="samsepiol@ecorp.com"
                        // error={Boolean(errors.first_name && touched.first_name)}
                        sx={{
                          marginTop: '4px',
                          padding: '0',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            borderWidth: '0px',
                            color: 'var(--Primary-Text-Color)',
                            backgroundColor: 'var(--Input-Box-Colors)',
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
                              borderColor: '#fff',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#fff',
                              borderWidth: '1px',
                              color: '#fff',
                            },
                          },
                          // '& .MuiFormHelperText-root': {
                          //   color:
                          //     errors.first_name && touched.first_name
                          //       ? '#ff4d4d'
                          //       : '#b0b0b0',
                          // },
                        }}
                      />
                    </div>
                    <div className={styles.dialogFormGroup}>
                      <Typography
                        variant="body2"
                        component="label"
                        htmlFor="email"
                        className={styles.formLabel}
                        sx={
                          {
                            // color:
                            //   errors.email && touched.email
                            //     ? '#ff4d4d'
                            //     : 'var(--Subtext-Color)',
                          }
                        }
                      >
                        Mobile No
                      </Typography>
                      <TextField
                        fullWidth
                        type="text"
                        id="contact_number"
                        name="contact_number"
                        placeholder="Enter Mobile Number here"
                        sx={{
                          marginTop: '5px',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            borderWidth: '0px',
                            color: '#fff',
                            backgroundColor: 'var(--Input-Box-Colors)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              top: '-10px !important',
                            },
                            '& .MuiOutlinedInput-input': {
                              fontSize: 'var(--SubTitle-2)',
                              color: '#fff',
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
                              borderColor: '#fff',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#fff',
                              borderWidth: '1px',
                              color: '#fff',
                            },
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Select
                                value={countryCode}
                                className="select-new"
                                onChange={(e) => setCountryCode(e.target.value)}
                                sx={{
                                  padding: '0px',
                                  color: '#b0b0b0',
                                  fontWeight: 'var(--Bold)',
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
                    </div>
                  </form>
                </Box>
                <Box component="div" className={styles.dialogFormButtonBox}>
                  <Button className={styles.formCancelBtn}>Cancel</Button>
                  <Button className={styles.formSaveBtn}>Save Changes</Button>
                </Box>
              </>
            )}

            {activeTab === 'password' && (
              <>
                <Box component="div" className={styles.dialogFormContent}>
                  <form className={styles.dialogFormInner}>
                    <div className={styles.dialogFormGroup}>
                      <Typography
                        variant="body2"
                        component="label"
                        htmlFor="email"
                        className={styles.formLabel}
                        sx={
                          {
                            // color:
                            //   errors.email && touched.email
                            //     ? '#ff4d4d'
                            //     : 'var(--Subtext-Color)',
                          }
                        }
                      >
                        Current Password
                      </Typography>
                      <TextField
                        // as={TextField}
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder="*******************"
                        // error={Boolean(errors.password && touched.password)}
                        sx={{
                          marginTop: '4px',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            borderWidth: '0px',
                            color: 'var(--Primary-Text-Color)',
                            backgroundColor: 'var(--Input-Box-Colors)',
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
                              borderColor: '#fff',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#fff',
                              borderWidth: '1px',
                              color: '#fff',
                            },
                          },
                          // '& .MuiFormHelperText-root': {
                          //   color:
                          //     errors.password && touched.password
                          //       ? '#ff4d4d'
                          //       : '#b0b0b0',
                          // },
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                                sx={{
                                  padding: '0',
                                  width: '20px',
                                  margin: '0',
                                }}
                              >
                                {showPassword ? (
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
                    </div>
                    <br />
                    <div className={styles.dialogFormGroup}>
                      <Typography
                        variant="body2"
                        component="label"
                        htmlFor="email"
                        className={styles.formLabel}
                        sx={
                          {
                            // color:
                            //   errors.email && touched.email
                            //     ? '#ff4d4d'
                            //     : 'var(--Subtext-Color)',
                          }
                        }
                      >
                        New Password*
                      </Typography>
                      <TextField
                        // as={TextField}
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder="*******************"
                        // error={Boolean(errors.password && touched.password)}
                        sx={{
                          marginTop: '4px',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            borderWidth: '0px',
                            color: 'var(--Primary-Text-Color)',
                            backgroundColor: 'var(--Input-Box-Colors)',
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
                              borderColor: '#fff',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#fff',
                              borderWidth: '1px',
                              color: '#fff',
                            },
                          },
                          // '& .MuiFormHelperText-root': {
                          //   color:
                          //     errors.password && touched.password
                          //       ? '#ff4d4d'
                          //       : '#b0b0b0',
                          // },
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                                sx={{
                                  padding: '0',
                                  width: '20px',
                                  margin: '0',
                                }}
                              >
                                {showPassword ? (
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
                    </div>
                    <div className={styles.dialogFormGroup}>
                      <Typography
                        variant="body2"
                        component="label"
                        htmlFor="email"
                        className={styles.formLabel}
                        sx={
                          {
                            // color:
                            //   errors.email && touched.email
                            //     ? '#ff4d4d'
                            //     : 'var(--Subtext-Color)',
                          }
                        }
                      >
                        Repeat New Password*
                      </Typography>
                      <TextField
                        // as={TextField}
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder="*******************"
                        // error={Boolean(errors.password && touched.password)}
                        sx={{
                          marginTop: '4px',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            borderWidth: '0px',
                            color: 'var(--Primary-Text-Color)',
                            backgroundColor: 'var(--Input-Box-Colors)',
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
                              borderColor: '#fff',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#fff',
                              borderWidth: '1px',
                              color: '#fff',
                            },
                          },
                          // '& .MuiFormHelperText-root': {
                          //   color:
                          //     errors.password && touched.password
                          //       ? '#ff4d4d'
                          //       : '#b0b0b0',
                          // },
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                                sx={{
                                  padding: '0',
                                  width: '20px',
                                  margin: '0',
                                }}
                              >
                                {showPassword ? (
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
                    </div>
                  </form>
                </Box>
                <Box component="div" className={styles.dialogFormButtonBox}>
                  <Button className={styles.formSaveBtn}>
                    Update Password
                  </Button>
                </Box>
              </>
            )}

            {activeTab === 'delete' && (
              <>
                {!showNextSlide ? (
                  <>
                    <Box component="div" className={styles.dialogFormContent}>
                      <Box>
                        <Typography className={styles.accountDeletTitle}>
                          Delete Your Account
                        </Typography>
                        <Typography
                          variant="body1"
                          className={styles.accountFormDetails}
                        >
                          This action will delete all your files, chats and
                          information from Exfiles servers. This action can not
                          be Undone. If you want to continue please type
                          “DELETE” in the text box below.
                        </Typography>
                      </Box>
                      <form className={styles.dialogFormInner}>
                        <div
                          className={`${styles.dialogFormGroup} ${styles.dialogFormFull}`}
                        >
                          <TextField
                            // as={TextField}
                            fullWidth
                            type="text"
                            id="first_name"
                            name="first_name"
                            placeholder=""
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            // error={Boolean(errors.first_name && touched.first_name)}
                            sx={{
                              marginTop: '0px',
                              padding: '0',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                borderWidth: '0px',
                                color: 'var(--Primary-Text-Color)',
                                backgroundColor: 'var(--Input-Box-Colors)',
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
                                  borderColor: '#fff',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#fff',
                                  borderWidth: '1px',
                                  color: '#fff',
                                },
                              },
                              // '& .MuiFormHelperText-root': {
                              //   color:
                              //     errors.first_name && touched.first_name
                              //       ? '#ff4d4d'
                              //       : '#b0b0b0',
                              // },
                            }}
                          />
                        </div>
                      </form>
                    </Box>
                    <Box component="div" className={styles.dialogFormButtonBox}>
                      <Button
                        onClick={handleContinueClick}
                        className={styles.formSaveBtn}
                      >
                        Continue
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box component="div" className={styles.dialogFormContent}>
                      <Box>
                        <Typography className={styles.accountDeletTitle}>
                          Delete Your Account
                        </Typography>
                        <Typography
                          variant="body1"
                          className={styles.accountFormDetails}
                        >
                          We have sent you an OTP on your registered mobile
                          number. Please enter OTP below to continue.
                        </Typography>
                      </Box>
                      <form
                        className={`${styles.dialogFormInner} ${styles.dialogFormOpt}`}
                      >
                        <TextField
                          // as={TextField}
                          // key={index}
                          variant="outlined"
                          type="text"
                          // value={digit}
                          // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          //   handleChange(index, e)
                          // }
                          // onKeyDown={(
                          //   e: React.KeyboardEvent<HTMLInputElement>
                          // ) => handleKeyDown(index, e)}
                          // inputRef={(el: HTMLInputElement | null) =>
                          //   (inputRefs.current[index] = el)
                          // }
                          sx={{
                            height: '48px',
                            width: '48px',
                            textAlign: 'center',
                            fontSize: 'var(--Heading-3)',
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'transparent',
                              color: 'var(--Txt-On-Gradient)',
                              borderRadius: '8px',
                              textAlign: 'center',
                              '& fieldset': {
                                borderColor: 'var(--Stroke-Color)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'var(--Txt-On-Gradient)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#fff',
                                borderWidth: '2px',
                              },
                            },
                          }}
                          inputProps={{
                            maxLength: 1,
                            style: { textAlign: 'center' },
                          }}
                        />

                        <TextField
                          variant="outlined"
                          type="text"
                          sx={{
                            height: '48px',
                            width: '48px',
                            textAlign: 'center',
                            fontSize: 'var(--Heading-3)',
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'transparent',
                              color: 'var(--Txt-On-Gradient)',
                              borderRadius: '8px',
                              textAlign: 'center',
                              '& fieldset': {
                                borderColor: 'var(--Stroke-Color)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'var(--Txt-On-Gradient)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#fff',
                                borderWidth: '2px',
                              },
                            },
                          }}
                          inputProps={{
                            maxLength: 1,
                            style: { textAlign: 'center' },
                          }}
                        />

                        <TextField
                          variant="outlined"
                          type="text"
                          sx={{
                            height: '48px',
                            width: '48px',
                            textAlign: 'center',
                            fontSize: 'var(--Heading-3)',
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'transparent',
                              color: 'var(--Txt-On-Gradient)',
                              borderRadius: '8px',
                              textAlign: 'center',
                              '& fieldset': {
                                borderColor: 'var(--Stroke-Color)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'var(--Txt-On-Gradient)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#fff',
                                borderWidth: '2px',
                              },
                            },
                          }}
                          inputProps={{
                            maxLength: 1,
                            style: { textAlign: 'center' },
                          }}
                        />

                        <TextField
                          variant="outlined"
                          type="text"
                          sx={{
                            height: '48px',
                            width: '48px',
                            textAlign: 'center',
                            fontSize: 'var(--Heading-3)',
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'transparent',
                              color: 'var(--Txt-On-Gradient)',
                              borderRadius: '8px',
                              textAlign: 'center',
                              '& fieldset': {
                                borderColor: 'var(--Stroke-Color)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'var(--Txt-On-Gradient)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#fff',
                                borderWidth: '2px',
                              },
                            },
                          }}
                          inputProps={{
                            maxLength: 1,
                            style: { textAlign: 'center' },
                          }}
                        />
                      </form>
                      <Link
                        href="#"
                        className="link-primary"
                        // onClick={resendOtp}
                        style={{
                          cursor: 'pointer',
                          color: 'var(--Placeholder-Text)',
                          textDecoration: 'underline',
                          marginTop: '32px',
                          display: 'inline-block',
                        }}
                      >
                        Resend OTP? (00:59)
                      </Link>
                    </Box>
                    <Box
                      component="div"
                      className={`${styles.dialogFormButtonBox} ${styles.dialogDeletButtonBox}`}
                    >
                      <Button
                        className={styles.formBackBtn}
                        onClick={handleBackClick}
                      >
                        <Image
                          src="/images/arrow-left.svg"
                          alt="left arrow"
                          width={16}
                          height={16}
                          style={{ marginRight: '4px' }}
                        />{' '}
                        Back
                      </Button>
                      <Button
                        className={`${styles.formSaveBtn} ${styles.formDeletBtn}`}
                      >
                        Delete Account
                      </Button>
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
