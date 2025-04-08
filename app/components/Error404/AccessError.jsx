import React from 'react';
import styles from '@components/Error404/error.module.scss';
import Image from 'next/image';
import { Box, Button, Typography } from '@mui/material';

export default function AccessError() {
  return (
    <>
      <Box component="div" className={styles.errorContainer}>
        <Typography className={styles.errorTitle} variant="body1">
          You don’t have access to this resources.
        </Typography>
        <Image
          src="/images/AccessError.png"
          alt="AccessError.png"
          width={562}
          height={195}
          className={styles.errorImage}
        />
        <Button className="btn btn-primary">Back to Home</Button>
      </Box>
    </>
  );
}
