import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';
import { FeedbackFormValues } from '@/app/components/FeedBackDialog/FeedBackDialog';

interface UserFeedbackState {
  feedbackGiven: boolean;
}

const initialState: UserFeedbackState = {
  feedbackGiven: false,
};

interface UserFeedbackResponse {
  messages?: string;
}

export const feedback = createAsyncThunk<
  UserFeedbackResponse,
  FeedbackFormValues,
  { rejectValue: string }
>('user/feedback', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<UserFeedbackResponse>(
      urlMapper.feedback,
      payload
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { messages?: string[] } } })?.response
        ?.data?.messages?.[0] || 'Something went wrong. Please try again.';
    return rejectWithValue(errorMessage);
  }
});

const userFeedbackSlice = createSlice({
  name: 'userFeedback',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(feedback.fulfilled, (state) => {
      state.feedbackGiven = true;
    });
  },
});

export default userFeedbackSlice.reducer;
