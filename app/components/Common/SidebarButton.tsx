'use client';
import React from 'react';
import Style from './Sidebar.module.scss';
import { Button, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useThemeMode } from '@/app/utils/ThemeContext';

export default function SidebarButton({
  btnTitle,
  iconPath,
  handleBtnClick,
  isOpen,
  matchPath,
}: {
  btnTitle: string;
  iconPath: string;
  handleBtnClick: () => void;
  isOpen?: boolean;
  matchPath: string;
}) {
  const pathname = usePathname();
  const isActive = pathname?.includes(matchPath);
  const { theme } = useThemeMode();

  const logIncident = () => {
    return theme === 'dark' ? (
      <svg
        width="18"
        height="19"
        viewBox="0 0 18 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.8945 4.92676L15.3643 3.13574L13.5732 7.60547L18 9.5L13.5732 11.3945L15.3643 15.8643L10.8945 14.0732L9 18.5L7.10547 14.0732L2.63574 15.8643L4.42676 11.3945L0 9.5L4.42676 7.60547L2.63574 3.13574L7.10547 4.92676L9 0.5L10.8945 4.92676ZM9.18359 11.0117C8.74349 11.012 8.38672 11.3684 8.38672 11.8086C8.38675 12.2487 8.74352 12.6052 9.18359 12.6055C9.62387 12.6055 9.98141 12.2489 9.98145 11.8086C9.98145 11.3683 9.62389 11.0117 9.18359 11.0117ZM8.38672 10.2139H9.98145V6.22754H8.38672V10.2139Z"
          fill={
            isActive === true ? 'var(--Icon-Color)' : 'var(--Subtext-Color)'
          }
        />
      </svg>
    ) : (
      <Image
        src="/images/log-incident-sidebar.svg"
        alt="icon"
        width={18}
        height={18}
      />
    );
  };

  const documents = () => {
    return theme === 'dark' ? (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.50804 14.9677C9.71409 15.0157 9.73297 15.2855 9.53227 15.3524V15.3524L8.34727 15.7424C5.36977 16.7024 3.80227 15.8999 2.83477 12.9224L1.87477 9.95994C0.914768 6.98244 1.70977 5.40744 4.68727 4.44744L4.82627 4.40141C5.22913 4.26799 5.62706 4.67423 5.5214 5.08524C5.50313 5.15632 5.4851 5.22872 5.46727 5.30244L4.73227 8.44494C3.90727 11.9774 5.11477 13.9274 8.64727 14.7674L9.50804 14.9677Z"
          fill={
            isActive === true ? 'var(--Icon-Color)' : 'var(--Subtext-Color)'
          }
        />
        <path
          d="M12.8776 2.40738L11.6251 2.11488C9.12013 1.52238 7.62763 2.00988 6.75013 3.82488C6.52513 4.28238 6.34513 4.83738 6.19513 5.47488L5.46013 8.61738C4.72513 11.7524 5.69263 13.2974 8.82013 14.0399L10.0801 14.3399C10.5151 14.4449 10.9201 14.5124 11.2951 14.5424C13.6351 14.7674 14.8801 13.6724 15.5101 10.9649L16.2451 7.82988C16.9801 4.69488 16.0201 3.14238 12.8776 2.40738ZM11.4676 9.99738C11.4001 10.2524 11.1751 10.4174 10.9201 10.4174C10.8751 10.4174 10.8301 10.4099 10.7776 10.4024L8.59513 9.84738C8.29513 9.77238 8.11513 9.46488 8.19013 9.16488C8.26513 8.86488 8.57263 8.68488 8.87263 8.75988L11.0551 9.31488C11.3626 9.38988 11.5426 9.69738 11.4676 9.99738ZM13.6651 7.46238C13.5976 7.71738 13.3726 7.88238 13.1176 7.88238C13.0726 7.88238 13.0276 7.87488 12.9751 7.86738L9.33763 6.94488C9.03763 6.86988 8.85763 6.56238 8.93263 6.26238C9.00763 5.96238 9.31513 5.78238 9.61513 5.85738L13.2526 6.77988C13.5601 6.84738 13.7401 7.15488 13.6651 7.46238Z"
          fill={
            isActive === true ? 'var(--Icon-Color)' : 'var(--Subtext-Color)'
          }
        />
      </svg>
    ) : (
      <Image src="/images/note-2.svg" alt="icon" width={18} height={18} />
    );
  };

  const reportDocuments = () => {
    return theme === 'dark' ? (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.6875 1.875H10.3125C10.6739 1.875 11.0001 2.01962 11.2402 2.25977C11.4804 2.49991 11.625 2.82608 11.625 3.1875C11.625 3.91039 11.0354 4.5 10.3125 4.5H7.6875C7.32608 4.5 6.99991 4.35538 6.75977 4.11523C6.51962 3.87509 6.375 3.54892 6.375 3.1875C6.375 2.46461 6.96461 1.875 7.6875 1.875Z"
          fill={
            isActive === true ? 'var(--Icon-Color)' : 'var(--Subtext-Color)'
          }
          stroke={
            isActive === true ? 'var(--Icon-Color)' : 'var(--Subtext-Color)'
          }
          stroke-width="0.75"
        />
        <path
          d="M14.1225 3.77253C13.95 3.63003 13.755 3.51753 13.545 3.43503C13.3275 3.35253 13.11 3.52503 13.065 3.75003C12.81 5.03253 11.6775 6.00003 10.3125 6.00003H7.6875C6.9375 6.00003 6.2325 5.70753 5.7 5.17503C5.31 4.78503 5.04 4.29003 4.935 3.75753C4.89 3.53253 4.665 3.35253 4.4475 3.44253C3.5775 3.79503 3 4.59003 3 6.18753V13.5C3 15.75 4.3425 16.5 6 16.5H12C13.6575 16.5 15 15.75 15 13.5V6.18753C15 4.96503 14.6625 4.21503 14.1225 3.77253ZM6 9.18753H9C9.3075 9.18753 9.5625 9.44253 9.5625 9.75003C9.5625 10.0575 9.3075 10.3125 9 10.3125H6C5.6925 10.3125 5.4375 10.0575 5.4375 9.75003C5.4375 9.44253 5.6925 9.18753 6 9.18753ZM12 13.3125H6C5.6925 13.3125 5.4375 13.0575 5.4375 12.75C5.4375 12.4425 5.6925 12.1875 6 12.1875H12C12.3075 12.1875 12.5625 12.4425 12.5625 12.75C12.5625 13.0575 12.3075 13.3125 12 13.3125Z"
          fill={
            isActive === true ? 'var(--Icon-Color)' : 'var(--Subtext-Color)'
          }
        />
      </svg>
    ) : (
      <Image src="/images/report-icon.svg" alt="icon" width={18} height={18} />
    );
  };

  function renderIcon() {
    if (iconPath === 'logIncident') {
      return logIncident();
    }
    if (iconPath === 'documents') {
      return documents();
    }
    if (iconPath === 'reportDocuments') {
      return reportDocuments();
    }
    return null;
  }

  console.log('iconPath:', iconPath);

  return (
    <Tooltip title={!isOpen ? btnTitle : ''} placement="right" arrow>
      <Button
        className={`${Style.customAccordionHeading} ${
          isActive ? Style['active'] : ''
        }`}
        sx={{
          display: 'flex',
          borderRadius: '10px',
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
          {renderIcon()}
          {btnTitle}
        </Typography>
      </Button>
    </Tooltip>
  );
}
