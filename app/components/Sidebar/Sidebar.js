import React, { useState } from 'react';
import Style from './style.module.scss';
// import ListItem from '@mui/material/ListItem';
import { Box, Link } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Image from 'next/image';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DesktopDatePicker } from '@mui/x-date-pickers';
// import { BorderBottom, Padding } from '@mui/icons-material';
// import zIndex from '@mui/material/styles/zIndex';

const newTheme = (theme) =>
  createTheme({
    ...theme,
    components: {
      MuiPickersCalendarHeader: {
        styleOverrides: {
          root: {
            backgroundColor: 'none',
            color: 'var(--Primary-Text-Color)',
            borderBottom: '1px solid var(--Stroke-Color)',
            '& button': {
              svg: {
                color: 'var(--Primary-Text-Color)',
              },
            },
          },
          label: {
            fontSize: 'var(--SubTitle-2)',
            fontWeight: 'var(--Medium)',
          },
        },
      },
      MuiPickersFadeTransitionGroup: {
        styleOverrides: {
          root: {
            '& .MuiDayCalendar-header': {
              span: {
                color: 'var(--Primary-Text-Color)',
              },
            },
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            color: 'var(--Primary-Text-Color)',
            fontWeight: 'bold',
            '&:hover': {
              border: '1px solid var(--Card-Border)',
              color: 'var(--Primary-Text-Color)',
            },
            '&.Mui-selected': {
              backgroundColor: 'var(--Card-Border)',
              color: 'var(--Primary-Text-Color)',
              '&:hover': {
                backgroundColor: 'var(--Card-Border)',
                border: '1px solid var(--Card-Border)',
                color: 'var(--Primary-Text-Color)',
              },
            },
            '&.MuiPickersDay-today': {
              border: '1px solid var(--Card-Border)',
              backgroundColor: 'var(--Card-Border)',
              color: 'var(--Primary-Text-Color)',
            },
          },
        },
      },
      MuiDateCalendar: {
        styleOverrides: {
          root: {
            color: 'unet',
            borderRadius: 12,
            border: '1px solid var(--Stroke-Color)',
            backgroundColor: 'var(--Card-Color)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            // Target only the Paper used by PickerPopper
            '&.MuiPickerPopper-paper': {
              backgroundColor: 'transparent', // or 'none'
            },
          },
        },
      },
      MuiPickerPopper: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            backdropFilter: 'none',
            inset: '-56px auto auto 300px !important',
            backdropFilter: 'blur(10px)',
            inset: '0 auto auto 300px !important',
            width: '100vw',
            height: '100vh',
            paddingTop: '130px',
            paddingLeft: '20px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            transform: 'unset !important',
          },
        },
      },
    },
  });

const Sidebar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [expanded, setExpanded] = useState('panel1'); // Track which accordion is expanded
  const [showDrawer, setShowDrawer] = useState(false);

  const openSidebar = () => {
    setShowDrawer(!showDrawer);
  };

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false); // Only expand the clicked panel
  };

  return (
    <>
      <div
        className={`${Style['sidebar']} ${showDrawer ? Style.closesidebar : ''}`}
      >
        <div className={Style['main-logo']}>
          <Link href="#" className={Style['opensidebar-logo']}>
            <Image src="/images/logo.svg" alt="logo" width={200} height={44} />
          </Link>
          <Link href="#" className={Style['close-sidebar-logo']}>
            <Image
              src="/images/close-sidebar-logo.svg"
              alt="close-sidebar-logo"
              width={44}
              height={44}
            />
          </Link>
        </div>
        <div className={Style['sidebar-details']}>
          <div className={Style['sidebar-top']}>
            <div className={Style['left']} onClick={openSidebar}>
              <Link href="#">
                <Image
                  src="/images/sidebar-hide-icon.svg"
                  alt="sidebar-hide-icon"
                  width={16}
                  height={16}
                />
              </Link>
            </div>
            <div className={Style['right']}>
              <Link href="#">
                <Image
                  src="/images/search-sidebar.svg"
                  alt="sidebar-hide-icon"
                  width={16}
                  height={16}
                />
              </Link>
            </div>
          </div>
          <div className={Style['sidebar-list']}>
            <Box style={{ marginBottom: '10px' }}>
              <ThemeProvider theme={newTheme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'stretch',
                      border: '1px solid #444',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#1c1c28',
                      width: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        padding: '8px 12px',
                        backgroundColor: '#1c1c28',
                        color: '#fff',
                        borderRight: '1px solid #444',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '16px',
                        whiteSpace: 'nowrap',
                        width: '63px',
                        flex: '0 0 auto',
                      }}
                    >
                      From
                    </Box>
                    <DesktopDatePicker
                      className={Style['data-input']}
                      slotProps={{
                        textField: {
                          placeholder: 'Select date',
                          sx: {
                            '& .MuiPickersInputBase-root': {
                              padding: '4px',
                            },
                            '& .MuiPickersSectionList-root': {
                              backgroundColor: '#1e1e1e',
                              color: 'var(--Subtext-Color)',
                              borderRadius: '8px',
                              padding: '5px 0 5px 8px',
                            },
                            '& .MuiInputAdornment-root': {
                              padding: '7px',
                              backgroundColor: 'var(--Card-Color)',
                              color: 'var(--Primary-Text-Color)',
                              borderRadius: '8px',
                              border: '0.72px solid var(--Stroke-Color)',
                              maxHeight: 'unset',
                              width: '40px',
                              flex: '0 0 auto',
                            },
                            '& .MuiInputAdornment-root button': {
                              padding: '0',
                              color: 'var(--Primary-Text-Color)',
                            },
                            '& fieldset': {
                              display: 'none',
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </LocalizationProvider>
              </ThemeProvider>
            </Box>
            <Box style={{ marginBottom: '10px' }}>
              <ThemeProvider theme={newTheme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'stretch',
                      border: '1px solid #444',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#1c1c28',
                      width: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        padding: '8px 12px',
                        backgroundColor: '#1c1c28',
                        color: '#fff',
                        borderRight: '1px solid #444',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '16px',
                        whiteSpace: 'nowrap',
                        width: '63px',
                        flex: '0 0 auto',
                      }}
                    >
                      To
                    </Box>
                    <DesktopDatePicker
                      className={Style['data-input']}
                      slotProps={{
                        textField: {
                          placeholder: 'Select date',
                          sx: {
                            '& .MuiPickersInputBase-root': {
                              padding: '4px',
                            },
                            '& .MuiPickersSectionList-root': {
                              backgroundColor: '#1e1e1e',
                              color: 'var(--Subtext-Color)',
                              borderRadius: '8px',
                              padding: '5px 0 5px 8px',
                            },
                            '& .MuiInputAdornment-root': {
                              padding: '7px',
                              backgroundColor: 'var(--Card-Color)',
                              color: 'var(--Primary-Text-Color)',
                              borderRadius: '8px',
                              border: '0.72px solid var(--Stroke-Color)',
                              maxHeight: 'unset',
                              width: '40px',
                              flex: '0 0 auto',
                            },
                            '& .MuiInputAdornment-root button': {
                              padding: '0',
                              color: 'var(--Primary-Text-Color)',
                            },
                            '& fieldset': {
                              display: 'none',
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </LocalizationProvider>
              </ThemeProvider>
            </Box>
          </div>
          <div className={Style['sidebar-accordian']}>
            <Accordion
              className={Style['accordian']}
              expanded={expanded === 'panel1'}
              onChange={handleAccordionChange('panel1')}
            >
              <AccordionSummary
                expandIcon={
                  <Image
                    className={Style['img-none']}
                    src={
                      expanded === 'panel1'
                        ? '/images/arrow-down.svg'
                        : '/images/arrow-down-right.svg'
                    }
                    alt="expand-collapse"
                    width={16}
                    height={16}
                  />
                }
                aria-controls="panel1-content"
                id="panel1-header"
                classes={{
                  root: Style['customAccordionHeading'],
                  content: Style['customAccordionContent'],
                }}
              >
                <Typography component="span" className={Style['heading']}>
                  <Image
                    src="/images/sidebar-Pin.svg"
                    alt="pin"
                    width={18}
                    height={18}
                  />{' '}
                  Pinned Chats (12)
                </Typography>
              </AccordionSummary>

              <AccordionDetails className={`${Style['bottom-content']} abc`}>
                <div className={Style['accordion-content']}>
                  <div className={Style['left']}>
                    <p>
                      How to optimize images in WordPress for faster loading
                      (complete guide)
                    </p>
                  </div>
                  <div className={Style['right']}>
                    <div className={Style['pin-img']}>
                      <Image
                        src="/images/sidebar-Pin.svg"
                        alt="pin"
                        width={18}
                        height={18}
                      />
                    </div>
                    <div>
                      <Button
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        <Image
                          src="/images/more.svg"
                          alt="user-icon"
                          height={10}
                          width={10}
                        />
                      </Button>
                      <Menu
                        id="fade-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                      >
                        <MenuItem onClick={handleClose}>
                          <Typography>Lorem 1</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <Typography>Lorem 2</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <Typography>Lorem 3</Typography>
                        </MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
                <div className={Style['accordion-content']}>
                  <div className={Style['left']}>
                    <p>Travelling as a way of self-discovery and progress</p>
                  </div>
                  <div className={Style['right']}>
                    <div className={Style['pin-img']}>
                      <Image
                        src="/images/sidebar-Pin.svg"
                        alt="pin"
                        width={18}
                        height={18}
                      />
                    </div>
                    <div>
                      <Button
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        <Image
                          src="/images/more.svg"
                          alt="user-icon"
                          height={10}
                          width={10}
                        />
                      </Button>
                      <Menu
                        id="fade-menu"
                        MenuListProps={{
                          'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
                <div className={Style['accordion-content']}>
                  <div className={Style['left']}>
                    <p>The unseen of spending three years at Pixelgrade</p>
                  </div>
                  <div className={Style['right']}>
                    <div className={Style['pin-img']}>
                      <Image
                        src="/images/sidebar-Pin.svg"
                        alt="pin"
                        width={18}
                        height={18}
                      />
                    </div>
                    <div>
                      <Button
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        <Image
                          src="/images/more.svg"
                          alt="user-icon"
                          height={10}
                          width={10}
                        />
                      </Button>
                      <Menu
                        id="fade-menu"
                        MenuListProps={{
                          'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
                <div className={Style['accordion-content']}>
                  <div className={Style['left']}>
                    <p>How to build a loyal community online and offline</p>
                  </div>
                  <div className={Style['right']}>
                    <div className={Style['pin-img']}>
                      <Image
                        src="/images/sidebar-Pin.svg"
                        alt="pin"
                        width={18}
                        height={18}
                      />
                    </div>
                    <div>
                      <Button
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        <Image
                          src="/images/more.svg"
                          alt="user-icon"
                          height={10}
                          width={10}
                        />
                      </Button>
                      <Menu
                        id="fade-menu"
                        MenuListProps={{
                          'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem onClick={handleClose}>Lorem 1</MenuItem>
                        <MenuItem onClick={handleClose}>Lorem 1</MenuItem>
                        <MenuItem onClick={handleClose}>Lorem 1</MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              className={Style['accordian']}
              // expanded={expanded}
              // onChange={handleAccordionChange}
              expanded={expanded === 'panel2'}
              onChange={handleAccordionChange('panel2')}
            >
              <AccordionSummary
                expandIcon={
                  <Image
                    className={Style['img-none']}
                    src={
                      expanded === 'panel2'
                        ? '/images/arrow-down.svg'
                        : '/images/arrow-down-right.svg'
                    }
                    alt="expand-collapse"
                    width={16}
                    height={16}
                  />
                }
                aria-controls="panel1-content"
                id="panel1-header"
                classes={{
                  root: Style['customAccordionHeading'],
                  content: Style['customAccordionContent'],
                }}
              >
                <Typography component="span" className={Style['heading']}>
                  <Image
                    src="/images/messages.svg"
                    alt="pin"
                    width={18}
                    height={18}
                  />
                  All Chats (101)
                </Typography>
              </AccordionSummary>

              <AccordionDetails className={Style['bottom-content']}>
                <div className={Style['accordion-content']}>
                  <div className={Style['left']}>
                    <p>
                      How to optimize images in WordPress for faster loading
                      (complete guide)
                    </p>
                  </div>
                  <div className={Style['right']}>
                    <div className={Style['pin-img']}>
                      <Image
                        src="/images/sidebar-Pin.svg"
                        alt="pin"
                        width={18}
                        height={18}
                      />
                    </div>
                    <div>
                      <Button
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        <Image
                          src="/images/more.svg"
                          alt="user-icon"
                          height={10}
                          width={10}
                        />
                      </Button>
                      <Menu
                        id="fade-menu"
                        MenuListProps={{
                          'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem onClick={handleClose}>Lorem 1</MenuItem>
                        <MenuItem onClick={handleClose}>Lorem 1</MenuItem>
                        <MenuItem onClick={handleClose}>Lorem 1</MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
                <div className={Style['accordion-content']}>
                  <div className={Style['left']}>
                    <p>Travelling as a way of self-discovery and progress</p>
                  </div>
                  <div className={Style['right']}>
                    <div className={Style['pin-img']}>
                      <Image
                        src="/images/sidebar-Pin.svg"
                        alt="pin"
                        width={18}
                        height={18}
                      />
                    </div>
                    <div>
                      <Button
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        <Image
                          src="/images/more.svg"
                          alt="user-icon"
                          height={10}
                          width={10}
                        />
                      </Button>
                      <Menu
                        id="fade-menu"
                        MenuListProps={{
                          'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
                <div className={Style['accordion-content']}>
                  <div className={Style['left']}>
                    <p>The unseen of spending three years at Pixelgrade</p>
                  </div>
                  <div className={Style['right']}>
                    <div className={Style['pin-img']}>
                      <Image
                        src="/images/sidebar-Pin.svg"
                        alt="pin"
                        width={18}
                        height={18}
                      />
                    </div>
                    <div>
                      <Button
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        <Image
                          src="/images/more.svg"
                          alt="user-icon"
                          height={10}
                          width={10}
                        />
                      </Button>
                      <Menu
                        id="fade-menu"
                        MenuListProps={{
                          'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem onClick={handleClose}>Lorem 1</MenuItem>
                        <MenuItem onClick={handleClose}>Lorem 1</MenuItem>
                        <MenuItem onClick={handleClose}>Lorem 1</MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
                <div className={Style['accordion-content']}>
                  <div className={Style['left']}>
                    <p>How to build a loyal community online and offline</p>
                  </div>
                  <div className={Style['right']}>
                    <div className={Style['pin-img']}>
                      <Image
                        src="/images/sidebar-Pin.svg"
                        alt="pin"
                        width={18}
                        height={18}
                      />
                    </div>
                    <div>
                      <Button
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        <Image
                          src="/images/more.svg"
                          alt="user-icon"
                          height={10}
                          width={10}
                        />
                      </Button>
                      <Menu
                        id="fade-menu"
                        MenuListProps={{
                          'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              className={Style['accordian']}
              // expanded={expanded}
              // onChange={handleAccordionChange}
              // defaultExpanded
              expanded={expanded === 'panel3'}
              onChange={handleAccordionChange('panel3')}
            >
              <AccordionSummary
                expandIcon={
                  <Image
                    className={Style['img-none']}
                    src={
                      expanded === 'panel3'
                        ? '/images/arrow-down.svg'
                        : '/images/arrow-down-right.svg'
                    }
                    alt="expand-collapse"
                    width={16}
                    height={16}
                  />
                }
                aria-controls="panel1-content"
                id="panel1-header"
                classes={{
                  root: Style['customAccordionHeading'],
                  content: Style['customAccordionContent'],
                }}
              >
                <Typography component="span" className={Style['heading']}>
                  <Image
                    src="/images/document-text.svg"
                    alt="pin"
                    width={18}
                    height={18}
                  />
                  Documents
                </Typography>
              </AccordionSummary>

              <AccordionDetails className={Style['bottom-content']}>
                <div className={Style['accordion-content']}>
                  <div className={Style['left']}>
                    <p>
                      How to optimize images in WordPress for faster loading
                      (complete guide)
                    </p>
                  </div>
                  <div className={Style['right']}>
                    <div className={Style['pin-img']}>
                      <Image
                        src="/images/sidebar-Pin.svg"
                        alt="pin"
                        width={18}
                        height={18}
                      />
                    </div>
                    <div>
                      <Button
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        <Image
                          src="/images/more.svg"
                          alt="user-icon"
                          height={10}
                          width={10}
                        />
                      </Button>
                      <Menu
                        id="fade-menu"
                        MenuListProps={{
                          'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
                <div className={Style['accordion-content']}>
                  <div className={Style['left']}>
                    <p>Travelling as a way of self-discovery and progress</p>
                  </div>
                  <div className={Style['right']}>
                    <div className={Style['pin-img']}>
                      <Image
                        src="/images/sidebar-Pin.svg"
                        alt="pin"
                        width={18}
                        height={18}
                      />
                    </div>
                    <div>
                      <Button
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        <Image
                          src="/images/more.svg"
                          alt="user-icon"
                          height={10}
                          width={10}
                        />
                      </Button>
                      <Menu
                        id="fade-menu"
                        MenuListProps={{
                          'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
                <div className={Style['accordion-content']}>
                  <div className={Style['left']}>
                    <p>The unseen of spending three years at Pixelgrade</p>
                  </div>
                  <div className={Style['right']}>
                    <div className={Style['pin-img']}>
                      <Image
                        src="/images/sidebar-Pin.svg"
                        alt="pin"
                        width={18}
                        height={18}
                      />
                    </div>
                    <div>
                      <Button
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        <Image
                          src="/images/more.svg"
                          alt="user-icon"
                          height={10}
                          width={10}
                        />
                      </Button>
                      <Menu
                        id="fade-menu"
                        MenuListProps={{
                          'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
                <div className={Style['accordion-content']}>
                  <div className={Style['left']}>
                    <p>How to build a loyal community online and offline</p>
                  </div>
                  <div className={Style['right']}>
                    <div className={Style['pin-img']}>
                      <Image
                        src="/images/sidebar-Pin.svg"
                        alt="pin"
                        width={18}
                        height={18}
                      />
                    </div>
                    <div>
                      <Button
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        <Image
                          src="/images/more.svg"
                          alt="user-icon"
                          height={10}
                          width={10}
                        />
                      </Button>
                      <Menu
                        id="fade-menu"
                        MenuListProps={{
                          'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
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
