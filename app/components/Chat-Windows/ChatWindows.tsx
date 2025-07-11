import React from 'react';
import styles from './chatwindows.module.scss';
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useThemeMode } from '@/app/utils/ThemeContext';

export default function ChatWindows() {
  const chatDate = ['March 5, 2025', '25-03-2025', 'today'];

  return (
    <>
      {chatDate.map((date, index) => (
        <>
          <ChatDate key={index} date={date} />
          <Box component="div" className={styles.chatWindow}>
            <ChatUser />
            <ChatAl />
            <ChatAlSummary />
            <UserDocsUpload />
            <ChatAlHold />
            <ChatAlCombined />
            <ChatAlFiles />
            <ChatAlError />
            <GeneratingCombined />
          </Box>
        </>
      ))}
    </>
  );
}

function ChatDate({ date }: { date: string }) {
  return (
    <Box component="div" className={styles.chatDate}>
      <span>{date}</span>
    </Box>
  );
}

function ChatAl() {
  const { theme } = useThemeMode();
  return (
    <Box component="div" className={styles.chatAl}>
      <Box component="div" className={styles.chatAlImg}>
        <Tooltip title="Open settings">
          <IconButton sx={{ p: 0 }}>
            <Image
              alt="Logo"
              width={40}
              height={40}
              src="/images/close-sidebar-logo.svg"
              style={{
                filter: theme === 'dark' ? 'brightness(0) invert(0)' : '',
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Box component="div" className={styles.chatAlContent}>
        <Typography variant="body1" className={styles.chatAlContentText}>
          As writing evolves in the digital age, the concept of paragraphs has
          extended beyond traditional print media. In online content, paragraphs
          are often shorter and more visually distinct to accommodate the
          shorter attention spans of digital readers. Additionally, the use of
          subheadings, bullet points, and numbered lists has become prevalent,
          allowing for easy scanning and navigation of online articles and blog
          posts. The advent of the internet and the rise of digital platforms
          have significantly influenced the way written content is consumed.
          Online readers tend to have shorter attention spans and engage with
          text differently compared to print readers. Consequently, paragraphs
          in digital writing have adapted to cater to these preferences. Online
          paragraphs are often shorter, consisting of only a few sentences. This
          brevity makes the content more accessible and digestible for readers
          who are accustomed to quickly scanning through online material.
        </Typography>
        <span className={styles.chatTime}>04:57 AM</span>
        <Box component="div" className={styles.chatAlIcon}>
          <Button>
            <Image
              src="/images/chat-like.svg"
              alt="Reply"
              width={18}
              height={18}
            />
          </Button>
          <Button>
            <Image
              src="/images/chat-dlike.svg"
              alt="Reply"
              width={18}
              height={18}
            />
          </Button>
          <Button>
            <Image
              src="/images/chat-copy.svg"
              alt="Reply"
              width={18}
              height={18}
            />
          </Button>
          <Button>
            <Image
              src="/images/chat-edit.svg"
              alt="Reply"
              width={18}
              height={18}
            />
          </Button>
          <Button>
            <Image
              src="/images/chat-pin.svg"
              alt="Reply"
              width={18}
              height={18}
            />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function ChatAlSummary() {
  return (
    <Box component="div" className={styles.chatAl}>
      <Box component="div" className={styles.chatAlImg}>
        <Tooltip title="Open settings">
          <IconButton sx={{ p: 0 }}>
            <Avatar
              alt="A S"
              src="/static/images/avatar/2.jpg"
              sx={{
                backgroundColor: 'var(--Primary-Text-Color)',
                color: 'var(--Card-Color)',
                fontSize: 'var(--SubTitle-2)',
                fontWeight: 'var(--Medium)',
                padding: '9px 10px',
                lineHeight: '140%',
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Box component="div" className={styles.chatAlContent}>
        <Typography variant="body1" className={styles.chatAlContentText}>
          Please select an option to continue
        </Typography>
        <Box component="div" className={styles.chatAlSummary}>
          <Box component="div" className={styles.chatAlSummaryInner}>
            <Box component="div" className={styles.chatAlSummaryBox}>
              <Box className={styles.chatAlSummaryImg}>
                <Image
                  src="/images/combined.svg"
                  alt="combined"
                  width={24}
                  height={21}
                />
              </Box>
              <Box className={styles.chatAlSummaryText}>
                <Typography className={styles.chatAlSummaryTitle}>
                  Combined Summary
                </Typography>
                <Typography className={styles.chatAlSummarySemiTitle}>
                  A combined summary will be generated and added to the chat.
                </Typography>
              </Box>
            </Box>
            <Box component="div" className={styles.chatAlSummaryBox}>
              <Box className={styles.chatAlSummaryImg}>
                <Image
                  src="/images/combined.svg"
                  alt="combined"
                  width={24}
                  height={21}
                />
              </Box>
              <Box className={styles.chatAlSummaryText}>
                <Typography className={styles.chatAlSummaryTitle}>
                  Combined Summary
                </Typography>
                <Typography className={styles.chatAlSummarySemiTitle}>
                  A combined summary will be generated and added to the chat.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <span className={styles.chatTime}>04:57 AM</span>
      </Box>
    </Box>
  );
}

function ChatAlHold() {
  return (
    <Box component="div" className={styles.chatAl}>
      <Box component="div" className={styles.chatAlImg}>
        <Tooltip title="Open settings">
          <IconButton sx={{ p: 0 }}>
            <Avatar
              alt="A S"
              src="/static/images/avatar/2.jpg"
              sx={{
                backgroundColor: 'var(--Primary-Text-Color)',
                color: 'var(--Card-Color)',
                fontSize: 'var(--SubTitle-2)',
                fontWeight: 'var(--Medium)',
                padding: '9px 10px',
                lineHeight: '140%',
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Box component="div" className={styles.chatAlContent}>
        <Typography variant="body1" className={styles.chatAlContentText}>
          Hold on a second...
        </Typography>
        <Box component="div" className={styles.chatAlCategory}>
          <Box component="div" className={styles.chatAlCategoryInner}>
            <Image
              src="/images/category.svg"
              alt="category"
              width={14}
              height={14}
            />
            <Typography variant="body1" className={styles.chatAlText}>
              Generating Summary Links
            </Typography>
          </Box>
          <Box component="div" className={styles.chatAlCategoryInner}>
            <Image
              src="/images/category.svg"
              alt="category"
              width={14}
              height={14}
            />
            <Typography variant="body1" className={styles.chatAlText}>
              Generating Summary Links
            </Typography>
          </Box>
        </Box>
        <span className={styles.chatTime}>04:57 AM</span>
      </Box>
    </Box>
  );
}

function ChatAlFiles() {
  return (
    <Box component="div" className={styles.chatAl}>
      <Box component="div" className={styles.chatAlImg}>
        <Tooltip title="Open settings">
          <IconButton sx={{ p: 0 }}>
            <Avatar
              alt="A S"
              src="/static/images/avatar/2.jpg"
              sx={{
                backgroundColor: 'var(--Primary-Text-Color)',
                color: 'var(--Card-Color)',
                fontSize: 'var(--SubTitle-2)',
                fontWeight: 'var(--Medium)',
                padding: '9px 10px',
                lineHeight: '140%',
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Box component="div" className={styles.chatAlContent}>
        <Typography variant="body1" className={styles.chatAlContentText}>
          Hold on a second...
        </Typography>
        <Grid
          container
          spacing={1.5}
          justifyContent="start"
          alignItems="stretch"
          // max-width="100%"
          padding="2px 12px 8px 12px"
          sx={{ background: 'var(--Card-Color)' }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            xl={4}
            className={styles.chatAlFile}
          >
            <Box component="div" className={styles.chatAlFileInner}>
              <Box component="div" className={styles.chatAlFileHeader}>
                <Box component="div" className={styles.chatAlFileIcon}>
                  <Image
                    src="/images/pdf.svg"
                    alt="pdf"
                    width={13}
                    height={16}
                    className={styles.pdfImg}
                  />
                </Box>
                <Typography variant="body1" className={styles.chatAlText}>
                  RekamanProspek.pdf
                </Typography>
              </Box>
              <Box component="div" className={styles.chatAlFileSummary}>
                <Box component="div" className={styles.chatAlUploadFailed}>
                  <Image
                    src="/images/error.svg"
                    alt="error"
                    width={14}
                    height={14}
                  />
                </Box>
                <Box component="div" className={styles.chatAlUploadFailed}>
                  <Typography variant="body1" className={styles.chatAlText}>
                    Error in training while processing this document
                  </Typography>
                  <Button className={styles.charAlRetryButton}>
                    <Image
                      src="/images/retry.svg"
                      alt="retry.svg"
                      width={10}
                      height={10}
                    />
                    Retry
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            xl={4}
            className={styles.chatAlFile}
          >
            <Box component="div" className={styles.chatAlFileInner}>
              <Box component="div" className={styles.chatAlFileHeader}>
                <Box component="div" className={styles.chatAlFileIcon}>
                  <Image
                    src="/images/pdf.svg"
                    alt="pdf"
                    width={13}
                    height={16}
                    className={styles.pdfImg}
                  />
                </Box>
                <Typography variant="body1" className={styles.chatAlText}>
                  RekamanProspek.pdf
                </Typography>
              </Box>
              <Box>
                <Box component="div" className={styles.chatAlFileSummary}>
                  <Image
                    src="/images/folder.svg"
                    alt="pdf"
                    width={14}
                    height={14}
                    className={styles.pdfImg}
                  />
                  <Typography>Category Name</Typography>
                  <Image
                    src="/images/open-new.svg"
                    alt="pdf"
                    width={12}
                    height={12}
                    className={styles.pdfImg}
                  />
                </Box>
                <Box component="div" className={styles.chatAlFileSummary}>
                  <Typography>View Summary</Typography>
                  <Image
                    src="/images/open-new.svg"
                    alt="pdf"
                    width={12}
                    height={12}
                    className={styles.pdfImg}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            xl={4}
            className={styles.chatAlFile}
          >
            <Box component="div" className={styles.chatAlFileInner}>
              <Box component="div" className={styles.chatAlFileHeader}>
                <Box component="div" className={styles.chatAlFileIcon}>
                  <Image
                    src="/images/pdf.svg"
                    alt="pdf"
                    width={13}
                    height={16}
                    className={styles.pdfImg}
                  />
                </Box>
                <Typography variant="body1" className={styles.chatAlText}>
                  RekamanProspek.pdf
                </Typography>
              </Box>
              <Box component="div" className={styles.chatAlFileSummary}>
                <Typography>View Summary</Typography>
                <Image
                  src="/images/open-new.svg"
                  alt="pdf"
                  width={12}
                  height={12}
                  className={styles.pdfImg}
                />
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            xl={4}
            className={styles.chatAlFile}
          >
            <Box component="div" className={styles.chatAlFileInner}>
              <Box component="div" className={styles.chatAlFileHeader}>
                <Box component="div" className={styles.chatAlFileIcon}>
                  <Image
                    src="/images/pdf.svg"
                    alt="pdf"
                    width={13}
                    height={16}
                    className={styles.pdfImg}
                  />
                </Box>
                <Typography variant="body1" className={styles.chatAlText}>
                  RekamanProspek.pdf
                </Typography>
              </Box>
              <Box component="div" className={styles.chatAlFileSummary}>
                <Typography>View Summary</Typography>
                <Image
                  src="/images/open-new.svg"
                  alt="pdf"
                  width={12}
                  height={12}
                  className={styles.pdfImg}
                />
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            xl={4}
            className={styles.chatAlFile}
          >
            <Box component="div" className={styles.chatAlFileInner}>
              <Box component="div" className={styles.chatAlFileHeader}>
                <Box component="div" className={styles.chatAlFileIcon}>
                  <Image
                    src="/images/pdf.svg"
                    alt="pdf"
                    width={13}
                    height={16}
                    className={styles.pdfImg}
                  />
                </Box>
                <Typography variant="body1" className={styles.chatAlText}>
                  RekamanProspek.pdf
                </Typography>
              </Box>
              <Box component="div" className={styles.chatAlFileSummary}>
                <Typography>View Summary</Typography>
                <Image
                  src="/images/open-new.svg"
                  alt="pdf"
                  width={12}
                  height={12}
                  className={styles.pdfImg}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box className={styles.chatAlSummaryButtonMain}>
          <Button className={styles.chatAlSummaryButton}>
            <Image
              src="/images/combined.svg"
              alt="combined"
              width={18}
              height={18}
            />
            Generate Combined Summary
          </Button>
        </Box>
        <span className={styles.chatTime}>04:57 AM</span>
        <Box component="div" className={styles.chatAlIcon}>
          <Button>
            <Image
              src="/images/chat-like.svg"
              alt="Reply"
              width={18}
              height={18}
            />
          </Button>
          <Button>
            <Image
              src="/images/chat-dlike.svg"
              alt="Reply"
              width={18}
              height={18}
            />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function ChatAlCombined() {
  return (
    <Box component="div" className={styles.chatAl}>
      <Box component="div" className={styles.chatAlImg}>
        <Tooltip title="Open settings">
          <IconButton sx={{ p: 0 }}>
            <Avatar
              alt="A S"
              src="/static/images/avatar/2.jpg"
              sx={{
                backgroundColor: 'var(--Primary-Text-Color)',
                color: 'var(--Card-Color)',
                fontSize: 'var(--SubTitle-2)',
                fontWeight: 'var(--Medium)',
                padding: '9px 10px',
                lineHeight: '140%',
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Box component="div" className={styles.chatAlContent}>
        <Typography variant="body1" className={styles.chatAlContentText}>
          Here is your combined summary
        </Typography>
        <Box component="div" className={styles.chatAlCombined}>
          <Box component="div" className={styles.chatAlCombinedInner}>
            <Typography variant="body1" className={styles.chatAlText}>
              As writing evolves in the digital age, the concept of paragraphs
              has extended beyond traditional print media. In online content,
              paragraphs are often shorter and more visually distinct to
              accommodate the shorter attention spans of digital readers.
              Additionally, the use of subheadings, bullet points, and numbered
              lists has become prevalent, allowing for easy scanning and
              navigation of online articles and blog posts. The advent of the
              internet and the rise of digital platforms have significantly
              influenced the way written content is consumed. Online readers
              tend to have shorter attention spans and engage with text
              differently compared to print readers. Consequently, paragraphs in
              digital writing have adapted to cater to these preferences. Online
              paragraphs are often shorter, consisting of only a few sentences.
              This brevity makes the content more accessible and digestible for
              readers who are accustomed to quickly scanning through online
              material.
            </Typography>
          </Box>
          <Box component="div" className={styles.chatAlCombinedInner}>
            <Typography variant="body1" className={styles.chatAlText}>
              As writing evolves in the digital age, the concept of paragraphs
              has extended beyond traditional print media. In online content,
              paragraphs are often shorter and more visually distinct to
              accommodate the shorter attention spans of digital readers.
              Additionally, the use of subheadings, bullet points, and numbered
              lists has become prevalent, allowing for easy scanning and
              navigation of online articles and blog posts. The advent of the
              internet and the rise of digital platforms have significantly
              influenced the way written content is consumed. Online readers
              tend to have shorter attention spans and engage with text
              differently compared to print readers. Consequently, paragraphs in
              digital writing have adapted to cater to these preferences. Online
              paragraphs are often shorter, consisting of only a few sentences.
              This brevity makes the content more accessible and digestible for
              readers who are accustomed to quickly scanning through online
              material.
            </Typography>
          </Box>
        </Box>
        <span className={styles.chatTime}>04:57 AM</span>
      </Box>
    </Box>
  );
}

function ChatAlError() {
  return (
    <Box component="div" className={styles.chatAl}>
      <Box component="div" className={styles.chatAlImg}>
        <Tooltip title="Open settings">
          <IconButton sx={{ p: 0 }}>
            <Avatar
              alt="A S"
              src="/static/images/avatar/2.jpg"
              sx={{
                backgroundColor: 'var(--Primary-Text-Color)',
                color: 'var(--Card-Color)',
                fontSize: 'var(--SubTitle-2)',
                fontWeight: 'var(--Medium)',
                padding: '9px 10px',
                lineHeight: '140%',
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Box component="div" className={styles.chatAlContent}>
        <Typography variant="body1" className={styles.chatAlContentText}>
          Opps... There’s an error
        </Typography>
        <Box component="div" className={styles.chatAlContent}>
          <Box component="div" className={styles.chatAlFileInner}>
            <div className={styles.fileBox}>
              <span className={styles.fileIcon}>
                <Image
                  src="/images/pdf.svg"
                  alt="pdf"
                  width={18}
                  height={22}
                  className={styles.pdfImg}
                />
              </span>
              <Typography variant="body1" className={styles.fileTitle}>
                Neon Insights
                <span>125 kb</span>
              </Typography>
            </div>
            <Box component="div" className={styles.chatAlUploadFailed}>
              <Image
                src="/images/error.svg"
                alt="error"
                width={14}
                height={14}
              />
              <Typography variant="body1" className={styles.chatAlText}>
                Error in training while processing this document
              </Typography>
              <Button className={styles.charAlRetryButton}>
                <Image
                  src="/images/retry.svg"
                  alt="retry.svg"
                  width={10}
                  height={10}
                />
                Retry
              </Button>
            </Box>
          </Box>
        </Box>
        <span className={styles.chatTime}>04:57 AM</span>
      </Box>
    </Box>
  );
}

function ChatUser() {
  return (
    <Box component="div" className={`${styles.chatAl} ${styles.chatAlUser}`}>
      <Box component="div" className={styles.chatAlContent}>
        <Typography variant="body1" className={styles.chatAlContentText}>
          If you had $40,000 to build your own business, what would you do?
        </Typography>
        <span className={styles.chatTime}>04:57 AM</span>
      </Box>
      <Box component="div" className={styles.chatAlImg}>
        <Avatar
          sx={{
            backgroundColor: 'var(--Primary-Text-Color)',
            color: 'var(--Card-Color)',
            fontSize: 'var(--SubTitle-2)',
            fontWeight: 'var(--Medium)',
            padding: '9px 10px',
            lineHeight: '140%',
          }}
        >
          AS
        </Avatar>
      </Box>
    </Box>
  );
}

function UserDocsUpload() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <Box component="div" className={`${styles.chatAl} ${styles.chatAlUser}`}>
      <Box component="div" className={` ${styles.chatUserProgress}`}>
        <Box component="div" className={styles.chatAlContent}>
          <div className={styles.fileBox}>
            <span className={styles.fileIcon}>
              <Image
                src="/images/pdf.svg"
                alt="pdf"
                width={18}
                height={22}
                className={styles.pdfImg}
              />
            </span>
            <Typography variant="body1" className={styles.fileTitle}>
              Neon Insights
              <span>125 kb</span>
            </Typography>
          </div>
          <Box component="div" className={styles.chatAlProgress}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        </Box>

        <Box component="div" className={styles.chatAlContent}>
          <div className={styles.fileBox}>
            <span className={styles.fileIcon}>
              <Image
                src="/images/pdf.svg"
                alt="pdf"
                width={18}
                height={22}
                className={styles.pdfImg}
              />
            </span>
            <Typography variant="body1" className={styles.fileTitle}>
              Neon Insights
              <span>125 kb</span>
            </Typography>
          </div>
          <Box component="div" className={styles.chatAlCategory}>
            <Image
              src="/images/category.svg"
              alt="category"
              width={14}
              height={14}
            />
            <Typography variant="body1" className={styles.chatAlText}>
              Assigning Category
            </Typography>
          </Box>
        </Box>

        <Box component="div" className={styles.chatAlContent}>
          <div className={styles.fileBox}>
            <span className={styles.fileIcon}>
              <Image
                src="/images/pdf.svg"
                alt="pdf"
                width={18}
                height={22}
                className={styles.pdfImg}
              />
            </span>
            <Typography variant="body1" className={styles.fileTitle}>
              Neon Insights
              <span>125 kb</span>
            </Typography>
          </div>
          <Box component="div" className={styles.chatAlUploadFailed}>
            <Image
              src="/images/upload-failed.svg"
              alt="category"
              width={14}
              height={14}
            />
            <Typography variant="body1" className={styles.chatAlText}>
              Upload Failed
            </Typography>
            {/* <Button className={styles.charAlRetryButton}>
              <Image
                src="/images/retry.svg"
                alt="retry.svg"
                width={10}
                height={10}
              />
              Retry
            </Button> */}
          </Box>
        </Box>

        <Box component="div" className={styles.chatAlContent}>
          <div className={styles.fileBox}>
            <span className={styles.fileIcon}>
              <Image
                src="/images/pdf.svg"
                alt="pdf"
                width={18}
                height={22}
                className={styles.pdfImg}
              />
            </span>
            <Typography variant="body1" className={styles.fileTitle}>
              Neon Insights
              <span>125 kb</span>
            </Typography>
          </div>
          <Box component="div" className={styles.chatAlFolder}>
            <Image
              src="/images/folder.svg"
              alt="category"
              width={14}
              height={14}
            />
            <Typography variant="body1" className={styles.chatAlText}>
              Financial
            </Typography>
            <Image
              src="/images/open-new.svg"
              alt="open-new.svg"
              width={14}
              height={14}
            />
          </Box>
        </Box>

        <span className={styles.chatTime}>04:57 AM</span>
      </Box>
      <Box component="div" className={styles.chatAlImg}>
        <Avatar
          sx={{
            backgroundColor: 'var(--Primary-Text-Color)',
            color: 'var(--Card-Color)',
            fontSize: 'var(--SubTitle-2)',
            fontWeight: 'var(--Medium)',
            padding: '9px 10px',
            lineHeight: '140%',
          }}
        >
          AS
        </Avatar>
      </Box>
    </Box>
  );
}

// Generating Combined summary using

function GeneratingCombined() {
  return (
    <Box component="div" className={`${styles.chatAl} ${styles.chatAlUser}`}>
      <Box component="div" className={styles.chatAlContent}>
        <Typography variant="body1" className={styles.chatAlContentText}>
          Generating Combined summary using
        </Typography>
        <Box component="div" className={styles.chatAlGenerating}>
          <span>RekamanProspek.pdf</span>
          <span>KartuNama.jpeg</span>
          <span>Company Profile.pdf</span>
          <span>Brosur Nusawork.pdf</span>
          <span>Brosur.pdf</span>
          <span>Nusawork.pdf</span>
          <span>Brosur.pdf</span>
          <span>Nusawork.pdf</span>
          <span>Brosur.pdf</span>
          <span>Nusawork.pdf</span>
          <span>Brosur.pdf</span>
          <span>Nusawork.pdf</span>
        </Box>
        <span className={styles.chatTime}>04:57 AM</span>
      </Box>
      <Box component="div" className={styles.chatAlImg}>
        <Avatar
          sx={{
            backgroundColor: 'var(--Primary-Text-Color)',
            color: 'var(--Card-Color)',
            fontSize: 'var(--SubTitle-2)',
            fontWeight: 'var(--Medium)',
            padding: '9px 10px',
            lineHeight: '140%',
          }}
        >
          AS
        </Avatar>
      </Box>
    </Box>
  );
}
