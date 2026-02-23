import { SupportMessage } from '@/types/support';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: SupportMessage;
}

const statusIcons: Record<string, string> = {
  sending: 'schedule',
  sent: 'check',
  delivered: 'done_all',
  seen: 'done_all',
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={cn('flex gap-2 px-4', isUser ? 'justify-end' : 'justify-start')}>
      {/* Avatar for bot/operator */}
      {!isUser && (
        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
          <span className="material-symbols-outlined text-primary text-sm">
            {message.sender === 'bot' ? 'smart_toy' : 'support_agent'}
          </span>
        </div>
      )}

      <div className={cn('max-w-[75%] space-y-1')}>
        {/* Sender label */}
        {!isUser && message.senderName && (
          <p className="text-[11px] text-muted-foreground px-1">{message.senderName}</p>
        )}

        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted text-foreground rounded-bl-md'
          )}
        >
          {message.content}
        </div>

        {/* Timestamp + status */}
        <div className={cn('flex items-center gap-1 px-1', isUser ? 'justify-end' : 'justify-start')}>
          <span className="text-[10px] text-muted-foreground">{time}</span>
          {isUser && (
            <span
              className={cn(
                'material-symbols-outlined text-xs',
                message.status === 'seen' ? 'text-primary' : 'text-muted-foreground'
              )}
              style={{ fontSize: '14px' }}
            >
              {statusIcons[message.status] || 'check'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
