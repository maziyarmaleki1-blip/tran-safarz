// ==============================
// Mock Support API Service
// Replace each function body with real fetch() calls to your backend
// Endpoints:  /api/send-message, /api/get-messages, /api/escalate-to-human, etc.
// ==============================

import type {
  SupportMessage,
  Conversation,
  SendMessageRequest,
  SendMessageResponse,
  GetMessagesRequest,
  GetMessagesResponse,
  EscalateRequest,
  EscalateResponse,
  GetConversationsResponse,
  ResolveConversationRequest,
} from '@/types/support';

// --------------- helpers ---------------
const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// --------------- in-memory store (mock only) ---------------
let mockMessages: SupportMessage[] = [];
let mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    userId: 'user-1',
    userName: 'علی رضایی',
    status: 'active',
    mode: 'ai',
    lastMessage: 'سلام، بلیط قطار تهران-مشهد می‌خوام',
    lastMessageAt: now(),
    unreadCount: 1,
    createdAt: now(),
  },
  {
    id: 'conv-2',
    userId: 'user-2',
    userName: 'مریم احمدی',
    status: 'waiting',
    mode: 'human',
    lastMessage: 'مشکل پرداخت دارم',
    lastMessageAt: now(),
    unreadCount: 3,
    createdAt: now(),
    assignedOperator: undefined,
  },
];

// Seed some messages
mockMessages = [
  { id: uid(), conversationId: 'conv-1', sender: 'user', content: 'سلام، بلیط قطار تهران-مشهد می‌خوام', timestamp: now(), status: 'seen' },
  { id: uid(), conversationId: 'conv-1', sender: 'bot', content: 'سلام! برای چه تاریخی بلیط نیاز دارید؟', timestamp: now(), status: 'delivered' },
  { id: uid(), conversationId: 'conv-2', sender: 'user', content: 'سلام، مشکل پرداخت دارم', timestamp: now(), status: 'seen' },
  { id: uid(), conversationId: 'conv-2', sender: 'user', content: 'پرداختم موفق نبوده ولی مبلغ کسر شده', timestamp: now(), status: 'seen' },
  { id: uid(), conversationId: 'conv-2', sender: 'operator', senderName: 'پشتیبان سفر بدون مرز', content: 'سلام، لطفاً شماره پیگیری رو ارسال کنید', timestamp: now(), status: 'delivered' },
];

// Bot responses pool
const botResponses = [
  'ممنون از پیامتون. بذارید بررسی کنم...',
  'بله، حتماً کمکتون می‌کنم.',
  'لطفاً چند لحظه صبر کنید.',
  'اطلاعاتتون رو دریافت کردم.',
  'آیا سوال دیگه‌ای هم دارید؟',
];

// ==============================
// PUBLIC API — replace with real fetch calls
// ==============================

/**
 * POST /api/send-message
 */
export async function sendMessage(req: SendMessageRequest): Promise<SendMessageResponse> {
  await delay(300);

  const msg: SupportMessage = {
    id: uid(),
    conversationId: req.conversationId,
    sender: req.sender,
    senderName: req.senderName,
    content: req.content,
    timestamp: now(),
    status: 'sent',
  };
  mockMessages.push(msg);

  // Update conversation
  const conv = mockConversations.find((c) => c.id === req.conversationId);
  if (conv) {
    conv.lastMessage = req.content;
    conv.lastMessageAt = msg.timestamp;
    if (req.sender === 'operator' && !conv.assignedOperator && req.senderName) {
      conv.assignedOperator = req.senderName;
      conv.status = 'active';
    }
  }

  // Simulate status progression
  setTimeout(() => { msg.status = 'delivered'; }, 800);
  setTimeout(() => { msg.status = 'seen'; }, 2000);

  return { success: true, message: msg };
}

/**
 * Simulate bot/operator reply after user sends a message
 */
export async function simulateReply(conversationId: string, mode: 'ai' | 'human'): Promise<SupportMessage> {
  await delay(mode === 'ai' ? 1500 : 3000);

  const reply: SupportMessage = {
    id: uid(),
    conversationId,
    sender: mode === 'ai' ? 'bot' : 'operator',
    senderName: mode === 'human' ? 'پشتیبان سفر بدون مرز' : undefined,
    content: botResponses[Math.floor(Math.random() * botResponses.length)],
    timestamp: now(),
    status: 'delivered',
  };
  mockMessages.push(reply);

  const conv = mockConversations.find((c) => c.id === conversationId);
  if (conv) {
    conv.lastMessage = reply.content;
    conv.lastMessageAt = reply.timestamp;
  }

  return reply;
}

/**
 * GET /api/get-messages?conversationId=...
 */
export async function getMessages(req: GetMessagesRequest): Promise<GetMessagesResponse> {
  await delay(200);
  const msgs = mockMessages.filter((m) => m.conversationId === req.conversationId);
  return { messages: msgs, hasMore: false };
}

/**
 * POST /api/escalate-to-human
 */
export async function escalateToHuman(req: EscalateRequest): Promise<EscalateResponse> {
  await delay(500);
  const conv = mockConversations.find((c) => c.id === req.conversationId);
  if (!conv) throw new Error('Conversation not found');
  conv.mode = 'human';
  conv.status = 'waiting';
  return { success: true, conversation: { ...conv } };
}

/**
 * GET /api/conversations
 */
export async function getConversations(): Promise<GetConversationsResponse> {
  await delay(300);
  return { conversations: [...mockConversations].sort((a, b) => (b.lastMessageAt ?? '').localeCompare(a.lastMessageAt ?? '')) };
}

/**
 * POST /api/resolve-conversation
 */
export async function resolveConversation(req: ResolveConversationRequest): Promise<Conversation> {
  await delay(400);
  const conv = mockConversations.find((c) => c.id === req.conversationId);
  if (!conv) throw new Error('Conversation not found');
  conv.status = 'resolved';
  conv.resolvedAt = now();
  return { ...conv };
}

/**
 * Create a new conversation (for the chat widget)
 */
export async function createConversation(): Promise<Conversation> {
  await delay(200);
  const conv: Conversation = {
    id: uid(),
    userId: 'guest-' + uid().slice(0, 6),
    userName: 'کاربر مهمان',
    status: 'active',
    mode: 'ai',
    unreadCount: 0,
    createdAt: now(),
  };
  mockConversations.push(conv);
  return conv;
}
