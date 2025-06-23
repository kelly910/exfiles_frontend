import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import EditCombinedSummaryStyles from '@components/ReName/rename.module.scss';
import { useAppDispatch } from '@/app/redux/hooks';
import { ChatMessage } from '@/app/redux/slices/Chat/chatTypes';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import {
  editCombinedSummaryData,
  setUpdateMessageList,
} from '@/app/redux/slices/Chat';
import { showToast } from '@/app/shared/toast/ShowToast';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Background-Color)',
    margin: '0px',
    border: '1px solid var(--Stroke-Color)',
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
  messageData: ChatMessage;
}

interface IFormSubmit {
  summary: string;
}

export default function EditCombinedSummary({
  open,
  handleClose,
  messageData,
}: EditCombineSummaryModalProps) {
  console.log(messageData);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const schema = Yup.object().shape({
    summary: Yup.string().trim().required().label('Summary'),
  });

  const [defaultValues, setDefaultValues] = useState<IFormSubmit>({
    summary: '',
  });

  const { handleSubmit, reset, control } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (
      messageData &&
      messageData.combined_summary_data &&
      messageData.combined_summary_data
    ) {
      setDefaultValues({
        summary: messageData.combined_summary_data.summary || '',
      });
      reset({ summary: messageData.combined_summary_data.summary || '' });
    }
  }, [messageData]);

  const handleSubmitEditSummary = async (values: IFormSubmit) => {
    const { summary } = values;
    if (
      messageData.combined_summary_data &&
      messageData.combined_summary_data.uuid
    ) {
      setIsLoading(true);
      const payload = {
        combined_summary_uuid: messageData.combined_summary_data.uuid,
        summary,
      };

      const resultData = await dispatch(editCombinedSummaryData(payload));

      if (editCombinedSummaryData.fulfilled.match(resultData)) {
        const changedMsgObj = {
          ...messageData,
          combined_summary_data: {
            ...messageData.combined_summary_data,
            summary,
          },
        };
        dispatch(setUpdateMessageList(changedMsgObj));

        handleClose();
        showToast(
          'success',
          'Generated Combined summary successfully updated.'
        );
      }
      if (editCombinedSummaryData.rejected.match(resultData)) {
        handleError(resultData.payload as ErrorResponse);
      }

      setIsLoading(false);
    }
  };

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
          {messageData.combined_summary_data &&
            messageData.combined_summary_data?.file_names?.length >= 2 && (
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
                  {messageData.combined_summary_data?.file_names
                    ?.slice(0, 1)
                    ?.map((fileItem: string, index: number) => (
                      <span key={index}>{fileItem}</span>
                    ))}
                  {messageData.combined_summary_data?.file_names?.length >
                    1 && (
                    <span>
                      +{messageData.combined_summary_data.file_names.length - 1}
                    </span>
                  )}
                </Typography>
              </Box>
            )}
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
      <form
        name="Edit combine summary Form"
        onSubmit={handleSubmit(handleSubmitEditSummary)}
      >
        <Box component="div" className={EditCombinedSummaryStyles.dialogInput}>
          <Controller
            name="summary"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                id="summary"
                placeholder="Edit your Summary"
                multiline
                minRows={4}
                maxRows={6}
                error={!!error}
                helperText={error?.message}
                sx={{
                  marginTop: '0px',
                  padding: '0',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    borderWidth: '0px',
                    color: 'var(--Primary-Text-Color)',
                    backgroundColor: 'var(--Input-Box-Colors)',
                    padding: '14px 16px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      top: '-10px !important',
                    },
                    '& .MuiOutlinedInput-input': {
                      fontSize: 'var(--SubTitle-3)',
                      color: 'var(--Primary-Text-Color)',
                      fontWeight: 'var(--Regular)',
                      borderRadius: '12px',
                      padding: '2px',
                      maxHeight: '200px',
                      overflowY: 'auto !important',
                      '&::placeholder': {
                        color: 'var(--Subtext-Color)',
                        fontWeight: 'var(--Lighter)',
                      },
                    },
                    '& fieldset': {
                      borderColor: 'var(--Stroke-Color)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--Txt-On-Gradient)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--Txt-On-Gradient)',
                      borderWidth: '1px',
                      color: 'var(--Txt-On-Gradient)',
                    },
                  },
                }}
              />
            )}
          />
        </Box>
        <DialogContent
          dividers
          className={EditCombinedSummaryStyles.dialogBody}
        >
          <Box
            component="div"
            className={EditCombinedSummaryStyles.dialogFormButtonBox}
          >
            <Button
              className={EditCombinedSummaryStyles.formCancelBtn}
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="btn btn-primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress
                  size={18}
                  sx={{ color: 'var(--Txt-On-Gradient)' }}
                />
              ) : (
                'Save Changes'
              )}
            </Button>
          </Box>
        </DialogContent>
      </form>
    </BootstrapDialog>
  );
}
