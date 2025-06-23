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
// import { useRouter } from 'next/navigation';

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
  // const router = useRouter();
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

  return (
    <>
      <Box className="mobile-active">
        <Tooltip title="">
          <IconButton onClick={handleOpenFirstDrawer} sx={{ p: 0 }}>
            <Avatar
              alt="abbreviaton"
              sx={{
                backgroundColor: 'var(--Primary-Text-Color)',
                color: 'var(--Card-Color)',
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
              <Image
                src="/images/arrow-left.svg"
                alt="user"
                width={16}
                height={16}
              />
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
                    <Image
                      src="/images/profile.svg"
                      alt="profile.svg"
                      width={18}
                      height={18}
                    />
                    <Typography>My Profile</Typography>
                    <Image
                      src="/images/arrow-down-right.svg"
                      alt="user"
                      width={16}
                      height={16}
                    />
                  </Button>
                  {/* <Button
                    className={styles.menuDropdown}
                    onClick={() => {
                      setFirstDrawerOpen(false);
                      router.push('/plans');
                    }}
                  >
                    <Image
                      src="/images/myPlan.svg"
                      alt="myPlan.svg"
                      width={18}
                      height={18}
                    />
                    <Typography>My Plan</Typography>
                    <Image
                      src="/images/arrow-down-right.svg"
                      alt="user"
                      width={16}
                      height={16}
                    />
                  </Button> */}
                  {!googleLogin && (
                    <Button
                      className={styles.menuDropdown}
                      onClick={() => handleOpenSecondDrawer('profile2')}
                    >
                      <Image
                        src="/images/password-change.svg"
                        alt="password-change.svg"
                        width={18}
                        height={18}
                      />
                      <Typography>Change Password</Typography>
                      <Image
                        src="/images/arrow-down-right.svg"
                        alt="user"
                        width={16}
                        height={16}
                      />
                    </Button>
                  )}
                  <Button
                    className={styles.menuDropdown}
                    onClick={handleOpenLogoutDialog}
                  >
                    <Image
                      src="/images/logout.svg"
                      alt="password-change.svg"
                      width={18}
                      height={18}
                    />
                    <Typography>Logout</Typography>
                    <Image
                      src="/images/arrow-down-right.svg"
                      alt="user"
                      width={16}
                      height={16}
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
                    <Image
                      src="/images/trash-white.svg"
                      alt="trash-white.svg"
                      width={18}
                      height={18}
                    />
                    <Typography>Delete Account</Typography>
                    <Image
                      src="/images/arrow-down-right.svg"
                      alt="user"
                      width={16}
                      height={16}
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
                <Image
                  src="/images/arrow-left.svg"
                  alt="user"
                  width={16}
                  height={16}
                />
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
