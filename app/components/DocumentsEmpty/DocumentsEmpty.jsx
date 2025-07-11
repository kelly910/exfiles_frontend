import React from 'react';
import styles from '@components/DocumentsEmpty/documentsEmpty.module.scss';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import { useThemeMode } from '@/app/utils/ThemeContext';

export default function DocumentsEmpty() {
  const { theme } = useThemeMode();
  return (
    <>
      <Box component="div" className={styles.emptyContainer}>
        <Image
          src={
            theme === 'dark'
              ? '/images/DocumentsEmpty-light.png'
              : '/images/DocumentsEmpty.png'
          }
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
