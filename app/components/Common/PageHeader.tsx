'use client';

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import styles from './Header.module.scss';
import React, { useEffect, useState } from 'react';
import SettingDialog from '@components/SettingDialog/SettingDialog';
import LogoutDialog from '@components/LogoutDialog/LogoutDialog';

import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import FeedbackDialog from '@components/FeedBackDialog/FeedBackDialog';
import { fetchCategories } from '@/app/redux/slices/categoryListing';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import TemporaryDrawer from '@components/Drawer/Drawer';
import { usePathname, useRouter } from 'next/navigation';
import {
  selectPageHeaderData,
  setPageHeaderData,
} from '@/app/redux/slices/login';
import { selectActiveThread } from '@/app/redux/slices/Chat';
import UpgradeTime from '../Upgrade-Time/UpgradeTime';
import HelpDeskDialog from '../HelpDeskDialog/HelpDeskDialog';
import { useThemeMode } from '@/app/utils/ThemeContext';

interface PageHeaderProps {
  toggleSidebar: () => void;
  title?: string;
  isSidebarOpen: boolean;
  handleOpenSidebarFromLogIncident?: () => void;
}

export default function PageHeader({
  toggleSidebar,
  isSidebarOpen,
  handleOpenSidebarFromLogIncident,
}: PageHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const selectedActiveChat = useAppSelector(selectActiveThread);

  const selectedPageHeaderData = useAppSelector(selectPageHeaderData);
  const pages = ['Products', 'Pricing', 'Blog'];
  const [openSettingDialog, setOpenSettingDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [openCountDownDialog, setOpenCountDownDialog] = useState(false);
  const SettingsIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.2051 4.06508L10.3276 1.82258C9.58506 1.39508 8.42256 1.39508 7.68006 1.82258L3.76506 4.08008C2.21256 5.13008 2.12256 5.28758 2.12256 6.96008V11.0326C2.12256 12.7051 2.21256 12.8701 3.79506 13.9351L7.67256 16.1776C8.04756 16.3951 8.52756 16.5001 9.00006 16.5001C9.47256 16.5001 9.95256 16.3951 10.3201 16.1776L14.2351 13.9201C15.7876 12.8701 15.8776 12.7126 15.8776 11.0401V6.96008C15.8776 5.28758 15.7876 5.13008 14.2051 4.06508ZM9.00006 11.4376C7.65756 11.4376 6.56256 10.3426 6.56256 9.00008C6.56256 7.65758 7.65756 6.56258 9.00006 6.56258C10.3426 6.56258 11.4376 7.65758 11.4376 9.00008C11.4376 10.3426 10.3426 11.4376 9.00006 11.4376Z"
        fill="var(--Icon-Color)"
      />
    </svg>
  );
  const MyPlanIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5 4.28311V11.4681C16.5 13.5381 14.82 15.2181 12.75 15.2181H5.24999C4.90499 15.2181 4.57499 15.1731 4.25249 15.0831C3.78749 14.9556 3.63749 14.3631 3.98249 14.0181L11.955 6.04561C12.12 5.88061 12.3675 5.84311 12.6 5.88811C12.84 5.93311 13.1025 5.86561 13.29 5.68561L15.2175 3.75061C15.9225 3.04561 16.5 3.27811 16.5 4.28311Z"
        fill="var(--Icon-Color)"
      />
      <path
        d="M10.98 5.51965L3.1275 13.3721C2.7675 13.7321 2.1675 13.6421 1.9275 13.1921C1.65 12.6821 1.5 12.0896 1.5 11.4671V4.28215C1.5 3.27715 2.0775 3.04465 2.7825 3.74965L4.7175 5.69215C5.01 5.97715 5.49 5.97715 5.7825 5.69215L8.4675 2.99965C8.76 2.70715 9.24 2.70715 9.5325 2.99965L10.9875 4.45465C11.2725 4.74715 11.2725 5.22715 10.98 5.51965Z"
        fill="var(--Icon-Color)"
      />
    </svg>
  );
  const LogoutIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.4 1.5H7.35C9.75 1.5 11.25 3 11.25 5.4V8.4375H6.5625C6.255 8.4375 6 8.6925 6 9C6 9.3075 6.255 9.5625 6.5625 9.5625H11.25V12.6C11.25 15 9.75 16.5 7.35 16.5H5.4075C3.0075 16.5 1.5075 15 1.5075 12.6V5.4C1.5 3 3 1.5 5.4 1.5Z"
        fill="var(--Icon-Color)"
      />
      <path
        d="M14.5799 8.43738L13.0274 6.88488C12.9149 6.77238 12.8624 6.62988 12.8624 6.48738C12.8624 6.34488 12.9149 6.19488 13.0274 6.08988C13.2449 5.87238 13.6049 5.87238 13.8224 6.08988L16.3349 8.60238C16.5524 8.81988 16.5524 9.17988 16.3349 9.39738L13.8224 11.9099C13.6049 12.1274 13.2449 12.1274 13.0274 11.9099C12.8099 11.6924 12.8099 11.3324 13.0274 11.1149L14.5799 9.56238H11.2499V8.43738H14.5799Z"
        fill="var(--Icon-Color)"
      />
    </svg>
  );
  const settings = [
    {
      title: 'Settings',
      img: <SettingsIcon />,
    },
    { title: 'My Plan', img: <MyPlanIcon /> },
    { title: 'Log out', img: <LogoutIcon /> },
  ];
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const isChatPage = pathname?.includes('/ai-chats');
  const isDocumentsPage = pathname?.includes('/documents');
  const isLogIncidentPage = pathname?.includes('/log-incident');
  const isDocumentDownloadPage = pathname?.includes('/download-doc-report');
  const isPlanPage = pathname?.includes('/plans');
  const isPaymentSuccessPage = pathname?.includes('/payment-successful');
  const isPaymentFailedPage = pathname?.includes('/payment-failed');
  const isPaymentPendingdPage = pathname?.includes('/payment-pending');
  const isUploadDocPage = pathname?.includes('/upload-doc');
  const isPaymentStatusPage =
    isPaymentSuccessPage || isPaymentFailedPage || isPaymentPendingdPage;

  useEffect(() => {
    if (selectedActiveChat?.name) {
      dispatch(
        setPageHeaderData({
          title: selectedActiveChat.name,
        })
      );
    }
  }, [selectedActiveChat]);

  useEffect(() => {
    // console.log(".")
  }, [isPlanPage]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (settingTitle: string) => {
    setAnchorElUser(null);
    if (settingTitle === 'Settings') {
      setOpenSettingDialog(true);
    } else if (settingTitle === 'My Plan') {
      router.push('/plans');
    } else {
      setOpenLogoutDialog(true);
    }
  };

  const handleOpenFeedback = () => {
    setOpenFeedbackDialog(true);
  };

  const loggedInUser = useSelector(
    (state: RootState) => state.login.loggedInUser
  );
  const firstName = loggedInUser?.data?.first_name;
  const lastName = loggedInUser?.data?.last_name;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategories({ page: 1 }));
    if (isUploadDocPage) {
      dispatch(
        setPageHeaderData({
          title: 'Upload Documents',
          subTitle: 'Upload your documents to get your answers and reports',
        })
      );
    }
  }, [dispatch]);

  const handleOpenCountdownDialog = () => {
    if (!loggedInUser?.data?.staff_user) {
      setOpenCountDownDialog(true);
    }
  };

  const [timerData, setTimerData] = useState([
    { value: '00', label: 'Days' },
    { value: '00', label: 'Hours' },
    { value: '00', label: 'Minutes' },
    { value: '00', label: 'Seconds' },
  ]);

  const expiryPlanDate =
    loggedInUser?.data?.active_subscription?.deactivate_date;

  const remainingDays = loggedInUser?.data?.remaining_days;

  useEffect(() => {
    if (!expiryPlanDate) {
      return;
    }

    const targetTime = new Date(expiryPlanDate);
    const istNow = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );

    const isSameDate = (date1: Date, date2: Date) =>
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();

    const showPopupDates = [
      new Date(
        targetTime.getFullYear(),
        targetTime.getMonth(),
        targetTime.getDate() - 1
      ), // 1 day before
      new Date(
        targetTime.getFullYear(),
        targetTime.getMonth(),
        targetTime.getDate() - 2
      ), // 2 days before
    ];

    const shouldShowPopup = showPopupDates.some((d) => isSameDate(d, istNow));
    if (!shouldShowPopup) {
      setOpenCountDownDialog(false);
      // return;
    }

    const updateCountdown = () => {
      const now = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
      );
      const diff = targetTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimerData([
          { value: '00', label: 'Days' },
          { value: '00', label: 'Hours' },
          { value: '00', label: 'Minutes' },
          { value: '00', label: 'Seconds' },
        ]);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimerData([
        { value: String(days).padStart(2, '0'), label: 'Days' },
        { value: String(hours).padStart(2, '0'), label: 'Hours' },
        { value: String(minutes).padStart(2, '0'), label: 'Minutes' },
        { value: String(seconds).padStart(2, '0'), label: 'Seconds' },
      ]);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [expiryPlanDate]);

  const [openHelpDeskDialog, setOpenHelpDeskDialog] = useState(false);

  const handleClickHelpDeskDialog = () => {
    setOpenHelpDeskDialog(true);
  };

  const { theme, toggleTheme } = useThemeMode();
  const SunIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--Icon-Color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-sun-icon"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );

  const SunMoonIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--Icon-Color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-sun-moon-icon"
    >
      <path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.9 4.9 1.4 1.4" />
      <path d="m17.7 17.7 1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.3 17.7-1.4 1.4" />
      <path d="m19.1 4.9-1.4 1.4" />
    </svg>
  );

  // dark Theme

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        className="nav-open header"
        sx={{
          backgroundColor: 'var(--Background-Color)',
          position: 'sticky',
          top: '0',
          maxHeight: '65px',
          height: '65px',
          padding: '0 24px 0 16px',
          '@media (max-width: 1200px)': {
            padding: '0 16px',
          },
          '.MuiContainer-root': {
            padding: '0',
          },
        }}
      >
        <Container maxWidth={false}>
          <Toolbar
            disableGutters
            sx={{ justifyContent: 'space-between', gap: '16px' }}
          >
            {!isPaymentStatusPage && (
              <Button
                onClick={toggleSidebar}
                className={styles.toggleBtnHedaer}
              >
                {isSidebarOpen ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.1 18.3C6.7134 18.6866 6.0866 18.6866 5.7 18.3C5.3134 17.9134 5.3134 17.2866 5.7 16.9L9.89289 12.7071C10.2834 12.3166 10.2834 11.6834 9.89289 11.2929L5.7 7.1C5.3134 6.7134 5.3134 6.0866 5.7 5.7C6.0866 5.3134 6.7134 5.3134 7.1 5.7L11.2929 9.89289C11.6834 10.2834 12.3166 10.2834 12.7071 9.89289L16.9 5.7C17.2866 5.3134 17.9134 5.3134 18.3 5.7C18.6866 6.0866 18.6866 6.7134 18.3 7.1L14.1071 11.2929C13.7166 11.6834 13.7166 12.3166 14.1071 12.7071L18.3 16.9C18.6866 17.2866 18.6866 17.9134 18.3 18.3C17.9134 18.6866 17.2866 18.6866 16.9 18.3L12.7071 14.1071C12.3166 13.7166 11.6834 13.7166 11.2929 14.1071L7.1 18.3Z"
                      fill="var(--Primary-Text-Color)"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="22"
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
                )}
              </Button>
            )}

            <Box className={styles.mobileLogo}>
              <Image
                src="/images/close-sidebar-logo.svg"
                alt="logo"
                width={40}
                height={38}
                onClick={() => router.push('/ai-chats')}
                style={{
                  filter:
                    theme === 'dark' ? 'brightness(1) invert(10)' : 'unset',
                }}
              />
            </Box>
            <Box sx={{ width: '100%' }} className={styles.docsHeader}>
              {isPaymentStatusPage && (
                <Box>
                  <Image
                    src="/images/logo.svg"
                    alt="logo"
                    width={200}
                    height={44}
                    style={{
                      filter:
                        theme === 'dark' ? 'brightness(1) invert(10)' : 'unset',
                    }}
                  />
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isChatPage &&
                  selectedActiveChat &&
                  (theme === 'dark' ? (
                    <Image
                      src="/images/messagesLight.svg"
                      alt="messages-icon"
                      width={18}
                      height={18}
                    />
                  ) : (
                    <Image
                      src="/images/messages.svg"
                      alt="messages-icon"
                      width={18}
                      height={18}
                    />
                  ))}
                {isDocumentsPage &&
                  (theme === 'dark' ? (
                    <Image
                      src="/images/note-2Light.svg"
                      alt="Documents-icon"
                      width={18}
                      height={18}
                    />
                  ) : (
                    <Image
                      src="/images/note-2.svg"
                      alt="Documents-icon"
                      width={18}
                      height={18}
                    />
                  ))}
                {isDocumentDownloadPage &&
                  (theme === 'dark' ? (
                    <Image
                      src="/images/report-iconLight.svg"
                      alt="Documents-icon"
                      width={18}
                      height={18}
                    />
                  ) : (
                    <Image
                      src="/images/report-icon.svg"
                      alt="Documents-icon"
                      width={18}
                      height={18}
                    />
                  ))}
                {isLogIncidentPage &&
                  (theme === 'dark' ? (
                    <Image
                      src="/images/log-incident-sidebarLight.svg"
                      alt="Log-incidents-icon"
                      width={18}
                      height={18}
                    />
                  ) : (
                    <Image
                      src="/images/log-incident-sidebar.svg"
                      alt="Log-incidents-icon"
                      width={18}
                      height={18}
                    />
                  ))}
                {isPlanPage &&
                  (theme === 'dark' ? (
                    <Image
                      src="/images/myPlanLight.svg"
                      alt="Log-incidents-icon"
                      width={18}
                      height={18}
                    />
                  ) : (
                    <Image
                      src="/images/myPlan.svg"
                      alt="Log-incidents-icon"
                      width={18}
                      height={18}
                    />
                  ))}
                {isUploadDocPage && (
                  <Image
                    src="/images/upload-doc-dark.svg"
                    alt="upload-doc-dark"
                    width={18}
                    height={18}
                  />
                )}
                {selectedPageHeaderData && selectedPageHeaderData.title && (
                  <Typography
                    variant="body1"
                    sx={{ display: 'flex' }}
                    className={styles.documentTitle}
                  >
                    {selectedPageHeaderData.title}
                  </Typography>
                )}
                {/* <IconButton
                  size="small"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  // onClick={handleOpenNavMenu}
                  color="inherit"
                ></IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  keepMounted
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                >
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography sx={{ textAlign: 'center' }}>
                        {page}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu> */}
              </Box>
              <Box>
                {/* Sub title of the Header */}
                {selectedPageHeaderData && selectedPageHeaderData.subTitle && (
                  <Typography variant="body1" className={styles.documentNo}>
                    {selectedPageHeaderData.subTitle}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                width: '100%',
                display: {
                  xs: 'none',
                  '@media (max-width:800px)': {
                    display: 'flex',
                  },
                },
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                sx={{ padding: '0' }}
              >
                {/* <MenuIcon /> */}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {(remainingDays === 1 || remainingDays === 2) &&
              !loggedInUser?.data?.staff_user && (
                <Button
                  onClick={handleOpenCountdownDialog}
                  className={styles.timeLog}
                >
                  <Box className={styles.timeLogInner}>
                    <Box className={styles.timeLogImage}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 3.875C6.01669 3.875 2.77502 7.11667 2.77502 11.1C2.77502 15.0833 6.01669 18.3333 10 18.3333C13.9834 18.3333 17.225 15.0917 17.225 11.1083C17.225 7.125 13.9834 3.875 10 3.875ZM10.625 10.8333C10.625 11.175 10.3417 11.4583 10 11.4583C9.65836 11.4583 9.37502 11.175 9.37502 10.8333V6.66667C9.37502 6.325 9.65836 6.04167 10 6.04167C10.3417 6.04167 10.625 6.325 10.625 6.66667V10.8333Z"
                          fill="var(--Icon-Color)"
                        />
                        <path
                          d="M12.4084 2.87533H7.5917C7.25837 2.87533 6.9917 2.60866 6.9917 2.27533C6.9917 1.94199 7.25837 1.66699 7.5917 1.66699H12.4084C12.7417 1.66699 13.0084 1.93366 13.0084 2.26699C13.0084 2.60033 12.7417 2.87533 12.4084 2.87533Z"
                          fill="var(--Icon-Color)"
                        />
                      </svg>
                    </Box>
                    <Box className={styles.timeLogTime}>
                      {timerData.map((item, index) => (
                        <>
                          <Typography variant="body2" component="p">
                            {item.value}
                          </Typography>

                          {index !== timerData.length - 1 && (
                            <>
                              <Typography variant="body2" component="span">
                                :
                              </Typography>
                            </>
                          )}
                        </>
                      ))}
                    </Box>
                  </Box>
                </Button>
              )}
            {isDocumentDownloadPage && (
              <Tooltip
                title={'Need Help? Watch a Quick Tour'}
                placement="bottom"
                arrow
              >
                <Button
                  sx={{ p: 0 }}
                  className={styles.messageButton}
                  onClick={handleClickHelpDeskDialog}
                >
                  {theme === 'dark' ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.74982 18.6508C2.33982 18.6508 1.99982 18.3108 1.99982 17.9008V12.2008C1.94982 9.49078 2.95982 6.93078 4.83982 5.01078C6.71982 3.10078 9.23982 2.05078 11.9498 2.05078C17.4898 2.05078 21.9998 6.56078 21.9998 12.1008V17.8008C21.9998 18.2108 21.6598 18.5508 21.2498 18.5508C20.8398 18.5508 20.4998 18.2108 20.4998 17.8008V12.1008C20.4998 7.39078 16.6698 3.55078 11.9498 3.55078C9.63982 3.55078 7.49982 4.44078 5.90982 6.06078C4.30982 7.69078 3.45982 9.86078 3.49982 12.1808V17.8908C3.49982 18.3108 3.16982 18.6508 2.74982 18.6508Z"
                        fill="var(--Icon-Color)"
                      />
                      <path
                        d="M5.94 12.4492H5.81C3.71 12.4492 2 14.1592 2 16.2592V18.1392C2 20.2392 3.71 21.9492 5.81 21.9492H5.94C8.04 21.9492 9.75 20.2392 9.75 18.1392V16.2592C9.75 14.1592 8.04 12.4492 5.94 12.4492Z"
                        fill="var(--Icon-Color)"
                      />
                      <path
                        d="M18.19 12.4492H18.06C15.96 12.4492 14.25 14.1592 14.25 16.2592V18.1392C14.25 20.2392 15.96 21.9492 18.06 21.9492H18.19C20.29 21.9492 22 20.2392 22 18.1392V16.2592C22 14.1592 20.29 12.4492 18.19 12.4492Z"
                        fill="var(--Icon-Color)"
                      />
                      <path
                        d="M17.5 20C17 20.8333 15.4 22.6 13 23"
                        stroke="var(--Icon-Color)"
                      />
                      <path
                        d="M13.0335 22H12.9665C11.8826 22 11 22.36 11 22.8021V23.1979C11 23.64 11.8826 24 12.9665 24H13.0335C14.1174 24 15 23.64 15 23.1979V22.8021C15 22.36 14.1174 22 13.0335 22Z"
                        fill="var(--Icon-Color)"
                      />
                    </svg>
                  ) : (
                    <Image
                      src="/images/report-info.svg"
                      alt="report-info"
                      width={20}
                      height={20}
                    />
                  )}
                </Button>
              </Tooltip>
            )}
            <Button onClick={toggleTheme} className={styles.messageButton}>
              {theme === 'dark' ? <SunIcon /> : <SunMoonIcon />}
            </Button>
            <Tooltip title={'Feedback'} placement="bottom" arrow>
              <Button
                sx={{ p: 0 }}
                className={styles.messageButton}
                onClick={handleOpenFeedback}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 2.42993H7C4 2.42993 2 4.42993 2 7.42993V13.4299C2 16.4299 4 18.4299 7 18.4299V20.5599C7 21.3599 7.89 21.8399 8.55 21.3899L13 18.4299H17C20 18.4299 22 16.4299 22 13.4299V7.42993C22 4.42993 20 2.42993 17 2.42993ZM12 14.5999C11.58 14.5999 11.25 14.2599 11.25 13.8499C11.25 13.4399 11.58 13.0999 12 13.0999C12.42 13.0999 12.75 13.4399 12.75 13.8499C12.75 14.2599 12.42 14.5999 12 14.5999ZM13.26 10.4499C12.87 10.7099 12.75 10.8799 12.75 11.1599V11.3699C12.75 11.7799 12.41 12.1199 12 12.1199C11.59 12.1199 11.25 11.7799 11.25 11.3699V11.1599C11.25 9.99993 12.1 9.42993 12.42 9.20993C12.79 8.95993 12.91 8.78993 12.91 8.52993C12.91 8.02993 12.5 7.61993 12 7.61993C11.5 7.61993 11.09 8.02993 11.09 8.52993C11.09 8.93993 10.75 9.27993 10.34 9.27993C9.93 9.27993 9.59 8.93993 9.59 8.52993C9.59 7.19993 10.67 6.11993 12 6.11993C13.33 6.11993 14.41 7.19993 14.41 8.52993C14.41 9.66993 13.57 10.2399 13.26 10.4499Z"
                    fill="var(--Icon-Color)"
                  />
                  <path
                    d="M17 2.42993H7C4 2.42993 2 4.42993 2 7.42993V13.4299C2 16.4299 4 18.4299 7 18.4299V20.5599C7 21.3599 7.89 21.8399 8.55 21.3899L13 18.4299H17C20 18.4299 22 16.4299 22 13.4299V7.42993C22 4.42993 20 2.42993 17 2.42993ZM12 14.5999C11.58 14.5999 11.25 14.2599 11.25 13.8499C11.25 13.4399 11.58 13.0999 12 13.0999C12.42 13.0999 12.75 13.4399 12.75 13.8499C12.75 14.2599 12.42 14.5999 12 14.5999ZM13.26 10.4499C12.87 10.7099 12.75 10.8799 12.75 11.1599V11.3699C12.75 11.7799 12.41 12.1199 12 12.1199C11.59 12.1199 11.25 11.7799 11.25 11.3699V11.1599C11.25 9.99993 12.1 9.42993 12.42 9.20993C12.79 8.95993 12.91 8.78993 12.91 8.52993C12.91 8.02993 12.5 7.61993 12 7.61993C11.5 7.61993 11.09 8.02993 11.09 8.52993C11.09 8.93993 10.75 9.27993 10.34 9.27993C9.93 9.27993 9.59 8.93993 9.59 8.52993C9.59 7.19993 10.67 6.11993 12 6.11993C13.33 6.11993 14.41 7.19993 14.41 8.52993C14.41 9.66993 13.57 10.2399 13.26 10.4499Z"
                    fill="transparent"
                  />
                </svg>
              </Button>
            </Tooltip>
            <Box className="desktop-active" sx={{ flexGrow: 0 }}>
              <Tooltip title="">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="abbreviaton"
                    sx={{
                      background:
                        theme === 'dark'
                          ? 'var(--Main-Gradient)'
                          : 'var(--Primary-Text-Color)',
                      color: 'var(--Background-Color)',
                      fontSize: 'var(--SubTitle-2)',
                      fontWeight: 'var(--Medium)',
                      padding: '9px 10px',
                      lineHeight: '16px',
                      textTransform: 'capitalize',
                      alignItems: 'center',
                      width: '40px',
                      height: '40px',
                      '@media (max-width: 768px)': {
                        width: '32px',
                        height: '32px',
                        fontSize: 'var(--SubTitle-5)',
                      },
                    }}
                  >
                    {firstName?.[0]}
                    {lastName?.[0]}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={() => setAnchorElUser(null)}
                className={styles.mainDropdown}
                sx={{
                  '& .MuiPaper-root': {
                    backgroundColor: 'var(--Background-Color)',
                    top: '69px !important',
                    borderRadius: '12px',
                  },
                }}
              >
                {settings.map((setting, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => handleCloseUserMenu(setting.title)}
                    className={styles.menuDropdown}
                  >
                    {setting.img}
                    <Typography>{setting.title}</Typography>
                    <Image
                      src="/images/arrow-down-right.svg"
                      alt="user"
                      width={16}
                      height={16}
                      style={{
                        filter:
                          theme === 'dark'
                            ? 'brightness(0) invert(0.5)'
                            : 'unset',
                      }}
                    />
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <TemporaryDrawer />
          </Toolbar>
        </Container>
      </AppBar>
      <SettingDialog
        openSettingDialogProps={openSettingDialog}
        onClose={() => setOpenSettingDialog(false)}
      />
      <LogoutDialog
        openLogoutDialogProps={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
      />
      <FeedbackDialog
        openFeedbackDialogProps={openFeedbackDialog}
        onClose={() => setOpenFeedbackDialog(false)}
      />
      {!loggedInUser?.data?.staff_user && (
        <UpgradeTime
          open={openCountDownDialog}
          onClose={() => setOpenCountDownDialog(false)}
        />
      )}
      <HelpDeskDialog
        open={openHelpDeskDialog}
        onClose={() => setOpenHelpDeskDialog(false)}
      />
      {isLogIncidentPage && (
        <Box
          sx={{ width: '100%' }}
          className={`${styles.docsHeader} ${styles.docsHeaderMobile}`}
        >
          <Button
            onClick={handleOpenSidebarFromLogIncident}
            className={styles.backButton}
            sx={{ marginBottom: '0 !important' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.0333 2.72027L5.68666 7.06694C5.17332 7.58027 5.17332 8.42027 5.68666 8.93361L10.0333 13.2803"
                stroke="var(--Primary-Text-Color)"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Button>
          <Box className={styles.backTitle}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {selectedPageHeaderData && selectedPageHeaderData.title && (
                <Typography
                  variant="body1"
                  sx={{ display: 'flex' }}
                  className={styles.documentTitle}
                >
                  {selectedPageHeaderData.title}
                </Typography>
              )}
            </Box>
            <Box>
              {selectedPageHeaderData && selectedPageHeaderData.subTitle && (
                <Typography variant="body1" className={styles.documentNo}>
                  {selectedPageHeaderData.subTitle}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
