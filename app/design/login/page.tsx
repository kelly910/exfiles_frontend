'use client';
import { Box, Container, Link, Typography } from '@mui/material';
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
                    Welcome to Exfiles
                  </Typography>
                  <Typography variant="body1" className={styles.formSubtitle}>
                    Please login to continue using Exfiles.
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

                  <CustomTextField
                    name="password"
                    label="Password"
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
                      justifyContent: 'space-between',
                    }}
                  >
                    <Link href="#" className="link-primary">
                      Need Help Logging In?
                    </Link>
                    <Button
                      type="submit"
                      variant="contained"
                      className={`btn btn-primary`}
                      color="primary"
                      fullWidth
                    >
                      Login
                    </Button>
                  </Box>

                  <Box className={styles.googleLogin}>
                    <Typography
                      variant="body2"
                      className={styles.textSecondary}
                    >
                      You Can also Continue with
                    </Typography>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={`btn btn-tertiary ${styles.googleBtn}`}
                      startIcon={
                        <Image
                          src="/images/google-icon.svg"
                          alt="google-icon"
                          width={24}
                          height={24}
                          className={styles.googleBtnIcon}
                        />
                      }
                      fullWidth
                    >
                      Google
                    </Button>
                  </Box>
                </Box>
              </div>
            </Box>

            <Box
              component="section"
              className={styles.alreadyLogin}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div className="">
                <Typography variant="h4" gutterBottom>
                  Already a Member?
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                  Lorem Ipsum dolor sit amet
                </Typography>
              </div>
              <Button variant="contained" className={`btn btn-secondary `}>
                Click Here to Login
              </Button>
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
