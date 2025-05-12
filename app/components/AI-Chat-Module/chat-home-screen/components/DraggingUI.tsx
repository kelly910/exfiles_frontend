import AIChatStyles from '@components/AI-Chat-Module/styles/AIChatStyle.module.scss';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

export default function DraggingUI() {
  return (
    <div className={AIChatStyles.dropOverlay}>
      <Box className={AIChatStyles.dropOverlayInner}>
        <Image
          src="/images/Upload-img.png"
          alt="Upload-img"
          width={88}
          height={94}
        />
        <Typography gutterBottom>Drag your documents here to upload</Typography>
        <Typography gutterBottom>
          You can upload upto 10 documents together.
        </Typography>
      </Box>
    </div>
  );
}
