import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';

interface RegisterUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  contact_number: string;
  about_me: string;
}

interface RegisterUserResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  user_type: string;
  is_email_verified: boolean;
  about_me: string;
}

interface SendOtpPayload {
  email: string;
  otp_type: string;
}

interface VerifyOtpPayload {
  email: string;
  otp_type: string;
  otp: number;
  new_plan_uuid?: string;
}

interface RegisterState {
  user: RegisterUserResponse | null;
  otpSent: boolean;
  otpVerified: boolean;
}

const initialState: RegisterState = {
  user: null,
  otpSent: false,
  otpVerified: false,
};

export const registerUser = createAsyncThunk<
  RegisterUserResponse,
  RegisterUserPayload,
  { rejectValue: string }
>('register/user', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<RegisterUserResponse>(
      urlMapper.register,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: string } };
      return rejectWithValue(
        err.response?.data || 'Something went wrong. Please try again.'
      );
    }
    return rejectWithValue('Something went wrong. Please try again.');
  }
});

export const sendOtp = createAsyncThunk<
  void,
  SendOtpPayload,
  { rejectValue: string }
>('register/sendOtp', async (payload, { rejectWithValue }) => {
  try {
    await api.post(urlMapper.sendOtp, payload);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: string } };
      return rejectWithValue(
        err.response?.data || 'Failed to send OTP. Please try again.'
      );
    }
    return rejectWithValue('Failed to send OTP. Please try again.');
  }
});

export const verifyOtp = createAsyncThunk<
  { messages: { otp_verified: boolean }[] },
  VerifyOtpPayload,
  { rejectValue: string }
>('register/verifyOtp', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<{ messages: { otp_verified: boolean }[] }>(
      urlMapper.verifyOtp,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: string } };
      return rejectWithValue(
        err.response?.data || 'Failed to verify OTP. Please try again.'
      );
    }
    return rejectWithValue('Failed to verify OTP. Please try again.');
  }
});

export const upgradePlanVerification = createAsyncThunk<
  { messages: string[] },
  VerifyOtpPayload,
  { rejectValue: string }
>('plan/upgradeSubscription', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<{ messages: string[] }>(
      urlMapper.upgradeSubscription,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: string } };
      return rejectWithValue(
        err.response?.data || 'Failed to verify OTP. Please try again.'
      );
    }
    return rejectWithValue('Failed to verify OTP. Please try again.');
  }
});

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      registerUser.fulfilled,
      (state, action: PayloadAction<RegisterUserResponse>) => {
        state.user = action.payload;
      }
    );
    builder.addCase(sendOtp.fulfilled, (state) => {
      state.otpSent = true;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      const otpVerified = action.payload?.messages?.[0]?.otp_verified || false;
      state.otpVerified = otpVerified;
    });
  },
});

export default registerSlice.reducer;
