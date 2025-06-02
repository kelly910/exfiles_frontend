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
import React from 'react';
import Image from 'next/image';

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

export default function UpgradePlan() {
  return (
    <>
      {/* =========== Accordion =========== */}
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
            <SinglePlanSidebar />
            <MultiPlan />
          </Box>
        </AccordionDetails>
      </Accordion>
      {/* =========== Accordion =========== */}
    </>
  );
}

function MultiPlan() {
  return (
    <Box className={styles['subscription-package-main']}>
      <SinglePlan />
      <SinglePlan />
      <SinglePlan />
    </Box>
  );
}

function SinglePlanSidebar() {
  const subscriptionPlan = {
    annually: {
      price: '$100',
      features: [
        'Messages & Documents',
        'AI Summaries',
        'Copilot AI Chats',
        'Court-Ready Reports',
        'Document Vault ',
        'Keyword Tagging & Timeline',
        'Pattern Detection & Analysis',
        'Multi Device  Support',
        'Storage',
        'Best For',
      ],
    },
  };

  return (
    <>
      <Box className={styles['subscription-plan-body']}>
        <Box className={styles['subscription-plan-sidebar']}>
          <Box className={styles['subscription-plan-container']}>
            <Box className={styles['subscription-plan-header']}>
              <Typography variant="h2" component="h2">
                Subscription Plan
              </Typography>

              <Box>
                <Paper elevation={0} className={styles['toggle-button-group']}>
                  <StyledToggleButtonGroup
                    size="small"
                    // value={alignment}
                    exclusive
                    // onChange={handleAlignment}
                    aria-label="text alignment"
                  >
                    <ToggleButton
                      className={`${styles['toggle-button']} ${styles['active']}`}
                      value="monthly"
                      aria-label="left aligned"
                    >
                      monthly
                    </ToggleButton>
                    <ToggleButton
                      className={`${styles['toggle-button']}`}
                      value="Annually"
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
              {subscriptionPlan.annually.features.map((feature, idx) => (
                <Box key={idx}>
                  <p>{feature}</p>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

function SinglePlan() {
  const subscriptionPlan = {
    annually: {
      price: '$100',
      features: [
        'Unlimited (14 days)',
        'Unlimited',
        'Unlimited',
        '3 included',
        'true',
        'true',
        'false',
        'false',
        '1 GB',
        'Getting started, no pressure',
      ],
    },
  };
  return (
    <>
      <Box className={styles['subscription-package-body']}>
        <Box className={styles['subscription-package-container']}>
          <Box className={styles['subscription-package-header']}>
            <Box className={styles['subscription-package-header-title']}>
              <Box className={styles['subscription-package-header-title-text']}>
                <Typography variant="h2" component="h2">
                  Free Tier
                </Typography>
                <Typography variant="body1" component="p">
                  $0 <Typography component="span">/Month</Typography>
                </Typography>
              </Box>
              <Box className={styles['subscription-package-header-image']}>
                <Image
                  src="/images/Essential.svg"
                  alt="Plan Image"
                  width={84}
                  height={84}
                />
              </Box>
            </Box>
            <Typography variant="body1" component="p">
              Start Free, Stress Less
            </Typography>
            <Button
              className={`${styles['subscription-package-button']} ${styles['']}`}
              variant="outlined"
            >
              Not Available
            </Button>
          </Box>
          <Box className={styles['subscription-package-footer']}>
            {subscriptionPlan.annually.features.map((feature, idx) => (
              <Box key={idx}>
                {feature === 'true' ? (
                  <Box component="figure">
                    <Image
                      src="/images/tick-circle.svg"
                      width={28}
                      height={28}
                      alt="True Feature"
                    />
                  </Box>
                ) : feature === 'false' ? (
                  <Box component="figure">
                    <Image
                      src="/images/close-circle.svg"
                      width={28}
                      height={28}
                      alt="False Feature"
                    />
                  </Box>
                ) : (
                  <Typography variant="body1" component="p">
                    {feature}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}
