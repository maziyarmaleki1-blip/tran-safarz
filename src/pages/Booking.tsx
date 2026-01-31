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
      {/* Full-width background with scenic image effect */}
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-background">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Passenger Form Component */}
          <PassengerForm
            passengerCount={passengers}
            foreignNational={false}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Booking;