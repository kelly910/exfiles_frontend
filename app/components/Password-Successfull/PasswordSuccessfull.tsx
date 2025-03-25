'use client';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { Button } from '@mui/material';
import styles from './passwordSuccess.module.scss';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <main>
      <div className={styles.authSection}>
        <div className={styles.authContainer}>
          <Container maxWidth="lg" disableGutters>
            <Box component="section" className={styles.boxLoginHeading}>
              <div className={styles.formLogo}>
                <Image
                  src="/images/logo.svg"
                  height={290}
                  width={63}
                  alt="logo"
                />
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
                    <Image
                      src="/images/success.svg"
                      height={148}
                      width={117}
                      alt="logo"
                    />
                  </div>
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{ textAlign: 'center', fotntSize: '28px' }}
                  >
                    Password updated successfully.
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    className={styles.formSubtitle}
                  >
                    Password for your account has been updated successfully.
                    Please Login to continue using ExFiles
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
                      variant="contained"
                      className={`btn btn-primary`}
                      color="primary"
                      fullWidth
                      onClick={() => {
                        setLoading(true);
                        setTimeout(() => {
                          router.push('/login');
                        }, 1000);
                        
                      }}
                      disabled={loading}
                    >
                       {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        ' Go Back to Login'
                      )}
                      
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
};

export default Page;
