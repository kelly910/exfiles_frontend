import React, { useState } from 'react';
import styles from './logincident.module.scss';
import Image from 'next/image';
import { Box, Button, Typography } from '@mui/material';
import LogModel from '../LogModel/LogModel';
import { selectFetchedUser } from '@/app/redux/slices/login';
import { useSelector } from 'react-redux';
import { useThemeMode } from '@/app/utils/ThemeContext';
import PlanExpired from '../Plan-Expired/PlanExpired';

export default function LogincidentEmpty() {
  const [openModel, setOpenModel] = useState(false);
  const { theme } = useThemeMode();
  const fetchedUser = useSelector(selectFetchedUser);
  const expiredStatus = fetchedUser?.active_subscription?.status;
  const [expiredDialog, setExpiredDialog] = useState(false);

  const openLogIncidentModel = () => {
    if (expiredStatus === 0) {
      setExpiredDialog(true);
    } else {
      setOpenModel(true);
    }
  };

  return (
    <>
      <Box component="div" className={styles.emptyContainer}>
        <Image
          src={
            theme === 'dark'
              ? '/images/log-incident-empty-light.png'
              : '/images/log-incident-empty.png'
          }
          alt="DocumentsEmpty.png"
          width={140}
          height={150}
          className={styles.emptyImage}
        />
        <Typography className={styles.emptyTitle} variant="body1">
          No Incidents are logged yet.
          <div>Click the button below to log an incident.</div>
        </Typography>
        <Button className={'btn btn-pluse'} onClick={openLogIncidentModel}>
          <Image src="/images/add-icon.svg" alt="re" width={20} height={20} />
          Add Incident
        </Button>
      </Box>
      <LogModel
        open={openModel}
        handleClose={() => setOpenModel(false)}
        editedData={null}
      />
      <PlanExpired
        open={expiredDialog}
        onClose={() => setExpiredDialog(false)}
        type={'LogIncident'}
      />
    </>
  );
}
