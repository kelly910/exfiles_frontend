'use client';
import { Box, Container, Typography } from '@mui/material';
import { Button } from '@mui/material';
import styles from './accounCreated.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
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
                <Box
                  component="form"
                  className={styles.authForm}
                  sx={{ textAlign: 'center' }}
                >
                  <div>
                    <Image
                      src="/images/created.svg"
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
                      variant="contained"
                      className={`btn btn-primary`}
                      color="primary"
                      fullWidth
                      onClick={() => router.push('/login')}
                    >
                      Go to Login
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
