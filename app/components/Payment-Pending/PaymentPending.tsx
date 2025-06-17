'use client';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import Styles from '@components/Payment-Successful/PaymentSuccessful.module.scss';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import PageHeader from '../Common/PageHeader';
import { setPageHeaderData } from '@/app/redux/slices/login';
import { useAppDispatch } from '@/app/redux/hooks';

export default function PaymentPending() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useAppDispatch();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    dispatch(
      setPageHeaderData({
        title: '',
        subTitle: '',
      })
    );
  }, [dispatch]);

  return (
    <>
      <main className="chat-body">
        <section className="main-body">
          <PageHeader
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            title="Pending Payment"
            handleOpenSidebarFromLogIncident={() => setIsSidebarOpen(true)}
          />
          <Box className={Styles['my-plan-container']}>
            <Box className={Styles.PaymentCardContainer}>
              <Box>
                <Box className={Styles.PaymentCard}>
                  <Image
                    src="images/pending-payment.svg"
                    alt="Payment Pending"
                    width={100}
                    height={100}
                    className={Styles.PaymentCardImage}
                  />
                  <Typography
                    variant="h1"
                    component="h1"
                    className={Styles.PaymentCardTitle}
                  >
                    Waiting for Payment
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    className={Styles.PaymentCardSemiTitle}
                  >
                    Lorem ipsum dolor sit amet consectetur Rhoncus nisl vel in
                    at varius in.
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    className={Styles.PaymentCardTime}
                  >
                    11 Apr 2025, 3:24 PM
                  </Typography>
                </Box>
                <Box className={Styles.PaymentCardBox}>
                  <Box className={Styles.PaymentCardDetails}>
                    <Box className={Styles.PaymentCardDetailsList}>
                      <Typography variant="body1" component="p">
                        Transaction ID
                      </Typography>
                      <Typography variant="body2" component="span">
                        546487845458
                      </Typography>
                    </Box>
                    <Box className={Styles.PaymentCardDetailsListPlan}>
                      <Box className={Styles.PaymentCardDetailsListPlanInner}>
                        <Typography variant="body1" component="p">
                          Plan Price
                        </Typography>
                        <Typography variant="body2" component="span">
                          $228.00
                        </Typography>
                      </Box>
                      <Box className={Styles.PaymentCardDetailsListPlanInner}>
                        <Typography variant="body1" component="p">
                          Sales Tax (8%)
                        </Typography>
                        <Typography variant="body2" component="span">
                          +$15.00
                        </Typography>
                      </Box>
                    </Box>
                    <Box className={Styles.PaymentCardTotalPrice}>
                      <Typography variant="body1" component="p">
                        Total Payable Amount
                      </Typography>
                      <Typography variant="body2" component="span">
                        205.00
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
                  <Button className="btn-primary btn">Go to My Plan</Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </section>
      </main>
    </>
  );
}
