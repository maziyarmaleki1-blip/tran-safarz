import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PassengerForm, { PassengerData, UserCredentials } from '@/components/PassengerForm';
import { ArrowRight } from 'lucide-react';

const cities: Record<string, string> = {
  tehran: 'تهران', mashhad: 'مشهد', isfahan: 'اصفهان', shiraz: 'شیراز',
  tabriz: 'تبریز', yazd: 'یزد', ahvaz: 'اهواز', bandarabbas: 'بندرعباس',
};

const Booking = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isRTL = language === 'fa';
  
  const passengers = parseInt(searchParams.get('passengers') || '1');
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const trainId = searchParams.get('train') || searchParams.get('trains') || '1';

  const handleSubmit = (passengerData: PassengerData[], credentials: UserCredentials) => {
    // Store passenger data in sessionStorage for payment page
    sessionStorage.setItem('passengerData', JSON.stringify(passengerData));
    sessionStorage.setItem('userCredentials', JSON.stringify(credentials));
    
    navigate(`/payment?train=${trainId}&from=${from}&to=${to}&passengers=${passengers}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <MainLayout>
      <div className="bg-primary/5 py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1">
              <ArrowRight className="size-4" />
              {t('back')}
            </Button>
            <h1 className="text-xl font-bold">{t('passengerInfo')}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Route Summary */}
        <Card className="p-4 mb-6 flex items-center gap-4 bg-card/80 backdrop-blur-sm">
          <div className="size-10 rounded-lg gradient-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-foreground">train</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span>{cities[from] || from}</span>
            <span className="material-symbols-outlined text-muted-foreground">arrow_back</span>
            <span>{cities[to] || to}</span>
          </div>
          <div className="mr-auto text-sm text-muted-foreground">
            {isRTL ? `${passengers} مسافر` : `${passengers} passenger(s)`}
          </div>
        </Card>

        {/* Passenger Form Component */}
        <PassengerForm
          passengerCount={passengers}
          foreignNational={false}
          onSubmit={handleSubmit}
          onBack={handleBack}
        />
      </div>
    </MainLayout>
  );
};

export default Booking;