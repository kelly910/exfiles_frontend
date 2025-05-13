import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';
import { showToast } from '@/app/shared/toast/ShowToast';

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
  can_download_summary_pdf?: string;
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

export const downloadSummaryById = createAsyncThunk<DocumentSummary, string>(
  'documents/downloadSummaryById',
  async (docId) => {
    const response = await api.get(
      `${urlMapper.generatedDownloadSummary}${docId}/`,
      {
        responseType: 'arraybuffer',
      }
    );
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `summary_${docId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    showToast('success', 'Document summary downloaded successfully');
    return response.data;
  }
);

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
