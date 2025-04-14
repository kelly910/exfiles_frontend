'use client';
import React from 'react';
import Style from './Sidebar.module.scss';
import { Button, Typography } from '@mui/material';
import Image from 'next/image';

export default function SidebaarButton() {
  return (
    <Button
      className={`${Style.customAccordionHeading} ${Style.active}`}
      sx={{
        '.MuiTouchRipple-root': {
          display: 'none !important',
        },
      }}
    >
      <Typography component="span" className={Style['heading']}>
        <Image
          src="/images/document-text.svg"
          alt="icon"
          width={18}
          height={18}
        />
        title
      </Typography>
      <Typography component="span" className={Style['heading-side-img']}>
        <Image
          className={Style['img-none']}
          src="/images/arrow-down-right.svg"
          alt="expand-collapse"
          width={16}
          height={16}
        />
      </Typography>
    </Button>
  );
}
