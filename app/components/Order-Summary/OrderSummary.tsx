'use client';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import Styles from '@components/Order-Summary/OrderSummary.module.scss';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import PageHeader from '../Common/PageHeader';
import UpgradeTime from '../Upgrade-Time/UpgradeTime';
import LimitOver from '../Limit-Over/LimitOver';
import PlanExpired from '../Plan-Expired/PlanExpired';
import PlanExpiredMG from '../Plan-Expired-MG/PlanExpiredMG';

export default function OrderSummary() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, []);
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
            <OrderSummaryCard />
          </Box>
        </section>
      </main>
    </>
  );
}

function OrderSummaryCard() {
  const planDetails = [
    {
      title: 'Messages & Documents',
      label: '250/month',
    },
    {
      title: 'AI Summaries ',
      label: '100/month',
    },
    {
      title: 'Copilot AI Chats',
      label: '50/month',
    },
    {
      title: 'Court-Ready Reports',
      label: '3/month',
    },
    {
      title: 'Document Vault ',
      label: true,
    },
    {
      title: 'Keyword Tagging & Timeline ',
      label: true,
    },
    {
      title: 'Pattern Detection & Analysis',
      label: false,
    },
    {
      title: 'Multi Device  Support',
      label: '3',
    },
    {
      title: 'Storage',
      label: '4 GB',
    },
    {
      title: 'Best For',
      label: 'Active co-parents  Description',
    },
  ];

  const planPrice = [
    {
      title: 'Plan Price',
      display_label: '$228.00',
    },
    {
      title: 'Discount',
      display_label: '-$38.00',
    },
    {
      title: 'Sales Tax (8%)',
      display_label: '+$15.00',
    },
  ];

  return (
    <>
      <Box className={Styles.OrderSummaryContainer}>
        <Box className={Styles.OrderSummaryHead}>
          <Box className={Styles.ButtonGroup}>
            <Button className={Styles.backButton}>
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
            scelerisque viverra convallis. ex libero, Nullam odio Quisque porta
            faucibus fringilla non
          </Typography>
        </Box>
        <Box className={Styles.OrderSummaryBody}>
          <Box className={Styles.OrderSummaryBodyInner}>
            <Box className={Styles.PlanDetails}>
              <Box className={Styles.PlanTitle}>
                <Typography variant="h2" component="h2">
                  Essential
                </Typography>
                <Typography variant="body2" component="span">
                  Steady Support
                </Typography>
              </Box>
              <Box className={Styles.PlanPrice}>
                <Typography variant="body1" component="p">
                  $190
                  <Typography variant="body2" component="span">
                    /Year
                  </Typography>
                </Typography>
              </Box>
            </Box>
            <Box className={Styles.PlanPriceList}>
              {planDetails.map((plan, ind) => (
                <Box key={ind} className={Styles.PlanPriceListHead}>
                  <Typography variant="body1" component="p">
                    {plan.title}
                  </Typography>
                  {plan.label === true ? (
                    <Image
                      src="/images/tick-circle.svg"
                      width={24}
                      height={24}
                      alt="Feature Available"
                    />
                  ) : plan.label === false ? (
                    <Image
                      src="/images/close-circle.svg"
                      width={24}
                      height={24}
                      alt="Feature Not Available"
                    />
                  ) : (
                    <Typography variant="body2" component="span">
                      {plan.label}
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
              {planPrice.map((price, ind) => (
                <Box key={ind} className={Styles.PaymentPriceListHead}>
                  <Typography variant="body1" component="p">
                    {price.title}
                  </Typography>
                  <Typography variant="body2" component="span">
                    {price.display_label}
                  </Typography>
                </Box>
              ))}
              <Box className={Styles.PaymentTotalPrice}>
                <Typography variant="body1" component="p">
                  Total Payable Amount
                </Typography>
                <Typography variant="body2" component="span">
                  205.00
                </Typography>
              </Box>
              <Button
                className="btn-primary btn"
                sx={{ width: '100% !important', marginTop: '24px' }}
              >
                Pay Now
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
