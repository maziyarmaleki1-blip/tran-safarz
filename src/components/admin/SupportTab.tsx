import { useState, useEffect, useRef, useCallback } from 'react';
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

const statusColors: Record<ConversationStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  waiting: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  resolved: 'bg-muted text-muted-foreground',
};
const statusLabels: Record<ConversationStatus, string> = {
  active: 'فعال',
  waiting: 'در انتظار اپراتور',
  resolved: 'حل شده',
};

// Sound for new support messages
const playSupportAlarm = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playBeep = (frequency: number, duration: number, startTime: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.4, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    const t = audioContext.currentTime;
    // Urgent double-beep pattern
    playBeep(1000, 0.12, t);
    playBeep(1400, 0.12, t + 0.14);
    playBeep(1000, 0.12, t + 0.4);
    playBeep(1400, 0.15, t + 0.54);
  } catch (e) {
    console.error('Support alarm error:', e);
  }
};

interface SupportTabProps {
  isAdmin: boolean;
  currentUserId?: string;
  currentUserName?: string;
}

export default function SupportTab({ isAdmin, currentUserId, currentUserName }: SupportTabProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState<'all' | 'waiting' | 'mine'>('waiting');
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevWaitingCount = useRef<number>(0);

  const fetchConversations = useCallback(async () => {
    const res = await getConversations();
    const convs = res.conversations;
    setConversations(convs);
    setLoading(false);

    // Check for new waiting conversations and play alarm
    const waitingCount = convs.filter(c => c.status === 'waiting').length;
    if (prevWaitingCount.current > 0 && waitingCount > prevWaitingCount.current) {
      playSupportAlarm();
    }
    prevWaitingCount.current = waitingCount;
  }, []);

  // Initial load + polling every 5s (mock — replace with realtime/websocket)
  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  // Load messages when selecting conversation
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

  // Poll messages of selected conversation
  useEffect(() => {
    if (!selected) return;
    const interval = setInterval(async () => {
      const res = await getMessages({ conversationId: selected.id });
      setMessages(res.messages);
    }, 3000);
    return () => clearInterval(interval);
  }, [selected]);

  const handleResolve = async () => {
    if (!selected) return;
    const updated = await resolveConversation({ conversationId: selected.id });
    setSelected(updated);
    setConversations(prev => prev.map(c => c.id === updated.id ? updated : c));
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
    setMessages(prev => [...prev, res.message]);
  };

  // Filter conversations
  const filtered = conversations.filter(c => {
    if (filter === 'waiting') return c.status === 'waiting';
    if (filter === 'mine') return c.assignedOperator === currentUserId;
    return true;
  });

  const waitingCount = conversations.filter(c => c.status === 'waiting').length;
  const activeCount = conversations.filter(c => c.status !== 'resolved').length;

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="flex flex-wrap gap-3">
        <Card className="flex items-center gap-3 px-4 py-3">
          <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">priority_high</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{waitingCount}</p>
            <p className="text-xs text-muted-foreground">در انتظار پاسخ</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 px-4 py-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">forum</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{activeCount}</p>
            <p className="text-xs text-muted-foreground">مکالمه فعال</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 px-4 py-3">
          <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">check_circle</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {conversations.filter(c => c.status === 'resolved').length}
            </p>
            <p className="text-xs text-muted-foreground">حل شده</p>
          </div>
        </Card>
      </div>

      {/* Main layout */}
      <div className="flex gap-4 h-[calc(100vh-340px)] min-h-[450px]">
        {/* Conversation list */}
        <Card className="w-80 shrink-0 flex flex-col overflow-hidden">
          {/* Filter tabs */}
          <div className="flex border-b border-border bg-muted/30 p-1.5 gap-1 shrink-0">
            {([
              { key: 'waiting' as const, label: 'در انتظار', icon: 'notifications_active', count: waitingCount },
              { key: 'all' as const, label: 'همه', icon: 'list' },
              { key: 'mine' as const, label: 'من', icon: 'person' },
            ]).map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1',
                  filter === f.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{f.icon}</span>
                {f.label}
                {f.count !== undefined && f.count > 0 && (
                  <span className="size-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                    {f.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-12 text-sm">مکالمه‌ای یافت نشد</p>
            ) : (
              filtered.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv)}
                  className={cn(
                    'w-full text-right p-3 border-b border-border/50 hover:bg-muted/50 transition-colors',
                    selected?.id === conv.id && 'bg-primary/5 border-r-2 border-r-primary',
                    conv.status === 'waiting' && 'bg-amber-50/50 dark:bg-amber-900/10'
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
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                          {conv.mode === 'ai' ? 'smart_toy' : 'person'}
                        </span>
                        {conv.mode === 'ai' ? 'ربات' : 'اپراتور'}
                      </span>
                      {conv.assignedOperator && (
                        <span className="text-[10px] text-primary flex items-center gap-0.5">
                          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>badge</span>
                          {conv.assignedOperator === currentUserId ? 'شما' : 'تخصیص داده شده'}
                        </span>
                      )}
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="size-5 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center animate-pulse">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Chat detail */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
              <span className="material-symbols-outlined text-5xl">forum</span>
              <p className="text-sm">یک مکالمه را انتخاب کنید</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20 shrink-0">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'size-10 rounded-full flex items-center justify-center',
                    selected.status === 'waiting' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-primary/10'
                  )}>
                    <span className={cn(
                      'material-symbols-outlined',
                      selected.status === 'waiting' ? 'text-amber-600 dark:text-amber-400 animate-pulse' : 'text-primary'
                    )}>person</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{selected.userName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0', statusColors[selected.status])}>
                        {statusLabels[selected.status]}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {selected.mode === 'ai' ? 'ربات هوشمند' : 'اپراتور انسانی'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selected.status === 'waiting' && (
                    <Button variant="default" size="sm" className="gap-1.5 text-xs" onClick={handleResolve}>
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      حل شده
                    </Button>
                  )}
                  {selected.status === 'active' && (
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleResolve}>
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      حل شده
                    </Button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-3">
                {msgLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                    <span className="material-symbols-outlined text-4xl">chat</span>
                    <p className="text-sm">هنوز پیامی ارسال نشده</p>
                  </div>
                ) : (
                  messages.map(msg => <ChatMessage key={msg.id} message={msg} />)
                )}
              </div>

              {/* Reply input */}
              {selected.status !== 'resolved' && (
                <div className="border-t border-border p-3 shrink-0">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleReply();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
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
  );
}
