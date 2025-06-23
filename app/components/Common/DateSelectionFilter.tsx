import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { deepmerge } from '@mui/utils';
import { Box, Button, Typography } from '@mui/material';
import Style from '@components/Common/Sidebar.module.scss';
import Image from 'next/image';
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
                            backgroundImage: 'url(/images/calendar_month.svg)',
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
                            backgroundImage: 'url(/images/calendar_month.svg)',
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
            <Image
              src="/images/close.svg"
              alt="sidebar-hide-icon"
              width={10}
              height={10}
            />
          </Button>
        </div>
      </div>
    </>
  );
}
