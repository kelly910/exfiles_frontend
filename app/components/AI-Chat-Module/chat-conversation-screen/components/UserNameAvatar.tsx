import React from 'react';
import { Avatar } from '@mui/material';

interface NameAvatarProps {
  fullName?: string;
  fallback?: 'initials' | 'question' | 'default' | 'emoji';
}

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  const first = parts[0]?.[0] || '';
  const last = parts[1]?.[0] || '';
  return (first + last).toUpperCase();
};

const UserNameAvatar: React.FC<NameAvatarProps> = ({
  fullName,
  fallback = 'default',
}) => {
  let displayText = '';

  if (fullName) {
    displayText = getInitials(fullName);
  } else {
    switch (fallback) {
      case 'question':
        displayText = '?';
        break;
      case 'emoji':
        displayText = '👤';
        break;
      case 'initials':
        displayText = 'NA';
        break;
      default:
        displayText = '--';
    }
  }

  return (
    <Avatar
      alt={fullName || 'user avatar'}
      sx={{
        backgroundColor: 'var(--Primary-Text-Color)',
        color: 'var(--Card-Color)',
        fontSize: 'var(--SubTitle-2)',
        fontWeight: 'var(--Medium)',
        padding: '9px 10px',
        lineHeight: '140%',
      }}
    >
      {displayText}
    </Avatar>
  );
};

export default UserNameAvatar;
