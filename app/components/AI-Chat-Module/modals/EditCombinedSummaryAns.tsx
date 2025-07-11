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

export default function EditCombinedSummaryAns({
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
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.1 18.3C6.7134 18.6866 6.0866 18.6866 5.7 18.3C5.3134 17.9134 5.3134 17.2866 5.7 16.9L9.89289 12.7071C10.2834 12.3166 10.2834 11.6834 9.89289 11.2929L5.7 7.1C5.3134 6.7134 5.3134 6.0866 5.7 5.7C6.0866 5.3134 6.7134 5.3134 7.1 5.7L11.2929 9.89289C11.6834 10.2834 12.3166 10.2834 12.7071 9.89289L16.9 5.7C17.2866 5.3134 17.9134 5.3134 18.3 5.7C18.6866 6.0866 18.6866 6.7134 18.3 7.1L14.1071 11.2929C13.7166 11.6834 13.7166 12.3166 14.1071 12.7071L18.3 16.9C18.6866 17.2866 18.6866 17.9134 18.3 18.3C17.9134 18.6866 17.2866 18.6866 16.9 18.3L12.7071 14.1071C12.3166 13.7166 11.6834 13.7166 11.2929 14.1071L7.1 18.3Z"
              fill="var(--Primary-Text-Color)"
            />
          </svg>
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
                        color: 'var(--Placeholder-Text)',
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
