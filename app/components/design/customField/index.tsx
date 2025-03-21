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
          fontSize: '16px',
          color: error ? '#ff4d4d' : '#676972',
          fontWeight: 500,
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
        InputLabelProps={{ style: { color: '#b0b0b0' } }}
        sx={{
          marginTop: '5px',
          padding: '0px 0 15px 0',
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            borderWidth: '0px',
            color: '#fff',
            backgroundColor: '#252431',
            '& .MuiOutlinedInput-input': {
              fontSize: '16px',
              color: '#fff',
              padding: '14px 16px',
              fontWeight: 500,
              borderRadius: '12px',
              // backgroundColor: '#252431',
              '&::placeholder': {
                color: '#888',
                fontWeight: 400,
              },
            },
            '& fieldset': {
              borderColor: '#3A3948',
            },
            '&:hover fieldset': {
              borderColor: '#fff',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#fff',
              borderWidth: '1px',
              color: '#fff',
            },
          },
          '& .MuiFormHelperText-root': {
            color: error ? '#ff4d4d' : '#b0b0b0',
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
                  color: '#b0b0b0',
                  fontWeight: 'bold',
                  width: '60px',
                  background: 'transparent',
                  '& .MuiSelect-icon': {
                    color: '#fff',
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
                  <VisibilityOff sx={{ color: '#b0b0b0' }} />
                ) : (
                  <Visibility sx={{ color: '#b0b0b0' }} />
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
