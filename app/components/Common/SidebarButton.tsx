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
        display: 'flex',
        marginBottom:
          btnTitle === 'Documents' || btnTitle === 'Reports' ? '5px' : '12px',
        '.MuiTouchRipple-root': {
          display: 'none !important',
        },
        width:
          btnTitle === 'Documents' || btnTitle === 'Reports'
            ? 'calc(100% - 26px)'
            : '100%',
        marginLeft:
          btnTitle === 'Documents' || btnTitle === 'Reports' ? 'auto' : '0',
        marginRight:
          btnTitle === 'Documents' || btnTitle === 'Reports' ? '0' : '0',
      }}
      onClick={handleBtnClick}
    >
      <Typography component="span" className={Style['heading']}>
        <Image src={iconPath} alt="icon" width={18} height={18} />
        {btnTitle}
      </Typography>
    </Button>
  );
}
