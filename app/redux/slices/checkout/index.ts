import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';

interface CheckoutState {
  checkoutUrl: string | null;
}

const initialState: CheckoutState = {
  checkoutUrl: null,
};

interface CheckoutPayload {
  plan: string;
}

interface CheckoutResponse {
  messages: string[];
}

export const checkoutSession = createAsyncThunk<
  string,
  CheckoutPayload,
  { rejectValue: string }
>('checkout/createSession', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<CheckoutResponse>(
      urlMapper.checkoutPlan,
      payload
    );
    const url = response.data?.messages?.[0];
    if (!url) {
      throw new Error('No checkout URL found');
    }
    return url;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { messages?: string[] } } })?.response
        ?.data?.messages?.[0] || 'Failed to checkout session';
    return rejectWithValue(errorMessage);
  }
});

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(checkoutSession.fulfilled, (state, action) => {
      state.checkoutUrl = action.payload;
    });
  },
});

export default checkoutSlice.reducer;
