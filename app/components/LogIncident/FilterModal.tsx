import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Checkbox,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react';
import { Dayjs } from 'dayjs';
import Style from '@components/Common/Sidebar.module.scss';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import { ListItemText } from '@mui/material';
import { RootState } from '@/app/redux/store';
import { useSelector } from 'react-redux';
import { deepmerge } from '@mui/utils';

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
  setFromDate: (date: Dayjs | null) => void;
  setToDate: (date: Dayjs | null) => void;
  onApply: () => void;
  selectedTags: number[];
  setSelectedTags: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function FilterModal({
  open,
  onClose,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  onApply,
  selectedTags,
  setSelectedTags,
}: FilterModalProps) {
  const [isFromDatePickerOpen, setIsFromDatePickerOpen] = useState(false);
  const [isToDatePickerOpen, setIsToDatePickerOpen] = useState(false);
  const { tags } = useSelector((state: RootState) => state.tagList);
  const isDisabledFilter = !((fromDate && toDate) || selectedTags.length);

  const handleApplyDateFilter = () => {
    onApply();
    onClose();
  };
  const baseTheme = createTheme();
  const customTheme = (theme: Theme) =>
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
              maxWidth: '280px',
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
              backdropFilter: 'blur(0)',
              inset: '0 auto auto 0 !important',
              width: '100dvw',
              height: '100dvh',
              paddingTop: '340px',
              paddingRight: '260px',
              paddingBottom: '10px',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              transform: 'unset !important',
              overflowY: 'auto',

              [theme.breakpoints.down('md')]: {
                inset: 'auto 0 0 0px !important',
                justifyContent: 'center',
                paddingRight: '0',
                height: '100dvh',
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
              paddingTop: '395px',
              [theme.breakpoints.down('md')]: {
                // paddingTop: '290px',
              },
            },
          },
        },
      },
    });

  const mergedTheme = deepmerge(customTheme(baseTheme), toTheme(baseTheme));

  const newThemeSelect = createTheme({
    components: {
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: 'var(--SubTitle-3)',
            padding: '8px 16px',
            color: 'var(--Primary-Text-Color)',
            borderRadius: '12px',
            margin: '4px 0',
            '&:hover': {
              backgroundColor: 'var(--Stroke-Color)',
            },
            '&[aria-selected="true"]': {
              background: 'var(--Stroke-Color)',
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          list: {
            padding: '5px',
            backgroundColor: 'var(--Card-Color)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            borderRadius: '12px',
            marginTop: '4px',
            border: '1px solid var(--Stroke-Color)',
            maxHeight: '250px !important',
          },
        },
      },
    },
  });

  const themeModal = createTheme({
    components: {
      MuiModal: {
        styleOverrides: {
          root: {
            // backgroundColor: '#11101BCC',
            backdropFilter: 'blur(4px)',
            zIndex: 1300,
            overflowY: 'auto',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={themeModal}>
      <Modal open={open} onClose={onClose}>
        <Box
          className={`${Style['date-picker-box-inner']} ${Style['date-pickerbox-inner']}`}
        >
          <Typography variant="h6" className={Style['date-picker-heading']}>
            Filters
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'var(--Subtext-Color)',
              marginBottom: '4px',
              textAlign: 'left',
            }}
          >
            Tag
          </Typography>
          <Box
            style={{
              marginBottom: '16px',
              borderBottom: '1px solid var(--Stroke-Color)',
              paddingBottom: '16px',
            }}
          >
            <ThemeProvider theme={newThemeSelect}>
              <TextField
                select
                fullWidth
                SelectProps={{
                  multiple: true,
                  displayEmpty: true,
                  value: selectedTags,
                  onChange: (e) => {
                    const value =
                      typeof e.target.value === 'string'
                        ? e.target.value.split(',').map(Number)
                        : e.target.value;
                    setSelectedTags(value as number[]);
                  },
                  renderValue: (selected) => {
                    if ((selected as number[]).length === 0) {
                      return (
                        <Box
                          sx={{
                            fontSize: 'var(--SubTitle-3)',
                            fontWeight: 'var(--Regular)',
                            color: 'var(--Placeholder-Text)',
                            padding: '2px 0',
                            textAlign: 'start',
                          }}
                        >
                          Select Tags
                        </Box>
                      );
                    }
                    return (
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 0.5,
                        }}
                      >
                        {(selected as number[])?.slice(0, 2)?.map((id) => {
                          const tagDisp = tags.find(
                            (tag) => Number(tag.id) === id
                          );
                          return tagDisp ? (
                            <Box
                              key={id}
                              sx={{
                                backgroundColor: 'var(--Card-Image)',
                                fontSize: 'var(--SubTitle-3)',
                                fontWeight: 'var(--Lighter)',
                                color: 'var(--Txt-On-Gradient)',
                                borderRadius: '100px',
                                px: 1.5,
                                py: 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                border: '1px solid var(--Stroke-Color)',
                              }}
                            >
                              {tagDisp.name}
                            </Box>
                          ) : null;
                        })}
                        {(selected as number[]).length > 2 && (
                          <Box
                            sx={{
                              backgroundColor: 'var(--Card-Image)',
                              fontSize: 'var(--SubTitle-3)',
                              fontWeight: 'var(--Lighter)',
                              color: 'var(--Txt-On-Gradient)',
                              borderRadius: '100px',
                              px: 1.5,
                              py: 0.5,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              border: '1px solid var(--Stroke-Color)',
                            }}
                          >
                            +{(selected as number[]).length - 2}
                          </Box>
                        )}
                      </Box>
                    );
                  },
                }}
                placeholder="Select Tags"
                sx={{
                  backgroundColor: 'var(--Input-Box-Colors)',
                  borderRadius: '12px',
                  fontSize: 'var(--SubTitle-3)',
                  fontWeight: 'var(--Regular)',
                  color: 'var(--Primary-Text-Color)',
                  width: '100%',
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                    {
                      borderColor: 'var(--Subtext-Color)',
                      borderWidth: '1px',
                    },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                    {
                      borderColor: 'var(--Subtext-Color)',
                      borderWidth: '1px',
                    },
                  '& .MuiOutlinedInput-notchedOutline': {
                    top: '-8px !important',
                    borderColor: 'var(--Stroke-Color)',
                    borderRadius: '12px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--Txt-On-Gradient)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--Txt-On-Gradient)',
                    borderWidth: '1px',
                  },
                  '& .MuiSelect-select': {
                    padding: '14px 16px',
                    display: 'block',
                  },
                  '& .MuiSelect-placeholder': {
                    color: 'var(--Placeholder-Text)',
                    fontWeight: 'var(--Lighter)',
                  },
                  '& svg': {
                    color: 'var(--Primary-Text-Color)',
                  },
                }}
              >
                {tags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>
                    <ListItemText
                      primary={tag.name}
                      primaryTypographyProps={{
                        sx: { color: 'var(--Txt-On-Gradient)' },
                      }}
                    />
                    <Checkbox
                      checked={selectedTags.includes(Number(tag.id))}
                      icon={
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            border: '2px solid var(--Subtext-Color)',
                            borderRadius: '8px',
                            backgroundColor: 'transparent',
                          }}
                        />
                      }
                      checkedIcon={
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            background: 'var(--Main-Gradient)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="8"
                            viewBox="0 0 12 8"
                            fill="none"
                          >
                            <path
                              d="M1.75 4.00004L4.58 6.83004L10.25 1.17004"
                              stroke="white"
                              stroke-width="1.8"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </Box>
                      }
                      sx={{ padding: '0' }}
                    />
                  </MenuItem>
                ))}
              </TextField>
            </ThemeProvider>
          </Box>

          <Box style={{ marginBottom: '16px' }}>
            <ThemeProvider theme={customTheme}>
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
      </Modal>
    </ThemeProvider>
  );
}
