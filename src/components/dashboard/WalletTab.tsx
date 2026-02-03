import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Profile } from '@/hooks/useProfile';
import { Transaction } from '@/hooks/useTransactions';

interface WalletTabProps {
  profile: Profile | null;
  transactions: Transaction[];
  loadingProfile: boolean;
  loadingTransactions: boolean;
}

export function WalletTab({ profile, transactions, loadingProfile, loadingTransactions }: WalletTabProps) {
  const { t } = useLanguage();

  const formatPrice = (price: number) => Math.abs(price).toLocaleString('fa-IR');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fa-IR').format(date);
  };

  const getTransactionLabel = (type: string) => {
    const labels: Record<string, string> = {
      deposit: 'واریز',
      withdraw: 'برداشت',
      purchase: 'خرید بلیط',
      refund: 'استرداد',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('wallet')}</h1>
      
      {/* Balance Card */}
      {loadingProfile ? (
        <Card className="p-6 gradient-primary">
          <Skeleton className="h-4 w-20 bg-primary-foreground/20" />
          <Skeleton className="h-10 w-40 mt-2 bg-primary-foreground/20" />
        </Card>
      ) : (
        <Card className="p-6 gradient-primary text-primary-foreground">
          <p className="text-sm opacity-80">{t('balance')}</p>
          <p className="text-4xl font-bold mt-1">
            {formatPrice(profile?.balance || 0)} <span className="text-lg">{t('toman')}</span>
          </p>
        </Card>
      )}

      {/* Quick Deposit */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">{t('deposit')}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {[50000, 100000, 200000, 500000].map((amount) => (
            <Button key={amount} variant="outline" size="sm">
              {amount.toLocaleString('fa-IR')} تومان
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input placeholder="مبلغ دلخواه" className="max-w-[200px]" />
          <Button className="gradient-primary">{t('deposit')}</Button>
        </div>
      </Card>

      {/* Transactions */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">{t('transactions')}</h3>
        {loadingTransactions ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <span className="material-symbols-outlined text-4xl mb-2">account_balance_wallet</span>
            <p>تراکنشی وجود ندارد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`size-8 rounded-full flex items-center justify-center ${
                    tx.type === 'deposit' || tx.type === 'refund' ? 'bg-success/10' : 'bg-destructive/10'
                  }`}>
                    <span className={`material-symbols-outlined text-sm ${
                      tx.type === 'deposit' || tx.type === 'refund' ? 'text-success' : 'text-destructive'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'refund' ? 'add' : 'remove'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.description || getTransactionLabel(tx.type)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                  </div>
                </div>
                <span className={`font-bold ${
                  tx.type === 'deposit' || tx.type === 'refund' ? 'text-success' : 'text-destructive'
                }`}>
                  {tx.type === 'deposit' || tx.type === 'refund' ? '+' : '-'}{formatPrice(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
