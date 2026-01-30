import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SmsState = 'sending' | 'sent' | 'failed';

interface SmsStatusProps {
  phoneNumber?: string;
}

export const SmsStatus = ({ phoneNumber = '۰۹۱۲****۱۲۳' }: SmsStatusProps) => {
  const [status, setStatus] = useState<SmsState>('sending');

  useEffect(() => {
    // Simulate SMS sending process
    const timer = setTimeout(() => {
      // 90% chance of success for demo
      setStatus(Math.random() > 0.1 ? 'sent' : 'failed');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const statusConfig = {
    sending: {
      icon: 'send',
      iconClass: 'animate-pulse text-primary',
      bgClass: 'bg-primary/5 border-primary/20',
      title: 'در حال ارسال پیامک...',
      description: `پیامک تأیید به شماره ${phoneNumber} ارسال می‌شود`,
    },
    sent: {
      icon: 'mark_email_read',
      iconClass: 'text-success',
      bgClass: 'bg-success/5 border-success/20',
      title: 'پیامک ارسال شد',
      description: `اطلاعات بلیط به شماره ${phoneNumber} ارسال شد`,
    },
    failed: {
      icon: 'error',
      iconClass: 'text-destructive',
      bgClass: 'bg-destructive/5 border-destructive/20',
      title: 'خطا در ارسال پیامک',
      description: 'لطفاً از کد رهگیری برای پیگیری رزرو استفاده کنید',
    },
  };

  const config = statusConfig[status];

  return (
    <Card className={cn('p-4 border-2 transition-all duration-300', config.bgClass)}>
      <div className="flex items-center gap-4">
        <div className={cn(
          'size-12 rounded-full flex items-center justify-center shrink-0',
          status === 'sending' && 'bg-primary/10',
          status === 'sent' && 'bg-success/10',
          status === 'failed' && 'bg-destructive/10'
        )}>
          <span className={cn('material-symbols-outlined text-2xl', config.iconClass)}>
            {config.icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium">{config.title}</p>
          <p className="text-sm text-muted-foreground truncate">{config.description}</p>
        </div>
        {status === 'sending' && (
          <div className="shrink-0">
            <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
          </div>
        )}
        {status === 'sent' && (
          <div className="shrink-0">
            <span className="material-symbols-outlined text-success">check_circle</span>
          </div>
        )}
        {status === 'failed' && (
          <button 
            onClick={() => setStatus('sending')}
            className="shrink-0 text-sm text-primary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            تلاش مجدد
          </button>
        )}
      </div>
    </Card>
  );
};
