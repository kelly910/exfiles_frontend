'use client'
import dynamic from 'next/dynamic'
import { Box, Container, Grid, Link, Typography } from '@mui/material'
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
                <Box
                  component="form"
                  className={styles.authForm}
                  sx={{ textAlign: 'center' }}
                >
                  <div>
                    <img src="/images/created.svg" alt="" />
                  </div>
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{ textAlign: 'center', fotntSize: '28px' }}
                  >
                    Account created successfully.
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    className={styles.formSubtitle}
                  >
                    Your account is created successfully. Go to Login page to
                    continue using Exfiles.
                  </Typography>
                  <Box
                    className={styles.btnGroup}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      className={`btn btn-primary`}
                      color="primary"
                      fullWidth
                    >
                      Go Back to Login
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
