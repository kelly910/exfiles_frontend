import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import AIChatStyles from '@components/AI-Chat-Module/styles/AIChatStyle.module.scss';

export default function DynamicLowerHeader() {
  const [randomTitle, setRandomTitle] = useState<string | null>(null);

  const CHAT_TITLES = [
    'Ask me anything',
    'What do you need help with today?',
    'Got something to upload, log, or respond to?',
    'What are we documenting today?',
    'Start by uploading a file or asking a question.',
  ];

  const getRandomTitle = () => {
    const index = Math.floor(Math.random() * CHAT_TITLES.length);
    return CHAT_TITLES[index];
  };

  useEffect(() => {
    const randomTitleString = getRandomTitle();
    setRandomTitle(randomTitleString);
  }, []);

  return (
    <div className={AIChatStyles.chatHeader}>
      <Typography variant="h2" className={AIChatStyles.chatTitle}>
        {randomTitle}
      </Typography>
      <Typography
        variant="body1"
        className={AIChatStyles.chatSubtitle}
        sx={{ maxWidth: '500px' }}
      >
        Type your question or upload a message below—ExFiles will do the heavy
        lifting.
      </Typography>
    </div>
  );
}
