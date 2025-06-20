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
import dayjs from 'dayjs';

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
      minWidth: '90%',
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
              right: '24px',
              top: '16px',
              padding: '0',
              color: theme.palette.grey[500],
              [theme.breakpoints.down('sm')]: {
                right: '16px',
              },
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
                {tag?.file_data?.file_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tag?.file_data?.file_url}
                    alt="Log-success"
                    width="16"
                    height="16"
                  />
                ) : (
                  <Image
                    src="/images/other.svg"
                    alt="close icon"
                    width={16}
                    height={16}
                  />
                )}
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
              {itemDetails?.incident_time
                ? dayjs(
                    itemDetails?.incident_time.replace(
                      /([+-]\d{2}:\d{2}):\d{2}$/,
                      '$1'
                    )
                  ).format('MM/DD/YYYY hh:mm A')
                : '-'}
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
                  {itemDetails?.involved_person_name || '-'}
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
                  {itemDetails?.evidence?.split('?')[0].split('/').pop() || '-'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
