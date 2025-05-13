import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';
import { DocumentEditSummary } from '@/app/components/Documents/DocumentSummary';

interface Tag {
  id: number;
  name: string;
}

interface EditSummaryResponse {
  id?: number;
  file_name: string;
  // file_path: string;
  file_type: string;
  description: string;
  upload_on: string;
  summary: string;
  ai_description: string;
  tags: Tag[];
}

interface EditSummaryState {
  document: EditSummaryResponse | null;
}

const initialState: EditSummaryState = {
  document: null,
};

export const editSummaryByDocId = createAsyncThunk<
  EditSummaryResponse,
  DocumentEditSummary,
  { rejectValue: string }
>('document/editSummary', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.patch<EditSummaryResponse>(
      `${urlMapper.getDocumentSummary}${payload.docId}/`,
      { summary: payload.summary }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { messages?: string[] } } })?.response
        ?.data?.messages?.[0] || 'Something went wrong. Please try again.';
    return rejectWithValue(errorMessage);
  }
});

const editSummarySlice = createSlice({
  name: 'editSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(editSummaryByDocId.fulfilled, (state, action) => {
      state.document = action.payload;
    });
  },
});

export default editSummarySlice.reducer;
