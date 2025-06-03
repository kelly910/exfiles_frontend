'use client';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Paper,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  toggleButtonGroupClasses,
  Typography,
} from '@mui/material';
import styles from './style.module.scss';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/app/redux/store';
import { fetchPlansList } from '@/app/redux/slices/subscriptionPlan';
import { useAppDispatch } from '@/app/redux/hooks';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
    {
      marginLeft: -1,
      borderLeft: '1px solid transparent',
    },
}));

const UpgradePlan = () => {
  const dispatch = useAppDispatch();
  const [billingCycle, setBillingCycle] = useState('monthly');
  // const { plans } = useSelector((state: RootState) => state.plans);

  const plans = [
    {
      id: 1,
      name: 'Free Trial Plan (14 Days)',
      description: 'Start Free, Stress Less',
      best_for: 'Getting started, no pressure',
      is_trial: true,
      status: 1,
      activate_date: '2025-05-28T17:31:40+05:30',
      deactivate_date: null,
      amount: '0.00',
      trial_days: 14,
      duration_unit: 'month',
      duration_value: 14,
      currency: 'USD',
      plan_type: 'free',
      features: [
        {
          title: 'Messages & Documents',
          display_label: 'Unlimited(14 days)',
        },
        {
          title: 'AI Summaries',
          display_label: 'Unlimited',
        },
        {
          title: 'Copilot AI Chats',
          display_label: 'Unlimited',
        },
        {
          title: 'Court-Ready Reports',
          display_label: '3 included',
        },
        {
          title: 'Document Vault',
          display_label: 'True',
        },
        {
          title: 'Keyword Tagging & Timelines',
          display_label: 'True',
        },
        {
          title: 'Pattern Detection & Analysis',
          display_label: 'False',
        },
        {
          title: 'Multi Device Support',
          display_label: 'False',
        },
        {
          title: 'Storage',
          display_label: '1 GB',
        },
      ],
    },
    {
      id: 2,
      name: 'Essential Plan',
      description: 'Steady Support',
      best_for: 'Active co-parents Description',
      is_trial: false,
      status: 1,
      activate_date: '2025-05-29T15:17:21+05:30',
      deactivate_date: null,
      amount: '19.00',
      trial_days: 0,
      duration_unit: 'month',
      duration_value: 1,
      currency: 'USD',
      plan_type: 'essential',
      features: [
        {
          title: 'Messages & Documents',
          display_label: '250/month',
        },
        {
          title: 'AI Summaries',
          display_label: '100/month',
        },
        {
          title: 'Copilot AI Chats',
          display_label: '50/month',
        },
        {
          title: 'Court-Ready Reports',
          display_label: '3/month',
        },
        {
          title: 'Document Vault',
          display_label: 'True',
        },
        {
          title: 'Keyword Tagging & Timelines',
          display_label: 'True',
        },
        {
          title: 'Pattern Detection & Analysis',
          display_label: 'False',
        },
        {
          title: 'Multi Device Support',
          display_label: '3',
        },
        {
          title: 'Storage',
          display_label: '4 GB',
        },
      ],
    },
    {
      id: 3,
      name: 'Pro Plan',
      description: 'Litigation mode',
      best_for: 'High-conflict cases, legal prep',
      is_trial: false,
      status: 1,
      activate_date: '2025-05-29T15:44:41+05:30',
      deactivate_date: null,
      amount: '39.00',
      trial_days: 0,
      duration_unit: 'month',
      duration_value: 1,
      currency: 'USD',
      plan_type: 'pro',
      features: [
        {
          title: 'Messages & Documents',
          display_label: 'Unlimited',
        },
        {
          title: 'AI Summaries',
          display_label: 'Unlimited',
        },
        {
          title: 'Copilot AI Chats',
          display_label: 'Unlimited',
        },
        {
          title: 'Court-Ready Reports',
          display_label: 'Unlimited',
        },
        {
          title: 'Document Vault',
          display_label: 'True',
        },
        {
          title: 'Keyword Tagging & Timelines',
          display_label: 'True',
        },
        {
          title: 'Pattern Detection & Analysis',
          display_label: 'Coming Soon',
        },
        {
          title: 'Multi Device Support',
          display_label: '8',
        },
        {
          title: 'Storage',
          display_label: '10 GB',
        },
      ],
    },
  ];

  useEffect(() => {
    dispatch(fetchPlansList(billingCycle));
  }, [dispatch]);

  return (
    <>
      <Accordion
        className={styles['upgrade-plan-accordion']}
        defaultExpanded={false}
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
          '& .Mui-expanded': {
            background: 'var(--Card-Color)',
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            <Image
              src="/images/arrow-down.svg"
              alt="Expand Icon"
              width={24}
              height={24}
            />
          }
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            justifyContent: 'center',
            textAlign: 'center',
            backgroundColor: 'transparent',

            '& .MuiAccordionSummary-content': {
              justifyContent: 'center',
              alignItems: 'center',
            },

            '& .Mui-expanded': {
              background: 'transparent',
            },
          }}
          className={styles['upgrade-plan-accordion-summary']}
        >
          <Typography>Upgrade Plan</Typography>
        </AccordionSummary>
        <AccordionDetails className={styles['upgrade-plan-accordion-details']}>
          <Box className={styles['upgrade-plan-package-main']}>
            <Box className={styles['subscription-plan-body']}>
              <Box className={styles['subscription-plan-sidebar']}>
                <Box className={styles['subscription-plan-container']}>
                  <Box className={styles['subscription-plan-header']}>
                    <Typography variant="h2" component="h2">
                      Subscription Plan
                    </Typography>
                    <Box>
                      <Paper
                        elevation={0}
                        className={styles['toggle-button-group']}
                      >
                        <StyledToggleButtonGroup
                          size="small"
                          value={billingCycle}
                          exclusive
                          onChange={(_, newValue) => {
                            if (newValue) {
                              setBillingCycle(newValue);
                              dispatch(fetchPlansList(newValue));
                            }
                          }}
                          aria-label="text alignment"
                        >
                          <ToggleButton
                            className={`${styles['toggle-button']} ${billingCycle === 'monthly' && styles['active']}`}
                            value="monthly"
                            aria-label="left aligned"
                          >
                            Monthly
                          </ToggleButton>
                          <ToggleButton
                            className={`${styles['toggle-button']} ${billingCycle === 'yearly' && styles['active']}`}
                            value="yearly"
                            aria-label="right aligned"
                          >
                            Annually
                          </ToggleButton>
                        </StyledToggleButtonGroup>
                      </Paper>
                    </Box>
                    <Typography variant="body1" component="p">
                      <Typography component="span">20% Off</Typography> on{' '}
                      <Typography component="span">Annual</Typography> Plan
                    </Typography>
                  </Box>
                  <Box className={styles['subscription-plan-footer']}>
                    {plans[0]?.features.map((feat, index) => (
                      <Box key={index}>
                        <p>{feat.title}</p>
                      </Box>
                    ))}
                    <Box>
                      <p>Best For</p>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className={styles['subscription-package-main']}>
              {plans.map((plan, index) => {
                let buttonLabel = 'Not Applicable';
                const activePlan = plans.find((p) => p.is_trial);
                if (activePlan) {
                  if (plan.plan_type === activePlan.plan_type) {
                    buttonLabel = 'Current Plan';
                  } else if (activePlan.plan_type === 'free') {
                    buttonLabel = 'Upgrade Now';
                  } else if (activePlan.plan_type === 'essential') {
                    if (plan.plan_type === 'pro') {
                      buttonLabel = 'Upgrade Now';
                    }
                  } else if (activePlan.plan_type === 'pro') {
                    buttonLabel = 'Not Applicable';
                  }
                } else {
                  buttonLabel =
                    plan.plan_type === 'free'
                      ? 'Not Applicable'
                      : 'Upgrade Now';
                }
                return (
                  <Box
                    className={styles['subscription-package-body']}
                    key={index}
                  >
                    <Box className={styles['subscription-package-container']}>
                      <Box className={styles['subscription-package-header']}>
                        <Box
                          className={
                            styles['subscription-package-header-title']
                          }
                        >
                          <Box
                            className={
                              styles['subscription-package-header-title-text']
                            }
                          >
                            <Typography variant="h2" component="h2">
                              {plan.name}
                            </Typography>
                            <Typography variant="body1" component="p">
                              ${plan.amount.split('.')[0]}{' '}
                              <Typography
                                component="span"
                                style={{ textTransform: 'capitalize' }}
                              >
                                /{plan.duration_unit}
                              </Typography>
                            </Typography>
                          </Box>
                          <Box
                            className={
                              styles['subscription-package-header-image']
                            }
                          >
                            {plan.plan_type === 'free' ? (
                              <Image
                                src="/images/FreeTier.svg"
                                alt="FreeTier Plan"
                                width={84}
                                height={84}
                              />
                            ) : plan.plan_type === 'essential' ? (
                              <Image
                                src="/images/Essential.svg"
                                alt="Essential Plan"
                                width={84}
                                height={84}
                              />
                            ) : (
                              <Image
                                src="/images/Pro.svg"
                                alt="Pro Plan"
                                width={84}
                                height={84}
                              />
                            )}
                          </Box>
                        </Box>
                        <Typography variant="body1" component="p">
                          {plan.description}
                        </Typography>
                        <Button
                          className={`${styles['subscription-package-button']} ${buttonLabel === 'Not Applicable' && styles['default']}`}
                          variant="outlined"
                        >
                          {buttonLabel}
                        </Button>
                      </Box>
                      <Box className={styles['subscription-package-footer']}>
                        {plan.features.map((feature, idx) => (
                          <Box key={idx} className={styles['feature-item']}>
                            {feature.display_label === 'True' ||
                            feature.display_label === 'true' ? (
                              <Box component="figure">
                                <Image
                                  src="/images/tick-circle.svg"
                                  width={28}
                                  height={28}
                                  alt="Feature Available"
                                />
                              </Box>
                            ) : feature.display_label === 'False' ||
                              feature.display_label === 'false' ? (
                              <Box component="figure">
                                <Image
                                  src="/images/close-circle.svg"
                                  width={28}
                                  height={28}
                                  alt="Feature Not Available"
                                />
                              </Box>
                            ) : (
                              <Typography variant="body1" component="p">
                                {feature.display_label}
                              </Typography>
                            )}
                          </Box>
                        ))}
                        <Box className={styles['feature-item']}>
                          <Box component="figure">
                            <Typography variant="body1" component="p">
                              {plan.best_for}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default UpgradePlan;
