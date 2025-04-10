import React, { ReactNode } from 'react';
import { Control, FieldValues, Path, UseFormSetValue } from 'react-hook-form';
import { SxProps, Theme } from '@mui/material/styles';

export type SharedFieldProps = {
  name: string;
  placeholder?: string;
};
export interface FormInputProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string | ReactNode;
  setValue?: UseFormSetValue<T>;
  type?: string;
  multiline?: boolean;
  classNames?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
  defaultValue?: string;
  placeholder?: string;
  sx?: SxProps<Theme>;
}
