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
  no_of_docs: number;
}

interface DocumentListingState {
  documents: Document[];
  allDocuments: Document[];
  count: number;
  no_of_docs: number;
}

const initialState: DocumentListingState = {
  documents: [],
  count: 0,
  allDocuments: [],
  no_of_docs: 0,
};

export const fetchDocumentsByCategory = createAsyncThunk<
  DocumentListingResponse,
  {
    categoryId: number;
    search?: string;
    page?: number;
    page_size?: number | 'all';
  },
  { rejectValue: string }
>(
  'documents/fetchDocumentsByCategory',
  async (
    { categoryId, search = '', page = 1, page_size = 12 },
    { rejectWithValue }
  ) => {
    try {
      const searchQuery = `?search=${encodeURIComponent(search)}&page=${page}&page_size=${page_size ?? 12}`;
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

export const renameDocuments = createAsyncThunk<
  Document,
  { uuid: number | string; file_name: string },
  { rejectValue: string }
>(
  'documents/renameDocuments',
  async ({ uuid, file_name }, { rejectWithValue }) => {
    try {
      const response = await api.patch<Document>(
        `${urlMapper.getDocumentSummary}${uuid}/`,
        { file_name }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { messages?: string[] } } })?.response
          ?.data?.messages?.[0] || 'Failed to rename document.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchAllDocuments = createAsyncThunk<
  DocumentListingResponse,
  {
    search?: string;
    page?: number;
    page_size?: number | 'all';
    created_before?: string;
    created_after?: string;
    category?: string;
  },
  { rejectValue: string }
>(
  'documents/fetchAllDocuments',
  async (
    {
      search = '',
      page = 1,
      page_size = 24,
      created_before,
      created_after,
      category,
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      if (search) params.append('search', search);
      if (page) params.append('page', String(page));
      if (page_size) params.append('page_size', String(page_size));
      if (created_before) params.append('created_before', created_before);
      if (created_after) params.append('created_after', created_after);
      if (category) params.append('category', category);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get<DocumentListingResponse>(
        `${urlMapper.getDocumentSummary}${queryString}`
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

export const downloadSelectedDocsReport = createAsyncThunk<
  void,
  {
    document_uuid?: string;
    created_before?: string;
    created_after?: string;
    category?: string;
    search?: string;
    type?: string;
  },
  { rejectValue: string }
>(
  'documents/downloadSelectedDocsReport',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${urlMapper.downloadDocReport}`,
        payload,
        {
          responseType: 'blob',
          validateStatus: () => true,
        }
      );

      if (response.status !== 200 && response.status === 403) {
        const errorText = await response.data.text();
        const fallbackMessage = 'Something went wrong. Please try again.';
        return rejectWithValue(errorText || fallbackMessage);
      }
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DocumentReport.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
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
      .addCase(fetchAllDocuments.fulfilled, (state, action) => {
        state.allDocuments = action.payload.results;
        state.no_of_docs = action.payload.no_of_docs;
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
