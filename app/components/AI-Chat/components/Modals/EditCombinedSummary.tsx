import React, { useEffect } from 'react';
import Image from 'next/image';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import EditCombinedSummaryStyles from '@components/ReName/rename.module.scss';
// import { useAppDispatch } from '@/app/redux/hooks';
import { ChatMessage } from '@/app/redux/slices/Chat/chatTypes';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: '#11101b',
    margin: '0px',
    border: '1px solid #3a3948',
    borderRadius: '16px',
    minWidth: '600px',
    maxWidth: '90vw',
    '@media (max-width: 768px)': {
      maxWidth: '80vw',
      minWidth: '550px',
    },
    '@media (max-width: 580px)': {
      maxWidth: '80vw',
      minWidth: '450px',
    },
    '@media (max-width: 480px)': {
      maxWidth: '95vw',
      minWidth: '90%',
    },
  },
}));

interface EditCombineSummaryModalProps {
  open: boolean;
  handleClose: () => void;
  threadId?: string | null;
  handleSubmit?: () => void;
  messageData: ChatMessage;
}

export default function EditCombinedSummary({
  open,
  handleClose,
  handleSubmit,
  messageData,
}: EditCombineSummaryModalProps) {
  // const dispatch = useAppDispatch();
  // const [isLoading, setIsLoading] = useState(false);

  const fetchSelectedDocSummary = async () => {
    // const resultData = await dispatch(
    //   fetchDocumentSummaryById(messageData.combined_summary_data.uuid)
    // );
    // console.log('dhfh', resultData);
  };

  useEffect(() => {
    if (
      messageData &&
      messageData.combined_summary_data &&
      messageData.combined_summary_data
    ) {
      fetchSelectedDocSummary();
    }
  }, [messageData]);

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      className={EditCombinedSummaryStyles.headerDialogBox}
      sx={{
        background: 'rgb(17 16 27 / 0%)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <Box component="div" className={EditCombinedSummaryStyles.dialogHeader}>
        <DialogTitle
          sx={{ m: 0, p: 0 }}
          id="customized-dialog-title"
          className={EditCombinedSummaryStyles.dialogHeaderInner}
        >
          <Box component="div" className={EditCombinedSummaryStyles.dialogIcon}>
            <Image
              src="/images/edit-model.svg"
              alt="edit-model"
              width={28}
              height={28}
            />
          </Box>
          <Box>
            <Typography
              variant="h6"
              className={EditCombinedSummaryStyles.dialogTitle}
            >
              Editing Combined Summary
            </Typography>
            <Typography
              variant="body1"
              className={EditCombinedSummaryStyles.dialogSemiTitleTag}
            >
              <span>RekamanProspek.pdf</span>
              <span>RekamanProspek.pdf</span>
              <span>+2</span>
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
      <Box component="div" className={EditCombinedSummaryStyles.dialogInput}>
        <TextField
          // as={TextField}
          fullWidth
          id="body"
          name="body"
          placeholder="Edit your Summary"
          multiline
          minRows={4}
          maxRows={6}
          // error={Boolean(errors.body && touched.body)}
          sx={{
            marginTop: '0px',
            padding: '0',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              borderWidth: '0px',
              color: '#DADAE1',
              backgroundColor: '#252431',
              padding: '14px 16px',
              '& .MuiOutlinedInput-notchedOutline': {
                top: '-10px !important',
              },
              '& .MuiOutlinedInput-input': {
                fontSize: '14px',
                color: '#DADAE1',
                fontWeight: 500,
                borderRadius: '12px',
                padding: '2px',
                maxHeight: '200px',
                overflowY: 'auto !important',
                '&::placeholder': {
                  color: '#888',
                  fontWeight: 400,
                },
              },
              '& fieldset': {
                borderColor: '#3A3948',
              },
              '&:hover fieldset': {
                borderColor: '#fff',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#fff',
                borderWidth: '1px',
                color: '#fff',
              },
            },
            // '& .MuiFormHelperText-root': {
            //   color: errors.body && touched.body ? '#ff4d4d' : '#b0b0b0',
            // },
          }}
        />
      </Box>
      <DialogContent dividers className={EditCombinedSummaryStyles.dialogBody}>
        <Box
          component="div"
          className={EditCombinedSummaryStyles.dialogFormButtonBox}
        >
          <Button
            className={EditCombinedSummaryStyles.formCancelBtn}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button className="btn btn-primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  );
}
