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
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { fetchPlansList } from '@/app/redux/slices/subscriptionPlan';
import { useAppDispatch } from '@/app/redux/hooks';
import Slider, { Settings } from 'react-slick';
import { setLoader } from '@/app/redux/slices/loader';

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
  const [billingCycle, setBillingCycle] = useState('month');
  const { plans } = useSelector((state: RootState) => state.plans);
  const storedUser = localStorage.getItem('loggedInUser');
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    dispatch(fetchPlansList(billingCycle));
  }, [dispatch]);

  const settings = {
    infinite: false,
    slidesToShow: 1.3,
    slidesToScroll: 1,
    swipeToSlide: true,
    centerMode: false,
    centerPadding: '50px',
    arrows: false,
    dots: false,
    autoPlay: false,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true, // Disable for mobile
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          centerPadding: '30px',
          centerMode: true,
        },
      },
    ],
  };

  const [isSliderActive, setIsSliderActive] = useState(false);

  useEffect(() => {
    const checkSlider = () => {
      setIsSliderActive(window.innerWidth < 1101);
    };

    checkSlider();
    window.addEventListener('resize', checkSlider);
    return () => window.removeEventListener('resize', checkSlider);
  }, []);

  type MaybeSliderProps = {
    condition: boolean;
    settings: Settings;
    children: React.ReactNode;
  };

  const MaybeSlider: React.FC<MaybeSliderProps> = ({
    condition,
    settings,
    children,
  }) => {
    return condition ? (
      <Slider className="plan-slider" {...settings}>
        {children}
      </Slider>
    ) : (
      <>{children}</>
    );
  };

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
                              dispatch(setLoader(true));
                              setBillingCycle(newValue);
                              setTimeout(() => {
                                dispatch(fetchPlansList(newValue));
                                dispatch(setLoader(false));
                              }, 1000);
                            }
                          }}
                          aria-label="text alignment"
                        >
                          <ToggleButton
                            className={`${styles['toggle-button']} ${billingCycle === 'month' && styles['active']}`}
                            value="month"
                            aria-label="left aligned"
                          >
                            Monthly
                          </ToggleButton>
                          <ToggleButton
                            className={`${styles['toggle-button']} ${billingCycle === 'year' && styles['active']}`}
                            value="year"
                            aria-label="right aligned"
                          >
                            Annually
                          </ToggleButton>
                        </StyledToggleButtonGroup>
                      </Paper>
                    </Box>
                    <Typography variant="body1" component="p">
                      You Can Buy{' '}
                      <Typography component="span">Annual Plans</Typography> In{' '}
                      <Typography component="span">
                        Discounted Prices.
                      </Typography>
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
            <Box className={styles['toggle-button-group-mobile']}>
              <Box>
                <Paper elevation={0} className={styles['toggle-button-group']}>
                  <StyledToggleButtonGroup
                    size="small"
                    value={billingCycle}
                    exclusive
                    onChange={(_, newValue) => {
                      if (newValue) {
                        dispatch(setLoader(true));
                        setBillingCycle(newValue);
                        setTimeout(() => {
                          dispatch(fetchPlansList(newValue));
                          dispatch(setLoader(false));
                        }, 1000);
                      }
                    }}
                    aria-label="text alignment"
                  >
                    <ToggleButton
                      className={`${styles['toggle-button']} ${billingCycle === 'month' && styles['active']}`}
                      value="month"
                      aria-label="left aligned"
                    >
                      Monthly
                    </ToggleButton>
                    <ToggleButton
                      className={`${styles['toggle-button']} ${billingCycle === 'year' && styles['active']}`}
                      value="year"
                      aria-label="right aligned"
                    >
                      Annually
                    </ToggleButton>
                  </StyledToggleButtonGroup>
                </Paper>
              </Box>
              <Typography variant="body1" component="p">
                You Can Buy{' '}
                <Typography component="span">Annual Plans</Typography> In{' '}
                <Typography component="span">Discounted Prices.</Typography>
              </Typography>
            </Box>
            <Box className={styles['subscription-package-main']}>
              <MaybeSlider condition={isSliderActive} settings={settings}>
                {plans.map((plan, index) => {
                  let buttonLabel = 'Not Applicable';
                  const activePlanName =
                    loggedInUser?.data?.active_subscription?.plan?.name;
                  const activePlan = plans.find(
                    (p) => p?.name === activePlanName
                  );
                  if (activePlan) {
                    if (plan.name === activePlan.name) {
                      buttonLabel = 'Current Plan';
                    } else if (activePlan.name === 'Free Tier') {
                      buttonLabel = 'Upgrade Now';
                    } else if (activePlan.name === 'Essential') {
                      if (plan.name === 'Pro') {
                        buttonLabel = 'Upgrade Now';
                      }
                    } else if (activePlan.name === 'Pro') {
                      buttonLabel = 'Not Applicable';
                    }
                  } else {
                    buttonLabel =
                      plan.name === 'Free Tier'
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
                                  /
                                  {plan.name === 'Free Tier'
                                    ? 'Day'
                                    : plan.duration_unit}
                                </Typography>
                              </Typography>
                            </Box>
                            <Box
                              className={
                                styles['subscription-package-header-image']
                              }
                            >
                              {plan.name === 'Free Tier' ? (
                                <Image
                                  src="/images/FreeTier.svg"
                                  alt="FreeTier Plan"
                                  width={84}
                                  height={84}
                                />
                              ) : plan.name === 'Essential' ? (
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
                                  <span>{feature.title}</span>
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
                                  <span>{feature.title}</span>
                                  <Image
                                    src="/images/close-circle.svg"
                                    width={28}
                                    height={28}
                                    alt="Feature Not Available"
                                  />
                                </Box>
                              ) : (
                                <Typography variant="body1" component="p">
                                  <span>{feature.title}</span>
                                  {feature.display_label}
                                </Typography>
                              )}
                            </Box>
                          ))}
                          <Box className={styles['feature-item']}>
                            <Typography variant="body1" component="p">
                              <span>Best For</span>
                              {plan.best_for}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </MaybeSlider>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default UpgradePlan;
