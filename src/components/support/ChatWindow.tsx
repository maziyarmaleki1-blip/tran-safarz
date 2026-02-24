import { useState, useRef, useEffect, useCallback } from 'react';
import { SupportMessage, SupportMode, Conversation } from '@/types/support';
import {
  sendMessage,
  getMessages,
  escalateToHuman,
  simulateReply,
  createConversation,
} from '@/services/supportApi';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<SupportMode>('ai');
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Init conversation
  useEffect(() => {
    (async () => {
      const conv = await createConversation();
      setConversation(conv);
      const res = await getMessages({ conversationId: conv.id });
      setMessages(res.messages);
      setLoading(false);
    })();
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !conversation) return;
    const text = input.trim();
    setInput('');

    // Optimistic user message
    const tempId = crypto.randomUUID();
    const optimistic: SupportMessage = {
      id: tempId,
      conversationId: conversation.id,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      status: 'sending',
    };
    setMessages((prev) => [...prev, optimistic]);

    // Send via API
    const res = await sendMessage({ conversationId: conversation.id, content: text, sender: 'user' });
    setMessages((prev) => prev.map((m) => (m.id === tempId ? res.message : m)));

    // Simulate reply
    setIsTyping(true);
    const reply = await simulateReply(conversation.id, mode);
    setIsTyping(false);
    setMessages((prev) => [...prev, reply]);
  }, [input, conversation, mode]);

  const handleEscalate = async () => {
    if (!conversation) return;
    const res = await escalateToHuman({ conversationId: conversation.id });
    setConversation(res.conversation);
    setMode('human');

    // System message
    const sysMsg: SupportMessage = {
      id: crypto.randomUUID(),
      conversationId: conversation.id,
      sender: 'bot',
      content: 'مکالمه به پشتیبان انسانی منتقل شد. لطفاً منتظر بمانید...',
      timestamp: new Date().toISOString(),
      status: 'delivered',
    };
    setMessages((prev) => [...prev, sysMsg]);
  };

  return (
    <div className="flex flex-col h-[500px] w-[370px] sm:w-[400px] bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">
              {mode === 'ai' ? 'smart_toy' : 'support_agent'}
            </span>
          </div>
          <div>
            <p className="font-semibold text-sm">پشتیبانی سفر بدون مرز</p>
            <p className="text-[11px] opacity-80">
              {mode === 'ai' ? 'ربات هوشمند' : 'اپراتور انسانی'} · آنلاین
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {mode === 'ai' && (
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20 size-8"
              onClick={handleEscalate}
              title="اتصال به اپراتور"
            >
              <span className="material-symbols-outlined text-lg">person</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-white/20 size-8"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </Button>
        </div>
      </div>

      {/* Mode toggle bar */}
      <div className="flex border-b border-border bg-muted/30 px-2 py-1.5 gap-1 shrink-0">
        {(['ai', 'human'] as SupportMode[]).map((m) => (
          <button
            key={m}
            onClick={() => m === 'human' ? handleEscalate() : setMode('ai')}
            className={cn(
              'flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5',
              mode === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            )}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              {m === 'ai' ? 'smart_toy' : 'support_agent'}
            </span>
            {m === 'ai' ? 'ربات هوشمند' : 'اپراتور انسانی'}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <span className="material-symbols-outlined text-4xl">chat</span>
            <p className="text-sm">پیام خود را ارسال کنید</p>
          </div>
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="border-t border-border p-3 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="پیام خود را بنویسید..."
            className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 transition-shadow"
            dir="rtl"
          />
          <Button
            type="submit"
            size="icon"
            className="size-10 rounded-xl shrink-0"
            disabled={!input.trim()}
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
