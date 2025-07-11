import React, { useState } from 'react';
import Style from '@components/Plan-Expired/PlanExpired.module.scss';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  styled,
  Typography,
} from '@mui/material';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid var(--Stroke-Color)',
    borderRadius: '24px',
    minWidth: '450px',
    width: '515px',
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

interface ConfirmationUpgradePlanDialogProps {
  open: boolean;
  onClose: () => void;
  upgradeContinue?: () => void;
}

export default function ConfirmationUpgradePlan({
  open,
  onClose,
  upgradeContinue,
}: ConfirmationUpgradePlanDialogProps) {
  const [loading, setLoading] = useState(false);

  const continueClick = () => {
    setLoading(true);
    setTimeout(() => {
      upgradeContinue?.();
      setLoading(false);
    }, 2000);
  };

  return (
    <>
      <React.Fragment>
        <BootstrapDialog
          open={open}
          onClose={(event, reason) => {
            console.log(event, 'evnet');
            if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
              onClose();
            }
          }}
          aria-labelledby="customized-dialog-title"
          className={Style.headerDialogBox}
          sx={{
            background: 'rgb(17 16 27 / 0%)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <Box component="div" className={Style.dialogHeader}>
            <Typography
              variant="h2"
              style={{
                fontSize: 'var(--Heading-3)',
                marginTop: '0',
              }}
            >
              Confirm Subscription Upgrade
            </Typography>
            <Typography variant="body2" style={{ textAlign: 'left' }}>
              <ul style={{ margin: 0 }}>
                <li>
                  You are about to upgrade from Essential Plan to Pro Plan.
                </li>
                <li>
                  Your new plan will take effect immediately, and the additional
                  features and limits will be available right away.
                </li>
                <li>
                  A prorated charge will be applied based on the remaining days
                  in your current billing cycle.
                </li>
              </ul>
            </Typography>
            <Box component="div" className={Style.dialogFormButtonBox}>
              <Button className={Style.formCancelBtn} onClick={onClose}>
                Cancel
              </Button>
              <Button
                className={Style.formContinueBtn}
                disabled={loading}
                onClick={continueClick}
              >
                {loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  'Continue'
                )}
              </Button>
            </Box>
          </Box>
        </BootstrapDialog>
      </React.Fragment>
    </>
  );
}
