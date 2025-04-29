import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';

export interface FileData {
  file_url: string;
}

export interface TagList {
  id: string;
  name: string;
  file_data: FileData | null;
}

export interface TagListResponse {
  data: TagList[];
}

interface TagListState {
  tags: TagList[];
}

const initialState: TagListState = {
  tags: [],
};

export const fetchTagList = createAsyncThunk<
  TagListResponse,
  void,
  { rejectValue: string }
>('tagList/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<TagListResponse>(`${urlMapper.tagList}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || 'Failed to fetch tags.';
    return rejectWithValue(errorMessage);
  }
});

const tagListingSlice = createSlice({
  name: 'tagList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTagList.fulfilled, (state, action) => {
      state.tags = action.payload.data;
    });
  },
});

export default tagListingSlice.reducer;
