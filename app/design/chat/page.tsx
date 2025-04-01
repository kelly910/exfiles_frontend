'use client';
import {
  Box,
  Container,
  Grid,
  Input,
  InputAdornment,
  Typography,
} from '@mui/material';
import { Button } from '@mui/material';
import styles from './style.module.scss';
import Header from '@/app/components/header/Header';
import ChatWindows from '@/app/components/Chat-Windows/ChatWindows';
import DialogBox from '@/app/components/Dialog-Box/DialogBox';
import Sidebar from '@/app/components/Sidebar/Sidebar';

export default function Page() {
  return (
    <>
      <Sidebar />
      <Header />
      <main>
        <div>
          <Container maxWidth="lg" disableGutters>
            <Box component="section" className={styles.chatBoarbMain}>
              <Box component="section" className={styles.chatHeading}>
                <Box component="div" className={styles.chatHeader}>
                  <Typography variant="h2" className={styles.chatTitle}>
                    Wondering What is ExFiles?
                  </Typography>
                  <Typography variant="body1" className={styles.chatSubtitle}>
                    Try clicking on below examples to get things going
                  </Typography>
                </Box>

                <Box className={styles.gridBox} component="div">
                  <Grid
                    container
                    spacing={4}
                    justifyContent="center"
                    alignItems="stretch"
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={4}
                      className={styles.gridBoxInner}
                    >
                      <div className={styles.chatGridBox}>
                        <div className={styles.chatBox}>
                          <Typography variant="body1">
                            What did say as a kid when asked: What do you want
                            to be when you grow up?
                          </Typography>
                          <Button
                            type="button"
                            variant="contained"
                            className={`btn btn-primary-arrow ${styles.gridBoxButton}`}
                            color="primary"
                            fullWidth
                          >
                            Start with this question
                            <span className="arrow"></span>
                          </Button>
                        </div>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={4}
                      className={styles.gridBoxInner}
                    >
                      <div className={styles.chatGridBox}>
                        <div className={styles.chatBox}>
                          <Typography variant="body1">
                            If you could visit one planet, which would it be?
                          </Typography>
                          <Button
                            type="button"
                            variant="contained"
                            className={`btn btn-primary-arrow ${styles.gridBoxButton}`}
                            color="primary"
                            fullWidth
                          >
                            Start with this question
                            <span className="arrow"></span>
                          </Button>
                        </div>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={4}
                      className={styles.gridBoxInner}
                    >
                      <div className={styles.chatGridBox}>
                        <div className={styles.chatBox}>
                          <Typography variant="body1">
                            When is the last time you can remember feeling
                            totally at peace?
                          </Typography>
                          <Button
                            type="button"
                            variant="contained"
                            className={`btn btn-primary-arrow ${styles.gridBoxButton}`}
                            color="primary"
                            fullWidth
                          >
                            Start with this question
                            <span className="arrow"></span>
                          </Button>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Box component="section" className={styles.chatHeading}>
                <div className={styles.chatHeader}>
                  <Typography variant="h2" className={styles.chatTitle}>
                    How can I help you with?
                  </Typography>
                  <Typography
                    variant="body1"
                    className={styles.chatSubtitle}
                    sx={{ maxWidth: '500px' }}
                  >
                    Ask me anything. Enter the queries you get in textbox below,
                    and see the magic of ExFiles.
                  </Typography>
                </div>

                <Box component="div" className={styles.chatBoard}>
                  <Input
                    id="input-with-icon-adornment"
                    className={styles.fileInput}
                    placeholder="Write your question here"
                    endAdornment={
                      <InputAdornment
                        position="end"
                        className={styles.fileIcon}
                      >
                        <span className={styles.clip}></span>
                      </InputAdornment>
                    }
                  />
                  <Button
                    type="button"
                    variant="contained"
                    className={`btn-arrow`}
                    color="primary"
                    fullWidth
                  >
                    <span className="arrow"></span>
                  </Button>
                </Box>
              </Box>
            </Box>
            <ChatWindows />
            <DialogBox />
          </Container>
        </div>
      </main>
    </>
  );
}

// function DocCard() {
//   return (
//     <Grid item xs={12} sm={12} md={4} className={styles.docBoxInner}>
//       <div className={styles.docGridBox}>
//         <div className={styles.docBox}>
//           <Image
//             src="/images/pdf.svg"
//             alt="pdf"
//             width={19}
//             height={24}
//             className={styles.pdfImg}
//           />
//           <Typography variant="body1" className={styles.docTitle}>
//             Neon Insights
//           </Typography>
//           <Image
//             src="/images/more.svg"
//             alt="more"
//             width={16}
//             height={16}
//             className={styles.moreImg}
//           />
//         </div>
//         <div className={styles.docDateBox}>
//           <div className={styles.docTagBox}>
//             <span className={styles.docTag}>Biotech</span>
//             <span className={styles.docTag}>Biotech</span>
//             <span className={styles.docTag}>+2</span>
//           </div>
//           <Typography variant="body1">12-03-2025</Typography>
//         </div>
//       </div>
//     </Grid>
//   );
// }
