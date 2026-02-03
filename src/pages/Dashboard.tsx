import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useReservations } from '@/hooks/useReservations';
import { useTransactions } from '@/hooks/useTransactions';
import { Link } from 'react-router-dom';
import { ReservationsTab } from '@/components/dashboard/ReservationsTab';
import { ProfileTab } from '@/components/dashboard/ProfileTab';
import { SecurityTab } from '@/components/dashboard/SecurityTab';
import { WalletTab } from '@/components/dashboard/WalletTab';

const menuItems = [
  { id: 'reservations', icon: 'confirmation_number', label: 'رزروها' },
  { id: 'profile', icon: 'person', label: 'پروفایل' },
  { id: 'security', icon: 'lock', label: 'امنیت' },
  { id: 'wallet', icon: 'account_balance_wallet', label: 'کیف پول' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { reservations, loading: reservationsLoading } = useReservations();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const [activeTab, setActiveTab] = useState('reservations');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-3">
          <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground w-full"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            خروج از حساب
          </button>
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
          {activeTab === 'reservations' && (
            <ReservationsTab reservations={reservations} loading={reservationsLoading} />
          )}

          {activeTab === 'profile' && (
            <ProfileTab profile={profile} loading={profileLoading} onUpdate={updateProfile} />
          )}

          {activeTab === 'security' && <SecurityTab />}

          {activeTab === 'wallet' && (
            <WalletTab 
              profile={profile} 
              transactions={transactions} 
              loadingProfile={profileLoading}
              loadingTransactions={transactionsLoading}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
