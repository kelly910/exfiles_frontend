import React from 'react';
import styles from '@components/Error404/error.module.scss';
import Image from 'next/image';
import { Box, Button, Typography } from '@mui/material';

export default function Error() {
  return (
    <>
      <Box component="div" className={styles.errorContainer}>
        <Typography className={styles.errorTitle} variant="body1">
          Seems like the page you requested doesn’t exist.
        </Typography>
        <Image
          src="/images/Error404.png"
          alt="Error404.png"
          width={562}
          height={195}
          className={styles.errorImage}
        />
        <Button className="btn btn-primary">Back to Home</Button>
      </Box>
    </>
  );
}
