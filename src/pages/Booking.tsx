import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProcessSteps } from '@/components/ProcessSteps';
import PassengerForm, { PassengerData, UserCredentials } from '@/components/PassengerForm';
import heroTrain from '@/assets/hero-train.jpg';

import { BOOKING_TRAINS } from '@/lib/constants';

const trains = BOOKING_TRAINS;

const Booking = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const direction = language === 'fa' ? 'rtl' : 'ltr';
  
  const passengers = parseInt(searchParams.get('passengers') || '1');
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const trainId = parseInt(searchParams.get('train') || searchParams.get('trains') || '1');
  const foreignNational = searchParams.get('foreign') === 'true';
  const dateParam = searchParams.get('date');

  const train = trains[trainId] || trains[1];
  const tripDate = dateParam ? new Date(dateParam) : new Date();
  const totalPrice = train.price * passengers;

  const handleSubmit = (passengerData: PassengerData[], credentials: UserCredentials) => {
    sessionStorage.setItem('passengerData', JSON.stringify(passengerData));
    sessionStorage.setItem('userCredentials', JSON.stringify(credentials));
    navigate(`/payment?train=${trainId}&from=${from}&to=${to}&passengers=${passengers}&date=${dateParam || ''}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <MainLayout>
      {/* Fixed Full-Screen Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${heroTrain})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-background/90" />
      </div>
        
      {/* Content */}
      <div className="relative z-10 min-h-screen" dir={direction}>
        <div className="container mx-auto px-4 py-8">
          <ProcessSteps activeStep={2} className="mb-6 max-w-4xl mx-auto" />
          <PassengerForm
            passengerCount={passengers}
            foreignNational={foreignNational}
            tripInfo={{
              from,
              to,
              date: tripDate,
              trainName: train.name,
              price: totalPrice,
            }}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Booking;
