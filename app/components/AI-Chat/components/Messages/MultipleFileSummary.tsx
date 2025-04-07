import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import chatMessagesStyles from '@components/AI-Chat/styles/ChatMessagesStyle.module.scss';

import Image from 'next/image';

export default function MultipleFileSummary({
  userDetails,
}: {
  userDetails: any;
}) {
  return (
    <Box component="div" className={chatMessagesStyles.chatAl}>
      <Box component="div" className={chatMessagesStyles.chatAlImg}>
        <Tooltip title="Open settings">
          <IconButton sx={{ p: 0 }}>
            <Avatar
              alt="A S"
              src="/static/images/avatar/2.jpg"
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
      <Box component="div" className={chatMessagesStyles.chatAlContent}>
        <Typography
          variant="body1"
          className={chatMessagesStyles.chatAlContentText}
        >
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
            className={chatMessagesStyles.chatAlFile}
          >
            <Box component="div" className={chatMessagesStyles.chatAlFileInner}>
              <Box
                component="div"
                className={chatMessagesStyles.chatAlFileIcon}
              >
                <Image
                  src="/images/pdf.svg"
                  alt="pdf"
                  width={14}
                  height={17}
                  className={chatMessagesStyles.pdfImg}
                />
              </Box>
              <Typography
                variant="body1"
                className={chatMessagesStyles.chatAlText}
              >
                RekamanProspek.pdf
              </Typography>
              <Box
                component="div"
                className={chatMessagesStyles.chatAlFileSummary}
              >
                <Typography>View Summary</Typography>
                <Image
                  src="/images/open-new.svg"
                  alt="pdf"
                  width={12}
                  height={12}
                  className={chatMessagesStyles.pdfImg}
                />
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            className={chatMessagesStyles.chatAlFile}
          >
            <Box component="div" className={chatMessagesStyles.chatAlFileInner}>
              <Box
                component="div"
                className={chatMessagesStyles.chatAlFileIcon}
              >
                <Image
                  src="/images/pdf.svg"
                  alt="pdf"
                  width={14}
                  height={17}
                  className={chatMessagesStyles.pdfImg}
                />
              </Box>
              <Typography
                variant="body1"
                className={chatMessagesStyles.chatAlText}
              >
                RekamanProspek.pdf
              </Typography>
              <Box
                component="div"
                className={chatMessagesStyles.chatAlFileSummary}
              >
                <Typography>View Summary</Typography>
                <Image
                  src="/images/open-new.svg"
                  alt="pdf"
                  width={12}
                  height={12}
                  className={chatMessagesStyles.pdfImg}
                />
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            className={chatMessagesStyles.chatAlFile}
          >
            <Box component="div" className={chatMessagesStyles.chatAlFileInner}>
              <Box
                component="div"
                className={chatMessagesStyles.chatAlFileIcon}
              >
                <Image
                  src="/images/pdf.svg"
                  alt="pdf"
                  width={14}
                  height={17}
                  className={chatMessagesStyles.pdfImg}
                />
              </Box>
              <Typography
                variant="body1"
                className={chatMessagesStyles.chatAlText}
              >
                RekamanProspek.pdf
              </Typography>
              <Box
                component="div"
                className={chatMessagesStyles.chatAlFileSummary}
              >
                <Typography>View Summary</Typography>
                <Image
                  src="/images/open-new.svg"
                  alt="pdf"
                  width={12}
                  height={12}
                  className={chatMessagesStyles.pdfImg}
                />
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            className={chatMessagesStyles.chatAlFile}
          >
            <Box component="div" className={chatMessagesStyles.chatAlFileInner}>
              <Box
                component="div"
                className={chatMessagesStyles.chatAlFileIcon}
              >
                <Image
                  src="/images/pdf.svg"
                  alt="pdf"
                  width={14}
                  height={17}
                  className={chatMessagesStyles.pdfImg}
                />
              </Box>
              <Typography
                variant="body1"
                className={chatMessagesStyles.chatAlText}
              >
                RekamanProspek.pdf
              </Typography>
              <Box
                component="div"
                className={chatMessagesStyles.chatAlFileSummary}
              >
                <Typography>View Summary</Typography>
                <Image
                  src="/images/open-new.svg"
                  alt="pdf"
                  width={12}
                  height={12}
                  className={chatMessagesStyles.pdfImg}
                />
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            className={chatMessagesStyles.chatAlFile}
          >
            <Box component="div" className={chatMessagesStyles.chatAlFileInner}>
              <Box
                component="div"
                className={chatMessagesStyles.chatAlFileIcon}
              >
                <Image
                  src="/images/pdf.svg"
                  alt="pdf"
                  width={14}
                  height={17}
                  className={chatMessagesStyles.pdfImg}
                />
              </Box>
              <Typography
                variant="body1"
                className={chatMessagesStyles.chatAlText}
              >
                RekamanProspek.pdf
              </Typography>
              <Box
                component="div"
                className={chatMessagesStyles.chatAlFileSummary}
              >
                <Typography>View Summary</Typography>
                <Image
                  src="/images/open-new.svg"
                  alt="pdf"
                  width={12}
                  height={12}
                  className={chatMessagesStyles.pdfImg}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
        <span className={chatMessagesStyles.chatTime}>04:57 AM</span>
        <Box component="div" className={chatMessagesStyles.chatAlIcon}>
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
