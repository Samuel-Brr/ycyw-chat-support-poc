export interface ChatPreview {
  id: number;
  status: ChatStatus;
  agentName?: string;
  lastMessage: ChatMessage;
  unreadCount: number;
}

export interface ChatMessage {
  id: number;
  content: string;
  timestamp: Date;
  sender: number;
  status: MessageStatus;
  isNew?: boolean;
}

export type ChatStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type MessageStatus = 'SENDING' | 'SENT' | 'DELIVERED' | 'READ';
