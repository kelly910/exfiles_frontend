import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';
import { NewPasswordFormValues } from '@/app/components/New-Password/NewPassword';
import { ForgotPasswordFormValues } from '@/app/components/Forgot-Password/ForgotPassword';
import { showToast } from '@/app/shared/toast/ShowToast';
import { UpdateUserFormValues } from '@/app/components/UserSetting/MyProfile';

interface ForgotPasswordState {
  forgotPasswordEmailSent: boolean;
  changePassword: boolean;
  loggedInUser: LoginResponse | null;
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
  loggedInUser: null,
};

interface SocialGoogleLoginPayload {
  access_token: string;
}
export interface SocialGoogleLoginResponse {
  messages: string[];
  data: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    user_type: string;
    is_email_verified: boolean;
    token: string;
  };
}

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  messages: string[];
  data: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    user_type: string;
    is_email_verified: boolean;
    token: string;
  };
}

interface UpdateProfileResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  user_type: string;
  is_email_verified: boolean;
}

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>('login/loginUser', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<LoginResponse>(urlMapper.login, payload);
    showToast('success', 'Login is successfully.');
    return response.data;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: string } };
      return rejectWithValue(
        err.response?.data || 'Login failed. Please try again.'
      );
    }
    return rejectWithValue('Login failed. Please try again.');
  }
});

export const getUserById = createAsyncThunk<
  UpdateProfileResponse,
  number,
  { rejectValue: string }
>('login/getUserById', async (userId, { rejectWithValue }) => {
  try {
    const response = await api.get<UpdateProfileResponse>(
      `${urlMapper.updateUser}${userId}/`
    );
    return response.data;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: string } };
      return rejectWithValue(
        err.response?.data || 'Failed to fetch user details. Please try again.'
      );
    }
    return rejectWithValue('Failed to fetch user details. Please try again.');
  }
});

export const updateProfile = createAsyncThunk<
  UpdateProfileResponse,
  UpdateUserFormValues,
  { rejectValue: string }
>('login/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.patch<UpdateProfileResponse>(
      `${urlMapper.updateUser}${payload.id}/`,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: string } };
      return rejectWithValue(
        err.response?.data || 'Profile update failed. Please try again.'
      );
    }
    return rejectWithValue('Profile update failed. Please try again.');
  }
});

export const socialGoogleLogin = createAsyncThunk<
  SocialGoogleLoginResponse,
  SocialGoogleLoginPayload,
  { rejectValue: string }
>('login/googleLogin', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<SocialGoogleLoginResponse>(
      urlMapper.googleLogin,
      payload
    );
    showToast('success', 'Google Login is successfully.');
    return response.data;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: string } };
      return rejectWithValue(
        err.response?.data || 'Google login failed. Please try again.'
      );
    }
    return rejectWithValue('Google login failed. Please try again.');
  }
});

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
        err.response?.data || 'Something went wrong. Please try again.'
      );
    }
    return rejectWithValue('Something went wrong. Please try again.');
  }
});

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      socialGoogleLogin.fulfilled,
      (state, action: PayloadAction<SocialGoogleLoginResponse>) => {
        state.loggedInUser = {
          messages: action.payload.messages,
          data: action.payload.data,
        };
      }
    );
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<LoginResponse>) => {
        state.loggedInUser = action.payload;
      }
    );
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.forgotPasswordEmailSent = true;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.changePassword = true;
    });
    builder.addCase(
      updateProfile.fulfilled,
      (state, action: PayloadAction<UpdateProfileResponse>) => {
        if (state.loggedInUser) {
          state.loggedInUser = {
            ...state.loggedInUser,
            data: {
              ...state.loggedInUser.data,
              first_name: action.payload.first_name,
              last_name: action.payload.last_name,
              contact_number: action.payload.contact_number,
            },
          };
          localStorage.setItem(
            'loggedInUser',
            JSON.stringify(state.loggedInUser)
          );
        }
      }
    );
  },
});

export default loginSlice.reducer;
