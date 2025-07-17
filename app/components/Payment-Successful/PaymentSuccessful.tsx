'use client';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import Styles from '@components/Payment-Successful/PaymentSuccessful.module.scss';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import PageHeader from '../Common/PageHeader';
import { useAppDispatch } from '@/app/redux/hooks';
import { setPageHeaderData } from '@/app/redux/slices/login';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPaymentDetailsByTransactionId } from '@/app/redux/slices/paymentStatus';
import dayjs from 'dayjs';
import { useThemeMode } from '@/app/utils/ThemeContext';
import { gtagEvent } from '@/app/utils/functions';

export default function PaymentSuccessful() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const transactionId = useSearchParams();
  const transactionid = transactionId.get('txn_id');

  const { paymentData } = useSelector(
    (state: RootState) => state.paymentDetailsData
  );

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    if (transactionid) {
      dispatch(getPaymentDetailsByTransactionId(transactionid as string));
      gtagEvent({
        action: 'upgrade_completed',
        category: 'Subscription',
        label: 'Upgrade successful',
      });
    }
    dispatch(
      setPageHeaderData({
        title: '',
        subTitle: '',
      })
    );
  }, [dispatch, transactionid]);

  const planBasePrice = Number(paymentData?.plan_base_price || 0);
  const salesTaxPercentage = Number(paymentData?.sales_tax_percentage || 0);
  let salesTaxAmount = Number(paymentData?.sales_tax_amount || 0);

  if (salesTaxAmount === 0) {
    salesTaxAmount = (planBasePrice * salesTaxPercentage) / 100;
  }

  const { theme } = useThemeMode();

  return (
    <>
      <main className="chat-body">
        <section className="main-body">
          <PageHeader
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            title="Successful Payment"
            handleOpenSidebarFromLogIncident={() => setIsSidebarOpen(true)}
          />
          <Box className={Styles['my-plan-container']}>
            <Box className={Styles.PaymentCardContainer}>
              <Box>
                <Box className={Styles.PaymentCard}>
                  <Image
                    src="images/Payment-Successful.svg"
                    alt="Payment Successful"
                    width={100}
                    height={100}
                    className={Styles.PaymentCardImage}
                  />
                  <Typography
                    variant="h1"
                    component="h1"
                    className={Styles.PaymentCardTitle}
                  >
                    Payment Successful
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    className={Styles.PaymentCardSemiTitle}
                  >
                    You’re all set. Your plan is now active, and you’re ready to
                    upload, organize, and start building your documentation.
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    className={Styles.PaymentCardTime}
                  >
                    {paymentData?.modified
                      ? dayjs(paymentData?.modified).format(
                          'DD MMM YYYY, h:mm A'
                        )
                      : '-'}
                  </Typography>
                </Box>
                <Box className={Styles.PaymentCardBox}>
                  <Box className={Styles.PaymentCardDetails}>
                    <Box className={Styles.PaymentCardDetailsList}>
                      <Typography variant="body1" component="p">
                        Transaction ID
                      </Typography>
                      <Typography variant="body2" component="span">
                        {paymentData?.uuid || '-'}
                      </Typography>
                    </Box>
                    <Box className={Styles.PaymentCardDetailsList}>
                      <Typography variant="body1" component="p">
                        Plan Name
                      </Typography>
                      <Typography variant="body2" component="span">
                        {paymentData?.plan_name || '-'}
                      </Typography>
                    </Box>
                    <Box className={Styles.PaymentCardDetailsListPlan}>
                      <Box className={Styles.PaymentCardDetailsListPlanInner}>
                        <Typography variant="body1" component="p">
                          Plan Price
                        </Typography>
                        <Typography variant="body2" component="span">
                          ${paymentData?.plan_base_price || '0.00'}
                          {/* {(
                            Number(paymentData?.plan_base_price) -
                            Number(salesTaxAmount)
                          )?.toFixed(2) || '0.00'} */}
                          {/* {Number(paymentData?.sales_tax_amount)
                            ? Number(paymentData?.plan_base_price) || '0.00'
                            : (
                                Number(paymentData?.plan_base_price) -
                                Number(salesTaxAmount)
                              )?.toFixed(2) || '0.00'} */}
                        </Typography>
                      </Box>
                      <Box className={Styles.PaymentCardDetailsListPlanInner}>
                        <Typography variant="body1" component="p">
                          Sales Tax ({paymentData?.sales_tax_percentage}%)
                        </Typography>
                        <Typography variant="body2" component="span">
                          +${salesTaxAmount.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className={Styles.PaymentCardTotalPrice}>
                      <Typography variant="body1" component="p">
                        Total Payable Amount
                      </Typography>
                      <Typography variant="body2" component="span">
                        ${paymentData?.amount || '0.00'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className={Styles.PaymentCardBoxBorder}>
                  {theme === 'dark' ? (
                    <Image
                      src="images/PaymentBorderLight.svg"
                      width={550}
                      height={50}
                      alt="PaymentBorder"
                    />
                  ) : (
                    <Image
                      src="images/PaymentBorder.svg"
                      width={550}
                      height={50}
                      alt="PaymentBorder"
                    />
                  )}
                </Box>
                <Box className={Styles.PaymentCardButton}>
                  <Button
                    className="btn-primary btn"
                    onClick={() => router.push('/plans')}
                  >
                    Go to My Plan
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </section>
      </main>
    </>
  );
}
