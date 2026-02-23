// ==============================
// Support System Types
// Fully decoupled — no backend dependencies
// ==============================

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'seen';
export type SupportMode = 'ai' | 'human';
export type ConversationStatus = 'active' | 'waiting' | 'resolved';
export type SenderType = 'user' | 'bot' | 'operator';

export interface SupportMessage {
  id: string;
  conversationId: string;
  sender: SenderType;
  senderName?: string;
  content: string;
  timestamp: string; // ISO string
  status: MessageStatus;
}

export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  status: ConversationStatus;
  mode: SupportMode;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
  resolvedAt?: string;
  assignedOperator?: string;
}

// API request/response shapes — match these on your real backend
export interface SendMessageRequest {
  conversationId: string;
  content: string;
  sender: SenderType;
}

export interface SendMessageResponse {
  success: boolean;
  message: SupportMessage;
}

export interface GetMessagesRequest {
  conversationId: string;
  cursor?: string; // for pagination
  limit?: number;
}

export interface GetMessagesResponse {
  messages: SupportMessage[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface EscalateRequest {
  conversationId: string;
  reason?: string;
}

export interface EscalateResponse {
  success: boolean;
  conversation: Conversation;
}

export interface GetConversationsResponse {
  conversations: Conversation[];
}

export interface ResolveConversationRequest {
  conversationId: string;
}
