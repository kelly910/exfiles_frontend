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
import React from 'react';

const planHistory = [
  {
    name: 'Essential',
    period: 'Year',
    date: '25/01/2025',
    payment: 'Credit Card',
    amount: '$190',
  },
  {
    name: 'Premium',
    period: 'Year',
    date: '25/01/2025',
    payment: 'Credit Card',
    amount: '$190',
  },
];

export default function PlanHistory() {
  return (
    <Box className={styles['history-plan-main']}>
      <Box className={styles['history-plan']}>
        <TableContainer component={Paper} className={styles['table-container']}>
          <Typography variant="h2" component="h2">
            Plan History
          </Typography>
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
              {planHistory.map((plan, idx) => (
                <TableRow key={idx}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>{plan.period}</TableCell>
                  <TableCell>{plan.date}</TableCell>
                  <TableCell>{plan.payment}</TableCell>
                  <TableCell>{plan.amount}</TableCell>
                  <TableCell sx={{ textAlign: 'center', width: '100px' }}>
                    <IconButton aria-label="import">
                      <Image
                        src="/images/Import.svg"
                        alt="import Icon"
                        width={24}
                        height={24}
                      />
                    </IconButton>
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
