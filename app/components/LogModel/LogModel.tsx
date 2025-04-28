import React, { useState } from 'react';
import LogStyle from './logmodel.module.scss';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import { DesktopDateTimePicker } from '@mui/x-date-pickers';
import '@mui/x-date-pickers/themeAugmentation';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid #3a3948',
    borderRadius: '16px',
    minWidth: '650px',
    maxHeight: '95dvh',

    // '@media (max-width: 1024px)': {
    //   maxWidth: '80vw',
    //   minWidth: '700px',
    //   minHeight: '500px',
    // },
    '@media (max-width: 768px)': {
      maxWidth: '80vw',
      minWidth: '480px', // 90% of the viewport width
    },
    '@media (max-width: 500px)': {
      maxWidth: '80vw',
      minWidth: '450px', // 90% of the viewport width
    },
    '@media (max-width: 480px)': {
      maxWidth: '95vw',
      minWidth: '100%', // Almost full width
    },
  },
}));

const newTheme = (theme: Theme) =>
  createTheme({
    ...theme,
    components: {
      MuiPickersCalendarHeader: {
        styleOverrides: {
          root: {
            backgroundColor: 'none',
            color: 'var(--Primary-Text-Color)',
            borderBottom: '1px solid var(--Stroke-Color)',
            '& button': {
              svg: {
                color: 'var(--Primary-Text-Color)',
              },
            },
          },
          label: {
            fontSize: 'var(--SubTitle-2)',
            fontWeight: 'var(--Medium)',
          },
        },
      },
      MuiYearCalendar: {
        styleOverrides: {
          root: {
            maxWidth: '100%',
          },
        },
      },
      MuiPickersFadeTransitionGroup: {
        styleOverrides: {
          root: {
            '& .MuiDayCalendar-header': {
              span: {
                color: 'var(--Primary-Text-Color)',
              },
            },
            button: {
              backgroundColor: 'var(--Card-Color)',
              padding: '5px 10px',
              fontSize: 'var(--SubTitle-3)',
              color: 'var(--Primary-Text-Color)',
              border: '1px solid transparent',
              '&:hover': {
                borderColor: 'var(--Card-Border)',
                color: 'var(--Primary-Text-Color)',
              },
              '&[aria-checked="true"].Mui-selected': {
                backgroundColor: 'var(--Card-Border)',
                color: 'var(--Primary-Text-Color)',
                '&:hover': {
                  backgroundColor: 'var(--Card-Border)',
                  color: 'var(--Primary-Text-Color)',
                },
              },
              '&.MuiPickersDay-today': {
                backgroundColor: 'var(--Card-Border)',
                color: 'var(--Primary-Text-Color)',
              },
            },
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            color: 'var(--Primary-Text-Color)',
            fontWeight: 'bold',
            '&:hover': {
              border: '1px solid var(--Card-Border)',
              color: 'var(--Primary-Text-Color)',
            },
            '&[aria-selected="true"].Mui-selected': {
              backgroundColor: 'var(--Card-Border)',
              color: 'var(--Primary-Text-Color)',
              '&:hover': {
                backgroundColor: 'var(--Card-Border)',
                border: '1px solid var(--Card-Border)',
                color: 'var(--Primary-Text-Color)',
              },
            },
            '&[aria-current="date"].MuiPickersDay-today': {
              border: '1px solid var(--Card-Border)',
              backgroundColor: 'transparent',
              color: 'var(--Primary-Text-Color)',
            },
          },
        },
      },
      MuiDateCalendar: {
        styleOverrides: {
          root: {
            color: 'inset',
            borderRadius: '12px 0 0 0',
            border: '1px solid var(--Stroke-Color)',
            borderBottom: '0',
            backgroundColor: 'var(--Card-Color)',
            maxWidth: '100%',
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            color: 'inset',
            borderRadius: '0 0 12px 12px',
            border: '1px solid var(--Stroke-Color)',
            backgroundColor: 'var(--Card-Color)',
            maxWidth: '100%',
            button: {
              color: 'var(--Card-Border)',
              fontSize: 'var(--SubTitle-3)',
              fontWeight: 'var(--Bold)',
              '&:first-child': {
                color: 'var(--Primary-Text-Color)',
                fontWeight: 'var(--Lighter)',
              },
            },
          },
        },
      },
      MuiMultiSectionDigitalClock: {
        styleOverrides: {
          root: {
            color: 'inset',
            borderRadius: '0 12px 0 0',
            border: '1px solid var(--Stroke-Color)',
            borderLeft: '0',
            borderBottom: '0',
            backgroundColor: 'var(--Card-Color)',
            maxWidth: '100%',
            ul: {
              overflowY: 'auto',
              width: '100%',
              '&:after': {
                content: 'none',
              },
            },
            li: {
              backgroundColor: 'var(--Card-Color)',
              padding: '5px 10px',
              fontSize: 'var(--SubTitle-3)',
              color: 'var(--Primary-Text-Color)',
              border: '1px solid transparent',
              borderRadius: 12,
              '&:hover': {
                borderColor: 'var(--Card-Border)',
                color: 'var(--Primary-Text-Color)',
              },
              '&[aria-selected="true"].Mui-selected': {
                backgroundColor: 'var(--Card-Border)',
                color: 'var(--Primary-Text-Color)',
                '&:hover': {
                  backgroundColor: 'var(--Card-Border)',
                  color: 'var(--Primary-Text-Color)',
                },
              },
              '&.MuiPickersDay-today': {
                backgroundColor: 'var(--Card-Border)',
                color: 'var(--Primary-Text-Color)',
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            // Target only the Paper used by PickerPopper
            '&.MuiPickerPopper-paper': {
              backgroundColor: 'transparent', // or 'none'
            },
          },
        },
      },
      MuiPickerPopper: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        },
      },
    },
  });

const peopleOptions = ['John Doe', 'Jane Smith', 'Other'];

export default function LogModel() {
  const [open, setOpen] = React.useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog Log as Incident
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className={LogStyle.headerDialogBox}
        sx={{
          background: 'rgb(17 16 27 / 0%)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <Box className={LogStyle.dialogHeader}>
          <DialogTitle
            sx={{ m: 0, p: 2 }}
            id="customized-dialog-title"
            className={LogStyle.dialogHeaderInner}
          >
            <Box component="div" className={LogStyle.dialogIcon}>
              <Image
                src="/images/log-model.svg"
                alt="logout"
                width={28}
                height={28}
              />
            </Box>
            <Box>
              <Typography variant="h6" className={LogStyle.dialogTitle}>
                Log as Incident
              </Typography>
              <Typography variant="body1" className={LogStyle.dialogSemiTitle}>
                Your thoughts are valuable in helping improve our products.
              </Typography>
            </Box>
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

        <DialogContent className={LogStyle.dialogFormContentBox}>
          <Box>
            <div className={LogStyle.dialogFormGroup}>
              <Typography
                variant="body2"
                component="label"
                htmlFor="description"
                className={LogStyle.dialogFormLabel}
                sx={
                  {
                    // color:
                    //   errors.first_name && touched.first_name
                    //     ? '#ff4d4d'
                    //     : '#676972',
                  }
                }
              >
                Description
              </Typography>
              <TextField
                // as={TextField}
                fullWidth
                type="text"
                id="description"
                name="description"
                placeholder="Enter the incident description"
                // error={Boolean(errors.first_name && touched.first_name)}
                sx={{
                  marginTop: '4px',
                  padding: '0',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    borderWidth: '0px',
                    color: 'var(--Primary-Text-Color)',
                    backgroundColor: '#252431',
                    '& .MuiOutlinedInput-notchedOutline': {
                      top: '-10px !important',
                    },
                    '& .MuiOutlinedInput-input': {
                      fontSize: 'var(--SubTitle-2)',
                      color: 'var(--Primary-Text-Color)',
                      padding: '14px 16px',
                      fontWeight: 'var(--Regular)',
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
                  // '& .MuiFormHelperText-root': {
                  //   color:
                  //     errors.first_name && touched.first_name
                  //       ? '#ff4d4d'
                  //       : '#b0b0b0',
                  // },
                }}
              />
            </div>
            <div className={LogStyle.dialogFormGroup}>
              <Typography
                variant="body2"
                component="label"
                htmlFor="date"
                className={LogStyle.dialogFormLabel}
                sx={
                  {
                    // color:
                    //   errors.first_name && touched.first_name
                    //     ? '#ff4d4d'
                    //     : '#676972',
                  }
                }
              >
                Date & Time
              </Typography>
              <ThemeProvider theme={newTheme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'stretch',
                      border: '1px solid #444',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--Input-Box-Colors)',
                      width: '100%',
                    }}
                  >
                    <DesktopDateTimePicker
                      className={LogStyle['data-input']}
                      format="MM/DD/YYYY HH:mm:ss"
                      slotProps={{
                        textField: {
                          placeholder: 'MM/DD/YYYY & HH:MM:SS',
                          sx: {
                            width: '100%',
                            textTransform: 'uppercase',
                            '& .MuiPickersInputBase-root': {
                              padding: '4px',
                            },
                            '& .MuiPickersSectionList-root': {
                              color: 'var(--Primary-Text-Color)',
                              borderRadius: '8px',
                              padding: '10px 0 10px 8px',
                              fontSize: 'var(--SubTitle-2)',
                              fontWeight: 'var(--Regular)',

                              '& span': {
                                fontFamily: 'var(--font-fustat)',
                              },
                            },
                            '& .MuiInputAdornment-root': {
                              padding: '6px',
                              backgroundColor: 'var(--Card-Color)',
                              color: 'var(--Primary-Text-Color)',
                              borderRadius: '8px',
                              border: '0.72px solid var(--Stroke-Color)',
                              maxHeight: 'unset',
                              width: '28px',
                              height: '28px',
                              flex: '0 0 auto',
                            },
                            '& .MuiInputAdornment-root button': {
                              padding: '0',
                              color: 'var(--Primary-Text-Color)',
                              backgroundImage:
                                'url(/images/calendar_month.svg)',
                              backgroundSize: 'contain',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center center',
                              borderRadius: '0',
                              width: '13px',
                              height: '14px',
                              flex: '0 0 auto',
                            },
                            '& .MuiInputAdornment-root button svg': {
                              display: 'none',
                            },
                            '& fieldset': {
                              display: 'none',
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </LocalizationProvider>
              </ThemeProvider>
            </div>
            <div className={LogStyle.dialogFormGroup}>
              <Typography
                variant="body2"
                component="label"
                htmlFor="first_name"
                className={LogStyle.dialogFormLabel}
                sx={{
                  display: 'block',
                  fontSize: 'var(--SubTitle-3)',
                  fontWeight: 'var(--Regular)',
                }}
              >
                Quick Tags
              </Typography>
              <Box className={LogStyle['card-options']}>
                <div className={LogStyle['checkbox-card']}>
                  <input type="checkbox" id="Mobile" />
                  <label htmlFor="Mobile">
                    <Image
                      src="/images/missed-visit.svg"
                      alt="Missed Visit"
                      width={20}
                      height={20}
                      className={LogStyle['checkbox-icon']}
                    />
                    <div>Missed Visit</div>
                  </label>
                </div>
                <div className={LogStyle['checkbox-card']}>
                  <input type="checkbox" id="Visit" />
                  <label htmlFor="Visit">
                    <Image
                      src="/images/late-visit.svg"
                      alt="Late Visit"
                      width={20}
                      height={20}
                      className={LogStyle['checkbox-icon']}
                    />
                    <div>Late Visit</div>
                  </label>
                </div>
                <div className={LogStyle['checkbox-card']}>
                  <input type="checkbox" id="Response" />
                  <label htmlFor="Response">
                    <Image
                      src="/images/late-visit.svg"
                      alt="No Response"
                      width={20}
                      height={20}
                      className={LogStyle['checkbox-icon']}
                    />
                    <div>No Response</div>
                  </label>
                </div>
                <div className={LogStyle['checkbox-card']}>
                  <input type="checkbox" id="Denied" />
                  <label htmlFor="Denied">
                    <Image
                      src="/images/denied-call.svg"
                      alt="Denied Call"
                      width={20}
                      height={20}
                      className={LogStyle['checkbox-icon']}
                    />
                    <div>Denied Call</div>
                  </label>
                </div>
                <div className={LogStyle['checkbox-card']}>
                  <input type="checkbox" id="Safety" />
                  <label htmlFor="Safety">
                    <Image
                      src="/images/safety-concerns.svg"
                      alt="Safety Concerns"
                      width={20}
                      height={20}
                      className={LogStyle['checkbox-icon']}
                    />
                    <div>Safety Concerns</div>
                  </label>
                </div>
                <div
                  className={LogStyle['checkbox-card']}
                  onChange={(e) =>
                    setIsChecked((e.target as HTMLInputElement).checked)
                  }
                >
                  <input type="checkbox" id="Other" />
                  <label htmlFor="Other">
                    <Image
                      src="/images/other.svg"
                      alt="close icon"
                      width={20}
                      height={20}
                      className={LogStyle['checkbox-icon']}
                    />
                    <div>Other</div>
                  </label>
                </div>
                {/* {isChecked && ( */}
                <div
                  className={`${LogStyle['specify-input']} ${
                    isChecked ? LogStyle['specify-input-show'] : ''
                  }`}
                >
                  <TextField
                    // as={TextField}
                    fullWidth
                    type="text"
                    id="other"
                    name="other"
                    placeholder="Please Specify"
                    // error={Boolean(errors.first_name && touched.first_name)}
                    sx={{
                      marginTop: '4px',
                      padding: '0',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        borderWidth: '0px',
                        color: 'var(--Primary-Text-Color)',
                        backgroundColor: '#252431',
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
                      // '& .MuiFormHelperText-root': {
                      //   color:
                      //     errors.first_name && touched.first_name
                      //       ? '#ff4d4d'
                      //       : '#b0b0b0',
                      // },
                    }}
                  />
                </div>
                {/* )} */}
              </Box>
            </div>
          </Box>
          <Accordion className={LogStyle.accordionBox}>
            <AccordionSummary
              expandIcon={
                <Image
                  className={LogStyle['img-none']}
                  src="/images/arrow-down.svg"
                  alt="expand-collapse"
                  width={16}
                  height={16}
                />
              }
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span">Optional Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={LogStyle.dialogFormGroup}>
                <Typography
                  variant="body2"
                  component="label"
                  htmlFor="first_name"
                  className={LogStyle.dialogFormLabel}
                  sx={
                    {
                      // color:
                      //   errors.first_name && touched.first_name
                      //     ? '#ff4d4d'
                      //     : '#676972',
                    }
                  }
                >
                  Location
                </Typography>
                <TextField
                  // as={TextField}
                  fullWidth
                  type="text"
                  id="first_name"
                  name="first_name"
                  placeholder="Enter Location "
                  // error={Boolean(errors.first_name && touched.first_name)}
                  sx={{
                    marginTop: '4px',
                    padding: '0',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      borderWidth: '0px',
                      color: 'var(--Primary-Text-Color)',
                      backgroundColor: '#252431',
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
                    // '& .MuiFormHelperText-root': {
                    //   color:
                    //     errors.first_name && touched.first_name
                    //       ? '#ff4d4d'
                    //       : '#b0b0b0',
                    // },
                  }}
                />
              </div>
              <div className={LogStyle.dialogFormGroup}>
                <Typography
                  variant="body2"
                  component="label"
                  htmlFor="involved"
                  className={LogStyle.dialogFormLabel}
                  sx={
                    {
                      // color:
                      //   errors.first_name && touched.first_name
                      //     ? '#ff4d4d'
                      //     : '#676972',
                    }
                  }
                >
                  Person Involved
                </Typography>
                <TextField
                  // as={TextField}
                  fullWidth
                  type="text"
                  id="involved"
                  name="involved"
                  placeholder="Enter Names of persons involved in this incident "
                  // error={Boolean(errors.first_name && touched.first_name)}
                  sx={{
                    marginTop: '4px',
                    padding: '0',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      borderWidth: '0px',
                      color: 'var(--Primary-Text-Color)',
                      backgroundColor: '#252431',
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
                    // '& .MuiFormHelperText-root': {
                    //   color:
                    //     errors.first_name && touched.first_name
                    //       ? '#ff4d4d'
                    //       : '#b0b0b0',
                    // },
                  }}
                />
              </div>
              <div className={LogStyle.dialogFormGroupMain}>
                <div className={LogStyle.dialogFormGroup}>
                  <Typography
                    variant="body2"
                    component="label"
                    htmlFor="category"
                    className={LogStyle.dialogFormLabel}
                    sx={
                      {
                        // color:
                        //   errors.first_name && touched.first_name
                        //     ? '#ff4d4d'
                        //     : '#676972',
                      }
                    }
                  >
                    Document Category
                  </Typography>
                  <Select
                    id="category"
                    name="category"
                    value={selectedPerson}
                    onChange={(e) => setSelectedPerson(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Person Involved' }}
                    sx={{
                      backgroundColor: '#252431',
                      borderRadius: '12px',
                      fontSize: 'var(--SubTitle-3)',
                      fontWeight: 'var(--Regular)',
                      color: 'var(--Primary-Text-Color)',
                      width: '100%',
                      '& .MuiOutlinedInput-notchedOutline': {
                        top: '-10px !important',
                        borderColor: '#3A3948',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#fff',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#fff',
                        borderWidth: '1px',
                      },
                      '& .MuiSelect-select': {
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                      },
                      '& .MuiSelect-placeholder': {
                        color: '#888',
                        fontWeight: 400,
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Choose Category
                    </MenuItem>
                    {peopleOptions.map((person, idx) => (
                      <MenuItem key={idx} value={person}>
                        {person}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className={LogStyle.dialogFormGroup}>
                  <Typography
                    variant="body2"
                    component="label"
                    htmlFor="category"
                    className={LogStyle.dialogFormLabel}
                    sx={
                      {
                        // color:
                        //   errors.first_name && touched.first_name
                        //     ? '#ff4d4d'
                        //     : '#676972',
                      }
                    }
                  >
                    Document Category
                  </Typography>
                  <Select
                    id="category"
                    name="category"
                    value={selectedPerson}
                    onChange={(e) => setSelectedPerson(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Person Involved' }}
                    sx={{
                      backgroundColor: '#252431',
                      borderRadius: '12px',
                      fontSize: 'var(--SubTitle-3)',
                      fontWeight: 'var(--Regular)',
                      color: 'var(--Primary-Text-Color)',
                      width: '100%',
                      '& .MuiOutlinedInput-notchedOutline': {
                        top: '-10px !important',
                        borderColor: '#3A3948',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#fff',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#fff',
                        borderWidth: '1px',
                      },
                      '& .MuiSelect-select': {
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                      },
                      '& .MuiSelect-placeholder': {
                        color: '#888',
                        fontWeight: 400,
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Choose Category
                    </MenuItem>
                    {peopleOptions.map((person, idx) => (
                      <MenuItem key={idx} value={person}>
                        {person}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div className={LogStyle.dialogFormGroup}>
                <Typography
                  variant="body2"
                  className={LogStyle.dialogFormLabel}
                  sx={{
                    display: 'block',
                    fontSize: 'var(--SubTitle-3)',
                    fontWeight: 'var(--Regular)',
                  }}
                >
                  Support Evidence
                </Typography>
                <Box
                  className={`${LogStyle.dialogContent}`}
                  role="button"
                  tabIndex={0}
                  style={{
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <Box>
                    <Image
                      src="/images/Upload-img.png"
                      alt="Upload-img"
                      width={51}
                      height={55}
                    />
                    <Typography gutterBottom>
                      Click here to upload Supported Evidences
                    </Typography>
                  </Box>
                </Box>
              </div>
            </AccordionDetails>
          </Accordion>
        </DialogContent>

        <DialogActions className={LogStyle.dialogFormButtonBoxMain}>
          <Box component="div" className={LogStyle.dialogFormButtonBox}>
            <Button className={LogStyle.formCancelBtn} onClick={handleClose}>
              Cancel
            </Button>
            <Button className="btn btn-primary" type="submit">
              Save
            </Button>
          </Box>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
