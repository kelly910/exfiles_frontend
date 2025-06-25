'use client';

import RenameThreadModalStyle from './RenameThreadModalStyle.module.scss';
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
  Typography,
} from '@mui/material';
// Third Party Imports
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { FormInputText } from '@/app/shared/forms/components/FormInputText';
import { Thread } from '@/app/redux/slices/Chat/chatTypes';

interface threadModalProps {
  open: boolean;
  handleClose: () => void;
  handleSubmitProp: (values: IFormSubmit) => void;
  threadValues: null | Thread;
  isLoading?: boolean;
}

interface IFormSubmit {
  name: string;
}

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

export default function RenameThreadModal(props: threadModalProps) {
  const { handleClose, open, handleSubmitProp, isLoading, threadValues } =
    props;

  const [defaultValues, setDefaultValues] = useState<IFormSubmit>({
    name: '',
  });

  const schema = Yup.object().shape({
    name: Yup.string().trim().required().label('Name'),
  });

  const { handleSubmit, reset, control } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (threadValues?.name) {
      setDefaultValues({ name: threadValues?.name });
      reset({ name: threadValues?.name || '' });
    }
  }, [reset]);

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      className={RenameThreadModalStyle.headerDialogBox}
      sx={{
        background: 'rgb(17 16 27 / 0%)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <Box component="div" className={RenameThreadModalStyle.dialogHeader}>
        <DialogTitle
          sx={{ m: 0, p: 0 }}
          id="customized-dialog-title"
          className={RenameThreadModalStyle.dialogHeaderInner}
        >
          <Box component="div" className={RenameThreadModalStyle.dialogIcon}>
            <Image
              src="/images/rename-thread.svg"
              alt="rename-thread"
              width={28}
              height={28}
            />
          </Box>
          <Box>
            <Typography
              variant="h6"
              className={RenameThreadModalStyle.dialogTitle}
            >
              Rename Thread
            </Typography>
            <Typography
              variant="body1"
              className={RenameThreadModalStyle.dialogSemiTitle}
            >
              Change the name of category according to your needs
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
      <form name="Rename Thread Form" onSubmit={handleSubmit(handleSubmitProp)}>
        <Box component="div" className={RenameThreadModalStyle.dialogInput}>
          <FormInputText
            name="name"
            control={control}
            // label="Title"
            placeholder="Enter Category Name here"
            sx={{
              marginTop: 0, // You can override or extend styles here
            }}
          />
        </Box>
        <DialogContent dividers className={RenameThreadModalStyle.dialogBody}>
          <Box
            component="div"
            className={RenameThreadModalStyle.dialogFormButtonBox}
          >
            <Button
              className={RenameThreadModalStyle.formCancelBtn}
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="btn btn-primary"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                'Save'
              )}
            </Button>
          </Box>
        </DialogContent>
      </form>
    </BootstrapDialog>
  );
}
