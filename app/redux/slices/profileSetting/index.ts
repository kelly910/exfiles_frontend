import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';

interface ProfileSettingState {
  successMessage: string | null;
  isLoggedOut: boolean;
}

const initialState: ProfileSettingState = {
  successMessage: null,
  isLoggedOut: false,
};

export const deleteAccount = createAsyncThunk<string, { otp: number }>(
  'profileSetting/deleteAccount',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.delete(urlMapper.deleteAccount, {
        data: payload,
      });
      if (response.data?.messages?.length > 0) {
        return response.data.messages[0];
      }
      return rejectWithValue('Account deletion not successful.');
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: string } };
        return rejectWithValue(
          err.response?.data || 'Something wend wrong. Please try again.'
        );
      }
      return rejectWithValue('Something wend wrong. Please try again.');
    }
  }
);

export const logout = createAsyncThunk<void, void>(
  'profileSetting/logout',
  async () => {
    await api.post(urlMapper.logout);
  }
);

const profileSettingSlice = createSlice({
  name: 'profileSetting',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        deleteAccount.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.successMessage = action.payload;
        }
      )
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedOut = true;
      });
  },
});

export default profileSettingSlice.reducer;
