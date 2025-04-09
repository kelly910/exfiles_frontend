import React from 'react';
import styles from '@components/Common/NoRecordFound.module.scss';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';

export default function NoRecordFound({
  title,
  imageSrc,
}: {
  title: string;
  imageSrc?: string;
}) {
  return (
    <>
      <Box component="div" className={styles.sideBarEmptyContainer}>
        <Image
          src={imageSrc || '/images/SideBarEmpty.png'}
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
