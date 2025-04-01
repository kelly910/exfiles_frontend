export const BASE_URL = '/api/v1/';

const urlMapper = {
  register: `${BASE_URL}users/`,
  login: `${BASE_URL}login/`,
  sendOtp: `${BASE_URL}send-otp/`,
  verifyOtp: `${BASE_URL}verify-otp/`,
  forgotPassword: `${BASE_URL}forget-password/`,
  resetPassword: `${BASE_URL}reset-password/`,
  googleLogin: `${BASE_URL}social-login/google/`,
  deleteAccount: `${BASE_URL}delete-account/`,
  logout: `${BASE_URL}logout/`,
  updateUser: `${BASE_URL}users/`,
  changePassword: `${BASE_URL}change-password/`,
  feedback: `${BASE_URL}feedback/`,
};

export default urlMapper;
