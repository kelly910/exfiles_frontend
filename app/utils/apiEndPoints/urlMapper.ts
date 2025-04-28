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
  logIncidents: `${BASE_URL}log-incidents/`,
  // Documents Module
  getCategories: `${BASE_URL}categories/`,
  getDocumentByCategory: `${BASE_URL}category-document/`,
  getDocumentSummary: `${BASE_URL}document/`,
  // Chat Module
  thread: `${BASE_URL}thread/`,
  pinnedMessages: `${BASE_URL}pinned-messages/`,
  togglePinMessages: `${BASE_URL}pin-unpin-message/`,
  uploadActualDoc: `${BASE_URL}upload-actual-document/`,
  chatMessage: `${BASE_URL}chat-message/`,
  chatAnswerReaction: `${BASE_URL}message-reaction/`,
  combinedSummary: `${BASE_URL}combined-summary/`,
};

export default urlMapper;
