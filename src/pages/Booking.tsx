import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import PassengerForm, { PassengerData, UserCredentials } from '@/components/PassengerForm';
import heroTrain from '@/assets/hero-train.jpg';

const Booking = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const direction = language === 'fa' ? 'rtl' : 'ltr';
  
  const passengers = parseInt(searchParams.get('passengers') || '1');
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const trainId = searchParams.get('train') || searchParams.get('trains') || '1';
  const foreignNational = searchParams.get('foreign') === 'true';

  const handleSubmit = (passengerData: PassengerData[], credentials: UserCredentials) => {
    sessionStorage.setItem('passengerData', JSON.stringify(passengerData));
    sessionStorage.setItem('userCredentials', JSON.stringify(credentials));
    navigate(`/payment?train=${trainId}&from=${from}&to=${to}&passengers=${passengers}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <MainLayout>
      {/* Full-screen background with train scenic image */}
      <div 
        className="min-h-screen relative"
        dir={direction}
        style={{
          backgroundImage: `url(${heroTrain})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Sky gradient overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200/80 via-sky-100/60 to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <PassengerForm
            passengerCount={passengers}
            foreignNational={foreignNational}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Booking;
