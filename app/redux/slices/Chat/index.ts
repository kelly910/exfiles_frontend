import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/app/utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';

import {
  GetMessagesByThreadIdPayload,
  GetMessagesByThreadIdResponse,
  ThreadCreationPayload,
  ThreadCreationResponse,
  UploadDocsPayload,
  UploadDocsResponse,
} from './chatTypes';

const initialState = {};

export const createNewThread = createAsyncThunk<
  ThreadCreationResponse,
  ThreadCreationPayload,
  { rejectValue: string }
>('chat/createNewThread', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<ThreadCreationResponse>(
      urlMapper.thread,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: string } };
      return rejectWithValue(
        err.response?.data || 'Something went wrong. Please try again.'
      );
    }
    return rejectWithValue('Something went wrong. Please try again.');
  }
});

export const uploadActualDocs = createAsyncThunk<
  UploadDocsResponse,
  UploadDocsPayload,
  { rejectValue: string }
>('chat/uploadActualDocs', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<UploadDocsResponse>(
      urlMapper.uploadActualDoc,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: string } };
      return rejectWithValue(
        err.response?.data || 'Something went wrong. Please try again.'
      );
    }
    return rejectWithValue('Something went wrong. Please try again.');
  }
});

/* ------------ Chat Messages Actions Start ------------------ */
export const fetchThreadMessagesByThreadId = createAsyncThunk<
  GetMessagesByThreadIdResponse,
  GetMessagesByThreadIdPayload,
  { rejectValue: string }
>(
  'chat/fetchThreadMessagesByThreadId',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.get<GetMessagesByThreadIdResponse>(
        `${urlMapper.chatMessage}${payload.thread_uuid}/`
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
/* ------------ Chat Messages Actions End ------------------ */

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: () => {},
});

export default chatSlice.reducer;
