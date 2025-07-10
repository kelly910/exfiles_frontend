'use client';

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
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import { getUserById, selectFetchedUser } from '@/app/redux/slices/login';
import { cancelPlanSubscription } from '@/app/redux/slices/planHistory';
import { useThemeMode } from '@/app/utils/ThemeContext';
import CancelDialog from './Dialog/CancelPlanDialog';

export default function ActivePlan() {
  const loggedInUser = useSelector(
    (state: RootState) => state.login.loggedInUser
  );
  const dispatch = useAppDispatch();
  const fetchedUser = useSelector(selectFetchedUser);
  const [cancelDialog, setCancelDialog] = useState(false);

  useEffect(() => {
    if (loggedInUser?.data?.id) {
      dispatch(getUserById(loggedInUser?.data?.id));
    }
  }, [dispatch]);

  useEffect(() => {
    // console.log(fetchedUser)
  }, [fetchedUser]);

  const startDate = fetchedUser?.active_subscription?.activate_date
    ? dayjs(
        fetchedUser?.active_subscription?.activate_date?.replace(
          /([+-]\d{2}:\d{2}):\d{2}$/,
          '$1'
        )
      ).format('MM/DD/YYYY')
    : '-';

  const endDate = fetchedUser?.active_subscription?.deactivate_date
    ? dayjs(
        fetchedUser?.active_subscription?.deactivate_date?.replace(
          /([+-]\d{2}:\d{2}):\d{2}$/,
          '$1'
        )
      ).format('MM/DD/YYYY')
    : '-';

  const used = fetchedUser?.storage?.split('/')[0] || 0;
  const total = fetchedUser?.storage?.split('/')[1] || 1;
  const value = (Number(used) / Number(total)) * 100;

  const cancelPlan = async () => {
    const subscriptionId = fetchedUser?.active_subscription?.id;
    if (subscriptionId) {
      const result = await dispatch(
        cancelPlanSubscription({ subscription_id: String(subscriptionId) })
      );
      setTimeout(() => {
        setCancelDialog(false);
        if (cancelPlanSubscription.fulfilled.match(result)) {
          if (loggedInUser?.data?.id) {
            dispatch(getUserById(loggedInUser?.data?.id));
          }
        }
      }, 2000);
    }
  };

  const { theme } = useThemeMode();

  return (
    <>
      <Box
        className={`${fetchedUser?.active_subscription?.status === 1 ? styles['active-plan-body'] : `${styles['active-plan-body-expired']} ${styles['active-plan-body']}`}`}
      >
        <Box className={styles['active-plan-main']}>
          <Box className={styles['active-plan']}>
            <Box className={styles['plan-details']}>
              <Box component="figure">
                {fetchedUser?.active_subscription?.plan?.name ===
                'Free Tier' ? (
                  <Image
                    src="/images/FreeTier.svg"
                    alt="FreeTier Plan"
                    width={48}
                    height={48}
                  />
                ) : fetchedUser?.active_subscription?.plan?.name ===
                  'Essential' ? (
                  <Image
                    src="/images/Essential.svg"
                    alt="Essential Plan"
                    width={48}
                    height={48}
                  />
                ) : (
                  <Image
                    src="/images/Pro.svg"
                    alt="Pro Plan"
                    width={48}
                    height={48}
                  />
                )}
              </Box>
              <Box className={styles['plan-description']}>
                <Box>
                  <Typography variant="h6" component="h3">
                    {fetchedUser?.active_subscription?.plan?.name || '-'}
                  </Typography>
                  <Typography variant="body2">
                    {fetchedUser?.active_subscription?.plan?.description || '-'}
                  </Typography>
                </Box>
                <Box className={styles['plan-status']}>
                  <Typography variant="body2">
                    {fetchedUser?.staff_user
                      ? 'Staff User'
                      : fetchedUser?.active_subscription
                            ?.subscription_status === 'cancelled' &&
                          fetchedUser?.active_subscription?.status === 1
                        ? 'Cancelled Plan'
                        : fetchedUser?.active_subscription?.status === 1
                          ? 'Active Plan'
                          : 'Viewer Mode'}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box className={styles['plan-actions']}>
              <Typography variant="body2">
                ${fetchedUser?.active_subscription?.plan?.amount?.split('.')[0]}{' '}
                <Typography
                  component="span"
                  variant="body2"
                  style={{ textTransform: 'capitalize' }}
                >
                  /
                  {fetchedUser?.active_subscription?.plan?.name === 'Free Tier'
                    ? 'Day'
                    : fetchedUser?.active_subscription?.plan?.duration_unit}
                </Typography>
              </Typography>
            </Box>
            <Box
              className={styles['plan-footer']}
              sx={{
                borderTop:
                  theme === 'dark'
                    ? '1px solid var(--Subtext-Color)'
                    : '1px solid var(--Stroke-Color)',
              }}
            >
              <Box className={styles['plan-footer-description']}>
                <Typography variant="body2">
                  <Typography component="span" variant="body2">
                    Start Date
                  </Typography>{' '}
                  {startDate}
                </Typography>
                <Typography component="span" variant="body2">
                  |
                </Typography>
                <Typography variant="body2">
                  <Typography component="span" variant="body2">
                    End Date
                  </Typography>{' '}
                  {endDate}
                </Typography>
              </Box>
              <Box className={styles['plan-footer-actions']}>
                {fetchedUser?.active_subscription?.plan?.name !== 'Free Tier' &&
                  fetchedUser?.active_subscription?.status === 1 &&
                  !fetchedUser?.staff_user &&
                  fetchedUser?.active_subscription?.subscription_status !==
                    'cancelled' && (
                    <Button
                      className={styles['cancel-plan-btn']}
                      onClick={() => setCancelDialog(true)}
                    >
                      Cancel Plan
                    </Button>
                  )}
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
              padding: 0,
            }}
          >
            <CircularProgressWithLabel value={value} />
          </Box>
        </Box>
      </Box>
      <CancelDialog
        open={cancelDialog}
        onClose={() => setCancelDialog(false)}
        cancelPlan={cancelPlan}
      />
    </>
  );
}

// Custom styled CircularProgress with gradient
const GradientCircularProgress = styled(CircularProgress)(() => ({
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
  const dispatch = useAppDispatch();
  const fetchedUser = useSelector(selectFetchedUser);
  const usedRaw = parseFloat(fetchedUser?.storage?.split('/')[0] || '0');
  const used = Math.ceil(usedRaw * 100) / 100;
  const total = parseFloat(fetchedUser?.storage?.split('/')[1] || '0');

  useEffect(() => {
    if (fetchedUser) {
      dispatch(getUserById(fetchedUser?.id));
    }
  }, [dispatch]);

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
        <Typography variant="h5">{used ? used : '0'} GB</Typography>
        <Typography variant="body2">
          {fetchedUser?.staff_user
            ? 'Unlimited'
            : `Total ${total ? total : '0'}`}{' '}
          GB
        </Typography>
      </Box>
    </Box>
  );
}
