import ConfirmDialogStyles from './ConfirmationDialogStyle.module.scss';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  Typography,
} from '@mui/material';
import Image from 'next/image';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: '#11101b',
    margin: '0px',
    border: '1px solid #3a3948',
    borderRadius: '16px',
    minWidth: '450px',
    maxWidth: '90vw',
    '@media (max-width: 500px)': {
      maxWidth: '80vw',
      minWidth: '450px',
    },
    '@media (max-width: 480px)': {
      maxWidth: '95vw',
      minWidth: '90%',
    },
  },
}));

interface DeleteDialogProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  modalTitle: string;
  modalContent: string;
  modalSubContent?: string;
  CancelBtnTitle: string;
  SubmitBtnTitle: string;
  isLoading?: boolean;
}

export default function ConfirmationDialog(props: DeleteDialogProps) {
  const {
    handleClose,
    open,
    handleSubmit,
    modalTitle,
    modalContent,
    CancelBtnTitle,
    SubmitBtnTitle,
    isLoading,
  } = props;

  // const images = {
  //   isLogoutModal: "/images/logout-modal.svg",
  //   isDeleteAcModal: "/images/delete-ac-modal.svg",
  //   isDeleteNoteModal: "/images/delete-icn-modal.svg",
  // };

  // const image = isLogoutModal
  //   ? images.isLogoutModal
  //   : isDeleteAcModal
  //   ? images.isDeleteAcModal
  //   : isDeleteNoteModal
  //   ? images.isDeleteNoteModal
  //   : "";

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      className={ConfirmDialogStyles.headerDialogBox}
      sx={{
        background: 'rgb(17 16 27 / 0%)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <Box component="div" className={ConfirmDialogStyles.dialogHeader}>
        <DialogTitle
          sx={{ m: 0, p: 0 }}
          id="customized-dialog-title"
          className={ConfirmDialogStyles.dialogHeaderInner}
        >
          <Box component="div" className={ConfirmDialogStyles.dialogIcon}>
            <Image src="/images/trash.svg" alt="trash" width={28} height={28} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              className={ConfirmDialogStyles.dialogTitle}
            >
              {modalTitle}
            </Typography>
            <Typography
              variant="body1"
              className={ConfirmDialogStyles.dialogSemiTitle}
            >
              {modalContent}
            </Typography>
          </Box>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <Image
            src="/images/close.svg"
            alt="close-icon"
            width={24}
            height={24}
          />
        </IconButton>
      </Box>
      <DialogContent dividers className={ConfirmDialogStyles.dialogBody}>
        <Box
          component="div"
          className={ConfirmDialogStyles.dialogFormButtonBox}
        >
          <Button
            className={ConfirmDialogStyles.formCancelBtn}
            onClick={handleClose}
          >
            {CancelBtnTitle || 'Cancel'}
          </Button>
          <Button
            className={ConfirmDialogStyles.formSaveBtn}
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              SubmitBtnTitle || 'Delete'
            )}
          </Button>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  );
}
