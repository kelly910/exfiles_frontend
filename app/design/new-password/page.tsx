'use client';
import { Box, Container, Typography } from '@mui/material';
import { Button } from '@mui/material';
import CustomTextField from '@/app/components/design/customField';
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
                    Set a New Password
                  </Typography>
                  <Typography variant="body1" className={styles.formSubtitle}>
                    Password must be at least 8 characters long and must contain
                    1 special character, 1 capital letter, and 1 number
                  </Typography>
                </div>

                <Box component="form" className={styles.authForm}>
                  <CustomTextField
                    name="password"
                    label="Password"
                    placeholder="Choose a strong Password"
                    type="password"
                    autoComplete="current-password"
                    error=""
                  />

                  <CustomTextField
                    name="password"
                    label="Confirm Password"
                    placeholder="Enter Password"
                    type="password"
                    autoComplete="current-password"
                    error=""
                  />

                  <Box
                    className={styles.btnGroup}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}
                  >
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
