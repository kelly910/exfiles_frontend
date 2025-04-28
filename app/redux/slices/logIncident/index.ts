import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';
import { showToast } from '@/app/shared/toast/ShowToast';
import {
  DocumentData,
  UserData,
} from '@/app/components/LogIncident/LogIncident';

interface Tag {
  id: number;
  name: string;
}

export interface LogIncident {
  id: string;
  name: string;
  created: string;
  description: string;
  incident_time: string;
  tags_data: Tag[];
  user_data?: UserData;
  document_data?: DocumentData;
  location: string | null;
  involved_person_name: string | null;
  evidence: string | null;
}

export interface LogIncidentResponse {
  count: number;
  next: string | null;
  page: number;
  results: LogIncident[];
}

interface LogIncidentState {
  incidents: LogIncident[];
  count: number;
  next: string | null;
  page: number;
}

const initialState: LogIncidentState = {
  incidents: [],
  count: 0,
  next: null,
  page: 1,
};

export const fetchLogIncidents = createAsyncThunk<
  LogIncidentResponse,
  { page?: number; search?: string },
  { rejectValue: string }
>(
  'logIncidents/fetch',
  async ({ search = '', page = 1 }, { rejectWithValue }) => {
    try {
      const searchQuery = `?search=${encodeURIComponent(search)}&page=${page}&page_size=16`;
      const response = await api.get<LogIncidentResponse>(
        `${urlMapper.logIncidents}${searchQuery}`
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to fetch log incidents.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteIncidentById = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('logIncidents/delete', async (uuid, { rejectWithValue }) => {
  try {
    const response = await api.delete<{ message: string[] }>(
      `${urlMapper.logIncidents}${uuid}/`
    );
    const successMessage =
      response.data.message?.[0] || 'Log incident deleted successfully.';
    showToast('success', successMessage);
    return uuid;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { messages?: string[] } } })?.response
        ?.data?.messages?.[0] || 'Failed to delete the log incident.';
    return rejectWithValue(errorMessage);
  }
});

const logIncidentSlice = createSlice({
  name: 'logIncidents',
  initialState,
  reducers: {
    setIncidents(state, action: PayloadAction<LogIncident[]>) {
      state.incidents = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogIncidents.fulfilled, (state, action) => {
        state.incidents = action.payload.results;
        state.count = action.payload.count;
        state.next = action.payload.next;
        state.page = action.payload.page;
      })
      .addCase(deleteIncidentById.fulfilled, (state, action) => {
        state.incidents = state.incidents.filter(
          (incident) => incident.id !== String(action.payload)
        );
        state.count -= 1;
      });
  },
});

export const { setIncidents } = logIncidentSlice.actions;
export default logIncidentSlice.reducer;
