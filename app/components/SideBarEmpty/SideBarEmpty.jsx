import React from 'react';
import styles from '@components/SideBarEmpty/sideBarEmpty.module.scss';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';

export default function SideBarrmpty() {
  return (
    <>
      <Box component="div" className={styles.sideBarEmptyContainer}>
        <Image
          src="/images/SideBarEmpty.png"
          alt="SideBarEmpty.png"
          width={62}
          height={78}
          className={styles.sideBarEmptyImage}
        />
        <Typography className={styles.sideBarEmptyTitle} variant="body1">
          Your chats will show up here.
        </Typography>
      </Box>
    </>
  );
}
