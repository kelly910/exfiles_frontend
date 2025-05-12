import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadFiles } from './fileUploadTypes';
import { RootState } from '../../store';

interface FileUploadSliceInitialState {
  uploadFiles: UploadFiles[];
}

const initialState: FileUploadSliceInitialState = {
  uploadFiles: [],
};

const fileUploadSlice = createSlice({
  name: 'file-upload-slice',
  initialState,
  reducers: {
    addUploadFiles(state, action: PayloadAction<UploadFiles[]>) {
      state.uploadFiles = [...action.payload, ...state.uploadFiles];
    },
    updateUploadProgress(
      state,
      action: PayloadAction<{ fileId: string; progress: number }>
    ) {
      const file = state.uploadFiles.find(
        (f) => f.fileId === action.payload.fileId
      );
      if (file) file.progress = action.payload.progress;
    },
    markUploadCompleted(
      state,
      action: PayloadAction<{ fileId: string; uploadedFileId: string }>
    ) {
      const file = state.uploadFiles.find(
        (f) => f.fileId === action.payload.fileId
      );
      if (file) {
        file.hasUploaded = true;
        file.uploadedFileId = action.payload.uploadedFileId;
      }
    },
    markUploadError(
      state,
      action: PayloadAction<{ fileId: string; error: string }>
    ) {
      const file = state.uploadFiles.find(
        (f) => f.fileId === action.payload.fileId
      );
      if (file) {
        file.hasError = true;
        file.fileErrorMsg = action.payload.error;
      }
    },
    updateFileDescription(
      state,
      action: PayloadAction<{ fileId: string; docDesc: string }>
    ) {
      const file = state.uploadFiles.find(
        (f) => f.fileId === action.payload.fileId
      );
      if (file) {
        file.docDesc = action.payload.docDesc;
      }
    },
    removeUploadFile(state, action: PayloadAction<{ fileId: string }>) {
      const file = state.uploadFiles.find(
        (f) => f.fileId === action.payload.fileId
      );
      if (file?.controller) {
        file.controller.abort();
      }
      state.uploadFiles = state.uploadFiles.filter(
        (f) => f.fileId !== action.payload.fileId
      );
    },
    resetUploadedFiles(state) {
      state.uploadFiles = initialState.uploadFiles;
    },
  },
});

export const selectUserUploadedFiles = (state: RootState) =>
  state.fileUpload.uploadFiles;

export const {
  addUploadFiles,
  updateUploadProgress,
  markUploadCompleted,
  markUploadError,
  removeUploadFile,
  updateFileDescription,
  resetUploadedFiles,
} = fileUploadSlice.actions;

export default fileUploadSlice.reducer;
