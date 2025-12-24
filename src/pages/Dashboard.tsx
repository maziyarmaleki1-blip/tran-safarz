import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const menuItems = [
  { id: 'reservations', icon: 'confirmation_number', label: 'رزروها' },
  { id: 'profile', icon: 'person', label: 'پروفایل' },
  { id: 'security', icon: 'lock', label: 'امنیت' },
  { id: 'wallet', icon: 'account_balance_wallet', label: 'کیف پول' },
];

const reservations = [
  { id: 'RES-1402-001', route: 'تهران → مشهد', date: '۱۴۰۲/۱۰/۱۵', status: 'confirmed' },
  { id: 'RES-1402-002', route: 'اصفهان → شیراز', date: '۱۴۰۲/۱۰/۲۰', status: 'pending' },
  { id: 'RES-1402-003', route: 'تبریز → تهران', date: '۱۴۰۲/۰۹/۰۵', status: 'cancelled' },
];

const transactions = [
  { id: 1, type: 'deposit', amount: 500000, date: '۱۴۰۲/۱۰/۱۰', desc: 'واریز آنلاین' },
  { id: 2, type: 'withdraw', amount: -250000, date: '۱۴۰۲/۱۰/۱۲', desc: 'خرید بلیط' },
  { id: 3, type: 'deposit', amount: 300000, date: '۱۴۰۲/۱۰/۱۴', desc: 'واریز آنلاین' },
];

const Dashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('reservations');

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-success/10 text-success border-success/20',
      pending: 'bg-gold/10 text-gold-dark border-gold/20',
      cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    const labels = { confirmed: 'تأیید شده', pending: 'در انتظار', cancelled: 'لغو شده' };
    return <Badge variant="outline" className={styles[status as keyof typeof styles]}>{labels[status as keyof typeof labels]}</Badge>;
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground hidden lg:flex flex-col fixed right-0 top-0 bottom-0 z-20 border-l border-sidebar-border">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-10 rounded-lg gradient-primary flex items-center justify-center">
              <span className="material-symbols-outlined icon-filled text-primary-foreground">train</span>
            </div>
            <span className="text-lg font-bold">سفیر ریل</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-start ${
                activeTab === item.id
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'hover:bg-sidebar-accent text-sidebar-foreground'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground">
            <span className="material-symbols-outlined text-lg">logout</span>
            خروج از حساب
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-card border-b border-border p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-primary-foreground">train</span>
          </div>
          <span className="font-bold">سفیر ریل</span>
        </Link>
        <div className="flex gap-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:mr-64 p-6 pt-20 lg:pt-6">
        <div className="max-w-4xl mx-auto">
          {/* Reservations Tab */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold mb-6">رزروهای من</h1>
              {reservations.map((res) => (
                <Card key={res.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary">confirmation_number</span>
                  </div>
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <div><span className="text-muted-foreground">شماره: </span>{res.id}</div>
                    <div><span className="text-muted-foreground">مسیر: </span>{res.route}</div>
                    <div><span className="text-muted-foreground">تاریخ: </span>{res.date}</div>
                    <div>{getStatusBadge(res.status)}</div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">پروفایل کاربری</h1>
              <Card className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('firstName')}</Label>
                    <Input defaultValue="علی" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('lastName')}</Label>
                    <Input defaultValue="محمدی" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('mobile')}</Label>
                    <Input defaultValue="۰۹۱۲۳۴۵۶۷۸۹" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('email')}</Label>
                    <Input defaultValue="ali@example.com" />
                  </div>
                </div>
                <Button className="mt-6 gradient-primary" onClick={() => toast({ title: 'تغییرات ذخیره شد' })}>
                  {t('saveChanges')}
                </Button>
              </Card>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">{t('changePassword')}</h1>
              <Card className="p-6">
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label>{t('currentPassword')}</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('newPassword')}</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('confirmPassword')}</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <Button className="gradient-primary" onClick={() => toast({ title: 'رمز عبور تغییر کرد' })}>
                    {t('changePassword')}
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">{t('wallet')}</h1>
              
              {/* Balance Card */}
              <Card className="p-6 gradient-primary text-primary-foreground">
                <p className="text-sm opacity-80">{t('balance')}</p>
                <p className="text-4xl font-bold mt-1">۵۵۰,۰۰۰ <span className="text-lg">{t('toman')}</span></p>
              </Card>

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
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                          <span className={`material-symbols-outlined text-sm ${tx.type === 'deposit' ? 'text-success' : 'text-destructive'}`}>
                            {tx.type === 'deposit' ? 'add' : 'remove'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{tx.desc}</p>
                          <p className="text-xs text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <span className={`font-bold ${tx.amount > 0 ? 'text-success' : 'text-destructive'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('fa-IR')}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;