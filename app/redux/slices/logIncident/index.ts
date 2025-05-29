import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../utils/axiosConfig';
import urlMapper from '@/app/utils/apiEndPoints/urlMapper';
import { showToast } from '@/app/shared/toast/ShowToast';
import {
  DocumentData,
  UserData,
} from '@/app/components/LogIncident/LogIncident';

export interface FileData {
  file_url: string;
}

interface Tag {
  id: number;
  name: string;
  file_data: FileData | null;
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
  {
    page?: number;
    search?: string;
    page_size?: number | 'all';
    created_before?: string;
    created_after?: string;
    tags?: string;
  },
  { rejectValue: string }
>(
  'logIncidents/fetch',
  async (
    {
      search = '',
      page = 1,
      page_size = 12,
      created_before,
      created_after,
      tags,
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
      if (tags) params.append('tags', tags);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get<LogIncidentResponse>(
        `${urlMapper.logIncidents}${queryString}`
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

export const downloadSelectedLogsReport = createAsyncThunk<
  void,
  {
    document_uuid?: string;
    created_before?: string;
    created_after?: string;
    tags?: string;
    search?: string;
    type?: string;
  },
  { rejectValue: string }
>(
  'documents/downloadSelectedLogsReport',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${urlMapper.downloadLogReport}`,
        payload,
        {
          responseType: 'blob',
        }
      );
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'LogIncidentReport.pdf';
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

export const addIncident = createAsyncThunk<
  void,
  FormData,
  { rejectValue: string }
>('logIncidents/add', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post(`${urlMapper.logIncidents}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    showToast('success', 'Incident logged successfully.');
    console.log(response, 'response');
    return;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { messages?: string[] } } })?.response
        ?.data?.messages?.[0] || 'Failed to log the incident.';
    return rejectWithValue(errorMessage);
  }
});

export const updateIncident = createAsyncThunk<
  void,
  { id: number; formData: FormData },
  { rejectValue: string }
>('logIncidents/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await api.patch(
      `${urlMapper.logIncidents}${id}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    showToast('success', 'Incident updated successfully.');
    console.log(response, 'response');
    return;
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { messages?: string[] } } })?.response
        ?.data?.messages?.[0] || 'Failed to update the incident.';
    return rejectWithValue(errorMessage);
  }
});

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
        state.no_of_incident = action.payload.no_of_incident;
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
