import React from 'react';
import styles from './chatwindows.module.scss';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import Image from 'next/image';

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
            <UserDocsUpload />
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
              src="/images/chat-like.svg"
              alt="Reply"
              width={18}
              height={18}
            />
          </Button>
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
              src="/images/chat-like.svg"
              alt="Reply"
              width={18}
              height={18}
            />
          </Button>
          <Button>
            <Image
              src="/images/chat-like.svg"
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
        <Tooltip title="Open settings">
          <IconButton sx={{ p: 0 }}>
            <Avatar
              alt="A S"
              src="/static/images/avatar/1.jpg"
              sx={{
                backgroundColor: '#DADAE1',
                color: '#1B1A25',
                fontSize: '16px',
                fontWeight: 600,
                padding: '9px 10px',
                lineHeight: '140%',
              }}
            />
          </IconButton>
        </Tooltip>
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
                width={14}
                height={16}
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
                width={14}
                height={16}
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
                width={14}
                height={16}
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
        <span className={styles.chatTime}>04:57 AM</span>
      </Box>
      <Box component="div" className={styles.chatAlImg}>
        <Tooltip title="Open settings">
          <IconButton sx={{ p: 0 }}>
            <Avatar
              alt="A S"
              src="/static/images/avatar/1.jpg"
              sx={{
                backgroundColor: '#DADAE1',
                color: '#1B1A25',
                fontSize: '16px',
                fontWeight: 600,
                padding: '9px 10px',
                lineHeight: '140%',
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
