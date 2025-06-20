import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';

interface Payment {
  id: number;
  uuid: string;
  plan_name: string;
  plan_base_price: string;
  sales_tax_percentage: string;
  sales_tax_amount: string;
  amount: string;
  currency_code: string;
  status: string;
  plan_slug?: string;
  modified: string;
}

interface PaymentDetails {
  paymentData: Payment | null;
}

const initialState: PaymentDetails = {
  paymentData: null,
};

export const getPaymentDetailsByTransactionId = createAsyncThunk<
  Payment,
  string
>('invoice/getPaymentDetailsByTransactionId', async (transactionId) => {
  const response = await api.get<{ messages: string[]; data: Payment }>(
    `${urlMapper.getPaymentDetails}?transaction_id=${transactionId}`
  );
  return response.data.data;
});

const paymentDetailsDataSlice = createSlice({
  name: 'paymentDetailsData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getPaymentDetailsByTransactionId.fulfilled,
      (state, action) => {
        state.paymentData = action.payload;
      }
    );
  },
});

export default paymentDetailsDataSlice.reducer;
