import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';
import { NewPasswordFormValues } from '@/app/components/New-Password/NewPassword';
import { ForgotPasswordFormValues } from '@/app/components/Forgot-Password/ForgotPassword';
import { showToast } from '@/app/shared/toast/ShowToast';
import { UpdateUserFormValues } from '@/app/components/UserSetting/MyProfile';

const initialState = {};

interface ThreadCreationPayload {
  name: string | null;
}

interface ThreadCreationResponse {
  data: {
    id: number;
    uuid: string;
    name: string;
    created: 
    contact_number: string;
    user_type: string;
    is_email_verified: boolean;
    token: string;
  };
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


const loginSlice = createSlice({
  name: 'chat',
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
