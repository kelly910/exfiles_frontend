import * as Yup from 'yup';

const firstNameSchema: Yup.StringSchema = Yup.string()
  .matches(/^[A-Za-z]+$/, 'Only letters are allowed, no spaces')
  .required('First name is required');

const lastNameSchema: Yup.StringSchema = Yup.string().matches(
  /^[A-Za-z]+$/,
  'Only letters are allowed, no spaces'
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

const confirmNewPasswordSchema: Yup.StringSchema = Yup.string()
  .oneOf([Yup.ref('new_password'), undefined], 'Passwords must match')
  .required('Password confirmation is required');

const emailSchema: Yup.StringSchema = Yup.string()
  .email('Invalid email address')
  .matches(
    /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    'Email contains invalid characters'
  )
  .required('Email is required');

const contactNumberSchema: Yup.StringSchema = Yup.string()
  .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Contact number is not valid')
  .required('Contact number is required');

const otpSchema: Yup.StringSchema = Yup.string()
  .matches(/^\d{4}$/, 'OTP must be exactly 4 digits')
  .required('OTP is required');

const currentPasswordSchema: Yup.StringSchema = Yup.string()
  .required('Current Password is required')
  .min(8, 'Current Password must be at least 8 characters long')
  .matches(/[A-Z]/, 'Current Password must contain at least one capital letter')
  .matches(/[0-9]/, 'Current Password must contain at least one number')
  .matches(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Current Password must contain at least one special character'
  );

const newPassword1Schema: Yup.StringSchema = Yup.string()
  .required('New Password is required')
  .min(8, 'New Password must be at least 8 characters long')
  .matches(/[A-Z]/, 'New Password must contain at least one capital letter')
  .matches(/[0-9]/, 'New Password must contain at least one number')
  .matches(
    /[!@#$%^&*(),.?":{}|<>]/,
    'New Password must contain at least one special character'
  );

const newPassword2Schema: Yup.StringSchema = Yup.string()
  .oneOf([Yup.ref('new_password1'), undefined], 'Passwords must match')
  .required('Password confirmation is required');

const feedbackBodySchema: Yup.StringSchema = Yup.string()
  .max(200, 'Feedback must be at most 200 characters')
  .required('Please write your feedback here');

const aboutMeSchema: Yup.StringSchema = Yup.string()
  .max(255, 'Info must be at most 255 characters')
  .required('Please write here about yourself');

const summarySchema: Yup.StringSchema = Yup.string().required(
  'Please write your summary here'
);

export {
  firstNameSchema,
  lastNameSchema,
  passwordSchema,
  emailSchema,
  confirmPasswordSchema,
  contactNumberSchema,
  otpSchema,
  confirmNewPasswordSchema,
  currentPasswordSchema,
  newPassword1Schema,
  newPassword2Schema,
  feedbackBodySchema,
  summarySchema,
  aboutMeSchema,
};
