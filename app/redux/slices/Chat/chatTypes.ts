export interface UserData {
  id: number;
  first_name: string;
  email: string;
  user_type: string;
}

export type ThreadType = 'chat';
export interface Thread {
  id: number;
  name: string;
  uuid: string;
  created: string;
  created_user_data?: UserData;
  thread_type?: ThreadType;
}
export interface GetThreadListResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Thread[];
}

export type FetchThreadListParams = {
  page: number;
  page_size?: number;
  search?: string;
  thread_type?: ThreadType;
  created_after?: string;
  created_before?: string;
};

export interface ThreadCreationPayload {
  name?: string | null;
}

export interface ThreadEditPayload {
  name?: string | null;
  thread_uuid: string;
}

export interface EditCombinedSummaryPayload {
  combined_summary_uuid: string;
  summary: string;
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
  user_message?: string;
}

export interface UploadDocsResponse {
  messages: string[];
}

export interface GetMessagesByThreadIdPayload {
  thread_uuid: string;
  page?: number;
  page_size?: number;
  search?: string;
}

export interface UploadedDocument {
  id: number;
  uuid: string;
  file: string;
  created: string;
  chat_message: number;
  trained_status: string;
  file_data: {
    file_name: string;
    file_size: number;
    file_url: string;
    file_extension: string;
  };
  category_data: {
    id: number;
    name: string;
  };
  doc_type: string;
  summary?: string;
}

export interface CombineSummaryData {
  id: string;
  uuid: string;
  summary: string;
  file_names: string[] | [];
}

export type ThumbReaction = 'thumbs_up' | 'thumbs_down';

export interface SaveUserAnswerReactionPayload {
  message_uuid: string;
  thumb_reaction: ThumbReaction;
}
export interface SaveUserAnswerReactionResponse {
  messages: string[];
}
export interface ChatMessage {
  id: number;
  uuid: string;
  created: string;
  thread: number;
  sender: number;
  receiver: number;
  message: string;
  uploaded_documents: UploadedDocument[];
  summary_documents: UploadedDocument[] | null;
  combined_summary_data: CombineSummaryData | null;
  all_doc_summarized: boolean;
  thumb_reaction?: ThumbReaction;
  is_pinned: boolean;
}

export interface GetMessagesByThreadIdResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
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
  next?: string | null;
  previous?: string | null;
  results: PinnedAnswerMessage[] | [];
}
// ----------- End Pinned Answers ---------------
