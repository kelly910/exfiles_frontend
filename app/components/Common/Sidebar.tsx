'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Style from './Sidebar.module.scss';
import ListItem from '@mui/material/ListItem';
import { Box, List, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Image from 'next/image';
import SidebarAccordion from './SidebarAccordion';
import { useAppDispatch } from '@/app/redux/hooks';
import {
  fetchPinnedMessagesList,
  fetchThreadList,
  setActiveThread,
} from '@/app/redux/slices/Chat';
import ThreadList from './ThreadsList';
import PinnedMessagesList from './PinnedMessagesList';
import {
  GetThreadListResponse,
  PinnedAnswerMessage,
  PinnedAnswerMessagesResponse,
} from '@/app/redux/slices/Chat/chatTypes';
import NoRecordFound from './NoRecordFound';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SidebarButton from '@components/Common/SidebarButton';
import { clearPageHeaderData } from '@/app/redux/slices/login';
import { fetchCategories } from '@/app/redux/slices/categoryListing';
import debounce from 'lodash.debounce';
import { ErrorResponse, handleError } from '@/app/utils/handleError';

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

  const handleSearch = async (inputValue: string) => {
    try {
      const [threadsRes, pinnedRes] = await Promise.all([
        dispatch(fetchThreadList({ page: 1, search: inputValue })),
        dispatch(fetchPinnedMessagesList({ page: 1, search: inputValue })),
      ]);
      if (fetchThreadList.fulfilled.match(threadsRes)) {
        setInitialAllChatsData(threadsRes.payload);
      }
      if (fetchPinnedMessagesList.fulfilled.match(pinnedRes)) {
        setInitialAllPinnedChatsData(pinnedRes.payload);
      }
    } catch (error) {
      handleError(error as ErrorResponse);
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((inputValue: string) => {
        handleSearch(inputValue);
      }, 300),
    []
  );

  const handleTextInput = (inputValue: string) => {
    const trimmed = inputValue.trim();
    setSearch(trimmed);
    debouncedSearch(trimmed);
  };

  const clearSearch = async () => {
    setSearch('');
    const [defaultThreads, defaultPinned] = await Promise.all([
      getThreadList(1),
      getPinnedMessagesList(1),
    ]);
    setInitialAllChatsData(defaultThreads);
    setInitialAllPinnedChatsData(defaultPinned);
    setIsSearchOpen(false);
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
            <Button
              className={`${Style['right']} ${isSearchOpen ? Style['active'] : ''}`}
              onClick={handleToggleSearch}
            >
              <Link href="#">
                <Image
                  src="/images/search-sidebar.svg"
                  alt="sidebar-hide-icon"
                  width={16}
                  height={16}
                />
              </Link>
            </Button>
            <div className={Style['search']}>
              <Box>
                <TextField
                  // as={TextField}
                  fullWidth
                  type="text"
                  id="email"
                  name="email"
                  value={search}
                  placeholder="Search here"
                  onChange={(e) => handleTextInput(e.target.value)}
                  // error={Boolean(errors.email && touched.email)}
                  sx={{
                    marginTop: '0',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      borderWidth: '0px',
                      color: 'var(--Primary-Text-Color)',
                      backgroundColor: 'var(--Input-Box-Colors)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        top: '-10px !important',
                      },
                      '& .MuiOutlinedInput-input': {
                        fontSize: 'var(--SubTitle-3)',
                        color: 'var(--Primary-Text-Color)',
                        padding: '8px 40px 8px 12px',
                        fontWeight: 'var(--Regular)',
                        borderRadius: '10px',
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
                  }}
                />
                <Button className={Style['search-btn']} onClick={clearSearch}>
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
              </Box>
            </div>
          </div>
          <div className={Style['sidebar-list']}>
            <List className={Style['sidebar-list-details']}>
              {isSearchOpen ? (
                <div className={Style['search']}>
                  <Box>
                    <TextField
                      // as={TextField}
                      fullWidth
                      type="text"
                      id="email"
                      name="email"
                      placeholder="Search here"
                      onChange={(e) => handleTextInput(e.target.value)}
                      // error={Boolean(errors.email && touched.email)}
                      sx={{
                        marginTop: '0',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          borderWidth: '0px',
                          color: 'var(--Primary-Text-Color)',
                          backgroundColor: 'var(--Input-Box-Colors)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            top: '-10px !important',
                          },
                          '& .MuiOutlinedInput-input': {
                            fontSize: 'var(--SubTitle-3)',
                            color: 'var(--Primary-Text-Color)',
                            padding: '10px 40px 10px 12px',
                            fontWeight: 'var(--Regular)',
                            borderRadius: '10px',
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
                      }}
                    />
                    <Button
                      className={Style['search-btn']}
                      onClick={handleToggleSearch}
                    >
                      <Image
                        src="/images/close.svg"
                        alt="sidebar-hide-icon"
                        width={16}
                        height={16}
                        onClick={clearSearch}
                      />
                    </Button>
                  </Box>
                </div>
              ) : (
                <ListItem>
                  <Link
                    href="/ai-chats"
                    className={Style['sidebar-btn']}
                    onClick={handleStartNewChat}
                  >
                    <span className={Style['btn-text']}>Start New Chat</span>{' '}
                    <span>
                      <Image
                        src="/images/add-icon.svg"
                        alt="icon"
                        width={20}
                        height={20}
                      />
                    </span>{' '}
                  </Link>
                </ListItem>
              )}
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

              {initialAllPinnedChatsData?.count === 0 && search && (
                <NoRecordFound title={'No Match Found'} />
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

              {initialAllChatsData?.count === 0 && search && (
                <NoRecordFound title={'No Match Found'} />
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
