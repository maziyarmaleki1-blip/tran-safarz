import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Profile } from '@/hooks/useProfile';
import { Transaction } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface WalletTabProps {
  profile: Profile | null;
  transactions: Transaction[];
  loadingProfile: boolean;
  loadingTransactions: boolean;
  onRefresh: () => void;
}

export function WalletTab({ profile, transactions, loadingProfile, loadingTransactions, onRefresh }: WalletTabProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();

  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [processing, setProcessing] = useState(false);

  const formatPrice = (price: number) => Math.abs(price).toLocaleString('fa-IR');
  const formatDate = (dateStr: string) => new Intl.DateTimeFormat('fa-IR').format(new Date(dateStr));

  const getTransactionLabel = (type: string) => {
    const labels: Record<string, string> = { deposit: t('deposit'), withdraw: t('withdraw'), purchase: t('payment'), refund: t('confirmed') };
    return labels[type] || type;
  };

  const handleQuickDeposit = (amount: number) => { setDepositAmount(amount.toString()); setDepositDialogOpen(true); };

  const handleDeposit = async () => {
    const amount = parseInt(depositAmount.replace(/,/g, ''));
    if (!amount || amount < 10000) { toast({ title: t('minDeposit'), variant: 'destructive' }); return; }
    if (!user) return;
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const newBalance = (profile?.balance || 0) + amount;
      const { error: balanceError } = await supabase.from('profiles').update({ balance: newBalance }).eq('id', user.id);
      if (balanceError) throw balanceError;
      const { error: txError } = await supabase.from('transactions').insert({ user_id: user.id, type: 'deposit', amount, description: t('depositToWallet') });
      if (txError) throw txError;
      toast({ title: t('depositSuccess') });
      setDepositDialogOpen(false); setDepositAmount(''); onRefresh();
    } catch (error: any) { toast({ title: t('error'), description: error.message, variant: 'destructive' }); }
    finally { setProcessing(false); }
  };

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount.replace(/,/g, ''));
    if (!amount || amount < 50000) { toast({ title: t('minDeposit'), variant: 'destructive' }); return; }
    if (amount > (profile?.balance || 0)) { toast({ title: t('error'), variant: 'destructive' }); return; }
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) { toast({ title: t('error'), variant: 'destructive' }); return; }
    if (!user) return;
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const newBalance = (profile?.balance || 0) - amount;
      const { error: balanceError } = await supabase.from('profiles').update({ balance: newBalance }).eq('id', user.id);
      if (balanceError) throw balanceError;
      const { error: txError } = await supabase.from('transactions').insert({ user_id: user.id, type: 'withdraw', amount, description: `${t('withdraw')} ${cardNumber.slice(-4)}****` });
      if (txError) throw txError;
      toast({ title: t('withdrawSuccess') });
      setWithdrawDialogOpen(false); setWithdrawAmount(''); setCardNumber(''); onRefresh();
    } catch (error: any) { toast({ title: t('error'), description: error.message, variant: 'destructive' }); }
    finally { setProcessing(false); }
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('wallet')}</h1>

      {/* Balance Card */}
      {loadingProfile ? (
        <Card className="p-6 gradient-primary"><Skeleton className="h-4 w-20 bg-primary-foreground/20" /><Skeleton className="h-10 w-40 mt-2 bg-primary-foreground/20" /></Card>
      ) : (
        <Card className="p-6 gradient-primary text-primary-foreground">
          <p className="text-sm opacity-80">{t('balance')}</p>
          <p className="text-4xl font-bold mt-1">{formatPrice(profile?.balance || 0)} <span className="text-lg">{t('toman')}</span></p>
          <div className="flex gap-2 mt-4">
            <Button variant="secondary" size="sm" onClick={() => setDepositDialogOpen(true)} className="gap-1">
              <span className="material-symbols-outlined text-lg">add</span>{t('deposit')}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setWithdrawDialogOpen(true)} className="gap-1" disabled={(profile?.balance || 0) < 50000}>
              <span className="material-symbols-outlined text-lg">remove</span>{t('withdraw')}
            </Button>
          </div>
        </Card>
      )}

      {/* Quick Deposit */}
      <Card className="p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">add_circle</span>{t('quickCharge')}</h3>
        <div className="flex flex-wrap gap-2">
          {[50000, 100000, 200000, 500000].map((amount) => (
            <Button key={amount} variant="outline" size="sm" onClick={() => handleQuickDeposit(amount)}>{amount.toLocaleString('fa-IR')} {t('toman')}</Button>
          ))}
        </div>
      </Card>

      {/* Transactions */}
      <Card className="p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">receipt_long</span>{t('transactions')}</h3>
        {loadingTransactions ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => (<div key={i} className="flex items-center justify-between py-2"><div className="flex items-center gap-3"><Skeleton className="size-8 rounded-full" /><div><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16 mt-1" /></div></div><Skeleton className="h-5 w-20" /></div>))}</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground"><span className="material-symbols-outlined text-4xl mb-2">account_balance_wallet</span><p>{t('noTransactions')}</p></div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`size-8 rounded-full flex items-center justify-center ${tx.type === 'deposit' || tx.type === 'refund' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                    <span className={`material-symbols-outlined text-sm ${tx.type === 'deposit' || tx.type === 'refund' ? 'text-success' : 'text-destructive'}`}>{tx.type === 'deposit' || tx.type === 'refund' ? 'add' : 'remove'}</span>
                  </div>
                  <div><p className="text-sm font-medium">{tx.description || getTransactionLabel(tx.type)}</p><p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p></div>
                </div>
                <span className={`font-bold ${tx.type === 'deposit' || tx.type === 'refund' ? 'text-success' : 'text-destructive'}`}>{tx.type === 'deposit' || tx.type === 'refund' ? '+' : '-'}{formatPrice(tx.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Deposit Dialog */}
      <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">add_circle</span>{t('depositToWallet')}</DialogTitle><DialogDescription>{t('enterAmount')}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>{t('amountLabel')}</Label><Input value={depositAmount} onChange={(e) => setDepositAmount(e.target.value.replace(/\D/g, ''))} className="text-lg" dir="ltr" /><p className="text-xs text-muted-foreground">{t('minDeposit')}</p></div>
            <div className="p-4 bg-muted/50 rounded-lg"><p className="text-sm text-muted-foreground mb-1">{t('payViaGateway')}</p><p className="text-xs text-muted-foreground">{t('redirectToGateway')}</p></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDepositDialogOpen(false)}>{t('cancelAction')}</Button>
            <Button onClick={handleDeposit} disabled={processing || !depositAmount} className="gradient-primary gap-2">
              {processing ? (<><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>{t('processing')}</>) : (<><span className="material-symbols-outlined text-lg">credit_card</span>{t('payNow')}</>)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">remove_circle</span>{t('withdrawFromWallet')}</DialogTitle><DialogDescription>{t('enterAmountAndCard')}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-primary/10 rounded-lg flex items-center justify-between"><span className="text-sm">{t('currentBalance')}:</span><span className="font-bold">{formatPrice(profile?.balance || 0)} {t('toman')}</span></div>
            <div className="space-y-2"><Label>{t('withdrawAmount')}</Label><Input value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value.replace(/\D/g, ''))} className="text-lg" dir="ltr" /></div>
            <div className="space-y-2"><Label>{t('cardNumberLabel')}</Label><Input value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} className="text-lg tracking-wider" dir="ltr" maxLength={19} /><p className="text-xs text-muted-foreground">{t('cardNumberDesc')}</p></div>
            <div className="p-4 bg-gold/10 border border-gold/20 rounded-lg"><p className="text-sm text-gold-dark flex items-center gap-2"><span className="material-symbols-outlined text-lg">info</span>{t('withdrawNote')}</p></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>{t('cancelAction')}</Button>
            <Button onClick={handleWithdraw} disabled={processing || !withdrawAmount || !cardNumber} className="gap-2">
              {processing ? (<><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>{t('processing')}</>) : (<><span className="material-symbols-outlined text-lg">send</span>{t('submitRequest')}</>)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
