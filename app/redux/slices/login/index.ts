import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';
import { NewPasswordFormValues } from '@/app/components/New-Password/NewPassword';
import { ForgotPasswordFormValues } from '@/app/components/Forgot-Password/ForgotPassword';

interface ForgotPasswordState {
  forgotPasswordEmailSent: boolean;
  changePassword: boolean;
}

export interface ForgotPasswordResponse {
  messages: string[];
}

export interface ChangePasswordResponse {
  messages: string[];
}

const initialState: ForgotPasswordState = {
  forgotPasswordEmailSent: false,
  changePassword: false,
};

export const forgotPassword = createAsyncThunk<
  ForgotPasswordResponse,
  ForgotPasswordFormValues,
  { rejectValue: string }
>('login/forgotPassword', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post(urlMapper.forgotPassword, payload);
    return response.data;
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

export const resetPassword = createAsyncThunk<
  ChangePasswordResponse,
  NewPasswordFormValues,
  { rejectValue: string }
>('login/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post(urlMapper.resetPassword, payload);
    return response.data;
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

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.forgotPasswordEmailSent = true;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.changePassword = true;
    });
  },
});

export default loginSlice.reducer;
