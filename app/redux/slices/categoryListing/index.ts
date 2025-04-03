import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';

interface CategoryListing {
  id: number;
  name: string;
  no_of_docs: number;
}

interface CategoryListingState {
  categories: CategoryListing[];
  no_of_docs: number;
}

const initialState: CategoryListingState = {
  categories: [],
  no_of_docs: 0,
};

interface DocumentListingResponse {
  results: CategoryListing[];
  no_of_docs: number;
}

export const fetchCategories = createAsyncThunk<
  DocumentListingResponse,
  void,
  { rejectValue: string }
>('documents/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<DocumentListingResponse>(
      urlMapper.getCategories
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { messages?: string[] } } })?.response
        ?.data?.messages?.[0] || 'Something went wrong. Please try again.';
    return rejectWithValue(errorMessage);
  }
});

const categoryListingSlice = createSlice({
  name: 'categoryListing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload.results;
      state.no_of_docs = action.payload.no_of_docs;
    });
  },
});

export default categoryListingSlice.reducer;
