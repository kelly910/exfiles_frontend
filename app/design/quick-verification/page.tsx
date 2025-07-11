'use client';
import { Box, Container, Link, TextField, Typography } from '@mui/material';
import { Button } from '@mui/material';
import styles from './style.module.scss';
import Image from 'next/image';

export default function Page() {
  return (
    <main>
      <div className={styles.authSection}>
        <div className={styles.authContainer}>
          <Container maxWidth="lg" disableGutters>
            <Box component="section" className={styles.boxLoginHeading}>
              <div className={styles.formLogo}>
                <Image
                  src="/images/logo.svg"
                  alt="logo"
                  width={290}
                  height={63}
                />
              </div>
            </Box>

            <Box component="section">
              <div className={styles.formCard}>
                <div className={styles.formHeader}>
                  <Typography variant="h2" className={styles.formTitle}>
                    A Quick Verification
                  </Typography>
                  <Typography variant="body1" className={styles.formSubtitle}>
                    We have sent you a One Time Password (OTP) on registered
                    Email Address. Enter that OTP here and we are good to go
                  </Typography>
                </div>

                <Box component="form" className={styles.authForm}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'nowrap',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      maxWidth: '300px',
                      margin: '0 auto 30px auto',
                      gap: '24px',
                    }}
                  >
                    <TextField
                      variant="outlined"
                      type="number"
                      sx={{
                        height: '48px',
                        width: '48px', // Ensure width is 48px
                        padding: '5px 0 8px 0',
                        marginTop: '0px',
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          color: 'var(--Txt-On-Gradient)',
                          borderRadius: '8px',
                          borderColor: 'var(--Stroke-Color)',
                          '& fieldset': {
                            borderColor: 'var(--Stroke-Color)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--Txt-On-Gradient)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#fff', // Focus border color
                            borderWidth: '2px',
                          },
                        },
                      }}
                      margin="normal"
                    />

                    <TextField
                      variant="outlined"
                      type="number"
                      sx={{
                        height: '48px',
                        width: '48px', // Ensure width is 48px
                        padding: '5px 0 8px 0',
                        marginTop: '0px',
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          color: 'var(--Txt-On-Gradient)',
                          borderRadius: '8px',
                          borderColor: 'var(--Stroke-Color)',
                          '& fieldset': {
                            borderColor: 'var(--Stroke-Color)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--Txt-On-Gradient)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#fff', // Focus border color
                            borderWidth: '2px',
                          },
                        },
                      }}
                      margin="normal"
                    />

                    <TextField
                      variant="outlined"
                      type="number"
                      sx={{
                        height: '48px',
                        width: '48px', // Ensure width is 48px
                        padding: '5px 0 8px 0',
                        marginTop: '0px',
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          color: 'var(--Txt-On-Gradient)',
                          borderRadius: '8px',
                          borderColor: 'var(--Stroke-Color)',
                          '& fieldset': {
                            borderColor: 'var(--Stroke-Color)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--Txt-On-Gradient)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#fff', // Focus border color
                            borderWidth: '2px',
                          },
                        },
                      }}
                      margin="normal"
                    />

                    <TextField
                      variant="outlined"
                      type="number"
                      sx={{
                        height: '48px',
                        width: '48px', // Ensure width is 48px
                        padding: '5px 0 8px 0',
                        marginTop: '0px',
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          color: 'var(--Txt-On-Gradient)',
                          borderRadius: '8px',
                          borderColor: 'var(--Stroke-Color)',
                          '& fieldset': {
                            borderColor: 'var(--Stroke-Color)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--Txt-On-Gradient)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#fff', // Focus border color
                            borderWidth: '2px',
                          },
                        },
                      }}
                      margin="normal"
                    />
                  </Box>

                  <Box
                    className={styles.btnGroup}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: 2,
                    }}
                  >
                    <Link href="#" className="link-primary">
                      Resend OTP? (00:59)
                    </Link>
                    <Button
                      type="submit"
                      variant="contained"
                      className={`btn btn-primary`}
                      color="primary"
                      fullWidth
                    >
                      Continue
                    </Button>
                  </Box>
                </Box>
              </div>
            </Box>
          </Container>
        </div>

        <div className={styles.before}>
          <Image src="/images/before.svg" alt="-" height={500} width={500} />
        </div>

        <div className={styles.after}>
          <Image src="/images/after.svg" alt="-" height={306} width={947} />
        </div>
      </div>
    </main>
  );
}
