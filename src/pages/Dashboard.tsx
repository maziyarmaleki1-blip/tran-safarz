import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useReservations } from '@/hooks/useReservations';
import { useTransactions } from '@/hooks/useTransactions';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { ReservationsTab } from '@/components/dashboard/ReservationsTab';
import { ProfileTab } from '@/components/dashboard/ProfileTab';

import { WalletTab } from '@/components/dashboard/WalletTab';
import { ProcessSteps } from '@/components/ProcessSteps';
import logo from '@/assets/logo.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile, fetchProfile } = useProfile();
  const { reservations, loading: reservationsLoading, fetchReservations } = useReservations();
  const { transactions, loading: transactionsLoading, fetchTransactions } = useTransactions();
  const [activeTab, setActiveTab] = useState('reservations');

  const menuItems = [
    { id: 'reservations', icon: 'confirmation_number', label: t('reservations') },
    { id: 'profile', icon: 'person', label: t('profile') },
    { id: 'wallet', icon: 'account_balance_wallet', label: t('wallet') },
  ];

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
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Determine active step based on latest reservation
  const getActiveStep = () => {
    if (reservations.length === 0) return 4;
    const latest = reservations[0];
    if (latest.ticket_file_path || latest.ticket_payment_status === 'confirmed') return 5;
    if (latest.ticket_payment_status === 'paid') return 5;
    if (latest.status === 'confirmed' && !latest.ticket_file_path) return 4;
    return 4;
  };

  return (
    <div className="min-h-screen flex bg-muted/30" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className={`w-64 bg-sidebar text-sidebar-foreground hidden lg:flex flex-col fixed ${isRTL ? 'right-0' : 'left-0'} top-0 bottom-0 z-20 ${isRTL ? 'border-l' : 'border-r'} border-sidebar-border`}>
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/"><img src={logo} alt="safarz" className="h-20" /></Link>
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
          <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground w-full">
            <span className="material-symbols-outlined text-lg">logout</span>
            {t('logoutAccount')}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-card border-b border-border p-4 flex items-center justify-between">
        <Link to="/"><img src={logo} alt="safarz" className="h-8" /></Link>
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
      <main className={`flex-1 ${isRTL ? 'lg:mr-64' : 'lg:ml-64'} p-6 pt-20 lg:pt-6`}>
        <div className="max-w-4xl mx-auto">
          {activeTab === 'reservations' && (
            <ProcessSteps activeStep={getActiveStep()} className="mb-6" />
          )}

          {activeTab === 'reservations' && (
            <ReservationsTab reservations={reservations} loading={reservationsLoading} onRefresh={fetchReservations} />
          )}
          {activeTab === 'profile' && (
            <ProfileTab profile={profile} loading={profileLoading} onUpdate={updateProfile} />
          )}
          
          {activeTab === 'wallet' && (
            <WalletTab profile={profile} transactions={transactions} loadingProfile={profileLoading} loadingTransactions={transactionsLoading} onRefresh={() => { fetchProfile(); fetchTransactions(); }} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
