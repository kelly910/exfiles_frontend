import React from 'react';
import styles from '@components/Common/NoRecordFound.module.scss';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import { useThemeMode } from '@/app/utils/ThemeContext';

export default function NoRecordFound({
  title,
  // imageSrc,
}: {
  title: string;
  // imageSrc?: string;
}) {
  const { theme } = useThemeMode();
  return (
    <>
      <Box component="div" className={styles.sideBarEmptyContainer}>
        <Image
          // src={imageSrc || '/images/SideBarEmpty.png'}
          src={
            theme === 'dark'
              ? '/images/log-incident-empty-light.png'
              : '/images/SideBarEmpty.png'
          }
          alt="SideBarEmpty.png"
          width={62}
          height={78}
          className={styles.sideBarEmptyImage}
        />
        <Typography className={styles.sideBarEmptyTitle} variant="body1">
          {title}
        </Typography>
      </Box>
    </>
  );
}
