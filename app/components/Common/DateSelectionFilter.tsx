import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { deepmerge } from '@mui/utils';
import { Box, Button, Typography } from '@mui/material';
import Style from '@components/Common/Sidebar.module.scss';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

export default function DateSelectionFilter({
  isFilterVisible,
  setIsFilterVisible,
  isFilterSelected,
  setIsFilterSelected,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  onApply,
  onClear,
}: {
  isFilterVisible: boolean;
  setIsFilterVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterSelected: boolean;
  setIsFilterSelected: React.Dispatch<React.SetStateAction<boolean>>;
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
  setFromDate: (date: Dayjs | null) => void;
  setToDate: (date: Dayjs | null) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  const baseTheme = createTheme();
  const isDisabledFilter = !(fromDate && toDate);
  const [isFromDatePickerOpen, setIsFromDatePickerOpen] = useState(false);
  const [isToDatePickerOpen, setIsToDatePickerOpen] = useState(false);
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
              '& .MuiDayCalendar-header span': {
                color: 'var(--Primary-Text-Color)', // your desired style
                fontWeight: 'var(--Medium)',
                fontSize: 'var(--SubTitle-3)',
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
                  color: 'var(--Txt-On-Gradient)',
                  '&:hover': {
                    backgroundColor: 'var(--Card-Border)',
                    color: 'var(--Txt-On-Gradient)',
                  },
                },
                '&.MuiPickersDay-today': {
                  backgroundColor: 'var(--Card-Border)',
                  color: 'var(--Primary-Text-Color)',
                },
              },
              '& .Mui-disabled:not(.Mui-selected)': {
                color: 'var(--Primary-Text-Color) !important',
                opacity: '0.5',
              },
            },
          },
        },
        MuiPickersDay: {
          styleOverrides: {
            root: {
              color: 'var(--Primary-Text-Color)',
              fontWeight: 'var(--Bold)',
              '&:hover': {
                border: '1px solid var(--Card-Border)',
                color: 'var(--Primary-Text-Color)',
              },
              '&.Mui-disabled:not(.Mui-selected)': {
                color: 'var(--Primary-Text-Color) !important',
                opacity: '0.5',
              },
              '&[aria-selected="true"].Mui-selected': {
                backgroundColor: 'var(--Card-Border)',
                color: 'var(--Txt-On-Gradient)',
                '&:hover': {
                  backgroundColor: 'var(--Card-Border)',
                  border: '1px solid var(--Card-Border)',
                  color: 'var(--Txt-On-Gradient)',
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
              borderRadius: 12,
              border: '1px solid var(--Stroke-Color)',
              backgroundColor: 'var(--Card-Color)',
              maxWidth: '90%',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              // Target only the Paper used by PickerPopper
              '&.MuiPickerPopper-paper': {
                backgroundColor: 'transparent', // or 'none'
                boxShadow: 'none',
              },
            },
          },
        },
        MuiPickerPopper: {
          styleOverrides: {
            root: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              backdropFilter: 'blur(10px)',
              inset: '0 auto auto 300px !important',
              width: '100vw',
              height: '100vh',
              paddingTop: '130px',
              paddingLeft: '20px',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              transform: 'unset !important',

              [theme.breakpoints.down('md')]: {
                inset: 'auto 0 0 0px !important',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '0',
                paddingLeft: '0',
                height: 'calc(100dvh - 64px)',
              },
            },
          },
        },
      },
    });

  const toTheme = (theme: Theme) =>
    createTheme({
      ...theme,
      components: {
        MuiPickerPopper: {
          styleOverrides: {
            root: {
              paddingTop: '184px',
              [theme.breakpoints.down('md')]: {
                paddingTop: '0',
              },
            },
          },
        },
      },
    });

  const mergedTheme = deepmerge(newTheme(baseTheme), toTheme(baseTheme));

  const handleApplyDateFilter = () => {
    setIsFilterVisible(!isFilterVisible);
    setIsFilterSelected(true);
    onApply();
  };

  const handleClearFilter = () => {
    setIsFilterSelected(false);
    onClear();
  };

  return (
    <>
      <div
        className={`${Style['sidebar-list']} ${Style['date-picker-box']} ${isFilterVisible ? Style['active'] : ''}`}
      >
        <Box className={Style['date-picker-box-inner']}>
          <Typography variant="body1" className={Style['date-picker-heading']}>
            Select Date
          </Typography>
          <Box style={{ marginBottom: '16px' }}>
            <ThemeProvider theme={newTheme}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'stretch',
                    border: '1px solid var(--Stroke-Color)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--Input-Box-Colors)',
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      padding: '8px 12px',
                      color: 'var(--Primary-Text-Color)',
                      borderRight: '1px solid var(--Stroke-Color)',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 'var(--SubTitle-3)',
                      fontWeight: 'var(--Medium)',
                      whiteSpace: 'nowrap',
                      width: '63px',
                      flex: '0 0 auto',
                    }}
                  >
                    From
                  </Box>
                  <DesktopDatePicker
                    slots={{
                      openPickerIcon: () => (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 13 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.4 14C1.02522 14 0.698167 13.8603 0.418833 13.581C0.139611 13.3018 0 12.9748 0 12.6V2.46667C0 2.09189 0.139611 1.76489 0.418833 1.48567C0.698167 1.20633 1.02522 1.06667 1.4 1.06667H1.98883V0.716667C1.98883 0.519444 2.05972 0.350722 2.2015 0.2105C2.34317 0.0701668 2.51372 0 2.71317 0C2.91561 0 3.08811 0.0701668 3.23067 0.2105C3.37311 0.350722 3.44433 0.519444 3.44433 0.716667V1.06667H9.26667V0.716667C9.26667 0.519444 9.3375 0.350722 9.47917 0.2105C9.62094 0.0701668 9.7915 0 9.99083 0C10.1934 0 10.3659 0.0701668 10.5083 0.2105C10.6509 0.350722 10.7222 0.519444 10.7222 0.716667V1.06667H11.311C11.6858 1.06667 12.0128 1.20633 12.2922 1.48567C12.5714 1.76489 12.711 2.09189 12.711 2.46667V12.6C12.711 12.9748 12.5714 13.3018 12.2922 13.581C12.0128 13.8603 11.6858 14 11.311 14H1.4ZM1.4 12.6H11.311V5.33333H1.4V12.6ZM6.35333 8.4C6.15111 8.4 5.97867 8.328 5.836 8.184C5.69344 8.04 5.62217 7.86683 5.62217 7.6645C5.62217 7.46228 5.69417 7.28983 5.83817 7.14717C5.98217 7.00461 6.15533 6.93333 6.35767 6.93333C6.55989 6.93333 6.73233 7.00533 6.875 7.14933C7.01756 7.29333 7.08883 7.4665 7.08883 7.66883C7.08883 7.87106 7.01683 8.0435 6.87283 8.18617C6.72883 8.32872 6.55567 8.4 6.35333 8.4ZM3.68667 8.4C3.48444 8.4 3.312 8.328 3.16933 8.184C3.02678 8.04 2.9555 7.86683 2.9555 7.6645C2.9555 7.46228 3.0275 7.28983 3.1715 7.14717C3.3155 7.00461 3.48867 6.93333 3.691 6.93333C3.89322 6.93333 4.06567 7.00533 4.20833 7.14933C4.35089 7.29333 4.42217 7.4665 4.42217 7.66883C4.42217 7.87106 4.35017 8.0435 4.20617 8.18617C4.06217 8.32872 3.889 8.4 3.68667 8.4ZM9.02 8.4C8.81778 8.4 8.64533 8.328 8.50267 8.184C8.36011 8.04 8.28883 7.86683 8.28883 7.6645C8.28883 7.46228 8.36083 7.28983 8.50483 7.14717C8.64883 7.00461 8.822 6.93333 9.02433 6.93333C9.22656 6.93333 9.399 7.00533 9.54167 7.14933C9.68422 7.29333 9.7555 7.4665 9.7555 7.66883C9.7555 7.87106 9.6835 8.0435 9.5395 8.18617C9.3955 8.32872 9.22233 8.4 9.02 8.4ZM6.35333 11.0667C6.15111 11.0667 5.97867 10.9947 5.836 10.8507C5.69344 10.7067 5.62217 10.5335 5.62217 10.3312C5.62217 10.1289 5.69417 9.9565 5.83817 9.81383C5.98217 9.67128 6.15533 9.6 6.35767 9.6C6.55989 9.6 6.73233 9.672 6.875 9.816C7.01756 9.96 7.08883 10.1332 7.08883 10.3355C7.08883 10.5377 7.01683 10.7102 6.87283 10.8528C6.72883 10.9954 6.55567 11.0667 6.35333 11.0667ZM3.68667 11.0667C3.48444 11.0667 3.312 10.9947 3.16933 10.8507C3.02678 10.7067 2.9555 10.5335 2.9555 10.3312C2.9555 10.1289 3.0275 9.9565 3.1715 9.81383C3.3155 9.67128 3.48867 9.6 3.691 9.6C3.89322 9.6 4.06567 9.672 4.20833 9.816C4.35089 9.96 4.42217 10.1332 4.42217 10.3355C4.42217 10.5377 4.35017 10.7102 4.20617 10.8528C4.06217 10.9954 3.889 11.0667 3.68667 11.0667ZM9.02 11.0667C8.81778 11.0667 8.64533 10.9947 8.50267 10.8507C8.36011 10.7067 8.28883 10.5335 8.28883 10.3312C8.28883 10.1289 8.36083 9.9565 8.50483 9.81383C8.64883 9.67128 8.822 9.6 9.02433 9.6C9.22656 9.6 9.399 9.672 9.54167 9.816C9.68422 9.96 9.7555 10.1332 9.7555 10.3355C9.7555 10.5377 9.6835 10.7102 9.5395 10.8528C9.3955 10.9954 9.22233 11.0667 9.02 11.0667Z"
                            fill={
                              !isFromDatePickerOpen === true
                                ? 'var(--Icon-Color)'
                                : 'var(--Txt-On-Gradient)'
                            }
                          />
                        </svg>
                      ),
                    }}
                    value={fromDate}
                    onChange={(newValue) => setFromDate(newValue)}
                    onOpen={() => setIsFromDatePickerOpen(true)}
                    onClose={() => setIsFromDatePickerOpen(false)}
                    disableFuture
                    className={Style['data-input']}
                    slotProps={{
                      textField: {
                        placeholder: 'Select date',
                        sx: {
                          '&.Mui-disabled': {
                            '& span': {
                              color: 'var(--Subtext-Color)',
                            },
                          },
                          '& .MuiPickersInputBase-root': {
                            padding: '4px',
                          },
                          '& .MuiPickersSectionList-root': {
                            color: 'var(--Primary-Text-Color)',
                            borderRadius: '8px',
                            padding: '5px 0 5px 8px',
                            fontSize: 'var(--SubTitle-4)',
                            fontWeight: 'var(--Regular)',

                            '& span': {
                              fontFamily: 'var(--font-fustat)',
                            },
                          },
                          '& .MuiInputAdornment-root': {
                            padding: '6px',
                            background: isFromDatePickerOpen
                              ? 'var(--Main-Gradient)'
                              : 'var(--Card-Color)',
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
                            borderRadius: '0',
                            width: '13px',
                            height: '14px',
                            flex: '0 0 auto',
                          },
                          '& fieldset': {
                            display: 'none',
                          },
                        },
                      },
                      field: {
                        readOnly: true,
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </ThemeProvider>
          </Box>
          <Box style={{ marginBottom: '16px' }}>
            <ThemeProvider theme={createTheme(mergedTheme)}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'stretch',
                    border: '1px solid var(--Stroke-Color)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--Input-Box-Colors)',
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      padding: '8px 12px',
                      color: 'var(--Primary-Text-Color)',
                      borderRight: '1px solid var(--Stroke-Color)',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 'var(--SubTitle-3)',
                      fontWeight: 'var(--Medium)',
                      whiteSpace: 'nowrap',
                      width: '63px',
                      flex: '0 0 auto',
                    }}
                  >
                    To
                  </Box>
                  <DesktopDatePicker
                    slots={{
                      openPickerIcon: () => (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 13 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.4 14C1.02522 14 0.698167 13.8603 0.418833 13.581C0.139611 13.3018 0 12.9748 0 12.6V2.46667C0 2.09189 0.139611 1.76489 0.418833 1.48567C0.698167 1.20633 1.02522 1.06667 1.4 1.06667H1.98883V0.716667C1.98883 0.519444 2.05972 0.350722 2.2015 0.2105C2.34317 0.0701668 2.51372 0 2.71317 0C2.91561 0 3.08811 0.0701668 3.23067 0.2105C3.37311 0.350722 3.44433 0.519444 3.44433 0.716667V1.06667H9.26667V0.716667C9.26667 0.519444 9.3375 0.350722 9.47917 0.2105C9.62094 0.0701668 9.7915 0 9.99083 0C10.1934 0 10.3659 0.0701668 10.5083 0.2105C10.6509 0.350722 10.7222 0.519444 10.7222 0.716667V1.06667H11.311C11.6858 1.06667 12.0128 1.20633 12.2922 1.48567C12.5714 1.76489 12.711 2.09189 12.711 2.46667V12.6C12.711 12.9748 12.5714 13.3018 12.2922 13.581C12.0128 13.8603 11.6858 14 11.311 14H1.4ZM1.4 12.6H11.311V5.33333H1.4V12.6ZM6.35333 8.4C6.15111 8.4 5.97867 8.328 5.836 8.184C5.69344 8.04 5.62217 7.86683 5.62217 7.6645C5.62217 7.46228 5.69417 7.28983 5.83817 7.14717C5.98217 7.00461 6.15533 6.93333 6.35767 6.93333C6.55989 6.93333 6.73233 7.00533 6.875 7.14933C7.01756 7.29333 7.08883 7.4665 7.08883 7.66883C7.08883 7.87106 7.01683 8.0435 6.87283 8.18617C6.72883 8.32872 6.55567 8.4 6.35333 8.4ZM3.68667 8.4C3.48444 8.4 3.312 8.328 3.16933 8.184C3.02678 8.04 2.9555 7.86683 2.9555 7.6645C2.9555 7.46228 3.0275 7.28983 3.1715 7.14717C3.3155 7.00461 3.48867 6.93333 3.691 6.93333C3.89322 6.93333 4.06567 7.00533 4.20833 7.14933C4.35089 7.29333 4.42217 7.4665 4.42217 7.66883C4.42217 7.87106 4.35017 8.0435 4.20617 8.18617C4.06217 8.32872 3.889 8.4 3.68667 8.4ZM9.02 8.4C8.81778 8.4 8.64533 8.328 8.50267 8.184C8.36011 8.04 8.28883 7.86683 8.28883 7.6645C8.28883 7.46228 8.36083 7.28983 8.50483 7.14717C8.64883 7.00461 8.822 6.93333 9.02433 6.93333C9.22656 6.93333 9.399 7.00533 9.54167 7.14933C9.68422 7.29333 9.7555 7.4665 9.7555 7.66883C9.7555 7.87106 9.6835 8.0435 9.5395 8.18617C9.3955 8.32872 9.22233 8.4 9.02 8.4ZM6.35333 11.0667C6.15111 11.0667 5.97867 10.9947 5.836 10.8507C5.69344 10.7067 5.62217 10.5335 5.62217 10.3312C5.62217 10.1289 5.69417 9.9565 5.83817 9.81383C5.98217 9.67128 6.15533 9.6 6.35767 9.6C6.55989 9.6 6.73233 9.672 6.875 9.816C7.01756 9.96 7.08883 10.1332 7.08883 10.3355C7.08883 10.5377 7.01683 10.7102 6.87283 10.8528C6.72883 10.9954 6.55567 11.0667 6.35333 11.0667ZM3.68667 11.0667C3.48444 11.0667 3.312 10.9947 3.16933 10.8507C3.02678 10.7067 2.9555 10.5335 2.9555 10.3312C2.9555 10.1289 3.0275 9.9565 3.1715 9.81383C3.3155 9.67128 3.48867 9.6 3.691 9.6C3.89322 9.6 4.06567 9.672 4.20833 9.816C4.35089 9.96 4.42217 10.1332 4.42217 10.3355C4.42217 10.5377 4.35017 10.7102 4.20617 10.8528C4.06217 10.9954 3.889 11.0667 3.68667 11.0667ZM9.02 11.0667C8.81778 11.0667 8.64533 10.9947 8.50267 10.8507C8.36011 10.7067 8.28883 10.5335 8.28883 10.3312C8.28883 10.1289 8.36083 9.9565 8.50483 9.81383C8.64883 9.67128 8.822 9.6 9.02433 9.6C9.22656 9.6 9.399 9.672 9.54167 9.816C9.68422 9.96 9.7555 10.1332 9.7555 10.3355C9.7555 10.5377 9.6835 10.7102 9.5395 10.8528C9.3955 10.9954 9.22233 11.0667 9.02 11.0667Z"
                            fill={
                              !isToDatePickerOpen === true
                                ? 'var(--Icon-Color)'
                                : 'var(--Txt-On-Gradient)'
                            }
                          />
                        </svg>
                      ),
                    }}
                    value={toDate}
                    onChange={(newValue) => setToDate(newValue)}
                    onOpen={() => setIsToDatePickerOpen(true)}
                    onClose={() => setIsToDatePickerOpen(false)}
                    minDate={fromDate || undefined}
                    disableFuture
                    disabled={!fromDate}
                    className={Style['data-input']}
                    slotProps={{
                      textField: {
                        placeholder: 'Select date',
                        sx: {
                          '&.Mui-disabled': {
                            '& span': {
                              color: 'var(--Subtext-Color)',
                            },
                          },
                          '& .MuiPickersInputBase-root': {
                            padding: '4px',
                          },
                          '& .MuiPickersSectionList-root': {
                            color: 'var(--Primary-Text-Color)',
                            borderRadius: '8px',
                            padding: '5px 0 5px 8px',
                            fontSize: 'var(--SubTitle-4)',
                            fontWeight: 'var(--Regular)',

                            '& span': {
                              fontFamily: 'var(--font-fustat)',
                            },
                          },
                          '& .MuiInputAdornment-root': {
                            padding: '6px',
                            background: isToDatePickerOpen
                              ? 'var(--Main-Gradient)'
                              : 'var(--Card-Color)',
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
                            borderRadius: '0',
                            width: '13px',
                            height: '14px',
                            flex: '0 0 auto',
                          },
                          '& fieldset': {
                            display: 'none',
                          },
                        },
                      },
                      field: {
                        readOnly: true,
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </ThemeProvider>
          </Box>
          <Button
            className={Style['apply-btn']}
            onClick={handleApplyDateFilter}
            disabled={isDisabledFilter}
          >
            Apply
          </Button>
        </Box>
      </div>
      <div
        className={`${Style['sidebar-list']} ${Style['date-chip-box']} ${isFilterSelected ? Style['active'] : ''}`}
      >
        <div className={Style['date-chip-inner']}>
          <Typography variant="body1" className={Style['date-chip-heading']}>
            <span>From :</span>
            <span>{fromDate?.format('MM-DD-YYYY') || '-'}</span>
          </Typography>
          <Typography variant="body1" className={Style['date-chip-heading']}>
            <span>To :</span>

            <span>{toDate?.format('MM-DD-YYYY') || '-'}</span>
          </Typography>
          <Button className={Style['chip-btn']} onClick={handleClearFilter}>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.1 18.3C6.7134 18.6866 6.0866 18.6866 5.7 18.3C5.3134 17.9134 5.3134 17.2866 5.7 16.9L9.89289 12.7071C10.2834 12.3166 10.2834 11.6834 9.89289 11.2929L5.7 7.1C5.3134 6.7134 5.3134 6.0866 5.7 5.7C6.0866 5.3134 6.7134 5.3134 7.1 5.7L11.2929 9.89289C11.6834 10.2834 12.3166 10.2834 12.7071 9.89289L16.9 5.7C17.2866 5.3134 17.9134 5.3134 18.3 5.7C18.6866 6.0866 18.6866 6.7134 18.3 7.1L14.1071 11.2929C13.7166 11.6834 13.7166 12.3166 14.1071 12.7071L18.3 16.9C18.6866 17.2866 18.6866 17.9134 18.3 18.3C17.9134 18.6866 17.2866 18.6866 16.9 18.3L12.7071 14.1071C12.3166 13.7166 11.6834 13.7166 11.2929 14.1071L7.1 18.3Z"
                fill="var(--Primary-Text-Color)"
              />
            </svg>
          </Button>
        </div>
      </div>
    </>
  );
}
