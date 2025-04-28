import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import React from 'react';
import LogList from '@/app/components/LogIncident/logincident.module.scss';
import Image from 'next/image';

export default function LogListing() {
  return (
    <Box component="div" className={LogList.logListingBox}>
      <LisData />
      <LisData />
      <LisData />
      <LisData />
    </Box>
  );
}

function LisData() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box component="div" className={LogList.logListing}>
      <Box component="div" className={LogList.logListHeader}>
        <Typography variant="body1" className={LogList.logTitle}>
          Corporate cards can be used for a wide range of expenses, including
          travel, office supplies, and bus
        </Typography>
        <>
          <IconButton onClick={handleClick}>
            <Image src="/images/more.svg" alt="more" width={20} height={20} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            className={LogList.mainDropdown}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <MenuItem className={LogList.menuDropdown}>
              <Image
                src="/images/edit-2.svg"
                alt="edit"
                width={18}
                height={18}
              />
              <Typography>Edit Incident</Typography>
            </MenuItem>
            <MenuItem
              className={`${LogList.menuDropdown} ${LogList.menuDropdownDelete}`}
            >
              <Image
                src="/images/trash.svg"
                alt="delet"
                width={18}
                height={18}
              />
              <Typography>Delete Incident</Typography>
            </MenuItem>
          </Menu>
        </>
      </Box>
      <Box component="div" className={LogList.logListBody}>
        <Box className={LogList.logListBodyTag}>
          <Image
            src="/images/missed-visit.svg"
            alt="Log-success"
            width={16}
            height={16}
          />
          <Typography variant="body1" className={LogList.logListBodyTagTitle}>
            Missed Visit
          </Typography>
        </Box>
        <Box className={LogList.logListBodyTag}>
          <Image
            src="/images/late-visit.svg"
            alt="Log-success"
            width={16}
            height={16}
          />
          <Typography variant="body1" className={LogList.logListBodyTagTitle}>
            Late Visit
          </Typography>
        </Box>
        <Box className={LogList.logListBodyTag}>
          <Image
            src="/images/late-visit.svg"
            alt="Log-success"
            width={16}
            height={16}
          />
          <Typography variant="body1" className={LogList.logListBodyTagTitle}>
            No Response
          </Typography>
        </Box>
      </Box>
      <Box component="div" className={LogList.logListFooter}>
        <Typography variant="body1" className={LogList.logListFooterTitle}>
          Date & Time
        </Typography>
        <Typography variant="body1" className={LogList.logListFooterDetails}>
          04-25-2025 10:30 AM
        </Typography>
      </Box>
    </Box>
  );
}
