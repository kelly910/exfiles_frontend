import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface CustomTextFieldProps {
  name: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'password' | 'email' | 'number';
  id?: string;
  autoComplete?: string;
  error?: string;
  isMobile?: boolean; // Enable mobile input with country code
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  name,
  label,
  placeholder,
  type = 'text',
  autoComplete,
  id,
  error,
  isMobile = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');

  return (
    <div>
      {/* Label */}
      <Typography
        variant="body2"
        component="label"
        htmlFor={id || name}
        sx={{
          display: 'block',
          marginBottom: '4px',
          fontSize: 'var(--SubTitle-2)',
          color: error ? 'var(--Red-Color)' : 'var(--Placeholder-Text)',
          fontWeight: 'var(--Medium)',
        }}
      >
        {label}
      </Typography>

      {/* Input Field */}
      <TextField
        fullWidth
        id={id || name}
        name={name}
        placeholder={placeholder}
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type} // Fixed password toggle
        variant="outlined"
        autoComplete={autoComplete}
        error={!!error}
        helperText={error || ''}
        InputLabelProps={{ style: { color: 'var(--Placeholder-Text)' } }}
        sx={{
          marginTop: '5px',
          padding: '0px 0 15px 0',
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            borderWidth: '0px',
            color: 'var(--Txt-On-Gradient)',
            backgroundColor: 'var(--Input-Box-Colors)',
            '& .MuiOutlinedInput-input': {
              fontSize: 'var(--SubTitle-2)',
              color: 'var(--Txt-On-Gradient)',
              padding: '14px 16px',
              fontWeight: 'var(--Medium)',
              borderRadius: '12px',
              // backgroundColor: 'var(--Input-Box-Colors)',
              '&::placeholder': {
                color: 'var(--Placeholder-Text)',
                fontWeight: 'var(--Lighter)',
              },
            },
            '& fieldset': {
              borderColor: 'var(--Stroke-Color)',
            },
            '&:hover fieldset': {
              borderColor: 'var(--Txt-On-Gradient)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--Txt-On-Gradient)',
              borderWidth: '1px',
              color: 'var(--Txt-On-Gradient)',
            },
          },
          '& .MuiFormHelperText-root': {
            color: error ? 'var(--Red-Color)' : 'var(--Placeholder-Text)',
          },
        }}
        InputProps={{
          // Mobile Input with Country Code
          startAdornment: isMobile && (
            <InputAdornment position="start">
              <Select
                value={countryCode}
                className="select-new"
                onChange={(e) => setCountryCode(e.target.value)}
                sx={{
                  padding: '0px',
                  color: 'var(--Placeholder-Text)',
                  fontWeight: 'var(--Bold)',
                  width: '60px',
                  background: 'transparent',
                  '& .MuiSelect-icon': {
                    color: 'var(--Txt-On-Gradient)',
                    position: 'absolute',
                    right: '-10px',
                  },
                }}
              >
                <MenuItem value="+91">+91</MenuItem>
                <MenuItem value="+1">+1</MenuItem>
                <MenuItem value="+44">+44</MenuItem>
                <MenuItem value="+61">+61</MenuItem>
              </Select>
            </InputAdornment>
          ),

          // Password Toggle Visibility
          endAdornment: type === 'password' && (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? (
                  <VisibilityOff sx={{ color: 'var(--Primary-Text-Color)' }} />
                ) : (
                  <Visibility sx={{ color: 'var(--Primary-Text-Color)' }} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        margin="normal"
      />
    </div>
  );
};

export default CustomTextField;
