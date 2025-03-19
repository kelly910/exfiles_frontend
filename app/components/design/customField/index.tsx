import React, { useState } from 'react'
import {
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

interface CustomTextFieldProps {
  name: string
  label: string
  placeholder: string
  type?: 'text' | 'password' | 'email'
  autoComplete?: string
  error?: string
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  name,
  label,
  placeholder,
  type = 'text',
  autoComplete,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password'

  return (
    <div>
      <Typography
        variant="body2"
        component="label"
        sx={{
          display: 'block',
          marginBottom: '4px',
          fontSize: '14px',
          color: error ? '#d32f2f' : '#ffffff',
        }}
      >
        {label}
      </Typography>

      <TextField
        fullWidth
        name={name}
        placeholder={placeholder}
        type={isPasswordField && !showPassword ? 'password' : 'text'}
        variant="outlined"
        autoComplete={autoComplete}
        error={!!error}
        helperText={error}
        InputLabelProps={{ style: { color: '#b0b0b0' } }}
        sx={{
          marginTop: '5px',
          padding: '10px 0 8px 0',
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'transparent',
            color: '#ffffff',
            borderRadius: '8px',
            borderColor: '#3A3948',
            '& fieldset': {
              borderColor: '#3A3948',
            },
            '&:hover fieldset': {
              borderColor: '#ffffff',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#fff', // Blue focus border
              borderWidth: '2px',
            },
          },
          '& .MuiFormHelperText-root': {
            color: error ? '#d32f2f' : '#b0b0b0',
          },
        }}
        InputProps={{
          endAdornment: isPasswordField && (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? (
                  <VisibilityOff style={{ color: '#b0b0b0' }} />
                ) : (
                  <Visibility style={{ color: '#b0b0b0' }} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        margin="normal"
      />
    </div>
  )
}

export default CustomTextField
