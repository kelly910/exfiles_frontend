'use client';
import React, { useMemo, useState } from 'react';

// css
import Style from '@components/Common/Sidebar.module.scss';

// Third party imports
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import debounce from 'lodash.debounce';
import { Dayjs } from 'dayjs';

// MUI Components
import ListItem from '@mui/material/ListItem';
import { Box, List, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import SidebarAccordion from '@components/Common/SidebarAccordion';

// Custom Components
import DynamicThreadsList from '@components/Common/DynamicThreadsList';
import DynamicPinnedMessagesList from '@components/Common/DynamicPinnedMessagesList';
import SidebarButton from '@components/Common/SidebarButton';
import DateSelectionFilter from '@components/Common/DateSelectionFilter';
import LogModel from '@components/LogModel/LogModel';

// Redux imports
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  selectPinnedMessagesList,
  selectThreadsList,
  setActiveThread,
} from '@/app/redux/slices/Chat';
import { PinnedAnswerMessage } from '@/app/redux/slices/Chat/chatTypes';
import { clearPageHeaderData } from '@/app/redux/slices/login';
import { fetchCategories } from '@/app/redux/slices/categoryListing';

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
  const [searchValue, setSearchValue] = useState('');

  const [openIncidentModel, setOpenIncidentModel] = useState(false);
  const threadList = useAppSelector(selectThreadsList);
  const pinnedChats = useAppSelector(selectPinnedMessagesList);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterSelected, setIsFilterSelected] = useState(false);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  const openLogIncidentModel = () => {
    setOpenIncidentModel(true);
  };

  if (isSearchOpen && !isOpen) {
    setIsSearchOpen(false);
  }

  const handleToggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
    setIsSearchOpen((prev) => !prev);
  };
  const [expanded, setExpanded] = useState<boolean | string>(''); // Track which accordion is expanded

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
        }
      });
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

  const handleTextInput = (inputValue: string) => {
    const trimmed = inputValue.trim();
    setSearch(trimmed);
    if (inputValue == '') {
      handleClearSearch();
    } else {
      debouncedSearch(trimmed);
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    setSearchValue('');
    setResetTrigger((prev) => prev + 1);
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
            <SidebarAccordion
              title={`Pinned Chats ${pinnedChats ? `(${pinnedChats?.count})` : ''}`}
              icon="/images/sidebar-Pin.svg"
              expanded={expanded}
              panelKey="panel1"
              handleAccordionChange={handleAccordionChange}
            >
              <DynamicPinnedMessagesList
                searchVal={searchValue}
                fromDateVal={fromDate}
                toDateVal={toDate}
                handlePinnedAnswerClick={handlePinnedAnswerClick}
                resetTrigger={resetTrigger}
              />
            </SidebarAccordion>

            <SidebarAccordion
              title={`All Chats ${threadList ? `(${threadList.count})` : ''}`}
              icon="/images/messages.svg"
              expanded={expanded}
              panelKey="panel2"
              handleAccordionChange={handleAccordionChange}
            >
              <DynamicThreadsList
                searchVal={searchValue}
                fromDateVal={fromDate}
                toDateVal={toDate}
                handleThreadClick={handleThreadClick}
                resetTrigger={resetTrigger}
              />
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
          <div
            className={Style['sidebar-btm-card']}
            onClick={openLogIncidentModel}
          >
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
      {openIncidentModel && (
        <LogModel
          open={openIncidentModel}
          handleClose={() => setOpenIncidentModel(false)}
          editedData={null}
        />
      )}
    </>
  );
};

export default Sidebar;
