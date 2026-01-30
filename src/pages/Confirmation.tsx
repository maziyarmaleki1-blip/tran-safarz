import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const trains: Record<number, { name: string; number: string; departure: string; arrival: string; duration: string; price: number }> = {
  1: { name: 'فدک', number: '301', departure: '06:00', arrival: '16:30', duration: '10:30', price: 250000 },
  2: { name: 'غزال', number: '302', departure: '08:30', arrival: '18:45', duration: '10:15', price: 320000 },
  3: { name: 'پردیس', number: '303', departure: '14:00', arrival: '23:30', duration: '9:30', price: 450000 },
  4: { name: 'سبز', number: '304', departure: '20:00', arrival: '06:15', duration: '10:15', price: 280000 },
  5: { name: 'نور', number: '305', departure: '22:30', arrival: '08:45', duration: '10:15', price: 350000 },
};

const cities: Record<string, string> = {
  tehran: 'تهران', mashhad: 'مشهد', isfahan: 'اصفهان', shiraz: 'شیراز',
  tabriz: 'تبریز', yazd: 'یزد', ahvaz: 'اهواز', bandarabbas: 'بندرعباس',
};

const Confirmation = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const trackingCode = searchParams.get('code') || '';
  const trainId = parseInt(searchParams.get('train') || '1');
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const passengers = parseInt(searchParams.get('passengers') || '1');

  const train = trains[trainId] || trains[1];
  const totalPrice = train.price * passengers;

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  const handlePrint = () => {
    window.print();
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="size-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-success text-5xl">check_circle</span>
          </div>
          <h1 className="text-2xl font-bold text-success mb-2">{t('paymentSuccess')}</h1>
          <p className="text-muted-foreground">{t('paymentSuccessDesc')}</p>
        </div>

        {/* Tracking Code */}
        <Card className="p-6 mb-6 text-center bg-primary/5 border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">{t('trackingCode')}</p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-3xl font-bold tracking-widest text-primary">{trackingCode}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigator.clipboard.writeText(trackingCode)}
              className="shrink-0"
            >
              <span className="material-symbols-outlined">content_copy</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{t('trackingCodeNote')}</p>
        </Card>

        {/* Ticket Details */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">confirmation_number</span>
              {t('ticketDetails')}
            </h2>
            <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
              {t('confirmed')}
            </span>
          </div>

          {/* Train Info */}
          <div className="p-4 bg-muted/30 rounded-lg mb-4">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary-foreground">train</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">قطار {train.name}</p>
                <p className="text-sm text-muted-foreground">شماره {train.number}</p>
              </div>
            </div>
          </div>

          {/* Route */}
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div className="text-center">
              <p className="text-2xl font-bold">{train.departure}</p>
              <p className="text-sm text-muted-foreground">{cities[from]}</p>
            </div>
            <div className="flex flex-col items-center gap-1 px-4">
              <span className="material-symbols-outlined text-muted-foreground">arrow_back</span>
              <p className="text-xs text-muted-foreground">{train.duration}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{train.arrival}</p>
              <p className="text-sm text-muted-foreground">{cities[to]}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('passengers')}</p>
              <p className="font-medium">{passengers} {t('passenger')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('totalPrice')}</p>
              <p className="font-bold text-primary">{formatPrice(totalPrice)} {t('toman')}</p>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="flex justify-center py-4 border-t border-border">
            <div className="size-32 bg-muted rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-muted-foreground">qr_code_2</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1 gap-2" onClick={handlePrint}>
            <span className="material-symbols-outlined">print</span>
            {t('printTicket')}
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <span className="material-symbols-outlined">download</span>
            {t('downloadTicket')}
          </Button>
          <Button className="flex-1 gap-2 gradient-primary" onClick={() => navigate('/dashboard')}>
            <span className="material-symbols-outlined">dashboard</span>
            {t('goToDashboard')}
          </Button>
        </div>

        {/* Help Note */}
        <p className="text-sm text-muted-foreground text-center mt-6 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">info</span>
          {t('confirmationNote')}
        </p>
      </div>
    </MainLayout>
  );
};

export default Confirmation;
