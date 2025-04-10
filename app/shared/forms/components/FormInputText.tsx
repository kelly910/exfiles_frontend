import { Controller, FieldValues } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { FormInputProps } from '../types';
import { SxProps, Theme } from '@mui/material/styles';

const defaultTextFieldSx: SxProps<Theme> = {
  marginTop: '5px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    borderWidth: '0px',
    color: 'var(--Primary-Text-Color)',
    backgroundColor: 'var(--Input-Box-Colors)',
    '& .MuiOutlinedInput-notchedOutline': {
      top: '-10px !important',
    },
    '& .MuiOutlinedInput-input': {
      fontSize: 'var(--SubTitle-2)',
      color: 'var(--Primary-Text-Color)',
      padding: '14px 16px',
      fontWeight: 'var(--Medium)',
      borderRadius: '12px',
      '&::placeholder': {
        color: 'var(--Placeholder-Text)',
        fontWeight: 'var(--Regular)',
      },
    },
    '& fieldset': {
      borderColor: 'var(--Stroke-Color)',
    },
    '&:hover fieldset': {
      borderColor: 'var(--Primary-Text-Color)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--Primary-Text-Color)',
      borderWidth: '1px',
      color: 'var(--Primary-Text-Color)',
    },
  },
  '& .MuiFormHelperText-root': {
    // Add custom helper text styles if needed
  },
};

export const FormInputText = <T extends FieldValues>({
  name,
  control,
  type = 'text',
  classNames,
  multiline,
  sx,
  ...props
}: FormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <TextField
          fullWidth
          type={type}
          onChange={onChange}
          value={value}
          error={!!error}
          helperText={error ? error.message : ''}
          variant="outlined"
          multiline={multiline}
          size="small"
          className={classNames}
          inputRef={ref}
          sx={{ ...defaultTextFieldSx, ...sx }}
          {...props}
        />
      )}
    />
  );
};
