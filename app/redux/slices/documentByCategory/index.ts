import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';
import { showToast } from '@/app/shared/toast/ShowToast';

interface Tag {
  id: number;
  name: string;
}

interface Document {
  id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  tags: Tag[];
  upload_on: string;
  uuid: string;
}

interface DocumentListingResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Document[];
}

interface DocumentListingState {
  documents: Document[];
  count: number;
}

const initialState: DocumentListingState = {
  documents: [],
  count: 0,
};

export const fetchDocumentsByCategory = createAsyncThunk<
  DocumentListingResponse,
  { categoryId: number; search?: string; page?: number },
  { rejectValue: string }
>(
  'documents/fetchDocumentsByCategory',
  async ({ categoryId, search = '', page = 1 }, { rejectWithValue }) => {
    try {
      const searchQuery = `?search=${encodeURIComponent(search)}&page=${page}&page_size=12`;
      const response = await api.get<DocumentListingResponse>(
        `${urlMapper.getDocumentByCategory}${categoryId}${searchQuery}`
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { messages?: string[] } } })?.response
          ?.data?.messages?.[0] || 'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteDocumentByDocId = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('documents/deleteDocument', async (deletedId, { rejectWithValue }) => {
  try {
    const response = await api.delete<{ message: string[] }>(
      `${urlMapper.getDocumentSummary}${deletedId}/`
    );
    const successMessage =
      response.data.message?.[0] || 'Document deleted successfully.';
    showToast('success', successMessage);
    return deletedId;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { messages?: string[] } } })?.response
        ?.data?.messages?.[0] || 'Failed to delete the document.';
    return rejectWithValue(errorMessage);
  }
});

const documentListSlice = createSlice({
  name: 'documentListing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentsByCategory.fulfilled, (state, action) => {
        state.documents = action.payload.results;
        state.count = action.payload.count;
      })
      .addCase(deleteDocumentByDocId.fulfilled, (state, action) => {
        state.documents = state.documents.filter(
          (doc) => doc.id !== action.payload
        );
        state.count -= 1;
      });
  },
});

export default documentListSlice.reducer;
