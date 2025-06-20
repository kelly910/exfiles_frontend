'use client';
import React, { useEffect, useRef, useState } from 'react';
import Style from '@/app/components/Sidebar/newsidebar.module.scss';
import ListItem from '@mui/material/ListItem';
import { Box, List, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Image from 'next/image';
import SidebarAccordion from '@/app/components/Common/SidebarAccordion';
import { useAppDispatch } from '@/app/redux/hooks';
import {
  fetchPinnedMessagesList,
  fetchThreadList,
  setActiveThread,
} from '@/app/redux/slices/Chat';
import ThreadList from '@/app/components/Common/ThreadsList';
import PinnedMessagesList from '@/app/components/Common/PinnedMessagesList';
import {
  GetThreadListResponse,
  PinnedAnswerMessage,
  PinnedAnswerMessagesResponse,
} from '@/app/redux/slices/Chat/chatTypes';
import NoRecordFound from '@/app/components/Common/NoRecordFound';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SidebarButton from '@components/Common/SidebarButton';
import { clearPageHeaderData } from '@/app/redux/slices/login';
import { fetchCategories } from '@/app/redux/slices/categoryListing';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { deepmerge } from '@mui/utils';

const baseTheme = createTheme();

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

const Sidebar = ({
  isOpen,
  toggleSidebar,
  handleThreadClick,
  handlePinnedAnswerClick,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
  handleThreadClick: (threadUUID: string) => void;
  handlePinnedAnswerClick: (selectedMessage: PinnedAnswerMessage) => void;
  title: string;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  if (isSearchOpen && !isOpen) {
    setIsSearchOpen(false);
  }

  const handleToggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };
  const [expanded, setExpanded] = useState<boolean | string>(''); // Track which accordion is expanded

  const [initialAllChatsData, setInitialAllChatsData] =
    useState<GetThreadListResponse | null>(null);

  const [initialAllPinnedChatsData, setInitialAllPinnedChatsData] =
    useState<PinnedAnswerMessagesResponse | null>(null);

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false); // Only expand the clicked panel
    };

  const getThreadList = async (page = 1) => {
    try {
      const resultData = await dispatch(fetchThreadList({ page }));

      if (fetchThreadList.fulfilled.match(resultData)) {
        const payload = resultData.payload;

        if (payload?.results?.length > 0) {
          if (page === 1) {
            setInitialAllChatsData(payload); // Only set on initial fetch
          }
          return payload;
        }
      }

      return { results: [], count: 0 };
    } catch (err) {
      console.error('Error fetching thread list:', err);
      return { results: [], count: 0 };
    }
  };

  const getPinnedMessagesList = async (page = 1) => {
    try {
      const resultData = await dispatch(fetchPinnedMessagesList({ page }));

      if (fetchPinnedMessagesList.fulfilled.match(resultData)) {
        const payload = resultData.payload;
        if (payload?.results?.length > 0) {
          if (page === 1) {
            setInitialAllPinnedChatsData(payload); // Only set on initial fetch
          }
          return payload;
        }
      }

      return { results: [], count: 0 };
    } catch (err) {
      console.error('Error fetching thread list:', err);
      return { results: [], count: 0 };
    }
  };

  const handleDocumentClick = async () => {
    dispatch(fetchCategories({ page: 1 }))
      .unwrap()
      .then((res) => {
        if (res?.count) {
          router.push(`/documents/${res?.results[0]?.id}`);
        } else {
          router.push('/documents');
        }
      });
  };

  useEffect(() => {
    getThreadList(1);
    getPinnedMessagesList(1);
  }, []);

  const handleStartNewChat = () => {
    dispatch(setActiveThread(null));
    dispatch(clearPageHeaderData());
  };

  return (
    <>
      <span
        className={`${Style['sidebarLayer']} ${!isOpen ? Style.closeLayer : ''}`}
        onClick={toggleSidebar}
      ></span>
      <div
        className={`${Style['sidebar']} ${!isOpen ? Style.closesidebar : ''}`}
      >
        <div className={Style['main-logo']}>
          <Link
            href="/ai-chats"
            className={Style['opensidebar-logo']}
            onClick={handleStartNewChat}
          >
            <Image src="/images/logo.svg" alt="logo" width={200} height={44} />
          </Link>
          <Link
            href="/ai-chats"
            className={Style['close-sidebar-logo']}
            onClick={handleStartNewChat}
          >
            <Image
              src="/images/close-sidebar-logo.svg"
              alt="close-sidebar-logo"
              width={41}
              height={44}
            />
          </Link>
        </div>
        <div className={Style['sidebar-details']}>
          <div className={Style['sidebar-top']}>
            <Button className={Style['left']} onClick={toggleSidebar}>
              <Link href="#">
                <Image
                  src="/images/sidebar-hide-icon.svg"
                  alt="sidebar-hide-icon"
                  width={16}
                  height={16}
                />
              </Link>
            </Button>
          </div>
          <div className={Style['sidebar-list']}>
            <List className={Style['sidebar-list-details']}>
              <ListItem>
                <Link
                  href="/ai-chats"
                  className={Style['sidebar-btn']}
                  onClick={handleStartNewChat}
                >
                  <span className={Style['btn-text']}>Upload + Chat</span>{' '}
                </Link>
              </ListItem>
              <ListItem style={{ display: 'block' }}>
                <div className={Style['search']}>
                  <Box className={Style['search-box']}>
                    <TextField
                      // as={TextField}
                      fullWidth
                      type="text"
                      id="email"
                      name="email"
                      value={search}
                      placeholder="Search here"
                      onChange={(e) => setSearch(e.target.value)}
                      // error={Boolean(errors.email && touched.email)}
                      sx={{
                        marginTop: '0',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 'unset',
                          borderWidth: '0px',
                          color: 'var(--Primary-Text-Color)',
                          backgroundColor: 'unset',
                          '& .MuiOutlinedInput-notchedOutline': {
                            top: '-10px !important',
                          },
                          '& .MuiOutlinedInput-input': {
                            fontSize: 'var(--SubTitle-3)',
                            color: 'var(--Primary-Text-Color)',
                            padding: '6px 6px 6px 12px',
                            fontWeight: 'var(--Regular)',
                            borderRadius: '10px',
                            '&::placeholder': {
                              color: 'var(Placeholder-Text)',
                              fontWeight: 'var(--Regular)',
                            },
                          },
                          '& fieldset': {
                            display: 'none',
                          },
                        },
                      }}
                    />
                    <Button
                      className={Style['search-btn']}
                      onClick={() => {
                        setSearch('');
                        inputRef.current?.focus();
                      }}
                    >
                      <Image
                        src={
                          search.trim()
                            ? '/images/close.svg'
                            : '/images/search-sidebar.svg'
                        }
                        alt="sidebar-hide-icon"
                        width={12}
                        height={12}
                      />
                    </Button>
                    <Box className={Style['filter-btn-box']}>
                      <Button
                        className={`${Style['search-btn']} ${Style['filter-btn']} ${isSearchOpen ? Style['active'] : ''}`}
                        onClick={handleToggleSearch}
                      >
                        <Image
                          src="/images/filter_list.svg"
                          alt="filter_list"
                          width={12}
                          height={8}
                        />
                      </Button>
                    </Box>
                  </Box>
                </div>
                <div
                  className={`${Style['sidebar-list']} ${Style['date-picker-box']} ${isSearchOpen ? Style['active'] : ''}`}
                >
                  <Box className={Style['date-picker-box-inner']}>
                    <Typography
                      variant="body1"
                      className={Style['date-picker-heading']}
                    >
                      Select Date
                    </Typography>
                    <Box style={{ marginBottom: '16px' }}>
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
                            <Box
                              sx={{
                                padding: '8px 12px',
                                color: 'var(--Primary-Text-Color)',
                                borderRight: '1px solid #444',
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
                              className={Style['data-input']}
                              slotProps={{
                                textField: {
                                  placeholder: 'Select date',
                                  sx: {
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
                                      backgroundColor: 'var(--Card-Color)',
                                      color: 'var(--Primary-Text-Color)',
                                      borderRadius: '8px',
                                      border:
                                        '0.72px solid var(--Stroke-Color)',
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
                    </Box>
                    <Box style={{ marginBottom: '16px' }}>
                      <ThemeProvider theme={createTheme(mergedTheme)}>
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
                            <Box
                              sx={{
                                padding: '8px 12px',
                                color: 'var(--Primary-Text-Color)',
                                borderRight: '1px solid #444',
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
                              className={Style['data-input']}
                              slotProps={{
                                textField: {
                                  placeholder: 'Select date',
                                  sx: {
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
                                      backgroundColor: 'var(--Card-Color)',
                                      color: 'var(--Primary-Text-Color)',
                                      borderRadius: '8px',
                                      border:
                                        '0.72px solid var(--Stroke-Color)',
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
                    </Box>
                    <Button
                      className={Style['apply-btn']}
                      onClick={handleToggleSearch}
                    >
                      Apply
                    </Button>
                  </Box>
                </div>
                <div
                  className={`${Style['sidebar-list']} ${Style['date-chip-box']} ${!isSearchOpen ? Style['active'] : ''}`}
                >
                  <div className={Style['date-chip-inner']}>
                    <Typography
                      variant="body1"
                      className={Style['date-chip-heading']}
                    >
                      <span>From :</span>
                      <span>04-24-2025</span>
                    </Typography>
                    <Typography
                      variant="body1"
                      className={Style['date-chip-heading']}
                    >
                      <span>To :</span>
                      <span>04-24-2025</span>
                    </Typography>
                    <Button
                      className={Style['chip-btn']}
                      onClick={handleToggleSearch}
                    >
                      <Image
                        src="/images/close.svg"
                        alt="sidebar-hide-icon"
                        width={10}
                        height={10}
                      />
                    </Button>
                  </div>
                </div>
              </ListItem>
            </List>
          </div>
          <div className={Style['sidebar-accordian']}>
            <SidebarAccordion
              title={`Pinned Chats ${initialAllPinnedChatsData ? `(${initialAllPinnedChatsData?.count})` : ''}`}
              icon="/images/sidebar-Pin.svg"
              expanded={expanded}
              panelKey="panel1"
              handleAccordionChange={handleAccordionChange}
            >
              {!initialAllPinnedChatsData && (
                <NoRecordFound title={'No Chats are pinned yet.'} />
              )}

              {initialAllPinnedChatsData &&
                initialAllPinnedChatsData?.count > 0 && (
                  <PinnedMessagesList
                    initialAllChatsData={initialAllPinnedChatsData?.results}
                    totalCount={initialAllPinnedChatsData?.count}
                    fetchPinnedAnswerList={(pageVal) =>
                      getPinnedMessagesList(pageVal)
                    }
                    handlePinnedAnswerClick={handlePinnedAnswerClick}
                    updateTotalCount={(count: number) =>
                      setInitialAllPinnedChatsData((prev) => ({
                        ...(prev ?? {
                          previous: null,
                          next: null,
                          results: [],
                        }),
                        count,
                      }))
                    }
                  />
                )}
            </SidebarAccordion>

            <SidebarAccordion
              title={`All Chats ${initialAllChatsData ? `(${initialAllChatsData?.count})` : ''}`}
              icon="/images/messages.svg"
              expanded={expanded}
              panelKey="panel2"
              handleAccordionChange={handleAccordionChange}
            >
              {!initialAllChatsData && (
                <NoRecordFound title={'Your chats will show up here.'} />
              )}

              {initialAllChatsData && initialAllChatsData?.count > 0 && (
                <ThreadList
                  initialAllChatsData={initialAllChatsData?.results}
                  totalCount={initialAllChatsData?.count}
                  fetchChats={(pageVal) => getThreadList(pageVal)}
                  handleThreadClick={handleThreadClick}
                  updateTotalCount={(count: number) =>
                    setInitialAllChatsData((prev) => ({
                      ...(prev ?? { previous: null, next: null, results: [] }),
                      count,
                    }))
                  }
                />
              )}
            </SidebarAccordion>

            <SidebarButton
              btnTitle={'Documents'}
              iconPath={'/images/document-text.svg'}
              handleBtnClick={handleDocumentClick}
            />

            <SidebarButton
              btnTitle={'Log Incident'}
              iconPath={'/images/log-incident-sidebar.svg'}
              handleBtnClick={() => router.push('/log-incident')}
            />
          </div>
        </div>
        <div className={Style['sidebar-btm']}>
          <div className={Style['sidebar-btm-card']}>
            <p>Something Unexpected Happened?</p>
            <p>
              <Link href="">Click Here</Link> to Log Incident
            </p>
          </div>
          <Link href="#" className={Style['close-sidebar-btm']}>
            <Image
              src="/images/close-sidebar-btm-img.svg"
              alt=""
              width={38}
              height={38}
            />{' '}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
