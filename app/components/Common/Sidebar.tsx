'use client';
import React, { useEffect, useRef, useState } from 'react';
import Style from './Sidebar.module.scss';
import ListItem from '@mui/material/ListItem';
import { Box, Link, List, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Image from 'next/image';
// import { useRouter } from 'next/navigation';
import SidebarAccordion from './SidebarAccordion';
import { useAppDispatch } from '@/app/redux/hooks';
import {
  fetchPinnedMessagesList,
  fetchThreadList,
} from '@/app/redux/slices/Chat';
import ThreadList from './ThreadsList';
import PinnedMessagesList from './PinnedMessagesList';
import {
  GetThreadListResponse,
  PinnedAnswerMessage,
  PinnedAnswerMessagesResponse,
} from '@/app/redux/slices/Chat/chatTypes';
import NoRecordFound from './NoRecordFound';

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
  // const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };
  const [expanded, setExpanded] = useState<boolean | string>('panel1'); // Track which accordion is expanded

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

  useEffect(() => {
    getThreadList(1);
    getPinnedMessagesList(1);
  }, []);

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
          <Link href="#" className={Style['opensidebar-logo']}>
            <Image src="/images/logo.svg" alt="logo" width={200} height={44} />
          </Link>
          <Link href="#" className={Style['close-sidebar-logo']}>
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
                  placeholder="Enter Email Address here"
                  onChange={(e) => setSearch(e.target.value)}
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
                      placeholder="Enter Email Address here"
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
                      />
                    </Button>
                  </Box>
                </div>
              ) : (
                <ListItem>
                  <Link
                    href="#"
                    underline="none"
                    className={Style['sidebar-btn']}
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
              title={`Pinned Chats ${initialAllPinnedChatsData ? initialAllPinnedChatsData?.count : ''}`}
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
              title={`All Chatss ${initialAllChatsData ? `(${initialAllChatsData?.count})` : ''}`}
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

            <SidebarAccordion
              title={'Documents'}
              icon="/images/document-text.svg"
              expanded={expanded}
              panelKey="panel3"
              handleAccordionChange={handleAccordionChange}
            ></SidebarAccordion>

            <SidebarAccordion
              title={'Log Incident'}
              icon="/images/log-incident-sidebar.svg"
              expanded={expanded}
              panelKey="panel4"
              handleAccordionChange={handleAccordionChange}
            ></SidebarAccordion>
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
