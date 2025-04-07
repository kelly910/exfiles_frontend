import React from 'react';
import styles from '@components/DocumentsEmpty/documentsEmpty.module.scss';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';

export default function DocumentsEmpty() {
  return (
    <>
      <Box component="div" className={styles.emptyContainer}>
        <Image
          src="/images/DocumentsEmpty.png"
          alt="DocumentsEmpty.png"
          width={140}
          height={150}
          className={styles.emptyImage}
        />
        <Typography className={styles.emptyTitle} variant="body1">
          No Documents added yet.
        </Typography>
      </Box>
    </>
  );
}
