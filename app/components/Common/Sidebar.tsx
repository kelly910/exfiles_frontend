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
import DynamicPinnedMessagesList from '@components/Common/DynamicPinnedMessagesList';
import SidebarButton from '@components/Common/SidebarButton';
import DateSelectionFilter from '@components/Common/DateSelectionFilter';

// Redux imports
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  selectPinnedMessagesList,
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
  const pinnedChats = useAppSelector(selectPinnedMessagesList);
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

  const getColor = (value: number) => {
    if (fetchedUser?.active_subscription?.status === 1) {
      if (value <= 80) return 'var(--Main-Gradient)'; // Gradient
      if (value <= 90) return '#FF7E22'; // Orange
      if (value == 100) return '#E72240'; // Red
      return 'var(--Subtext-Color)'; // Gradient
    } else {
      return 'var(--Subtext-Color)'; // Gradient
    }
  };

  const getGracePointColor = (value: boolean) => {
    console.log(value, 'value');
    if (fetchedUser?.active_subscription?.status === 1) {
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
        backgroundColor: 'var(--Stroke-Color)',
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
                        onClick={handleToggleFilter}
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
              title={`All Chats ${threadList ? `(${threadList.count + pinnedChats?.count})` : ''}`}
              icon="/images/messages.svg"
              expanded={expanded}
              panelKey="panel2"
              handleAccordionChange={handleAccordionChange}
              closeDocumentSummary={selectedDocIdNull}
              expandPanel={() => setExpanded('panel2')}
              handleClickOpenSidebar={handleOpenSidebar}
              isOpen={isOpen}
              expandedNested={expandedNested}
              setExpandedNested={setExpandedNested}
              innerAccordions={[
                {
                  panelKey: 'nested1',
                  title: 'Pinned Chats',
                  // icon: '',
                  children: (
                    <DynamicPinnedMessagesList
                      searchVal={searchValue}
                      fromDateVal={fromDate}
                      toDateVal={toDate}
                      handlePinnedAnswerClick={handlePinnedAnswerClick}
                      resetTrigger={resetTrigger}
                    />
                  ),
                },
                {
                  panelKey: 'nested2',
                  title: 'Chat History',
                  // icon: '',
                  children: (
                    <DynamicThreadsList
                      searchVal={searchValue}
                      fromDateVal={fromDate}
                      toDateVal={toDate}
                      handleThreadClick={handleThreadClick}
                      resetTrigger={resetTrigger}
                    />
                  ),
                },
              ]}
            >
              {/* <div className={Style['sidebar-pinned-chats']}>
                <span>Pinned Chats</span>
                <DynamicPinnedMessagesList
                  searchVal={searchValue}
                  fromDateVal={fromDate}
                  toDateVal={toDate}
                  handlePinnedAnswerClick={handlePinnedAnswerClick}
                  resetTrigger={resetTrigger}
                />
              </div> */}
              {/* <div className={Style['sidebar-pinned-chats']}>
                <span>Chat History</span>
                <DynamicThreadsList
                  searchVal={searchValue}
                  fromDateVal={fromDate}
                  toDateVal={toDate}
                  handleThreadClick={handleThreadClick}
                  resetTrigger={resetTrigger}
                />
              </div> */}
            </SidebarAccordion>

            <SidebarButton
              btnTitle={'Log Incident'}
              iconPath={'/images/log-incident-sidebar.svg'}
              handleBtnClick={handleLogIncidentClick}
              isOpen={isOpen}
            />
            <SidebarButton
              btnTitle={'View Documents'}
              iconPath={'/images/note-2.svg'}
              handleBtnClick={handleDocumentClick}
              isOpen={isOpen}
            />
            <SidebarButton
              btnTitle={'Export Summaries'}
              iconPath={'/images/report-icon.svg'}
              handleBtnClick={handleDocReport}
              isOpen={isOpen}
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

                    {fetchedUser?.active_subscription?.status === 1 ? (
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
                      !fetchedUser?.staff_user &&
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
              <Image
                src="/images/graph.svg"
                alt="graph"
                width={18}
                height={18}
              />
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
                      {fetchedUser?.active_subscription?.status === 1 ? (
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
                        !fetchedUser?.staff_user &&
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
