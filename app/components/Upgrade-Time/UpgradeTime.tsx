import React from 'react';
import { useEffect, useState } from 'react';
import Style from '@components/Upgrade-Time/UpgradeTime.module.scss';
import { Box, Button, Dialog, styled, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

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

interface UpgradeTimeDialogProps {
  open: boolean;
  onClose: () => void;
  type?: string;
}

export default function UpgradeTime({
  open,
  onClose,
  type,
}: UpgradeTimeDialogProps) {
  const router = useRouter();
  const loggedInUser = useSelector(
    (state: RootState) => state.login.loggedInUser
  );

  const expiryPlanDate =
    loggedInUser?.data?.active_subscription?.deactivate_date;

  const [timerData, setTimerData] = useState([
    { value: '00', label: 'Days' },
    { value: '00', label: 'Hours' },
    { value: '00', label: 'Minutes' },
    { value: '00', label: 'Seconds' },
  ]);

  useEffect(() => {
    if (!expiryPlanDate) return;

    const targetTime = new Date(expiryPlanDate);
    const istNow = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );

    const isSameDate = (date1: Date, date2: Date) =>
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();

    const showPopupDates = [
      new Date(
        targetTime.getFullYear(),
        targetTime.getMonth(),
        targetTime.getDate() - 1
      ), // 1 day before
      new Date(
        targetTime.getFullYear(),
        targetTime.getMonth(),
        targetTime.getDate() - 2
      ), // 2 days before
    ];

    const shouldShowPopup = showPopupDates.some((d) => isSameDate(d, istNow));
    if (!shouldShowPopup) {
      onClose();
      // return;
    }

    const updateCountdown = () => {
      const now = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
      );
      const diff = targetTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimerData([
          { value: '00', label: 'Days' },
          { value: '00', label: 'Hours' },
          { value: '00', label: 'Minutes' },
          { value: '00', label: 'Seconds' },
        ]);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimerData([
        { value: String(days).padStart(2, '0'), label: 'Days' },
        { value: String(hours).padStart(2, '0'), label: 'Hours' },
        { value: String(minutes).padStart(2, '0'), label: 'Minutes' },
        { value: String(seconds).padStart(2, '0'), label: 'Seconds' },
      ]);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [expiryPlanDate]);

  const upgradeNow = () => {
    onClose();
    router.push('/plans');
  };

  const notNow = () => {
    onClose();
    if (type === 'login') {
      router.push('/ai-chats');
    }
  };

  return (
    <>
      <React.Fragment>
        <BootstrapDialog
          open={open}
          onClose={onClose}
          aria-labelledby="customized-dialog-title"
          className={Style.headerDialogBox}
          sx={{
            background: 'rgb(17 16 27 / 0%)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <Box component="div" className={Style.dialogHeader}>
            <Box component="div" className={Style.dialogTimer}>
              {timerData.map((item, index) => (
                <>
                  <Box className={Style.dialogSetTime}>
                    <Box className={Style.dialogSetTimeInner}>
                      <Box className={Style.dialogSetTimeLog}>
                        <Typography className={Style.dialogSetText}>
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography className={Style.dialogSetTextTime}>
                      {item.label}
                    </Typography>
                  </Box>
                  {index !== timerData.length - 1 && (
                    <Typography
                      variant="body2"
                      className={Style.dialogSetTextDot}
                    >
                      :
                    </Typography>
                  )}
                </>
              ))}
            </Box>
            <Typography variant="h2">It’s Time for Your Upgrade!</Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sitamet consectetur Purus lacus sagittis
              facilisi fringilla purus lacus
            </Typography>
            <Box component="div" className={Style.dialogFormButtonBox}>
              <Button className={Style.formCancelBtn} onClick={notNow}>
                Not Now
              </Button>
              <Button className={Style.formContinueBtn} onClick={upgradeNow}>
                Upgrade Now
              </Button>
            </Box>
          </Box>
        </BootstrapDialog>
      </React.Fragment>
    </>
  );
}
