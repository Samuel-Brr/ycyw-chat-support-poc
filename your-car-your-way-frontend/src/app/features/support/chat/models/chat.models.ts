export interface ChatPreview {
  id: number;
  status: ChatStatus;
  agentName?: string;
  lastMessage: ChatMessage;
  unreadCount: number;
}

export interface SupportRequests {
  support_requests: ChatPreview[];
}

export interface ChatMessage {
  id: number;
  content: string;
  timestamp: Date;
  sender: number;
  status: MessageStatus;
  isNew?: boolean;
}

export interface ChatMessageDTO {
  id?: string;
  content: string;
  timestamp: string;
  sender?: string;
  status?: string;
}

export interface ChatMessages {
  payload: ChatMessage[];
}

export type ChatStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type MessageStatus = 'SENDING' | 'SENT' | 'DELIVERED' | 'READ';
