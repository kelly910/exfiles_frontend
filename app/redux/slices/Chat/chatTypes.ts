export interface UserData {
  id: number;
  first_name: string;
  email: string;
  user_type: string;
}
export interface Thread {
  id: number;
  name: string;
  uuid: string;
  created: string;
  created_user_data?: UserData;
}
export interface GetThreadListResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Thread[];
}

export type FetchThreadListParams = {
  page?: number;
  page_size?: number;
  search?: string;
};

export interface ThreadCreationPayload {
  name?: string | null;
}

export interface ThreadEditPayload {
  name?: string | null;
  thread_uuid: string;
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

// ----------- Start Pinned Answers ---------------
export interface PinnedAnswerToggleResponse {
  messages: string[];
}
export interface PinnedAnswerToggleParams {
  message_uuid: string;
}
export interface PinnedAnswerThread {
  id: number;
  name: string;
  uuid: string;
}

export interface PinnedAnswerMessage {
  id: number;
  uuid: string;
  is_pinned: boolean;
  pinned_at: string;
  thread: PinnedAnswerThread;
  message: string;
}

export interface PinnedAnswerMessagesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PinnedAnswerMessage[];
}
// ----------- End Pinned Answers ---------------
