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
// import UpgradeTime from '../Upgrade-Time/UpgradeTime';
import HelpDeskDialog from '../HelpDeskDialog/HelpDeskDialog';

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
  // const [openCountDownDialog, setOpenCountDownDialog] = useState(false);
  const settings = [
    { title: 'Settings', img: '/images/setting.svg' },
    // { title: 'My Plan', img: '/images/myPlan.svg' },
    { title: 'Log out', img: '/images/logout.svg' },
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
  // const isPlanPage = pathname?.includes('/plans');

  useEffect(() => {
    if (selectedActiveChat?.name) {
      dispatch(
        setPageHeaderData({
          title: selectedActiveChat.name,
        })
      );
    }
  }, [selectedActiveChat]);

  // useEffect(() => {
  //   console.log(".")
  // }, [isPlanPage]);

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
      // } else if (settingTitle === 'My Plan') {
      //   router.push('/plans');
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
  }, [dispatch]);

  // const handleOpenCountdownDialog = () => {
  //   setOpenCountDownDialog(true);
  // };

  // const [timerData, setTimerData] = useState([
  //   { value: '00', label: 'Days' },
  //   { value: '00', label: 'Hours' },
  //   { value: '00', label: 'Minutes' },
  //   { value: '00', label: 'Seconds' },
  // ]);

  // useEffect(() => {
  //   // Set target date = now + 3 days (in IST)
  //   const targetTime = new Date();
  //   targetTime.setDate(targetTime.getDate() + 3);

  //   const updateCountdown = () => {
  //     const now = new Date(
  //       new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  //     );
  //     const diff = targetTime.getTime() - now.getTime();

  //     if (diff <= 0) {
  //       setTimerData([
  //         { value: '00', label: 'Days' },
  //         { value: '00', label: 'Hours' },
  //         { value: '00', label: 'Minutes' },
  //         { value: '00', label: 'Seconds' },
  //       ]);
  //       return;
  //     }

  //     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  //     const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  //     const minutes = Math.floor((diff / (1000 * 60)) % 60);
  //     const seconds = Math.floor((diff / 1000) % 60);

  //     setTimerData([
  //       { value: String(days).padStart(2, '0'), label: 'Days' },
  //       { value: String(hours).padStart(2, '0'), label: 'Hours' },
  //       { value: String(minutes).padStart(2, '0'), label: 'Minutes' },
  //       { value: String(seconds).padStart(2, '0'), label: 'Seconds' },
  //     ]);
  //   };

  //   updateCountdown();
  //   const interval = setInterval(updateCountdown, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  const [openHelpDeskDialog, setOpenHelpDeskDialog] = useState(false);

  const handleClickHelpDeskDialog = () => {
    setOpenHelpDeskDialog(true);
  };

  return (
    <>
      <AppBar
        position="static"
        className="nav-open header"
        sx={{
          backgroundColor: '#11101BE5',
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
            <Button onClick={toggleSidebar} className={styles.toggleBtnHedaer}>
              <Image
                key={isSidebarOpen ? 'open' : 'closed'}
                src={
                  isSidebarOpen
                    ? '/images/close.svg' // Active state image
                    : '/images/sidebar-hide-icon.svg' // Inactive state image
                }
                alt="menu"
                width={20}
                height={20}
              />
            </Button>

            <Box className={styles.mobileLogo}>
              <Image
                src="/images/close-sidebar-logo.svg"
                alt="logo"
                width={40}
                height={38}
                onClick={() => router.push('/ai-chats')}
              />
            </Box>

            <Box sx={{ width: '100%' }} className={styles.docsHeader}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isChatPage && selectedActiveChat && (
                  <Image
                    src="/images/messages.svg"
                    alt="messages-icon"
                    width={18}
                    height={18}
                  />
                )}
                {isDocumentsPage && (
                  <Image
                    src="/images/note-2.svg"
                    alt="Documents-icon"
                    width={18}
                    height={18}
                  />
                )}
                {isDocumentDownloadPage && (
                  <Image
                    src="/images/report-icon.svg"
                    alt="Documents-icon"
                    width={18}
                    height={18}
                  />
                )}
                {isLogIncidentPage && (
                  <Image
                    src="/images/log-incident-sidebar.svg"
                    alt="Log-incidents-icon"
                    width={18}
                    height={18}
                  />
                )}
                {/* {isPlanPage && (
                  <Image
                    src="/images/myPlan.svg"
                    alt="Log-incidents-icon"
                    width={18}
                    height={18}
                  />
                )} */}
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

            {/* <Button
              onClick={handleOpenCountdownDialog}
              className={styles.timeLog}
            >
              <Box className={styles.timeLogInner}>
                <Box className={styles.timeLogImage}>
                  <Image
                    src="/images/timer.svg"
                    alt="search"
                    width={20}
                    height={20}
                  />
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
            </Button> */}
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
                  <Image
                    src="/images/report-info.svg"
                    alt="report-info"
                    width={20}
                    height={20}
                  />
                </Button>
              </Tooltip>
            )}
            <Tooltip title={'Feedback'} placement="bottom" arrow>
              <Button
                sx={{ p: 0 }}
                className={styles.messageButton}
                onClick={handleOpenFeedback}
              >
                <Image
                  src="/images/message-question.svg"
                  alt="search"
                  width={20}
                  height={20}
                />
              </Button>
            </Tooltip>
            <Box className="desktop-active" sx={{ flexGrow: 0 }}>
              <Tooltip title="">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="abbreviaton"
                    sx={{
                      backgroundColor: '#DADAE1',
                      color: '#1B1A25',
                      fontSize: '16px',
                      fontWeight: 600,
                      padding: '9px 10px',
                      lineHeight: '16px',
                      textTransform: 'capitalize',
                      alignItems: 'center',
                      width: '40px',
                      height: '40px',
                      '@media (max-width: 768px)': {
                        width: '32px',
                        height: '32px',
                        fontSize: '12px',
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
                    backgroundColor: '#11101b',
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
                    <Image
                      src={setting.img}
                      alt={setting.title}
                      width={18}
                      height={18}
                    />
                    <Typography>{setting.title}</Typography>
                    <Image
                      src="/images/arrow-down-right.svg"
                      alt="user"
                      width={16}
                      height={16}
                    />
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <TemporaryDrawer />
          </Toolbar>

          {/* <TemporaryDrawer /> */}
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
      {/* <UpgradeTime
        open={openCountDownDialog}
        onClose={() => setOpenCountDownDialog(false)}
      /> */}
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
            <Image
              src="/images/arrow-left.svg"
              alt="user"
              width={16}
              height={16}
            />
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
