/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';
import React, { useEffect, useMemo, useState } from 'react';

// css
import Style from '@components/Common/Sidebar.module.scss';

// Third party imports
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import debounce from 'lodash.debounce';
import { Dayjs } from 'dayjs';

// MUI Components
import ListItem from '@mui/material/ListItem';
import {
  Box,
  LinearProgress,
  linearProgressClasses,
  List,
  Modal,
  styled,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Button from '@mui/material/Button';
import SidebarAccordion from '@components/Common/SidebarAccordion';

// Custom Components
import DynamicThreadsList from '@components/Common/DynamicThreadsList';
// import DynamicPinnedMessagesList from '@components/Common/DynamicPinnedMessagesList';
import SidebarButton from '@components/Common/SidebarButton';
import DateSelectionFilter from '@components/Common/DateSelectionFilter';

// Redux imports
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  // selectPinnedMessagesList,
  selectThreadsList,
  setActiveThread,
} from '@/app/redux/slices/Chat';
import { PinnedAnswerMessage } from '@/app/redux/slices/Chat/chatTypes';
import {
  clearPageHeaderData,
  getUserById,
  selectFetchedUser,
} from '@/app/redux/slices/login';
import { fetchCategories } from '@/app/redux/slices/categoryListing';
import { useSearch } from '../AI-Chat-Module/context/SearchContext';
import { useThemeMode } from '@/app/utils/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

const Sidebar = ({
  isOpen,
  toggleSidebar,
  handleThreadClick,
  handlePinnedAnswerClick,
  selectedDocIdNull,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
  handleThreadClick: (threadUUID: string) => void;
  handlePinnedAnswerClick: (selectedMessage: PinnedAnswerMessage) => void;
  selectedDocIdNull?: () => void;
  title: string;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const isMobile = useMediaQuery('(max-width:768px)');
  const threadList = useAppSelector(selectThreadsList);
  // const pinnedChats = useAppSelector(selectPinnedMessagesList);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterSelected, setIsFilterSelected] = useState(false);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const { setSearchingChat } = useSearch();

  if (isSearchOpen && !isOpen) {
    setIsSearchOpen(false);
  }

  const handleToggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
    setIsSearchOpen((prev) => !prev);
  };

  const pathname = usePathname();
  const isChatPage = pathname?.includes('/ai-chats');
  const [expanded, setExpanded] = useState<boolean | string>(
    isChatPage ? 'panel2' : ''
  ); // Track which accordion is expanded
  const [expandedNested, setExpandedNested] = useState<string | false>(
    'nested2'
  );
  const loggedInUser = useSelector(
    (state: RootState) => state.login.loggedInUser
  );
  const fetchedUser = useSelector(selectFetchedUser);

  useEffect(() => {
    // console.log("");
    if (loggedInUser?.data?.id) {
      dispatch(getUserById(loggedInUser?.data?.id));
    }
  }, [isChatPage, expanded]);

  const handleOpenSidebar = () => {
    if (!isOpen) {
      setExpanded('panel2');
      setExpandedNested('nested2');
      toggleSidebar();
    }
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false); // Only expand the clicked panel
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

  const handleDocReport = () => {
    router.push('/download-doc-report');
  };

  const handleStartNewChat = () => {
    dispatch(setActiveThread(null));
    dispatch(clearPageHeaderData());
  };

  const handleFilterApply = () => {
    const createdAfter = fromDate?.format('YYYY-MM-DD');
    const createdBefore = toDate?.format('YYYY-MM-DD');

    if (createdAfter && createdBefore) {
      setResetTrigger((prev) => prev + 1);
      setIsSearchOpen(false);
    }
  };

  const handleClearFilter = () => {
    setFromDate(null);
    setToDate(null);
    setResetTrigger((prev) => prev + 1);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((inputValue: string) => {
        setSearchValue(inputValue);
        setResetTrigger((prev) => prev + 1);
      }, 300),
    []
  );

  const handleLogIncidentClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
    router.push('/log-incident');
  };

  const handleTextInput = (inputValue: string) => {
    setSearch(inputValue);
    setSearchingChat?.(inputValue);
    const trimmed = inputValue.trim();
    if (inputValue == '') {
      handleClearSearch();
    } else {
      debouncedSearch(trimmed);
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    setSearchValue('');
    setSearchingChat?.('');
    setResetTrigger((prev) => prev + 1);
  };

  const { theme } = useThemeMode();

  const getColor = (value: number) => {
    if (fetchedUser?.active_subscription?.status === 1) {
      if (value <= 80) return 'var(--Main-Gradient)'; // Gradient
      if (value <= 90) return '#FF7E22'; // Orange
      if (value == 100) return '#E72240'; // Red
      return 'var(--Main-Gradient)'; // Gradient
    } else if (fetchedUser?.staff_user) {
      return 'var(--Stroke-Color)';
    } else {
      return 'var(--Main-Gradient)'; // Gradient
    }
  };

  const getGracePointColor = (value: boolean) => {
    if (fetchedUser?.active_subscription?.status === 1) {
      return '#A6152B';
    } else if (fetchedUser?.staff_user) {
      return 'var(--Stroke-Color)';
    } else {
      return '#A6152B';
    }
  };

  const ColoredLinearProgress = styled(LinearProgress)<{ $barColor: string }>(
    ({ $barColor }) => ({
      height: 4,
      borderRadius: 50,
      marginBottom: 0,
      marginTop: '8px',
      [`&.${linearProgressClasses.colorPrimary}`]: {
        background:
          theme === 'dark' ? 'var(--Icon-Color-Rgb)' : 'var(--Stroke-Color)',
      },
      [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        background: $barColor,
      },
    })
  );

  const usageData = [
    {
      label: 'Summaries used',
      used: fetchedUser?.summary_used?.split('/')[0] || 0,
      total: fetchedUser?.summary_used?.split('/')[1] || 0,
      gracePoint: fetchedUser?.summary_grace_point_used,
      title:
        'You have surpassed Summary generation limit. Please upgrade to continue using Exfiles AI',
    },
    {
      label: 'Chats used',
      used: fetchedUser?.chat_used?.split('/')[0] || 0,
      total: fetchedUser?.chat_used?.split('/')[1] || 0,
      gracePoint: fetchedUser?.chat_grace_point_used,
      title:
        'You have surpassed AI Chat limit. Please upgrade to continue using Exfiles AI',
    },
    {
      label: 'Reports generated',
      used: fetchedUser?.reports_generated?.split('/')[0] || 0,
      total: fetchedUser?.reports_generated?.split('/')[1] || 0,
      gracePoint: fetchedUser?.report_grace_point_used,
      title:
        'You have surpassed Report Generation limit. Please upgrade to continue using Exfiles AI',
    },
  ];

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
                <svg
                  width="19"
                  height="20"
                  viewBox="0 0 20 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.0513 7.38137V14.6192C18.0513 17.763 16.2708 19.6372 13.2841 19.6372H8V2.36328H13.2841C16.2708 2.36328 18.0513 4.23751 18.0513 7.38137Z"
                    fill="var(--Icon-Color)"
                  />
                  <path
                    d="M6.76932 2.36328V19.6372H6.40829C3.42163 19.6372 1.64111 17.763 1.64111 14.6192V7.38137C1.64111 4.23751 3.42163 2.36328 6.40829 2.36328H6.76932Z"
                    fill={
                      theme === 'dark'
                        ? 'var(--Icon-Color)'
                        : 'var(--Subtext-Color)'
                    }
                    opacity={theme === 'dark' ? 0.2 : 1}
                  />
                </svg>
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
              {/* <ListItem style={{ display: 'block' }}>
                <div className={Style['search']}>
                  <Box className={Style['search-box']}>
                    <TextField
                      // as={TextField}
                      fullWidth
                      type="text"
                      id="search-input"
                      name="search"
                      value={search}
                      placeholder="Search here"
                      onChange={(e) => handleTextInput(e.target.value)}
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
                      onClick={() => search?.length > 0 && handleClearSearch()}
                    >
                      {!search.trim() ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.53492 11.3413C9.30241 11.3413 11.5459 9.09782 11.5459 6.33033C11.5459 3.56283 9.30241 1.31934 6.53492 1.31934C3.76742 1.31934 1.52393 3.56283 1.52393 6.33033C1.52393 9.09782 3.76742 11.3413 6.53492 11.3413Z"
                            stroke="var(--Icon-Color)"
                            stroke-width="1.67033"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M14.8866 14.6815L11.5459 11.3408"
                            stroke="var(--Icon-Color)"
                            stroke-width="1.67033"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.1 18.3C6.7134 18.6866 6.0866 18.6866 5.7 18.3C5.3134 17.9134 5.3134 17.2866 5.7 16.9L9.89289 12.7071C10.2834 12.3166 10.2834 11.6834 9.89289 11.2929L5.7 7.1C5.3134 6.7134 5.3134 6.0866 5.7 5.7C6.0866 5.3134 6.7134 5.3134 7.1 5.7L11.2929 9.89289C11.6834 10.2834 12.3166 10.2834 12.7071 9.89289L16.9 5.7C17.2866 5.3134 17.9134 5.3134 18.3 5.7C18.6866 6.0866 18.6866 6.7134 18.3 7.1L14.1071 11.2929C13.7166 11.6834 13.7166 12.3166 14.1071 12.7071L18.3 16.9C18.6866 17.2866 18.6866 17.9134 18.3 18.3C17.9134 18.6866 17.2866 18.6866 16.9 18.3L12.7071 14.1071C12.3166 13.7166 11.6834 13.7166 11.2929 14.1071L7.1 18.3Z"
                            fill="var(--Icon-Color)"
                          />
                        </svg>
                      )}
                    </Button>
                    <Box className={Style['filter-btn-box']}>
                      <Button
                        className={`${Style['search-btn']} ${Style['filter-btn']} ${isSearchOpen ? Style['active'] : ''}`}
                        onClick={handleToggleFilter}
                      >
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.32411 9.26749C6.11045 9.26749 5.93128 9.19533 5.78661 9.05099C5.64206 8.90655 5.56978 8.7276 5.56978 8.51416C5.56978 8.30072 5.64295 8.12077 5.78928 7.97433C5.93573 7.82799 6.11534 7.75483 6.32811 7.75483H7.67345C7.88711 7.75483 8.06628 7.82799 8.21095 7.97433C8.3555 8.12077 8.42778 8.30072 8.42778 8.51416C8.42778 8.7276 8.35461 8.90655 8.20828 9.05099C8.06184 9.19533 7.88223 9.26749 7.66945 9.26749H6.32411ZM3.63361 5.75483C3.41984 5.75483 3.24067 5.68266 3.09611 5.53833C2.95156 5.39388 2.87928 5.21494 2.87928 5.00149C2.87928 4.78805 2.95156 4.6081 3.09611 4.46166C3.24067 4.31533 3.41984 4.24216 3.63361 4.24216H10.3599C10.5737 4.24216 10.7529 4.31533 10.8974 4.46166C11.042 4.6081 11.1143 4.78805 11.1143 5.00149C11.1143 5.21494 11.042 5.39388 10.8974 5.53833C10.7529 5.68266 10.5737 5.75483 10.3599 5.75483H3.63361ZM1.61761 2.24216C1.40384 2.24216 1.22467 2.16994 1.08011 2.02549C0.935559 1.88116 0.863281 1.70227 0.863281 1.48883C0.863281 1.27538 0.936448 1.09544 1.08278 0.948992C1.22923 0.802659 1.40884 0.729492 1.62161 0.729492H12.3799C12.5937 0.729492 12.7729 0.802659 12.9174 0.948992C13.062 1.09544 13.1343 1.27538 13.1343 1.48883C13.1343 1.70227 13.0611 1.88116 12.9148 2.02549C12.7683 2.16994 12.5887 2.24216 12.3759 2.24216H1.61761Z"
                            fill={
                              !isFilterVisible === true
                                ? 'var(--Icon-Color)'
                                : 'var(--Txt-On-Gradient)'
                            }
                          />
                        </svg>
                      </Button>
                    </Box>
                  </Box>
                </div>
                <DateSelectionFilter
                  isFilterVisible={isFilterVisible}
                  setIsFilterVisible={setIsFilterVisible}
                  isFilterSelected={isFilterSelected}
                  setIsFilterSelected={setIsFilterSelected}
                  fromDate={fromDate}
                  toDate={toDate}
                  setFromDate={setFromDate}
                  setToDate={setToDate}
                  onApply={handleFilterApply}
                  onClear={handleClearFilter}
                />
              </ListItem> */}
            </List>
          </div>
          <div className={Style['sidebar-accordian']}>
            {/* <SidebarAccordion
              title={`Pinned Chats ${pinnedChats ? `(${pinnedChats?.count})` : ''}`}
              icon="/images/sidebar-Pin.svg"
              expanded={expanded}
              panelKey="panel1"
              handleAccordionChange={handleAccordionChange}
              closeDocumentSummary={selectedDocIdNull}
              expandPanel={() => setExpanded('panel1')}
            >
              <DynamicPinnedMessagesList
                searchVal={searchValue}
                fromDateVal={fromDate}
                toDateVal={toDate}
                handlePinnedAnswerClick={handlePinnedAnswerClick}
                resetTrigger={resetTrigger}
              />
            </SidebarAccordion> */}

            <SidebarAccordion
              title={`AI Chat History ${threadList ? `(${threadList.count})` : ''}`}
              icon="messages"
              matchPath="/ai-chats"
              expanded={expanded}
              panelKey="panel2"
              handleAccordionChange={handleAccordionChange}
              closeDocumentSummary={selectedDocIdNull}
              expandPanel={() => setExpanded('panel2')}
              handleClickOpenSidebar={handleOpenSidebar}
              isOpen={isOpen}
              expandedNested={expandedNested}
              setExpandedNested={setExpandedNested}
              // innerAccordions={[
              //   {
              //     panelKey: 'nested2',
              //     title: 'AI Chat History',
              //     // icon: '',
              //     children: (
              //       <DynamicThreadsList
              //         searchVal={searchValue}
              //         fromDateVal={fromDate}
              //         toDateVal={toDate}
              //         handleThreadClick={handleThreadClick}
              //         resetTrigger={resetTrigger}
              //       />
              //     ),
              //   },
              //   {
              //     panelKey: 'nested1',
              //     title: 'Pinned AI Chats',
              //     // icon: '',
              //     children: (
              //       <DynamicPinnedMessagesList
              //         searchVal={searchValue}
              //         fromDateVal={fromDate}
              //         toDateVal={toDate}
              //         handlePinnedAnswerClick={handlePinnedAnswerClick}
              //         resetTrigger={resetTrigger}
              //       />
              //     ),
              //   },
              // ]}
            >
              <div className={Style['sidebar-list']}>
                <List className={Style['sidebar-list-details']}>
                  <ListItem style={{ display: 'block' }}>
                    <div className={Style['search']}>
                      <Box className={Style['search-box']}>
                        <TextField
                          fullWidth
                          type="text"
                          id="search-input"
                          name="search"
                          value={search}
                          placeholder="Search here"
                          onChange={(e) => handleTextInput(e.target.value)}
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
                          onClick={() =>
                            search?.length > 0 && handleClearSearch()
                          }
                        >
                          {!search.trim() ? (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.53492 11.3413C9.30241 11.3413 11.5459 9.09782 11.5459 6.33033C11.5459 3.56283 9.30241 1.31934 6.53492 1.31934C3.76742 1.31934 1.52393 3.56283 1.52393 6.33033C1.52393 9.09782 3.76742 11.3413 6.53492 11.3413Z"
                                stroke="var(--Icon-Color)"
                                stroke-width="1.67033"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M14.8866 14.6815L11.5459 11.3408"
                                stroke="var(--Icon-Color)"
                                stroke-width="1.67033"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7.1 18.3C6.7134 18.6866 6.0866 18.6866 5.7 18.3C5.3134 17.9134 5.3134 17.2866 5.7 16.9L9.89289 12.7071C10.2834 12.3166 10.2834 11.6834 9.89289 11.2929L5.7 7.1C5.3134 6.7134 5.3134 6.0866 5.7 5.7C6.0866 5.3134 6.7134 5.3134 7.1 5.7L11.2929 9.89289C11.6834 10.2834 12.3166 10.2834 12.7071 9.89289L16.9 5.7C17.2866 5.3134 17.9134 5.3134 18.3 5.7C18.6866 6.0866 18.6866 6.7134 18.3 7.1L14.1071 11.2929C13.7166 11.6834 13.7166 12.3166 14.1071 12.7071L18.3 16.9C18.6866 17.2866 18.6866 17.9134 18.3 18.3C17.9134 18.6866 17.2866 18.6866 16.9 18.3L12.7071 14.1071C12.3166 13.7166 11.6834 13.7166 11.2929 14.1071L7.1 18.3Z"
                                fill="var(--Icon-Color)"
                              />
                            </svg>
                          )}
                        </Button>
                        <Box className={Style['filter-btn-box']}>
                          <Button
                            className={`${Style['search-btn']} ${Style['filter-btn']} ${isSearchOpen ? Style['active'] : ''}`}
                            onClick={handleToggleFilter}
                          >
                            <svg
                              width="14"
                              height="10"
                              viewBox="0 0 14 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.32411 9.26749C6.11045 9.26749 5.93128 9.19533 5.78661 9.05099C5.64206 8.90655 5.56978 8.7276 5.56978 8.51416C5.56978 8.30072 5.64295 8.12077 5.78928 7.97433C5.93573 7.82799 6.11534 7.75483 6.32811 7.75483H7.67345C7.88711 7.75483 8.06628 7.82799 8.21095 7.97433C8.3555 8.12077 8.42778 8.30072 8.42778 8.51416C8.42778 8.7276 8.35461 8.90655 8.20828 9.05099C8.06184 9.19533 7.88223 9.26749 7.66945 9.26749H6.32411ZM3.63361 5.75483C3.41984 5.75483 3.24067 5.68266 3.09611 5.53833C2.95156 5.39388 2.87928 5.21494 2.87928 5.00149C2.87928 4.78805 2.95156 4.6081 3.09611 4.46166C3.24067 4.31533 3.41984 4.24216 3.63361 4.24216H10.3599C10.5737 4.24216 10.7529 4.31533 10.8974 4.46166C11.042 4.6081 11.1143 4.78805 11.1143 5.00149C11.1143 5.21494 11.042 5.39388 10.8974 5.53833C10.7529 5.68266 10.5737 5.75483 10.3599 5.75483H3.63361ZM1.61761 2.24216C1.40384 2.24216 1.22467 2.16994 1.08011 2.02549C0.935559 1.88116 0.863281 1.70227 0.863281 1.48883C0.863281 1.27538 0.936448 1.09544 1.08278 0.948992C1.22923 0.802659 1.40884 0.729492 1.62161 0.729492H12.3799C12.5937 0.729492 12.7729 0.802659 12.9174 0.948992C13.062 1.09544 13.1343 1.27538 13.1343 1.48883C13.1343 1.70227 13.0611 1.88116 12.9148 2.02549C12.7683 2.16994 12.5887 2.24216 12.3759 2.24216H1.61761Z"
                                fill={
                                  !isFilterVisible === true
                                    ? 'var(--Icon-Color)'
                                    : 'var(--Txt-On-Gradient)'
                                }
                              />
                            </svg>
                          </Button>
                        </Box>
                      </Box>
                    </div>
                    <DateSelectionFilter
                      isFilterVisible={isFilterVisible}
                      setIsFilterVisible={setIsFilterVisible}
                      isFilterSelected={isFilterSelected}
                      setIsFilterSelected={setIsFilterSelected}
                      fromDate={fromDate}
                      toDate={toDate}
                      setFromDate={setFromDate}
                      setToDate={setToDate}
                      onApply={handleFilterApply}
                      onClear={handleClearFilter}
                    />
                  </ListItem>
                </List>
              </div>
              <DynamicThreadsList
                searchVal={searchValue}
                fromDateVal={fromDate}
                toDateVal={toDate}
                handleThreadClick={handleThreadClick}
                resetTrigger={resetTrigger}
              />
            </SidebarAccordion>

            <SidebarButton
              btnTitle={'Log Incident'}
              iconPath="logIncident"
              handleBtnClick={handleLogIncidentClick}
              isOpen={isOpen}
              matchPath="/log-incident"
            />
            <SidebarButton
              btnTitle={'View Documents'}
              iconPath="documents"
              handleBtnClick={handleDocumentClick}
              isOpen={isOpen}
              matchPath="/documents"
            />
            <SidebarButton
              btnTitle={'Export Summaries'}
              iconPath="reportDocuments"
              handleBtnClick={handleDocReport}
              isOpen={isOpen}
              matchPath="/download-doc-report"
            />

            {/* {isOpen ? (
              <SidebarAccordion
                title="View Documents"
                icon="/images/manage-document.svg"
                expanded={expanded}
                panelKey="panel3"
                handleAccordionChange={handleAccordionChange}
                expandPanel={() => setExpanded('panel3')}
              >
                <SidebarButton
                  btnTitle={'Documents'}
                  iconPath={'/images/note-2.svg'}
                  handleBtnClick={handleDocumentClick}
                />

                <SidebarButton
                  btnTitle={'Reports'}
                  iconPath={'/images/report-icon.svg'}
                  handleBtnClick={handleDocReport}
                />
              </SidebarAccordion>
            ) : (
              <>
                <SidebarButton
                  btnTitle={'Documents'}
                  iconPath={'/images/note-2.svg'}
                  handleBtnClick={handleDocumentClick}
                />
                <SidebarButton
                  btnTitle={'Reports'}
                  iconPath={'/images/report-icon.svg'}
                  handleBtnClick={handleDocReport}
                />
              </>
            )} */}
          </div>
        </div>

        <div className={Style['storage-main-body']}>
          <div className={Style['storage-main']}>
            {usageData.map((item, idx) => {
              const value = (Number(item.used) / Number(item.total)) * 100;

              return (
                <Box key={idx} className={Style['storage-body']}>
                  <Typography variant="body1" className={Style['storage-head']}>
                    <Typography
                      variant="body1"
                      className={Style['storage-head']}
                      sx={{ flex: '1 1 ' }}
                    >
                      {item.label}{' '}
                    </Typography>

                    {fetchedUser?.active_subscription?.status === 1 ||
                    fetchedUser?.staff_user ? (
                      <Typography component="span">
                        {item.used}/
                        {fetchedUser?.staff_user ? 'Unlimited' : item.total}
                      </Typography>
                    ) : (
                      <Typography component="span">{item.used}</Typography>
                    )}
                    {item.gracePoint === false &&
                      value === 100 &&
                      !fetchedUser?.staff_user &&
                      item?.total !== 'Unlimited' && (
                        <Tooltip title={item.title} placement="right" arrow>
                          <Typography
                            component="span"
                            className={Style['grace-points']}
                          >
                            +1
                          </Typography>
                        </Tooltip>
                      )}
                  </Typography>
                  <Box className={Style['storage-body-inner']}>
                    <ColoredLinearProgress
                      variant="determinate"
                      value={value}
                      $barColor={getColor(value)}
                      sx={{ maxWidth: '100%', width: '100%' }}
                    />
                    {item.gracePoint === false &&
                      value === 100 &&
                      // !fetchedUser?.staff_user &&
                      item?.total !== 'Unlimited' && (
                        <ColoredLinearProgress
                          variant="determinate"
                          value={0}
                          $barColor={
                            getGracePointColor(item.gracePoint) ?? '#A6152B'
                          }
                          sx={{ width: '25px', flex: '1 1 auto' }}
                        />
                      )}
                  </Box>
                </Box>
              );
            })}
          </div>
          <Box className={Style['close-storage']}>
            <Box onClick={handleOpen} className={Style['close-storage-inner']}>
              {/* {theme === 'dark' ? ( */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.2526 5.21206C15.7726 3.58456 14.4151 2.22706 12.7876 1.74706C11.5501 1.38706 10.6951 1.41706 10.1026 1.85956C9.39012 2.39206 9.30762 3.35206 9.30762 4.03456V5.90206C9.30762 7.74706 10.1476 8.68456 11.7976 8.68456H13.9501C14.6251 8.68456 15.5926 8.60206 16.1251 7.88956C16.5826 7.30456 16.6201 6.44956 16.2526 5.21206Z"
                  fill="var(--Icon-Color)"
                />
                <path
                  d="M14.1825 10.0199C13.9875 9.79487 13.7025 9.66737 13.41 9.66737H10.725C9.40505 9.66737 8.33255 8.59487 8.33255 7.27487V4.58987C8.33255 4.29737 8.20505 4.01237 7.98005 3.81737C7.76255 3.62237 7.46255 3.53237 7.17755 3.56987C5.41505 3.79487 3.79505 4.76237 2.73755 6.21737C1.67255 7.67987 1.28255 9.46487 1.62005 11.2499C2.10755 13.8299 4.17005 15.8924 6.75755 16.3799C7.17005 16.4624 7.58255 16.4999 7.99505 16.4999C9.35255 16.4999 10.665 16.0799 11.7825 15.2624C13.2375 14.2049 14.205 12.5849 14.43 10.8224C14.4675 10.5299 14.3775 10.2374 14.1825 10.0199Z"
                  fill="var(--Icon-Color)"
                />
              </svg>
              {/* // ) : (
              //   <Image
              //     src="/images/graph.svg"
              //     alt="graph"
              //     width={18}
              //     height={18}
              //   />
              // )} */}
            </Box>
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            BackdropProps={{
              sx: {
                backgroundColor: 'transparent',
              },
            }}
            className={Style['modal-box']}
          >
            <Box className={Style['storage-main']}>
              {usageData.map((item, idx) => {
                const value = (Number(item.used) / Number(item.total)) * 100;

                return (
                  <Box key={idx} className={Style['storage-body']}>
                    <Typography
                      variant="body1"
                      className={Style['storage-head']}
                    >
                      <Typography
                        variant="body1"
                        className={Style['storage-head']}
                        sx={{ flex: '1 1 ' }}
                      >
                        {item.label}{' '}
                      </Typography>
                      {fetchedUser?.active_subscription?.status === 1 ||
                      fetchedUser?.staff_user ? (
                        <Typography component="span">
                          {item.used}/
                          {fetchedUser?.staff_user ? 'Unlimited' : item.total}
                        </Typography>
                      ) : (
                        <Typography component="span">{item.used}</Typography>
                      )}
                      {item.gracePoint === false &&
                        value === 100 &&
                        !fetchedUser?.staff_user &&
                        item?.total !== 'Unlimited' && (
                          <Tooltip title={item.title} placement="right" arrow>
                            <Typography
                              component="span"
                              className={Style['grace-points']}
                            >
                              +1
                            </Typography>
                          </Tooltip>
                        )}
                    </Typography>

                    <Box className={Style['storage-body-inner']}>
                      <ColoredLinearProgress
                        variant="determinate"
                        value={value}
                        $barColor={getColor(value)}
                        sx={{ maxWidth: '100%', width: '100%' }}
                      />
                      {item.gracePoint === false &&
                        value === 100 &&
                        // !fetchedUser?.staff_user &&
                        item?.total !== 'Unlimited' && (
                          <ColoredLinearProgress
                            variant="determinate"
                            value={0}
                            $barColor={
                              getGracePointColor(item.gracePoint) ?? '#A6152B'
                            }
                            sx={{ width: '25px', flex: '1 1 auto' }}
                          />
                        )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
