export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4">
      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
      </div>
      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
        <span className="size-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="size-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="size-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
