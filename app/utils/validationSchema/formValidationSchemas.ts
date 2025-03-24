import * as Yup from 'yup';

import {
  firstNameSchema,
  passwordSchema,
  confirmPasswordSchema,
  emailSchema,
  contactNumberSchema,
  otpSchema,
} from './validationSchemas';

// Register Validation Schema
export const registrationValidationSchema = Yup.object({
  first_name: firstNameSchema,
  email: emailSchema,
  contact_number: contactNumberSchema,
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
});

// OTP Verification Validation Schema
export const otpVerificationSchema = Yup.object({
  otp: otpSchema,
});

// Login Validation Schema
export const loginValidationSchema = Yup.object({
  email: emailSchema,
  password: passwordSchema,
});

// Forgot Password Validation Schema
export const forgotPasswordValidationSchema = Yup.object({
  email: emailSchema,
});

// Change Password Validation Schema
export const changePasswordValidationSchema = Yup.object({
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
});
