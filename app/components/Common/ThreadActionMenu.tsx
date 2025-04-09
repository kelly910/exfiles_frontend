import { Fade, Menu, MenuItem } from '@mui/material';
import { useEffect } from 'react';

interface threadMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
  handleRename: () => void;
  handleDelete: () => void;
  data: null | {};
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
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      TransitionComponent={Fade}
    >
      <MenuItem onClick={handleRename}>Rename</MenuItem>
      <MenuItem onClick={handleDelete}>Delete</MenuItem>
    </Menu>
  );
}
