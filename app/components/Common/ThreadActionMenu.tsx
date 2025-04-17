import { Thread } from '@/app/redux/slices/Chat/chatTypes';
import { Fade, Menu, MenuItem, Typography } from '@mui/material';
import { useEffect } from 'react';
import Style from './Sidebar.module.scss';
import Image from 'next/image';

interface threadMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
  handleRename: () => void;
  handleDelete: () => void;
  data: null | Thread;
}

export default function ThreadActionMenu(props: threadMenuProps) {
  const { handleClose, open, anchorEl, handleRename, handleDelete } = props;

  useEffect(() => {
    return () => {
      handleClose();
    };
  }, []);

  return (
    <Menu
      id="fade-menu"
      MenuListProps={{
        'aria-labelledby': 'fade-button',
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      TransitionComponent={Fade}
      className={Style.mainDropdown}
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: '#11101b',
        },
      }}
    >
      <MenuItem onClick={handleRename} className={Style.menuDropdown}>
        <Image src="/images/edit-2.svg" alt="tras" width={18} height={18} />
        <Typography>Rename Thread</Typography>
      </MenuItem>
      <MenuItem
        onClick={handleDelete}
        className={`${Style.menuDropdown} ${Style.menuDropdownDelete}`}
      >
        <Image src="/images/trash.svg" alt="tras" width={18} height={18} />
        <Typography>Delete Thread</Typography>
      </MenuItem>
    </Menu>
  );
}
