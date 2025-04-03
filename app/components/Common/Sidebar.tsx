'use client';
import React, { useState } from 'react';
import Style from './Sidebar.module.scss';
import ListItem from '@mui/material/ListItem';
import { Link, List } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Sidebar = ({
  isOpen,
  toggleSidebar,
  handleThreadClick,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
  handleThreadClick: (threadUUID: string) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [expanded, setExpanded] = useState<boolean | string>('panel1'); // Track which accordion is expanded

  const router = useRouter();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccordionChange = (panel: string) => 
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false); // Only expand the clicked panel
    };
  
  return (
    <>
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
              width={44}
              height={44}
            />
          </Link>
        </div>
        <div className={Style['sidebar-details']}>
          <div className={Style['sidebar-top']}>
            <div className={Style['left']} onClick={toggleSidebar}>
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
            <List className={Style['sidebar-list-details']}>
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
            </List>
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
                <div
                  className={Style['accordion-content']}
                  onClick={() => handleThreadClick('sdhfjsjdf')}
                >
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
                onClick={() => router.push('/documents')}
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
