'use client';
import React from 'react';
import Style from './Sidebar.module.scss';
import { Button, Typography } from '@mui/material';
import Image from 'next/image';

export default function SidebarButton({
  btnTitle,
  iconPath,
  handleBtnClick,
}: {
  btnTitle: string;
  iconPath: string;
  handleBtnClick: () => void;
}) {
  return (
    <Button
      className={`${Style.customAccordionHeading}`}
      sx={{
        marginBottom: '12px',
        '.MuiTouchRipple-root': {
          display: 'none !important',
        },
      }}
      onClick={handleBtnClick}
    >
      <Typography component="span" className={Style['heading']}>
        <Image src={iconPath} alt="icon" width={18} height={18} />
        {btnTitle}
      </Typography>
      {/* <Typography component="span" className={Style['heading-side-img']}>
        <Image
          className={Style['img-none']}
          src="/images/arrow-down-right.svg"
          alt="expand-collapse"
          width={16}
          height={16}
        />
      </Typography> */}
    </Button>
  );
}
