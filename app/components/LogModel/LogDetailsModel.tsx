import React, { useState } from 'react';
import LogStyle from './logmodel.module.scss';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import { DesktopDateTimePicker } from '@mui/x-date-pickers';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid #3a3948',
    borderRadius: '16px',
    minWidth: '606px',
    maxHeight: '95dvh',

    // '@media (max-width: 1024px)': {
    //   maxWidth: '80vw',
    //   minWidth: '700px',
    //   minHeight: '500px',
    // },
    '@media (max-width: 768px)': {
      maxWidth: '80vw',
      minWidth: '480px', // 90% of the viewport width
    },
    '@media (max-width: 500px)': {
      maxWidth: '80vw',
      minWidth: '450px', // 90% of the viewport width
    },
    '@media (max-width: 480px)': {
      maxWidth: '95vw',
      minWidth: '100%', // Almost full width
    },
  },
}));

export default function LogDetailsModel() {
  const [open, setOpen] = React.useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog Incident Details
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
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

        <DialogContent className={LogStyle.dialogFormContentDetailsBox}>
          <Typography variant="body1" className={LogStyle.logTitle}>
            Corporate card products can help businesses of all sizes manage
            their finances more effectively.
          </Typography>
          <Box component="div" className={LogStyle.logListBody}>
            <Box className={LogStyle.logListBodyTag}>
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
                Missed Visit
              </Typography>
            </Box>
            <Box className={LogStyle.logListBodyTag}>
              <Image
                src="/images/late-visit.svg"
                alt="Log-success"
                width={16}
                height={16}
              />
              <Typography
                variant="body1"
                className={LogStyle.logListBodyTagTitle}
              >
                Late Visit
              </Typography>
            </Box>
            <Box className={LogStyle.logListBodyTag}>
              <Image
                src="/images/late-visit.svg"
                alt="Log-success"
                width={16}
                height={16}
              />
              <Typography
                variant="body1"
                className={LogStyle.logListBodyTagTitle}
              >
                No Response
              </Typography>
            </Box>
          </Box>
          <Box component="div" className={LogStyle.logListFooter}>
            <Typography variant="body1" className={LogStyle.logListFooterTitle}>
              Date & Time
            </Typography>
            <Typography
              variant="body1"
              className={LogStyle.logListFooterDetails}
            >
              04-25-2025 10:30 AM
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
                  4517 Washington Ave. Manchester, Kentucky 39495
                </Typography>
                <Typography
                  variant="body1"
                  className={LogStyle.logDetailsListDetailsInner}
                >
                  4517 Washington Ave. Manchester, Kentucky 39495
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
                  Jonathan Weak, Winston Churchil
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
                  Jonathan Weak, Winston Churchil
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
                  Conflict-With-Jonathan-Report.pdf
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
                  Conflict-With-Jonathan-Report.pdf
                </Typography>
                <Typography
                  variant="body1"
                  className={LogStyle.logDetailsListDetailsInner}
                >
                  Conflict-With-Jonathan-Report.jpeg
                </Typography>
                <Typography
                  variant="body1"
                  className={LogStyle.logDetailsListDetailsInner}
                >
                  Conflict-With-Jonathan-Report.png
                </Typography>
                <Typography
                  variant="body1"
                  className={LogStyle.logDetailsListDetailsInner}
                >
                  Conflict-With-Jonathan-Report.docs
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
