'use client';
import React from 'react';
import Style from './Sidebar.module.scss';
import { Button, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';

export default function SidebarButton({
  btnTitle,
  iconPath,
  handleBtnClick,
  isOpen,
}: {
  btnTitle: string;
  iconPath: string;
  handleBtnClick: () => void;
  isOpen?: boolean;
}) {
  return (
    <Tooltip title={!isOpen ? btnTitle : ''} placement="right" arrow>
      <Button
        className={`${Style.customAccordionHeading}`}
        sx={{
          display: 'flex',
          marginBottom:
            btnTitle === 'View Documents' || btnTitle === 'Export Summaries'
              ? '5px'
              : '12px',
          '.MuiTouchRipple-root': {
            display: 'none !important',
          },
          width:
            // btnTitle === 'View Documents' || btnTitle === 'Export Summaries'
            //   ? 'calc(100% - 26px)' :
            '100%',
          marginLeft:
            btnTitle === 'View Documents' || btnTitle === 'Export Summaries'
              ? 'auto'
              : '0',
          marginRight:
            btnTitle === 'View Documents' || btnTitle === 'Export Summaries'
              ? '0'
              : '0',
        }}
        onClick={handleBtnClick}
      >
        <Typography component="span" className={Style['heading']}>
          <Image src={iconPath} alt="icon" width={18} height={18} />
          {btnTitle}
        </Typography>
      </Button>
    </Tooltip>
  );
}
