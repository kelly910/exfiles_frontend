import * as Yup from 'yup';

const firstNameSchema: Yup.StringSchema = Yup.string().required(
  'First name is required'
);

const passwordSchema: Yup.StringSchema = Yup.string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters long')
  .matches(/[A-Z]/, 'Password must contain at least one capital letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .matches(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Password must contain at least one special character'
  );

const confirmPasswordSchema: Yup.StringSchema = Yup.string()
  .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
  .required('Password confirmation is required');

const emailSchema: Yup.StringSchema = Yup.string()
  .email('Invalid email address')
  .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Invalid email address')
  .required('Email is required');

const contactNumberSchema: Yup.StringSchema = Yup.string()
  .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Contact number is not valid')
  .required('Contact number is required');

const otpSchema: Yup.StringSchema = Yup.string()
  .matches(/^\d{4}$/, 'OTP must be exactly 4 digits')
  .required('OTP is required');

export {
  firstNameSchema,
  passwordSchema,
  emailSchema,
  confirmPasswordSchema,
  contactNumberSchema,
  otpSchema,
};
