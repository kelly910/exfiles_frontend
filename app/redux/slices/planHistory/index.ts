import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';

export interface PlanHistoryList {
  id: number;
  plan_name: string;
  duration_value: string;
  duration_unit: string;
  activate_date: string;
  payment_method: string;
  amount: string;
  payment_invoice_link: string;
  status: number;
}

interface PlanHistoryState {
  planHistoryData: PlanHistoryList[];
}

const initialState: PlanHistoryState = {
  planHistoryData: [],
};

export const fetchPlanHistory = createAsyncThunk<
  PlanHistoryList[],
  { page_size?: string },
  { rejectValue: string }
>('planHistory/fetch', async ({ page_size = 'all' }, { rejectWithValue }) => {
  try {
    const response = await api.get<PlanHistoryList[]>(
      `${urlMapper.planHistory}`,
      {
        params: { page_size },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || 'Failed to fetch plan history.';
    return rejectWithValue(errorMessage);
  }
});

const planHistorySlice = createSlice({
  name: 'planHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPlanHistory.fulfilled, (state, action) => {
      state.planHistoryData = action.payload;
    });
  },
});

export default planHistorySlice.reducer;
