import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/app/utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';

import {
  FetchThreadListParams,
  GetMessagesByThreadIdPayload,
  GetMessagesByThreadIdResponse,
  GetThreadListResponse,
  PinnedAnswerMessagesResponse,
  PinnedAnswerToggleParams,
  PinnedAnswerToggleResponse,
  SaveUserAnswerReactionPayload,
  SaveUserAnswerReactionResponse,
  Thread,
  ThreadCreationPayload,
  ThreadCreationResponse,
  ThreadEditPayload,
  UploadDocsPayload,
  UploadDocsResponse,
} from './chatTypes';
import { RootState } from '../../store';

interface ChatState {
  activeThread: Thread | null;
  isStreaming: boolean;
  messagesList: GetMessagesByThreadIdResponse;
  messagesListLoading: boolean;
  messageChunks: string[];
}

const initialState: ChatState = {
  activeThread: null,
  messagesList: {
    count: 0,
    results: [],
  },
  isStreaming: false,
  messagesListLoading: true,
  messageChunks: [],
};

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

export const getThreadDetailsById = createAsyncThunk<
  ThreadCreationResponse,
  GetMessagesByThreadIdPayload,
  { rejectValue: string }
>('chat/getThreadDetailsById', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.get<ThreadCreationResponse>(
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
    const response = await api.patch<ThreadCreationResponse>(
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
  PinnedAnswerMessagesResponse,
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

    const response = await api.get<PinnedAnswerMessagesResponse>(
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

/* ------------ Answer Chat Messages Actions Start ------------------ */
export const saveUserAnswerReaction = createAsyncThunk<
  SaveUserAnswerReactionResponse,
  SaveUserAnswerReactionPayload,
  { rejectValue: string }
>('chat/saveUserAnswerReaction', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.patch<SaveUserAnswerReactionResponse>(
      `${urlMapper.chatAnswerReaction}${payload.message_uuid}/`,
      { thumb_reaction: payload.thumb_reaction }
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

/* ------------ Answer Chat Messages Actions End ------------------ */

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setWebSocketMessage: (state, action) => {
      const { data } = action.payload;
      const {
        thread_uuid: threadId,
        chat_message_uuid: msgId,
        chat_message_data: newQuestionMsg,
        message: newMsg,
        is_streaming_finished: isStreamingCompleted,
      } = data;
      const targetData = [...state.messagesList.results];
      console.log(threadId, state.activeThread?.uuid, msgId);

      if (threadId == state.activeThread?.uuid) {
        if (newQuestionMsg) {
          // Handle newly asked user message
          targetData.push(newQuestionMsg);
          state.messagesList.results = targetData;
          return;
        }

        if (
          state.isStreaming &&
          typeof newMsg !== 'object' &&
          (newMsg || newMsg == '')
        ) {
          const lastChunk = state.messageChunks[state.messageChunks.length - 1];

          if (newMsg !== lastChunk) {
            state.messageChunks.push(newMsg);
          }

          if (isStreamingCompleted) {
            state.isStreaming = false;
            state.messageChunks = [];
          }
        } else {
          if (typeof newMsg === 'object') {
            const index = targetData.findIndex(
              (item) => item?.uuid === newMsg.uuid
            );

            if (index !== -1) {
              targetData[index] = newMsg;
            } else {
              targetData.push(newMsg);
            }

            state.messagesList.results = targetData;
          }
        }
      }
    },
    setUpdateMessageList: (state, action) => {
      const updatedMsgList = state.messagesList.results.map((item) =>
        item.uuid === action.payload.uuid ? { ...action.payload } : item
      );
      state.messagesList.results = updatedMsgList;
    },
    clearChunks: (state, action) => {
      state.messageChunks = action.payload;
    },
    setActiveThread: (state, action) => {
      state.activeThread = action.payload;
    },
    setIsStreaming: (state, action) => {
      state.isStreaming = action.payload;
    },
    clearMessagesList: (state) => {
      state.messagesList = initialState.messagesList;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadMessagesByThreadId.pending, (state) => {
        state.messagesListLoading = true;
      })
      .addCase(fetchThreadMessagesByThreadId.fulfilled, (state, action) => {
        state.messagesListLoading = false;
        state.messagesList = action.payload;
      })
      .addCase(fetchThreadMessagesByThreadId.rejected, (state) => {
        state.messagesListLoading = false;
      });
  },
});

export const {
  setWebSocketMessage,
  setActiveThread,
  setIsStreaming,
  setUpdateMessageList,
  clearChunks,
  clearMessagesList,
} = chatSlice.actions;

export const selectMessageList = (state: RootState) => state.chat.messagesList;
export const selectActiveThread = (state: RootState) => state.chat.activeThread;
export const selectMessagesChunks = (state: RootState) =>
  state.chat.messageChunks;
export const selectIsStreaming = (state: RootState) => state.chat.isStreaming;

export default chatSlice.reducer;
