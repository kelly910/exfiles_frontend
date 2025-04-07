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

export interface GetMessagesByThreadIdPayload {
  thread_uuid: string;
}

interface UploadedDocument {
  id: number;
  file: string;
  created: string;
  file_name: string;
  file_size: number;
  chat_message: number;
  trained_status: string;
}

interface ChatMessage {
  id: number;
  uuid: string;
  created: string;
  thread: number;
  sender: number;
  receiver: number;
  message: string;
  uploaded_documents: UploadedDocument[];
}

export interface GetMessagesByThreadIdResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChatMessage[];
}
