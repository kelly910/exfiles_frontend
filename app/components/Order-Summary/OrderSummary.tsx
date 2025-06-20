'use client';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import Styles from '@components/Order-Summary/OrderSummary.module.scss';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import PageHeader from '../Common/PageHeader';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { useAppDispatch } from '@/app/redux/hooks';
import { setPageHeaderData } from '@/app/redux/slices/login';
import { fetchOrderSummaryById } from '@/app/redux/slices/orderSummery';
import { setLoader } from '@/app/redux/slices/loader';
import { checkoutSession } from '@/app/redux/slices/checkout';
import { showToast } from '@/app/shared/toast/ShowToast';

export default function OrderSummary() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dynamicPlanId = useSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { orderDetail } = useSelector(
    (state: RootState) => state.orderDetailSummary
  );

  useEffect(() => {
    const planid = dynamicPlanId.get('planId');
    if (planid) {
      const planIdNumber = Number(planid);
      if (!isNaN(planIdNumber)) {
        dispatch(setLoader(true));
        setTimeout(() => {
          dispatch(fetchOrderSummaryById(planIdNumber));
          dispatch(
            setPageHeaderData({
              title: '',
              subTitle: '',
            })
          );
          dispatch(setLoader(false));
        }, 1000);
      }
    }
  }, [dispatch]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, []);

  const paynow = async (slug: string) => {
    const result = await dispatch(checkoutSession({ plan: slug }));
    if (checkoutSession.fulfilled.match(result)) {
      window.location.href = result.payload;
    } else {
      showToast('error', result.payload || 'Checkout failed.');
    }
  };

  return (
    <>
      <main className="chat-body">
        <section className="main-body">
          <PageHeader
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            title="Download Report"
            handleOpenSidebarFromLogIncident={() => setIsSidebarOpen(true)}
          />
          <Box className={Styles['my-plan-container']}>
            <Box className={Styles.OrderSummaryContainer}>
              <Box className={Styles.OrderSummaryHead}>
                <Box className={Styles.ButtonGroup}>
                  <Button
                    className={Styles.backButton}
                    onClick={() => router.push('/plans')}
                  >
                    <Image
                      src="/images/arrow-left.svg"
                      alt="user"
                      width={16}
                      height={16}
                    />
                  </Button>
                  <Typography variant="h2" className={Styles.OrderSummaryTitle}>
                    Order Summary
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  component="p"
                  className={Styles.OrderSummarySemiTitle}
                >
                  scelerisque viverra convallis. ex libero, Nullam odio Quisque
                  porta faucibus fringilla non
                </Typography>
              </Box>
              <Box className={Styles.OrderSummaryBody}>
                <Box className={Styles.OrderSummaryBodyInner}>
                  <Box className={Styles.PlanDetails}>
                    <Box className={Styles.PlanTitle}>
                      <Typography variant="h2" component="h2">
                        {orderDetail?.name}
                      </Typography>
                      <Typography variant="body2" component="span">
                        {orderDetail?.description}
                      </Typography>
                    </Box>
                    <Box className={Styles.PlanPrice}>
                      <Typography variant="body1" component="p">
                        ${orderDetail?.amount?.split('.')[0]}
                        <Typography
                          variant="body2"
                          component="span"
                          style={{ textTransform: 'capitalize' }}
                        >
                          /{orderDetail?.duration_unit}
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                  <Box className={Styles.PlanPriceList}>
                    {orderDetail?.features?.map((feat, index) => (
                      <Box key={index} className={Styles.PlanPriceListHead}>
                        <Typography variant="body1" component="p">
                          {feat?.title}
                        </Typography>
                        {feat.display_label === 'true' ||
                        feat.display_label === 'True' ? (
                          <Image
                            src="/images/tick-circle.svg"
                            width={24}
                            height={24}
                            alt="Feature Available"
                          />
                        ) : feat.display_label === 'false' ||
                          feat.display_label === 'False' ? (
                          <Image
                            src="/images/close-circle.svg"
                            width={24}
                            height={24}
                            alt="Feature Not Available"
                          />
                        ) : (
                          <Typography variant="body2" component="span">
                            {feat?.display_label}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box className={Styles.OrderSummaryPayment}>
                  <Typography
                    variant="body1"
                    component="p"
                    className={Styles.PaymentHead}
                  >
                    Payment Summary
                  </Typography>
                  <Box className={Styles.PaymentPriceList}>
                    <Box className={Styles.PaymentPriceListHead}>
                      <Typography variant="body1" component="p">
                        Plan Price
                      </Typography>
                      <Typography variant="body2" component="span">
                        ${orderDetail?.plan_price}
                      </Typography>
                    </Box>
                    <Box className={Styles.PaymentPriceListHead}>
                      <Typography variant="body1" component="p">
                        Sales Tax (8%)
                      </Typography>
                      <Typography variant="body2" component="span">
                        +${orderDetail?.sales_tax}
                      </Typography>
                    </Box>
                    <Box className={Styles.PaymentTotalPrice}>
                      <Typography variant="body1" component="p">
                        Total Payable Amount
                      </Typography>
                      <Typography variant="body2" component="span">
                        {orderDetail?.total_payable_amount}
                      </Typography>
                    </Box>
                    <Button
                      className="btn-primary btn"
                      sx={{ width: '100% !important', marginTop: '24px' }}
                      onClick={() => paynow(orderDetail?.slug as string)}
                    >
                      Pay Now
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </section>
      </main>
    </>
  );
}
