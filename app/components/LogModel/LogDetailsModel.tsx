'use client';

import React from 'react';
import LogStyle from './logmodel.module.scss';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { LogIncidentDetails } from '../LogIncident/LogIncident';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid #3a3948',
    borderRadius: '16px',
    minWidth: '606px',
    maxHeight: '95dvh',
    '@media (max-width: 768px)': {
      maxWidth: '80vw',
      minWidth: '480px',
    },
    '@media (max-width: 500px)': {
      maxWidth: '80vw',
      minWidth: '450px',
    },
    '@media (max-width: 480px)': {
      maxWidth: '95vw',
      minWidth: '100%',
    },
  },
}));

interface DetailsDialogProps {
  openDetailDialogProps: boolean;
  onClose: () => void;
  itemDetails: LogIncidentDetails | null;
}

export default function LogDetailsModel({
  openDetailDialogProps,
  onClose,
  itemDetails,
}: DetailsDialogProps) {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date
      .toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .replace(',', '');
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={openDetailDialogProps}
        className={LogStyle.headerDialogBox}
        sx={{
          background: 'rgb(17 16 27 / 0%)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <Box className={LogStyle.dialogHeader}>
          <DialogTitle
            sx={{ m: 0, p: 2 }}
            id="customized-dialog-title"
            className={LogStyle.dialogHeaderInner}
          >
            <Box component="div" className={LogStyle.dialogIcon}>
              <Image
                src="/images/log-model.svg"
                alt="logout"
                width={28}
                height={28}
              />
            </Box>
            <Box>
              <Typography variant="h6" className={LogStyle.dialogTitle}>
                Incident Details
              </Typography>
              <Typography variant="body1" className={LogStyle.dialogSemiTitle}>
                Your thoughts are valuable in helping improve our products.
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

        <DialogContent className={LogStyle.dialogFormContentDetailsBox}>
          <Typography variant="body1" className={LogStyle.logTitle}>
            {itemDetails?.description || '-'}
          </Typography>
          <Box component="div" className={LogStyle.logListBody}>
            {itemDetails?.tags_data?.map((tag, index) => (
              <Box className={LogStyle.logListBodyTag} key={index}>
                <Image
                  src="/images/missed-visit.svg"
                  alt="Log-success"
                  width={16}
                  height={16}
                />
                <Typography
                  variant="body1"
                  className={LogStyle.logListBodyTagTitle}
                >
                  {tag.name}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box component="div" className={LogStyle.logListFooter}>
            <Typography variant="body1" className={LogStyle.logListFooterTitle}>
              Date & Time
            </Typography>
            <Typography
              variant="body1"
              className={LogStyle.logListFooterDetails}
            >
              {formatDate(itemDetails?.incident_time)}
            </Typography>
          </Box>
          <Box component="div" className={LogStyle.logDetailsList}>
            <Box component="div" className={LogStyle.logDetailsListInner}>
              <Typography
                variant="body1"
                className={LogStyle.logDetailsListTitle}
              >
                Location
              </Typography>
              <Box component="div" className={LogStyle.logDetailsListDetails}>
                <Typography
                  variant="body1"
                  className={LogStyle.logDetailsListDetailsInner}
                >
                  {itemDetails?.location || '-'}
                </Typography>
              </Box>
            </Box>

            <Box component="div" className={LogStyle.logDetailsListInner}>
              <Typography
                variant="body1"
                className={LogStyle.logDetailsListTitle}
              >
                Person Involved
              </Typography>
              <Box component="div" className={LogStyle.logDetailsListDetails}>
                <Typography
                  variant="body1"
                  className={LogStyle.logDetailsListDetailsInner}
                >
                  {itemDetails?.user_data?.first_name}{' '}
                  {itemDetails?.user_data?.last_name}
                </Typography>
              </Box>
            </Box>

            <Box component="div" className={LogStyle.logDetailsListInner}>
              <Typography
                variant="body1"
                className={LogStyle.logDetailsListTitle}
              >
                Document Category
              </Typography>
              <Box component="div" className={LogStyle.logDetailsListDetails}>
                <Typography
                  variant="body1"
                  className={LogStyle.logDetailsListDetailsInner}
                >
                  {itemDetails?.document_data?.category_data?.name || '-'}
                </Typography>
              </Box>
            </Box>

            <Box component="div" className={LogStyle.logDetailsListInner}>
              <Typography
                variant="body1"
                className={LogStyle.logDetailsListTitle}
              >
                Document
              </Typography>
              <Box component="div" className={LogStyle.logDetailsListDetails}>
                <Typography
                  variant="body1"
                  className={LogStyle.logDetailsListDetailsInner}
                >
                  {itemDetails?.document_data?.file_data?.file_name || '-'}
                </Typography>
              </Box>
            </Box>

            <Box component="div" className={LogStyle.logDetailsListInner}>
              <Typography
                variant="body1"
                className={LogStyle.logDetailsListTitle}
              >
                Support Evidences
              </Typography>
              <Box component="div" className={LogStyle.logDetailsListDetails}>
                <Typography
                  variant="body1"
                  className={LogStyle.logDetailsListDetailsInner}
                >
                  {itemDetails?.evidence?.split('log_incidents/')[1] || '-'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
