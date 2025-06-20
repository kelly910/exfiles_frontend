import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';

export interface OrderSummaryFeature {
  title: string;
  display_label: string;
}

export interface OrderSummary {
  id: number;
  name: string;
  description: string | null;
  best_for: string;
  is_trial: boolean;
  status: number;
  activate_date: string;
  deactivate_date: string | null;
  amount: string;
  trial_days: number;
  duration_unit: string;
  duration_value: number;
  currency: string;
  features: OrderSummaryFeature[];
  sales_tax: number;
  total_payable_amount: number;
  plan_price: number;
  slug: string;
}

export interface OrderSummaryResponse {
  messages: string[];
  data: OrderSummary;
}

export const fetchOrderSummaryById = createAsyncThunk<
  OrderSummaryResponse,
  number,
  { rejectValue: string }
>('orderSummary/fetchById', async (planId, { rejectWithValue }) => {
  try {
    const response = await api.get<OrderSummaryResponse>(
      `${urlMapper.orderSummaryDetails}${planId}/`
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || 'Failed to fetch order summary.';
    return rejectWithValue(errorMessage);
  }
});

interface OrderSummaryState {
  orderDetail: OrderSummary | null;
}

const initialState: OrderSummaryState = {
  orderDetail: null,
};

const orderSummarySlice = createSlice({
  name: 'orderSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrderSummaryById.fulfilled, (state, action) => {
      state.orderDetail = action.payload.data;
    });
  },
});

export default orderSummarySlice.reducer;
