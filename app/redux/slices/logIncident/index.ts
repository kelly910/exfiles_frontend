import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';
import { showToast } from '@/app/shared/toast/ShowToast';

export interface LogIncident {
  id: number;
  name: string;
  created: string;
  uuid: string;
}

export interface LogIncidentResponse {
  count: number;
  next: string | null;
  page: number;
  results: LogIncident[];
  no_of_incident: number;
}

interface LogIncidentState {
  incidents: LogIncident[];
  count: number;
  next: string | null;
  page: number;
  no_of_incident: number;
}

const initialState: LogIncidentState = {
  incidents: [],
  count: 0,
  next: null,
  page: 1,
  no_of_incident: 0,
};

export const fetchLogIncidents = createAsyncThunk<
  LogIncidentResponse,
  { page?: number; search?: string },
  { rejectValue: string }
>(
  'logIncidents/fetch',
  async ({ search = '', page = 1 }, { rejectWithValue }) => {
    try {
      const searchQuery = `?search=${encodeURIComponent(search)}&page=${page}&page_size=12`;
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
      `${urlMapper.thread}${uuid}/`
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
        state.no_of_incident = action.payload.no_of_incident;
      })
      .addCase(deleteIncidentById.fulfilled, (state, action) => {
        state.incidents = state.incidents.filter(
          (incident) => incident.id !== action.payload
        );
        state.count -= 1;
      });
  },
});

export const { setIncidents } = logIncidentSlice.actions;
export default logIncidentSlice.reducer;
