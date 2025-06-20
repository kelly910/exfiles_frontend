import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';

import {
  ALLOWED_FILE_TYPES,
  FILE_UPLOAD_CHUNK_SIZE,
} from '@/app/utils/constants';
import { computeChecksum } from '@/app/utils/functions';
import {
  addUploadFiles,
  markUploadCompleted,
  markUploadError,
  selectUserUploadedFiles,
  updateUploadProgress,
} from '@/app/redux/slices/fileUpload';

import {
  successChunkResponseType,
  UploadFiles,
} from '@/app/redux/slices/fileUpload/fileUploadTypes';
import { showToast } from '@/app/shared/toast/ShowToast';

export const useChunkedFileUpload = () => {
  const dispatch = useAppDispatch();
  const uploadedFiles = useAppSelector(selectUserUploadedFiles);

  const storedUser =
    typeof window !== 'undefined' ? localStorage.getItem('loggedInUser') : null;

  const uploadFileInChunks = useCallback(
    async (fileData: UploadFiles) => {
      const { file, controller, fileId } = fileData;
      const totalChunks = Math.ceil(file.size / FILE_UPLOAD_CHUNK_SIZE);
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const token: string | null = parsedUser?.data?.token || null;

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/upload-temporary-document/`;

      let documentId: string | null = null;
      let uploadedSize = 0;
      let successChunkResponse: successChunkResponseType = null;

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * FILE_UPLOAD_CHUNK_SIZE;
        const end = Math.min(start + FILE_UPLOAD_CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);
        const checkSUM = await computeChecksum(chunk);

        const filename = file.name.split('.')[0];
        const fileParts = file.name.split('.');
        const fileExtension = (fileParts.pop() || '').toLowerCase();

        const formData = new FormData();
        formData.append('document', chunk);
        formData.append('extension', fileExtension);
        formData.append('file_name', filename);
        formData.append('chunk_index', chunkIndex.toString());
        formData.append('total_index', totalChunks.toString());
        formData.append('file_size', file.size.toString());
        formData.append('checksum', checkSUM);

        try {
          const apiURI: string = documentId
            ? `${apiUrl}${documentId}/`
            : apiUrl;
          const response = await fetch(apiURI, {
            method: chunkIndex === 0 ? 'POST' : 'PUT',
            body: formData,
            signal: controller?.signal,
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          const data = await response.json();

          if (chunkIndex === 0 && data.id) {
            documentId = data.id;
          } else if (chunkIndex === 0 && !data.id) {
            if (
              data.messages[0].document[0] ===
              'Uploaded document is empty, Please upload a valid document.'
            ) {
              showToast('error', data.messages[0].document[0]);
            }
            throw new Error('Failed to get document ID');
          }

          uploadedSize += chunk.size;
          const progress = Math.round((uploadedSize / file.size) * 100);
          dispatch(updateUploadProgress({ fileId, progress }));

          if (data.is_completed) {
            successChunkResponse = {
              uploadedFileId: data.id,
              is_completed: true,
            };
            dispatch(markUploadCompleted({ fileId, uploadedFileId: data.id }));
            return successChunkResponse;
          }
        } catch (error) {
          console.error(`Error uploading chunk ${chunkIndex}`, error);
          // dispatch(markUploadError({ fileId, error: error.message }));
          if (error instanceof Error) {
            dispatch(markUploadError({ fileId, error: error.message }));
          } else {
            dispatch(markUploadError({ fileId, error: String(error) }));
          }
          return false;
        }
      }

      return true;
    },
    [dispatch, storedUser]
  );

  const handleFiles = (files: File[] | FileList | null) => {
    if (!files) return;

    const fileArray: File[] = Array.from(files);
    const maxFiles =
      Number(process.env.NEXT_PUBLIC_MAX_FILE_UPLOAD_LIMIT_AT_ONCE) || 10;

    const remainingSlots = maxFiles - uploadedFiles.length;

    if (remainingSlots <= 0) {
      showToast('error', 'You can only upload up to 10 files.');
      return;
    }

    if (fileArray.length > remainingSlots) {
      showToast('error', `You can only upload ${remainingSlots} more file(s).`);
    }
    // const newFiles: File[] = fileArray.slice(0, remainingSlots);

    const newFiles: File[] = fileArray
      .slice(0, remainingSlots)
      .filter((file) => {
        const alreadyUploaded = uploadedFiles.some(
          (uf) => uf.file.name === file.name && uf.file.size === file.size
        );
        return !alreadyUploaded;
      });

    const uploadFilesPayload: UploadFiles[] = newFiles.map((file) => {
      const fileParts = file.name.split('.');
      const fileExtension = '.' + fileParts.pop()?.toLowerCase();
      const isValidExtension = ALLOWED_FILE_TYPES.includes(fileExtension);
      const fileId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

      return {
        file,
        progress: 0,
        isUploading: isValidExtension,
        hasUploaded: false,
        controller: new AbortController(),
        fileId,
        docDesc: '',
        uploadedFileId: null,
        fileErrorMsg: isValidExtension ? '' : 'Invalid file extension',
        hasError: !isValidExtension,
      };
    });

    dispatch(addUploadFiles(uploadFilesPayload));

    uploadFilesPayload
      .filter((f) => !f.hasError)
      .forEach((fileData) => {
        uploadFileInChunks(fileData);
      });
  };

  return {
    handleFiles,
  };
};
