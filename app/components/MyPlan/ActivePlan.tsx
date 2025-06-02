import React from 'react';
import styles from './style.module.scss';
import Image from 'next/image';
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressProps,
  styled,
  Typography,
} from '@mui/material';

export default function ActivePlan() {
  const used = 1.6;
  const total = 4;
  const value = (used / total) * 100;
  return (
    <>
      <Box className={styles['active-plan-body']}>
        <Box className={styles['active-plan-main']}>
          <Box className={styles['active-plan']}>
            <Box className={styles['plan-details']}>
              <Box component="figure">
                <Image
                  src="/images/Essential.svg"
                  alt="Plan Image"
                  width={48}
                  height={48}
                />
              </Box>
              <Box className={styles['plan-description']}>
                <Box>
                  <Typography variant="h6" component="h3">
                    Essential
                  </Typography>
                  <Typography variant="body2">Steady Support</Typography>
                </Box>
                <Box className={styles['plan-status']}>
                  <Typography variant="body2">Active Plan</Typography>
                </Box>
              </Box>
            </Box>
            <Box className={styles['plan-actions']}>
              <Typography variant="body2">
                $190{' '}
                <Typography component="span" variant="body2">
                  /Year
                </Typography>
              </Typography>
            </Box>
            <Box className={styles['plan-footer']}>
              <Box className={styles['plan-footer-description']}>
                <Typography variant="body2">
                  <Typography component="span" variant="body2">
                    Start Date
                  </Typography>{' '}
                  25/01/2025
                </Typography>
                <Typography component="span" variant="body2">
                  |
                </Typography>
                <Typography variant="body2">
                  <Typography component="span" variant="body2">
                    End Date
                  </Typography>{' '}
                  25/01/2026
                </Typography>
              </Box>
              <Box className={styles['plan-footer-actions']}>
                <Button className={styles['cancel-plan-btn']}>
                  Cancel Plan
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className={styles['active-plan-footer']}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              // bgcolor: 'var(--Card-Color)',
              padding: 0,
            }}
          >
            <CircularProgressWithLabel value={value} />
          </Box>
        </Box>
      </Box>
    </>
  );
}

// Custom styled CircularProgress with gradient
const GradientCircularProgress = styled(CircularProgress)(({ theme }) => ({
  circle: {
    strokeLinecap: 'round',
  },
  '& .MuiCircularProgress-circle': {
    stroke: 'url(#gradient)',
  },
}));

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        // backgroundColor: 'var(--Card-Color)',
        borderRadius: '50%',
        padding: 0,
      }}
    >
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C74FFC" />
            <stop offset="100%" stopColor="#3E7BFA" />
          </linearGradient>
        </defs>
      </svg>

      <GradientCircularProgress
        variant="determinate"
        thickness={5}
        size={200}
        value={props.value}
        sx={{
          color: '#2d2d3a',
          position: 'relative',
          zIndex: 2,
          width: '148px !important',
          height: '148px !important',
        }}
      />
      <GradientCircularProgress
        variant="determinate"
        thickness={5}
        size={200}
        value={100}
        sx={{
          color: '#000000',
          position: 'absolute',
          top: 0,
          zIndex: 1,
          width: '148px !important',
          height: '148px !important',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
            stroke: 'black',
          },
        }}
      />

      <Box className={styles['storage-info']}>
        <Typography variant="subtitle2">Storage</Typography>
        <Typography variant="h5">1.6 GB</Typography>
        <Typography variant="body2">Total 4 GB</Typography>
      </Box>
    </Box>
  );
}
