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
import styles from './header.module.scss';
import React, { useState } from 'react';
import SettingDialog from '../SettingDialog/SettingDialog';
import LogoutDialog from '../LogoutDialog/LogoutDialog';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import FeedbackDialog from '../FeedBackDialog/FeedBackDialog';

export default function Header() {
  const pages = ['Products', 'Pricing', 'Blog'];
  const [openSettingDialog, setOpenSettingDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const settings = [
    { title: 'Settings', img: '/images/setting.svg' },
    { title: 'Log out', img: '/images/logout.svg' },
  ];
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

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

  return (
    <>
      <AppBar
        position="static"
        className="nav-open header"
        sx={{
          backgroundColor: 'var(--Background-Color)',
          position: 'sticky',
          top: '0',
        }}
      >
        <Container maxWidth={false}>
          <Toolbar
            disableGutters
            sx={{ justifyContent: 'space-between', gap: '16px' }}
          >
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Image
                  src="/images/note-2.svg"
                  alt="menu"
                  width={20}
                  height={20}
                />
                <Typography
                  variant="body1"
                  sx={{ display: 'flex' }}
                  className={styles.documentTitle}
                >
                  Documents
                </Typography>
                <IconButton
                  size="small"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  // onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  {/* <Image
                    src="/images/more.svg"
                    alt="menu"
                    width={20}
                    height={20}
                  /> */}
                </IconButton>
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
                </Menu>
              </Box>
              <Box>
                <Typography variant="body1" className={styles.documentNo}>
                  No. of Documents : <span>2500</span>
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                width: '100%',
                display: { xs: 'flex', md: 'none' },
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
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
                  fill="var(--Primary-Text-Color)"
                />
                <path
                  d="M17 2.42993H7C4 2.42993 2 4.42993 2 7.42993V13.4299C2 16.4299 4 18.4299 7 18.4299V20.5599C7 21.3599 7.89 21.8399 8.55 21.3899L13 18.4299H17C20 18.4299 22 16.4299 22 13.4299V7.42993C22 4.42993 20 2.42993 17 2.42993ZM12 14.5999C11.58 14.5999 11.25 14.2599 11.25 13.8499C11.25 13.4399 11.58 13.0999 12 13.0999C12.42 13.0999 12.75 13.4399 12.75 13.8499C12.75 14.2599 12.42 14.5999 12 14.5999ZM13.26 10.4499C12.87 10.7099 12.75 10.8799 12.75 11.1599V11.3699C12.75 11.7799 12.41 12.1199 12 12.1199C11.59 12.1199 11.25 11.7799 11.25 11.3699V11.1599C11.25 9.99993 12.1 9.42993 12.42 9.20993C12.79 8.95993 12.91 8.78993 12.91 8.52993C12.91 8.02993 12.5 7.61993 12 7.61993C11.5 7.61993 11.09 8.02993 11.09 8.52993C11.09 8.93993 10.75 9.27993 10.34 9.27993C9.93 9.27993 9.59 8.93993 9.59 8.52993C9.59 7.19993 10.67 6.11993 12 6.11993C13.33 6.11993 14.41 7.19993 14.41 8.52993C14.41 9.66993 13.57 10.2399 13.26 10.4499Z"
                  fill="transparent"
                />
              </svg>
            </Button>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="abbreviaton"
                    sx={{
                      backgroundColor: 'var(--Primary-Text-Color)',
                      color: 'var(--Card-Color)',
                      fontSize: 'var(--SubTitle-2)',
                      fontWeight: 'var(--Medium)',
                      padding: '9px 10px',
                      lineHeight: '1.4',
                      display: 'flex',
                      alignItems: 'center',
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
                onClose={handleCloseUserMenu}
                className={styles.mainDropdown}
                sx={{
                  '& .MuiPaper-root': {
                    backgroundColor: 'var(--Background-Color)',
                    top: '69px !important',
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
    </>
  );
}
