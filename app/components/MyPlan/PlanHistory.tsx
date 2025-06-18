import { fetchPlanHistory } from '@/app/redux/slices/planHistory';
import styles from './style.module.scss';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import dayjs from 'dayjs';

export default function PlanHistory() {
  const dispatch = useAppDispatch();
  const { planHistoryData } = useSelector(
    (state: RootState) => state.planHistory
  );

  useEffect(() => {
    dispatch(fetchPlanHistory());
  }, [dispatch]);

  return (
    <Box className={styles['history-plan-main']}>
      <Box className={styles['history-plan']}>
        <Typography variant="h2" component="h2">
          Plan History
        </Typography>
        <TableContainer component={Paper} className={styles['table-container']}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Plan Name</TableCell>
                <TableCell>Time Period</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {planHistoryData?.map((plan, idx) => (
                <TableRow key={idx}>
                  <TableCell>{plan.plan_name || '-'}</TableCell>
                  <TableCell style={{ textTransform: 'capitalize' }}>
                    {plan.duration_unit === 'day'
                      ? '14 Days'
                      : plan.duration_unit}
                  </TableCell>
                  <TableCell>
                    {plan.activate_date
                      ? dayjs(
                          plan.activate_date?.replace(
                            /([+-]\d{2}:\d{2}):\d{2}$/,
                            '$1'
                          )
                        ).format('MM/DD/YYYY')
                      : '-'}
                  </TableCell>
                  <TableCell>{plan.payment_method || '-'}</TableCell>
                  <TableCell>{plan.amount || '-'}</TableCell>
                  <TableCell sx={{ textAlign: 'center', width: '100px' }}>
                    {plan.payment_invoice_link !== null ? (
                      <IconButton aria-label="import">
                        <Image
                          src="/images/import.svg"
                          alt="import Icon"
                          width={24}
                          height={24}
                        />
                      </IconButton>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
