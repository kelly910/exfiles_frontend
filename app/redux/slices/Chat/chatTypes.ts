export interface ThreadCreationPayload {
  name?: string | null;
}

export interface ThreadCreationResponse {
  id: number;
  uuid: string;
  name: string;
  created: string;
}

export interface UploadDocsPayload {
  thread_uuid: string;
  data: {
    temp_doc: number;
    description: string;
  }[];
}

export interface UploadDocsResponse {
  messages: string[];
}
