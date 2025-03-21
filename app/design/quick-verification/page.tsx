'use client'
import dynamic from 'next/dynamic'
import {
  Box,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import { Button } from '@mui/material'
import { useState } from 'react'
import CustomTextField from '@/app/components/design/customField'
import styles from './style.module.scss'

export default function Page() {
  const [countryCode, setCountryCode] = useState('+1')

  return (
    <main>
      <div className={styles.authSection}>
        <div className={styles.authContainer}>
          <Container maxWidth="lg" disableGutters>
            <Box component="section" className={styles.boxLoginHeading}>
              <div className={styles.formLogo}>
                <img src="/images/logo.svg" alt="logo" />
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
                          color: '#ffffff',
                          borderRadius: '8px',
                          borderColor: '#3A3948',
                          '& fieldset': {
                            borderColor: '#3A3948',
                          },
                          '&:hover fieldset': {
                            borderColor: '#ffffff',
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
                          color: '#ffffff',
                          borderRadius: '8px',
                          borderColor: '#3A3948',
                          '& fieldset': {
                            borderColor: '#3A3948',
                          },
                          '&:hover fieldset': {
                            borderColor: '#ffffff',
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
                          color: '#ffffff',
                          borderRadius: '8px',
                          borderColor: '#3A3948',
                          '& fieldset': {
                            borderColor: '#3A3948',
                          },
                          '&:hover fieldset': {
                            borderColor: '#ffffff',
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
                          color: '#ffffff',
                          borderRadius: '8px',
                          borderColor: '#3A3948',
                          '& fieldset': {
                            borderColor: '#3A3948',
                          },
                          '&:hover fieldset': {
                            borderColor: '#ffffff',
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
          <img src="/images/before.svg" height={500} width={500} />
        </div>

        <div className={styles.after}>
          <img src="/images/after.svg" height={306} width={947} />
        </div>
      </div>
    </main>
  )
}
