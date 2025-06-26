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
import { useThemeMode } from '@/app/utils/ThemeContext';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid var(--Stroke-Color)',
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
  const { theme } = useThemeMode();
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

        <DialogContent className={LogStyle.dialogFormContentDetailsBox}>
          <Typography variant="body1" className={LogStyle.logTitle}>
            {itemDetails?.description || '-'}
          </Typography>
          <Box component="div" className={LogStyle.logListBody}>
            {itemDetails?.tags_data?.map((tag, index) => (
              <Box
                className={LogStyle.logListBodyTag}
                key={index}
                style={{
                  background:
                    theme === 'dark'
                      ? 'var(--Txt-On-Gradient)'
                      : 'var(--Stroke-Color)',
                }}
              >
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
                  style={{
                    color:
                      theme === 'dark'
                        ? 'var(--Icon-Color)'
                        : 'var(--Subtext-Color)',
                  }}
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
