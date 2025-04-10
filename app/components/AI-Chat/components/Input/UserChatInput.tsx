import AIChatStyles from '@components/AI-Chat/styles/AIChatStyle.module.scss';
import { Box, Button, Input, InputAdornment } from '@mui/material';

interface UserChatInputProps {
  handleOpenDocUploadModal: () => void;
}

export default function UserChatInput({
  handleOpenDocUploadModal,
}: UserChatInputProps) {
  return (
    <Box component="div" className={AIChatStyles.chatBoard}>
      <Input
        id="input-with-icon-adornment"
        className={AIChatStyles.fileInput}
        placeholder="Write your question here"
        endAdornment={
          <InputAdornment
            position="end"
            className={AIChatStyles.fileIcon}
            onClick={handleOpenDocUploadModal}
          >
            <span className={AIChatStyles.clip}></span>
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
  );
}
