import { useState } from 'react';
import { ChatWindow } from './ChatWindow';
import { cn } from '@/lib/utils';

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      {open && (
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
          <ChatWindow onClose={() => setOpen(false)} />
        </div>
      )}

      {/* Floating action button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'size-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105',
          open
            ? 'bg-muted text-foreground rotate-0'
            : 'bg-primary text-primary-foreground'
        )}
        aria-label="پشتیبانی آنلاین"
      >
        <span className="material-symbols-outlined text-2xl">
          {open ? 'close' : 'chat'}
        </span>
      </button>
    </div>
  );
}
