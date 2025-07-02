'use client';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import Styles from '@components/Payment-Successful/PaymentSuccessful.module.scss';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import PageHeader from '../Common/PageHeader';
import { useAppDispatch } from '@/app/redux/hooks';
import { setPageHeaderData } from '@/app/redux/slices/login';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { getPaymentDetailsByTransactionId } from '@/app/redux/slices/paymentStatus';
import { showToast } from '@/app/shared/toast/ShowToast';
import { checkoutSession } from '@/app/redux/slices/checkout';
import dayjs from 'dayjs';

export default function PaymentFailed() {
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
    }
    dispatch(
      setPageHeaderData({
        title: '',
        subTitle: '',
      })
    );
  }, [dispatch, transactionid]);

  const tryAgainCheckout = async () => {
    if (paymentData && paymentData?.plan_slug) {
      const result = await dispatch(
        checkoutSession({ plan: paymentData?.plan_slug })
      );
      if (checkoutSession.fulfilled.match(result)) {
        window.location.href = result.payload;
      } else {
        showToast('error', result.payload || 'Checkout failed.');
      }
    }
  };

  return (
    <>
      <main className="chat-body">
        <section className="main-body">
          <PageHeader
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            title="Failed Payment"
            handleOpenSidebarFromLogIncident={() => setIsSidebarOpen(true)}
          />
          <Box className={Styles['my-plan-container']}>
            <Box className={Styles.PaymentCardContainer}>
              <Box>
                <Box className={Styles.PaymentCard}>
                  <Image
                    src="images/payment-failed.svg"
                    alt="Payment Failed"
                    width={100}
                    height={100}
                    className={Styles.PaymentCardImage}
                  />
                  <Typography
                    variant="h1"
                    component="h1"
                    className={Styles.PaymentCardTitle}
                  >
                    Payment Failed
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    className={Styles.PaymentCardSemiTitle}
                  >
                    Looks like there was a hiccup processing your payment.
                    Double-check your info or try a different card.
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
                        </Typography>
                      </Box>
                      <Box className={Styles.PaymentCardDetailsListPlanInner}>
                        <Typography variant="body1" component="p">
                          Sales Tax (8%)
                        </Typography>
                        <Typography variant="body2" component="span">
                          +${paymentData?.sales_tax_amount || '0.00'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className={Styles.PaymentCardTotalPrice}>
                      <Typography variant="body1" component="p">
                        Total Payable Amount
                      </Typography>
                      <Typography variant="body2" component="span">
                        {paymentData?.amount || '0.00'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className={Styles.PaymentCardBoxBorder}>
                  <Image
                    src="images/PaymentBorder.svg"
                    width={550}
                    height={50}
                    alt="PaymentBorder"
                  />
                </Box>
                <Box className={Styles.PaymentCardButton}>
                  <Button
                    className={`${Styles.BackPlan} btn-primary btn`}
                    onClick={() => router.push('/plans')}
                  >
                    Go to My Plan
                  </Button>
                  <Button
                    className="btn-primary btn"
                    onClick={tryAgainCheckout}
                  >
                    Try Again
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
