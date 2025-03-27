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
import styles from './style.module.scss';
import React from 'react';
import HeaderDialog from '../HeaderDialog/HeaderDialog';
import LogoutDialog from '../LogoutDialog/LogoutDialog';

export default function Header() {
  const pages = ['Products', 'Pricing', 'Blog'];
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

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <>
      <AppBar
        position="static"
        className="nav-open header"
        sx={{ backgroundColor: 'transparent' }}
      >
        <Container maxWidth={false}>
          <Toolbar
            disableGutters
            sx={{ justifyContent: 'space-between', gap: '16px' }}
          >
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Image
                  src="/images/document-text.svg"
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
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <Image
                    src="/images/more.svg"
                    alt="menu"
                    width={20}
                    height={20}
                  />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  keepMounted
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  // sx={{ display: { xs: 'block', md: 'none' } }}
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
            {/* <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            LOGO
                        </Typography> */}
            <Button sx={{ p: 0 }} className={styles.messageButton}>
              <Image
                src="/images/message-question.svg"
                alt="search"
                width={24}
                height={24}
              />
            </Button>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="Pravin Lagariya"
                    src="/static/images/avatar/2.jpg"
                    sx={{
                      backgroundColor: '#DADAE1',
                      color: '#1B1A25',
                      fontSize: '16px',
                      fontWeight: 600,
                      padding: '9px 10px',
                      lineHeight: '140%',
                    }}
                  />
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
                    backgroundColor: '#11101b',
                    top: '69px !important',
                  },
                }}
              >
                {settings.map((setting, index) => (
                  <MenuItem
                    key={index}
                    onClick={handleCloseUserMenu}
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
            <HeaderDialog />
            <LogoutDialog />
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
