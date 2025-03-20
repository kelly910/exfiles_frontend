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
                <div className={styles.formHeader}>
                  <Typography variant="h2" className={styles.formTitle}>
                    Having Trouble Logging In?
                  </Typography>
                  <Typography variant="body1" className={styles.formSubtitle}>
                    Please enter the registered email address to receive
                    Password reset instructions.{' '}
                  </Typography>
                </div>

                <Box component="form" className={styles.authForm}>
                  <CustomTextField
                    name="email"
                    label="Email Address"
                    placeholder="Enter Email address here"
                    type="email"
                    autoComplete="email"
                    error=""
                  />

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
                      Back to Login
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
