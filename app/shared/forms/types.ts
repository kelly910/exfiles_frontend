import React, { ReactNode, Ref } from 'react';

export type SharedFieldProps = {
  name: string;
  placeholder?: string;
};

export type CoreReactHookFormProps = {
  onChange?: (event: any) => void;
  onBlur?: (event: any) => void;
  ref?: Ref<any>;
  forwardedRef?: Ref<any>;
  name?: string;
};

export interface FormInputProps {
  name: string;
  control: any;
  label: string | ReactNode;
  setValue?: any;
  type?: string;
  multiline?: boolean | undefined;
  classNames?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
  defaultValue?: string;
  placeholder?: string;
}
