import * as Yup from 'yup';

import {
  firstNameSchema,
  passwordSchema,
  confirmPasswordSchema,
  emailSchema,
  contactNumberSchema,
  otpSchema,
  confirmNewPasswordSchema,
  currentPasswordSchema,
  newPassword1Schema,
  newPassword2Schema,
  feedbackBodySchema,
  lastNameSchema,
  summarySchema,
  aboutMeSchema,
} from './validationSchemas';

// Register Validation Schema
export const registrationValidationSchema = Yup.object({
  first_name: firstNameSchema,
  last_name: lastNameSchema,
  email: emailSchema,
  contact_number: contactNumberSchema,
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
  about_me: aboutMeSchema,
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
  new_password: passwordSchema,
  confirm_password: confirmNewPasswordSchema,
});

// Change Password Validation Schema If User Is Login
export const changePasswordUserLoginValidationSchema = Yup.object({
  old_password: currentPasswordSchema,
  new_password1: newPassword1Schema,
  new_password2: newPassword2Schema,
});

// Update User Validation Schema
export const updateUserValidationSchema = Yup.object({
  contact_number: contactNumberSchema,
  first_name: firstNameSchema,
  last_name: lastNameSchema,
  about_me: aboutMeSchema,
});

// Feedback Validation Schema
export const feedbackValidation = Yup.object({
  body: feedbackBodySchema,
});

export const editSummaryValidation = Yup.object({
  summary: summarySchema,
});
