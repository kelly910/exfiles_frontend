// components/NameAvatar.tsx
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

const NameAvatar: React.FC<NameAvatarProps> = ({
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
        backgroundColor: '#DADAE1',
        color: '#1B1A25',
        fontSize: '16px',
        fontWeight: 600,
        padding: '9px 10px',
        lineHeight: '140%',
      }}
    >
      {displayText}
    </Avatar>
  );
};

export default NameAvatar;
