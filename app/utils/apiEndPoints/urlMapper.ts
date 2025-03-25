export const BASE_URL = '/api/v1/';

const urlMapper = {
  register: `${BASE_URL}users/`,
  login: `${BASE_URL}login/`,
  sendOtp: `${BASE_URL}send-otp/`,
  verifyOtp: `${BASE_URL}verify-otp/`,
  forgotPassword: `${BASE_URL}forget-password/`,
  resetPassword: `${BASE_URL}reset-password/`,
  googleLogin: `${BASE_URL}social-login/google/`,
};

export default urlMapper;
