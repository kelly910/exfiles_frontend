'use client';

import React, { useState } from 'react';
import styles from './logout.module.scss';
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
import { deleteDocumentByDocId } from '@/app/redux/slices/documentByCategory';
import { useAppDispatch } from '@/app/redux/hooks';
import { setLoader } from '@/app/redux/slices/loader';
import { fetchCategories } from '@/app/redux/slices/categoryListing';
import {
  deleteIncidentById,
  fetchLogIncidents,
} from '@/app/redux/slices/logIncident';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Background-Color)',
    margin: '0px',
    border: '1px solid var(--Stroke-Color)',
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
  openDeleteDialogProps: boolean;
  onClose: () => void;
  type: string;
  deletedId: number | string;
  onConfirmDelete?: () => void;
}

export default function DeleteDialog({
  openDeleteDialogProps,
  onClose,
  type,
  deletedId,
  onConfirmDelete,
}: DeleteDialogProps) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const deleteDocument = () => {
    setLoading(true);
    dispatch(setLoader(true));
    setTimeout(async () => {
      if (type === 'Document') {
        await dispatch(deleteDocumentByDocId(deletedId as number));
        await dispatch(fetchCategories({ page: 1 }));
      } else {
        await dispatch(deleteIncidentById(deletedId as number));
        await dispatch(fetchLogIncidents({ page: 1 }));
      }

      if (onConfirmDelete) {
        onConfirmDelete();
      }

      onClose();
      dispatch(setLoader(false));
      setLoading(false);
    }, 1000);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={openDeleteDialogProps}
        className={styles.headerDialogBox}
        sx={{
          background: 'rgb(17 16 27 / 0%)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <Box component="div" className={styles.dialogHeader}>
          <DialogTitle
            sx={{ m: 0, p: 0 }}
            id="customized-dialog-title"
            className={styles.dialogHeaderInner}
          >
            <Box component="div" className={styles.dialogIcon}>
              <Image
                src="/images/trash.svg"
                alt="trash"
                width={28}
                height={28}
              />
            </Box>
            <Box>
              <Typography variant="h6" className={styles.dialogTitle}>
                Delete {type === 'Document' ? 'Document' : ''}
              </Typography>
              <Typography variant="body1" className={styles.dialogSemiTitle}>
                Are you sure you want to delete this{' '}
                {type === 'Document' ? ' document' : 'incident'}?
              </Typography>
            </Box>
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onClose}
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
        <DialogContent dividers className={styles.dialogBody}>
          <Box component="div" className={styles.dialogFormButtonBox}>
            <Button className={styles.formCancelBtn} onClick={onClose}>
              {type === 'Document' ? 'No, Don’t Delete' : 'Cancel'}
            </Button>
            <Button
              className={styles.formSaveBtn}
              disabled={loading}
              onClick={deleteDocument}
            >
              {loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                `${type === 'Document' ? 'Yes, Delete It' : 'Delete'} `
              )}
            </Button>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
