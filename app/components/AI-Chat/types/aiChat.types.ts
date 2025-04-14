import { QUESTION_TYPES } from '@/app/utils/constants';

export interface FileData {
  file_name: string;
  file_size: number;
  file_url: string;
  file_extension: string;
}

export interface CategoryData {
  id: number;
  name: string;
}

export interface ChatDocument {
  id: number;
  uuid: string;
  file: string;
  created: string;
  chat_message: number;
  trained_status: string;
  file_data: FileData;
  category_data: CategoryData;
  doc_type: string;
}

export type MessageType = (typeof QUESTION_TYPES)[keyof typeof QUESTION_TYPES];

export interface SocketPayload {
  thread_uuid?: string;
  chat_msg_uuid?: string;
  message_type: MessageType;
  message: string;
}
