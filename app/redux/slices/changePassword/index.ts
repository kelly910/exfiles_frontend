import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';
import { ChangePasswordFormValues } from '@/app/components/UserSetting/ChangeUserPassword';

interface ForgotPasswordState {
  changePassword: boolean;
}

const initialState: ForgotPasswordState = {
  changePassword: false,
};

interface ChangePasswordResponse {
  detail?: string;
}

export const changeUserPassword = createAsyncThunk<
  ChangePasswordResponse,
  ChangePasswordFormValues,
  { rejectValue: string }
>('password/changePassword', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post(urlMapper.changePassword, payload);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      (error as { response?: { data?: string } })?.response?.data ||
        'Password change failed. Please try again.'
    );
  }
});

const changePasswordSlice = createSlice({
  name: 'changePassword',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(changeUserPassword.fulfilled, (state) => {
      state.changePassword = true;
    });
  },
});

export default changePasswordSlice.reducer;
