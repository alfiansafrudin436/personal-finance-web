import { Response } from '@/types';
import { appClient } from '@/lib/axios';
import { request } from '@/lib/api-response';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatPayload {
  messages: ChatMessage[];
  /** The user's local date as `YYYY-MM-DD`. */
  today: string;
}

export interface ChatReply {
  reply: string;
}

export const assistantService = {
  /** Sends the conversation so far and returns the assistant's next turn. */
  chat: async (payload: ChatPayload): Promise<Response<ChatReply>> =>
    request<ChatReply>(() => appClient.post('/chat', payload)),
};
