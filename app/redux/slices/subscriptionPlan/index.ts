import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';

interface Feature {
  title: string;
  display_label: string;
}

interface Plan {
  id: number;
  name: string;
  description: string;
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
  features: Feature[];
  plan_type: string;
  slug: string;
}

interface PlansResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Plan[];
}

interface PlansState {
  plans: Plan[];
}

const initialState: PlansState = {
  plans: [],
};

export const fetchPlansList = createAsyncThunk<
  PlansResponse,
  string | undefined,
  { rejectValue: string }
>('plans/fetch', async (billingCycle = 'month', { rejectWithValue }) => {
  try {
    const response = await api.get<PlansResponse>(
      `${urlMapper.subscriptionPlan}?duration_unit=${billingCycle === 'month' ? process.env.NEXT_PUBLIC_BILLING_CYCLE_MONTH : process.env.NEXT_PUBLIC_BILLING_CYCLE_ANNUALLY}`
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || 'Failed to fetch plans.';
    return rejectWithValue(errorMessage);
  }
});

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPlansList.fulfilled, (state, action) => {
      state.plans = action.payload.results;
    });
  },
});

export default plansSlice.reducer;
