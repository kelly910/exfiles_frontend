import React from 'react';
import styles from './logincident.module.scss';
import Image from 'next/image';
import { Box, Button, Typography } from '@mui/material';

export default function LogincidentEmpty() {
  return (
    <>
      <Box component="div" className={styles.emptyContainer}>
        <Image
          src="/images/log-incident-empty.png"
          alt="DocumentsEmpty.png"
          width={140}
          height={150}
          className={styles.emptyImage}
        />
        <Typography className={styles.emptyTitle} variant="body1">
          No Incidents are logged yet.
          <div>Click the button below to log an incident.</div>
        </Typography>
        <Button className="btn btn-pluse">
          <Image src="/images/add-icon.svg" alt="re" width={20} height={20} />
          Add Incident
        </Button>
      </Box>
    </>
  );
}
