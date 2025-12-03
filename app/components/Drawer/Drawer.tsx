'use client';

import * as React from 'react';
import {
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  Tooltip,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import styles from '@components/Drawer/drawer.module.scss';
import { useState } from 'react';
import MyProfile from '@components/UserSetting/MyProfile';
import ChangeUserPassword from '@components/UserSetting/ChangeUserPassword';
import DeleteAccount from '@components/UserSetting/DeleteAccount';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import LogoutDialog from '../LogoutDialog/LogoutDialog';
import { useRouter } from 'next/navigation';
import { useThemeMode } from '@/app/utils/ThemeContext';

export default function TemporaryDrawer() {
  const [isFirstDrawerOpen, setFirstDrawerOpen] = useState(false);
  const [activeSecondDrawer, setActiveSecondDrawer] = useState<string | null>(
    null
  );
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const loggedInUser = useSelector(
    (state: RootState) => state.login.loggedInUser
  );
  const firstName = loggedInUser?.data?.first_name;
  const lastName = loggedInUser?.data?.last_name;
  const router = useRouter();
  const storedUser = localStorage.getItem('loggedInUser');
  const loggedInUserData = storedUser ? JSON.parse(storedUser) : null;
  const googleLogin = loggedInUserData?.data?.google_login;

  const handleOpenFirstDrawer = () => setFirstDrawerOpen(true);
  const handleCloseFirstDrawer = () => {
    setFirstDrawerOpen(false);
    setActiveSecondDrawer(null); // Close all second drawers
  };

  // Open Specific Second Drawer
  const handleOpenSecondDrawer = (drawerName: string) =>
    setActiveSecondDrawer(drawerName);
  const handleCloseSecondDrawer = () => setActiveSecondDrawer(null);

  // Select component based on active drawer
  const renderSecondDrawerContent = () => {
    switch (activeSecondDrawer) {
      case 'profile1':
        return <MyProfile closeDialog={handleCloseSecondDrawer} />;
      case 'profile2':
        return (
          <ChangeUserPassword
            closeDialog={handleCloseSecondDrawer}
            mobileView={true}
          />
        );
      case 'profile3':
        return <DeleteAccount closeDialog={handleCloseSecondDrawer} />;
      default:
        return null;
    }
  };

  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };

  const { theme } = useThemeMode();

  return (
    <>
      <Box className="mobile-active">
        <Tooltip title="">
          <IconButton onClick={handleOpenFirstDrawer} sx={{ p: 0 }}>
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
        <Drawer
          anchor="right"
          open={isFirstDrawerOpen}
          onClose={handleCloseFirstDrawer}
          sx={{
            top: '65px',
            right: '0',
            left: 'auto',
            zIndex: '99',
            maxHeight: 'calc(100dvh - 65px)',
            '& .MuiPaper-root': {
              top: '65px',
              width: '400px',
              maxWidth: 'calc(100vw - 16px)',
              maxHeight: 'calc(100dvh - 65px)',
              background: 'var(--Card-Color)',
              borderLeft: '1px solid  var(--Stroke-Color)',
            },
            '& .MuiBackdrop-root': {
              top: '65px',
              maxHeight: 'calc(100dvh - 65px)',
              backdropFilter: 'blur(24px)',
              backgroundColor: 'unset',
            },
          }}
        >
          <List
            sx={{
              width: '100%',
              padding: '24px 16px',
              height: '100%',
            }}
            className={styles.mainDropdown}
          >
            <Button
              onClick={handleCloseFirstDrawer}
              className={styles.backButton}
              sx={{ marginBottom: '24px' }}
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
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
            <Box component="div" className={styles.dialogSidebar}>
              <Box component="div" className={styles.dialogSidebarHeader}>
                <Typography variant="h6" className={styles.dialogSemiTitle}>
                  General settings
                </Typography>
                <Box component="div" className={styles.dialogSidebarContent}>
                  <Button
                    className={styles.menuDropdown}
                    onClick={() => handleOpenSecondDrawer('profile1')}
                  >
                    {theme === 'dark' ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.5 9C16.5 4.8675 13.1325 1.5 9 1.5C4.8675 1.5 1.5 4.8675 1.5 9C1.5 11.175 2.4375 13.1325 3.9225 14.505C3.9225 14.5125 3.9225 14.5125 3.915 14.52C3.99 14.595 4.08 14.655 4.155 14.7225C4.2 14.76 4.2375 14.7975 4.2825 14.8275C4.4175 14.94 4.5675 15.045 4.71 15.15C4.7625 15.1875 4.8075 15.2175 4.86 15.255C5.0025 15.3525 5.1525 15.4425 5.31 15.525C5.3625 15.555 5.4225 15.5925 5.475 15.6225C5.625 15.705 5.7825 15.78 5.9475 15.8475C6.0075 15.8775 6.0675 15.9075 6.1275 15.93C6.2925 15.9975 6.4575 16.0575 6.6225 16.11C6.6825 16.1325 6.7425 16.155 6.8025 16.17C6.9825 16.2225 7.1625 16.2675 7.3425 16.3125C7.395 16.3275 7.4475 16.3425 7.5075 16.35C7.7175 16.395 7.9275 16.425 8.145 16.4475C8.175 16.4475 8.205 16.455 8.235 16.4625C8.49 16.485 8.745 16.5 9 16.5C9.255 16.5 9.51 16.485 9.7575 16.4625C9.7875 16.4625 9.8175 16.455 9.8475 16.4475C10.065 16.425 10.275 16.395 10.485 16.35C10.5375 16.3425 10.59 16.32 10.65 16.3125C10.83 16.2675 11.0175 16.23 11.19 16.17C11.25 16.1475 11.31 16.125 11.37 16.11C11.535 16.05 11.7075 15.9975 11.865 15.93C11.925 15.9075 11.985 15.8775 12.045 15.8475C12.2025 15.78 12.36 15.705 12.5175 15.6225C12.5775 15.5925 12.63 15.555 12.6825 15.525C12.8325 15.435 12.9825 15.3525 13.1325 15.255C13.185 15.225 13.23 15.1875 13.2825 15.15C13.4325 15.045 13.575 14.94 13.71 14.8275C13.755 14.79 13.7925 14.7525 13.8375 14.7225C13.92 14.655 14.0025 14.5875 14.0775 14.52C14.0775 14.5125 14.0775 14.5125 14.07 14.505C15.5625 13.1325 16.5 11.175 16.5 9ZM12.705 12.7275C10.6725 11.3625 7.3425 11.3625 5.295 12.7275C4.965 12.945 4.695 13.2 4.47 13.4775C3.33 12.3225 2.625 10.74 2.625 9C2.625 5.4825 5.4825 2.625 9 2.625C12.5175 2.625 15.375 5.4825 15.375 9C15.375 10.74 14.67 12.3225 13.53 13.4775C13.3125 13.2 13.035 12.945 12.705 12.7275Z"
                          fill="var(--Icon-Color)"
                        />
                        <path
                          d="M9 5.19775C7.4475 5.19775 6.1875 6.45775 6.1875 8.01025C6.1875 9.53275 7.38 10.7703 8.9625 10.8153C8.985 10.8153 9.015 10.8153 9.03 10.8153C9.045 10.8153 9.0675 10.8153 9.0825 10.8153C9.09 10.8153 9.0975 10.8153 9.0975 10.8153C10.6125 10.7628 11.805 9.53275 11.8125 8.01025C11.8125 6.45775 10.5525 5.19775 9 5.19775Z"
                          fill="var(--Icon-Color)"
                        />
                      </svg>
                    ) : (
                      <Image
                        src="/images/profile.svg"
                        alt="profile.svg"
                        width={18}
                        height={18}
                      />
                    )}
                    <Typography>My Profile</Typography>
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
                  </Button>
                  <Button
                    className={styles.menuDropdown}
                    onClick={() => {
                      setFirstDrawerOpen(false);
                      router.push('/plans');
                    }}
                  >
                    {theme === 'dark' ? (
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
                    ) : (
                      <Image
                        src="/images/logout.svg"
                        alt="password-change.svg"
                        width={18}
                        height={18}
                      />
                    )}
                    <Typography>My Plan</Typography>
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
                  </Button>
                  {!googleLogin && (
                    <Button
                      className={styles.menuDropdown}
                      onClick={() => handleOpenSecondDrawer('profile2')}
                    >
                      {theme === 'dark' ? (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.5 3H11.8125V2.0625C11.8125 1.755 11.5575 1.5 11.25 1.5C10.9425 1.5 10.6875 1.755 10.6875 2.0625V15.9375C10.6875 16.245 10.9425 16.5 11.25 16.5C11.5575 16.5 11.8125 16.245 11.8125 15.9375V15H13.5C15.1575 15 16.5 13.6575 16.5 12V6C16.5 4.3425 15.1575 3 13.5 3Z"
                            fill="var(--Icon-Color)"
                          />
                          <path
                            d="M4.875 3C3.2175 3 1.875 4.3425 1.875 6V12C1.875 13.6575 3.2175 15 4.875 15H8.625C9.0375 15 9.375 14.6625 9.375 14.25V3.75C9.375 3.3375 9.0375 3 8.625 3H4.875ZM5.0025 9.285C4.965 9.375 4.9125 9.4575 4.845 9.5325C4.77 9.6 4.6875 9.6525 4.5975 9.69C4.5075 9.7275 4.41 9.75 4.3125 9.75C4.215 9.75 4.1175 9.7275 4.0275 9.69C3.9375 9.6525 3.855 9.6 3.78 9.5325C3.7125 9.4575 3.66 9.375 3.615 9.285C3.5775 9.195 3.5625 9.0975 3.5625 9C3.5625 8.805 3.645 8.61 3.78 8.4675C3.8175 8.4375 3.855 8.4075 3.8925 8.3775C3.9375 8.3475 3.9825 8.325 4.0275 8.31C4.0725 8.2875 4.1175 8.2725 4.1625 8.265C4.4175 8.2125 4.6725 8.295 4.845 8.4675C4.98 8.61 5.0625 8.805 5.0625 9C5.0625 9.0975 5.04 9.195 5.0025 9.285ZM7.6275 9.285C7.59 9.375 7.5375 9.4575 7.47 9.5325C7.395 9.6 7.3125 9.6525 7.2225 9.69C7.1325 9.7275 7.035 9.75 6.9375 9.75C6.84 9.75 6.7425 9.7275 6.6525 9.69C6.5625 9.6525 6.48 9.6 6.405 9.5325C6.2625 9.39 6.1875 9.2025 6.1875 9C6.1875 8.9025 6.21 8.805 6.2475 8.715C6.285 8.6175 6.3375 8.5425 6.405 8.4675C6.6825 8.19 7.185 8.19 7.47 8.4675C7.605 8.61 7.6875 8.805 7.6875 9C7.6875 9.0975 7.665 9.195 7.6275 9.285Z"
                            fill="var(--Icon-Color)"
                          />
                        </svg>
                      ) : (
                        <Image
                          src="/images/password-change.svg"
                          alt="password-change.svg"
                          width={18}
                          height={18}
                        />
                      )}
                      <Typography>Change Password</Typography>
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
                    </Button>
                  )}
                  <Button
                    className={styles.menuDropdown}
                    onClick={handleOpenLogoutDialog}
                  >
                    {theme === 'dark' ? (
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
                    ) : (
                      <Image
                        src="/images/logout.svg"
                        alt="password-change.svg"
                        width={18}
                        height={18}
                      />
                    )}
                    <Typography>Logout</Typography>
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
                  </Button>
                </Box>
              </Box>
              <Box component="div" className={styles.dialogSidebarHeader}>
                <Typography variant="h6" className={styles.dialogSemiTitle}>
                  Danger Zone
                </Typography>
                <Box component="div" className={styles.dialogSidebarContent}>
                  <Button
                    className={styles.menuDropdown}
                    onClick={() => handleOpenSecondDrawer('profile3')}
                  >
                    {theme === 'dark' ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.8025 3.9225C14.595 3.8025 13.3875 3.7125 12.1725 3.645V3.6375L12.0075 2.6625C11.895 1.9725 11.73 0.9375 9.975 0.9375H8.01C6.2625 0.9375 6.0975 1.9275 5.9775 2.655L5.82 3.615C5.1225 3.66 4.425 3.705 3.7275 3.7725L2.1975 3.9225C1.8825 3.9525 1.6575 4.23 1.6875 4.5375C1.7175 4.845 1.9875 5.07 2.3025 5.04L3.8325 4.89C7.7625 4.5 11.7225 4.65 15.6975 5.0475C15.72 5.0475 15.735 5.0475 15.7575 5.0475C16.0425 5.0475 16.29 4.83 16.32 4.5375C16.3425 4.23 16.1175 3.9525 15.8025 3.9225Z"
                          fill="var(--Red-Color)"
                        />
                        <path
                          d="M14.4226 6.105C14.2426 5.9175 13.9951 5.8125 13.7401 5.8125H4.26006C4.00506 5.8125 3.75006 5.9175 3.57756 6.105C3.40506 6.2925 3.30756 6.5475 3.32256 6.81L3.78756 14.505C3.87006 15.645 3.97506 17.07 6.59256 17.07H11.4076C14.0251 17.07 14.1301 15.6525 14.2126 14.505L14.6776 6.8175C14.6926 6.5475 14.5951 6.2925 14.4226 6.105ZM10.2451 13.3125H7.74756C7.44006 13.3125 7.18506 13.0575 7.18506 12.75C7.18506 12.4425 7.44006 12.1875 7.74756 12.1875H10.2451C10.5526 12.1875 10.8076 12.4425 10.8076 12.75C10.8076 13.0575 10.5526 13.3125 10.2451 13.3125ZM10.8751 10.3125H7.12506C6.81756 10.3125 6.56256 10.0575 6.56256 9.75C6.56256 9.4425 6.81756 9.1875 7.12506 9.1875H10.8751C11.1826 9.1875 11.4376 9.4425 11.4376 9.75C11.4376 10.0575 11.1826 10.3125 10.8751 10.3125Z"
                          fill="var(--Red-Color)"
                        />
                      </svg>
                    ) : (
                      <Image
                        src="/images/trash-white.svg"
                        alt="trash-white.svg"
                        width={18}
                        height={18}
                      />
                    )}
                    <Typography>Delete Account</Typography>
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
                  </Button>
                </Box>
              </Box>
            </Box>
          </List>
        </Drawer>
        <Drawer
          anchor="right"
          open={Boolean(activeSecondDrawer)}
          onClose={handleCloseSecondDrawer}
          sx={{
            top: '65px',
            right: '0',
            left: 'auto',
            width: '100%',
            zIndex: '99',
            maxHeight: 'calc(100dvh - 65px)',
            '& .MuiPaper-root': {
              top: '65px',
              right: '0',
              left: 'auto',
              width: '100%',
              maxHeight: 'calc(100dvh - 65px)',
              background: 'var(--Background-Color)',
              borderLeft: '1px solid  var(--Stroke-Color)',
            },
            '& .MuiBackdrop-root': {
              top: '65px',
              maxHeight: 'calc(100dvh - 65px)',
            },
          }}
        >
          <List
            sx={{
              width: '100%',
              padding: '0',
              height: '100%',
              '&>div': {
                height: 'calc(100% - 59px)',
                padding: '32px 16px',
              },
            }}
          >
            <Box
              component="section"
              sx={{
                padding: '12px 16px',
                height: 'auto',
                background: 'var(--Card-Color)',
                border: '0 solid var(--Stroke-Color)',
                borderTopWidth: '0',
                borderBottomWidth: '1px',
              }}
              className={styles.drawerSidebarHeader}
            >
              <Button
                onClick={handleCloseSecondDrawer}
                className={styles.backButton}
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
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <Typography variant="body1" color="initial">
                {activeSecondDrawer === 'profile1'
                  ? 'My Profile'
                  : activeSecondDrawer === 'profile2'
                    ? 'Change Password'
                    : activeSecondDrawer === 'profile3'
                      ? 'Delete Account'
                      : ''}
              </Typography>
            </Box>
            {renderSecondDrawerContent()}
          </List>
        </Drawer>
      </Box>
      <LogoutDialog
        openLogoutDialogProps={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
      />
    </>
  );
}
