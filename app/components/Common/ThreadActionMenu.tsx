import { Thread } from '@/app/redux/slices/Chat/chatTypes';
import { Fade, Menu, MenuItem } from '@mui/material';
import { useEffect } from 'react';
import Style from './Sidebar.module.scss';

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
        Rename
      </MenuItem>
      <MenuItem onClick={handleDelete} className={Style.menuDropdown}>
        Delete
      </MenuItem>
    </Menu>
  );
}
