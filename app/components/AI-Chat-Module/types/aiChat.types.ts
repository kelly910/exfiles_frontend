import { QUESTION_TYPES } from '@/app/utils/constants';

export type MessageType = (typeof QUESTION_TYPES)[keyof typeof QUESTION_TYPES];

export interface SocketPayload {
  thread_uuid?: string;
  chat_msg_uuid?: string;
  message_type: MessageType;
  message: string;
}
