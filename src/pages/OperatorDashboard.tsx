import { useState, useEffect, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Conversation,
  SupportMessage,
  ConversationStatus,
} from '@/types/support';
import {
  getConversations,
  getMessages,
  resolveConversation,
  sendMessage,
} from '@/services/supportApi';
import { ChatMessage } from '@/components/support/ChatMessage';
import { TypingIndicator } from '@/components/support/TypingIndicator';

const statusColors: Record<ConversationStatus, string> = {
  active: 'bg-success text-success-foreground',
  waiting: 'bg-accent text-accent-foreground',
  resolved: 'bg-muted text-muted-foreground',
};
const statusLabels: Record<ConversationStatus, string> = {
  active: 'فعال',
  waiting: 'در انتظار',
  resolved: 'حل شده',
};

export default function OperatorDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    (async () => {
      const res = await getConversations();
      setConversations(res.conversations);
      setLoading(false);
    })();
  }, []);

  // Load messages when selecting a conversation
  useEffect(() => {
    if (!selected) return;
    (async () => {
      setMsgLoading(true);
      const res = await getMessages({ conversationId: selected.id });
      setMessages(res.messages);
      setMsgLoading(false);
    })();
  }, [selected]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleResolve = async () => {
    if (!selected) return;
    const updated = await resolveConversation({ conversationId: selected.id });
    setSelected(updated);
    setConversations((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selected) return;
    const text = replyText.trim();
    setReplyText('');
    const res = await sendMessage({
      conversationId: selected.id,
      content: text,
      sender: 'operator',
    });
    setMessages((prev) => [...prev, res.message]);
  };

  const activeCount = conversations.filter((c) => c.status !== 'resolved').length;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">headset_mic</span>
            داشبورد پشتیبانی
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {activeCount} مکالمه فعال
          </p>
        </div>

        <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[500px]">
          {/* Conversation List */}
          <Card className="w-80 shrink-0 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-sm">مکالمات</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              ) : conversations.length === 0 ? (
                <p className="text-center text-muted-foreground py-12 text-sm">مکالمه‌ای وجود ندارد</p>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelected(conv)}
                    className={cn(
                      'w-full text-right p-3 border-b border-border/50 hover:bg-muted/50 transition-colors',
                      selected?.id === conv.id && 'bg-primary/5 border-r-2 border-r-primary'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{conv.userName}</span>
                      <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0', statusColors[conv.status])}>
                        {statusLabels[conv.status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                          {conv.mode === 'ai' ? 'smart_toy' : 'person'}
                        </span>
                        {conv.mode === 'ai' ? 'ربات' : 'اپراتور'}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="size-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>

          {/* Conversation Detail */}
          <Card className="flex-1 flex flex-col overflow-hidden">
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
                <span className="material-symbols-outlined text-5xl">forum</span>
                <p className="text-sm">یک مکالمه را انتخاب کنید</p>
              </div>
            ) : (
              <>
                {/* Detail header */}
                <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">person</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{selected.userName}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0', statusColors[selected.status])}>
                          {statusLabels[selected.status]}
                        </Badge>
                        <span>·</span>
                        <span>{selected.mode === 'ai' ? 'ربات هوشمند' : 'اپراتور انسانی'}</span>
                      </p>
                    </div>
                  </div>
                  {selected.status !== 'resolved' && (
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={handleResolve}>
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      حل شده
                    </Button>
                  )}
                </div>

                {/* Messages area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-3">
                  {msgLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    </div>
                  ) : (
                    messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
                  )}
                </div>

                {/* Reply input */}
                {selected.status !== 'resolved' && (
                  <div className="border-t border-border p-3 shrink-0">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleReply();
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="پاسخ خود را بنویسید..."
                        className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 transition-shadow"
                        dir="rtl"
                      />
                      <Button type="submit" size="icon" className="size-10 rounded-xl" disabled={!replyText.trim()}>
                        <span className="material-symbols-outlined text-lg">send</span>
                      </Button>
                    </form>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
