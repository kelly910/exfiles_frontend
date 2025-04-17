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
  nextPage: number | null;
  isFetching: boolean;
  count: number;
}

const initialState: CategoryListingState = {
  categories: [],
  no_of_docs: 0,
  nextPage: 1,
  isFetching: false,
  count: 0,
};

interface DocumentListingResponse {
  results: CategoryListing[];
  no_of_docs: number;
  next: string | null;
  count: number;
}

interface FetchCategoriesArgs {
  page: number;
}

export const fetchCategories = createAsyncThunk<
  DocumentListingResponse,
  FetchCategoriesArgs,
  { rejectValue: string }
>('documents/fetchCategories', async ({ page }, { rejectWithValue }) => {
  try {
    const response = await api.get<DocumentListingResponse>(
      `${urlMapper.getCategories}?page=${page}&page_size=20`
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { messages?: string[] } } })?.response
        ?.data?.messages?.[0] || 'Something went wrong. Please try again.';
    return rejectWithValue(errorMessage);
  }
});

export const renameCategory = createAsyncThunk<
  CategoryListing,
  { id: number; name: string },
  { rejectValue: string }
>('documents/renameCategory', async ({ id, name }, { rejectWithValue }) => {
  try {
    const response = await api.put<CategoryListing>(
      `${urlMapper.getCategories}${id}/`,
      { name }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { messages?: string[] } } })?.response
        ?.data?.messages?.[0] || 'Failed to rename category.';
    return rejectWithValue(errorMessage);
  }
});

const categoryListingSlice = createSlice({
  name: 'categoryListing',
  initialState,
  reducers: {
    resetCategories: (state) => {
      state.categories = [];
      state.no_of_docs = 0;
      state.nextPage = 1;
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isFetching = false;
        const newCategories = action.payload.results.filter(
          (newCat) => !state.categories.some((cat) => cat.id === newCat.id)
        );
        if (action.meta.arg.page === 1) {
          state.categories = action.payload.results;
        } else {
          state.categories = [...state.categories, ...newCategories];
        }
        state.no_of_docs = action.payload.no_of_docs;
        state.nextPage = action.payload.next ? action.meta.arg.page + 1 : null;
        state.count = action.payload.count;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(renameCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index].name = action.payload.name;
        }
      });
  },
});

export const { resetCategories } = categoryListingSlice.actions;
export default categoryListingSlice.reducer;
