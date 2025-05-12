export interface UploadFiles {
  file: File;
  progress: number;
  docDesc: string;
  isUploading: boolean;
  hasUploaded: boolean;
  fileId: string;
  controller?: AbortController;
  fileErrorMsg: string;
  hasError: boolean;
  uploadedFileId: string | number | null;
}

export type successChunkResponseType = {
  uploadedFileId: number | string;
  is_completed: boolean;
} | null;
