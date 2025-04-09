import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/app/utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';

import {
  FetchThreadListParams,
  GetMessagesByThreadIdPayload,
  GetMessagesByThreadIdResponse,
  GetThreadListResponse,
  PinnedAnswerToggleParams,
  PinnedAnswerToggleResponse,
  ThreadCreationPayload,
  ThreadCreationResponse,
  ThreadEditPayload,
  UploadDocsPayload,
  UploadDocsResponse,
} from './chatTypes';

const initialState = {};

export const fetchThreadList = createAsyncThunk<
  GetThreadListResponse,
  FetchThreadListParams | undefined,
  { rejectValue: string }
>('chat/fetchThreadList', async (payload, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();

    if (payload?.page !== undefined) {
      params.append('page', payload.page.toString());
    }

    if (payload?.page_size !== undefined) {
      params.append('page_size', payload.page_size.toString());
    }

    if (payload?.search) {
      params.append('search', payload.search);
    }

    const response = await api.get<GetThreadListResponse>(
      `${urlMapper.thread}?${params.toString()}`
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { messages?: string[] } } })?.response
        ?.data?.messages?.[0] || 'Something went wrong. Please try again.';
    return rejectWithValue(errorMessage);
  }
});

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

export const renameNewThread = createAsyncThunk<
  ThreadCreationResponse,
  ThreadEditPayload,
  { rejectValue: string }
>('chat/renameNewThread', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.patch<GetMessagesByThreadIdResponse>(
      `${urlMapper.thread}${payload.thread_uuid}/`,
      { name: payload.name }
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

export const deleteThread = createAsyncThunk<
  GetMessagesByThreadIdResponse,
  GetMessagesByThreadIdPayload,
  { rejectValue: string }
>('chat/deleteThread', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.delete<GetMessagesByThreadIdResponse>(
      `${urlMapper.thread}${payload.thread_uuid}/`
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { messages?: string[] } } })?.response
        ?.data?.messages?.[0] || 'Something went wrong. Please try again.';
    return rejectWithValue(errorMessage);
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

/* ------------ Pinned Chat Messages Actions Start ------------------ */
export const fetchPinnedMessagesList = createAsyncThunk<
  GetThreadListResponse,
  FetchThreadListParams | undefined,
  { rejectValue: string }
>('chat/fetchPinnedMessagesList', async (payload, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();

    if (payload?.page !== undefined) {
      params.append('page', payload.page.toString());
    }

    if (payload?.page_size !== undefined) {
      params.append('page_size', payload.page_size.toString());
    }

    if (payload?.search) {
      params.append('search', payload.search);
    }

    const response = await api.get<GetThreadListResponse>(
      `${urlMapper.pinnedMessages}?${params.toString()}`
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { messages?: string[] } } })?.response
        ?.data?.messages?.[0] || 'Something went wrong. Please try again.';
    return rejectWithValue(errorMessage);
  }
});

export const togglePinMessages = createAsyncThunk<
  PinnedAnswerToggleResponse,
  PinnedAnswerToggleParams,
  { rejectValue: string }
>('chat/togglePinMessages', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<PinnedAnswerToggleResponse>(
      `${urlMapper.togglePinMessages}${payload.message_uuid}/`
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

/* ------------ Pinned Chat Messages Actions End ------------------ */

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: () => {},
});

export default chatSlice.reducer;
