import LogModel from '@/app/components/LogModel/LogModel';
import AIChatStyles from '@components/AI-Chat-Module/styles/AIChatStyle.module.scss';
import { Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';

interface PrompsSuggestionsProp {
  handlePromptClick: (prompt: string) => void;
}

export default function PromptsSuggestions({
  handlePromptClick,
}: PrompsSuggestionsProp) {
  const [openModel, setOpenModel] = useState(false);

  const CHAT_PROMPS = [
    'Upload a document - AI will summarize and organize it for you.',
    'How do I respond to this message?',
  ];

  const openLogIncidentModel = () => {
    setOpenModel(true);
  };

  return (
    <Grid
      container
      spacing={{ xs: 2, md: 4 }}
      justifyContent="center"
      alignItems="stretch"
    >
      <Grid item xs={12} sm={12} md={4} className={AIChatStyles.gridBoxInner}>
        <div
          className={`${AIChatStyles.chatGridBox} ${AIChatStyles.chatLogIncident}`}
          onClick={openLogIncidentModel}
        >
          <div className={AIChatStyles.chatBox}>
            <Typography variant="body1">
              Log an incident - document what happened today.
            </Typography>
            <Button
              type="button"
              variant="contained"
              className={`btn btn-primary-arrow ${AIChatStyles.gridBoxButton}`}
              color="primary"
              fullWidth
            >
              Log Incident
              <span className="incident"></span>
            </Button>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} sm={12} md={4} className={AIChatStyles.gridBoxInner}>
        <div
          className={`${AIChatStyles.chatGridBox} ${AIChatStyles.chatLogIcon}`}
        >
          <div className={AIChatStyles.chatBox}>
            <Typography variant="body1">{CHAT_PROMPS[0]}</Typography>
            <Button
              type="button"
              variant="contained"
              className={`btn btn-primary-arrow ${AIChatStyles.gridBoxButton}`}
              color="primary"
              fullWidth
              onClick={() => handlePromptClick(CHAT_PROMPS[0])}
            >
              Upload for AI Summary
              <span className="arrow"></span>
            </Button>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} sm={12} md={4} className={AIChatStyles.gridBoxInner}>
        <div className={AIChatStyles.chatGridBox}>
          <div className={AIChatStyles.chatBox}>
            <Typography variant="body1">{CHAT_PROMPS[1]}</Typography>
            <Button
              type="button"
              variant="contained"
              className={`btn btn-primary-arrow ${AIChatStyles.gridBoxButton}`}
              color="primary"
              fullWidth
              onClick={() => handlePromptClick(CHAT_PROMPS[1])}
            >
              Ask AI to Write a Response
              <span className="arrow"></span>
            </Button>
          </div>
        </div>
      </Grid>
      {openModel && (
        <LogModel
          open={openModel}
          handleClose={() => setOpenModel(false)}
          editedData={null}
        />
      )}
    </Grid>
  );
}
