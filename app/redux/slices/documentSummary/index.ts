import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';

interface Tag {
  id: number;
  name: string;
}

interface DocumentSummary {
  id: number;
  file_name: string;
  tags: Tag[];
  upload_on: string;
  ai_description: string;
  description: string;
  summary: string;
  uuid?: string;
}

interface DocumentSummaryState {
  documentSummary: DocumentSummary | null;
}

const initialState: DocumentSummaryState = {
  documentSummary: null,
};

export const fetchDocumentSummaryById = createAsyncThunk<
  DocumentSummary,
  string
>('documents/fetchDocumentSummaryById', async (docId) => {
  const response = await api.get<DocumentSummary>(
    `${urlMapper.getDocumentSummary}${docId}/`
  );
  return response.data;
});

const documentSummarySlice = createSlice({
  name: 'documentSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDocumentSummaryById.fulfilled, (state, action) => {
      state.documentSummary = action.payload;
    });
  },
});

export default documentSummarySlice.reducer;
