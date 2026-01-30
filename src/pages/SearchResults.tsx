import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { SearchBox } from '@/components/search/SearchBox';
import heroImage from '@/assets/hero-train.jpg';

const trains = [
  { id: 1, name: 'غزال', number: '378', departure: '06:26', arrival: '13:08', duration: '۷ ساعت ۳۷ دقیقه', price: 1603370, seats: 45 },
  { id: 2, name: 'غزال', number: '827', departure: '08:46', arrival: '16:12', duration: '۸ ساعت ۵۱ دقیقه', price: 1435648, seats: 23 },
  { id: 3, name: 'غزال', number: '881', departure: '09:30', arrival: '14:36', duration: '۵ ساعت ۱۹ دقیقه', price: 1310465, seats: 12 },
  { id: 4, name: 'سبز', number: '304', departure: '20:00', arrival: '06:15', duration: '۱۰ ساعت ۱۵ دقیقه', price: 980000, seats: 67 },
  { id: 5, name: 'نور', number: '305', departure: '22:30', arrival: '08:45', duration: '۱۰ ساعت ۱۵ دقیقه', price: 1150000, seats: 34 },
];

const cities: Record<string, string> = {
  tehran: 'تهران', mashhad: 'مشهد', isfahan: 'اصفهان', shiraz: 'شیراز',
  tabriz: 'تبریز', yazd: 'یزد', ahvaz: 'اهواز', bandarabbas: 'بندرعباس',
  kermanshah: 'کرمانشاه', qom: 'قم',
};

const SearchResults = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedTrain, setSelectedTrain] = useState<number | null>(null);

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const passengers = searchParams.get('passengers') || '1';

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  const handleSelect = (trainId: number) => {
    navigate(`/booking?train=${trainId}&from=${from}&to=${to}&passengers=${passengers}`);
  };

  return (
    <MainLayout>
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Search Box Section - Glassmorphism */}
        <div className="py-8">
          <div className="container mx-auto px-4">
            <SearchBox />
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Header with Title and Route Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-foreground drop-shadow-sm">
              {language === 'fa' ? 'قطارهای موجود' : 'Available Trains'}
            </h1>
            <div className="bg-card/80 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-soft border border-border/50">
              <span className="font-semibold">{cities[from]}</span>
              <span className="text-primary">←</span>
              <span className="font-semibold">{cities[to]}</span>
            </div>
          </div>

          {/* Train Cards */}
          <div className="space-y-4">
            {trains.map((train, index) => (
              <div
                key={train.id}
                className={`relative overflow-hidden rounded-2xl transition-all cursor-pointer hover:shadow-lg ${
                  selectedTrain === train.id ? 'ring-2 ring-primary' : ''
                } ${index === 0 
                  ? 'bg-gradient-to-l from-primary via-primary/90 to-primary/80 text-primary-foreground' 
                  : 'bg-card/80 backdrop-blur-md border border-border/50'
                }`}
                onClick={() => setSelectedTrain(train.id)}
              >
                {/* Featured card background image */}
                {index === 0 && (
                  <div className="absolute inset-0 opacity-20">
                    <img 
                      src={heroImage} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="relative p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Train Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${
                        index === 0 ? 'bg-white/20' : 'gradient-primary'
                      }`}>
                        <span className={`material-symbols-outlined ${index === 0 ? 'text-white' : 'text-primary-foreground'}`}>train</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{train.name}</h3>
                        <p className={`text-sm ${index === 0 ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {language === 'fa' ? 'شماره قطار:' : 'Train No:'} {train.number}
                        </p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-6 flex-1 justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{train.departure}</p>
                        <p className={`text-xs ${index === 0 ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {language === 'fa' ? 'حرکت' : 'Departure'}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className={`flex items-center gap-1 text-xs ${index === 0 ? 'text-white/80' : 'text-muted-foreground'}`}>
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {train.duration}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{train.arrival}</p>
                        <p className={`text-xs ${index === 0 ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {language === 'fa' ? 'ورود' : 'Arrival'}
                        </p>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                      <div className="text-start lg:text-end">
                        <p className={`text-2xl font-bold ${index === 0 ? 'text-white' : 'text-accent'}`}>
                          {formatPrice(train.price)}
                        </p>
                        <p className={`text-xs ${index === 0 ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {language === 'fa' ? 'تومان' : 'Toman'}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(train.id);
                        }} 
                        className={`${index === 0 
                          ? 'border-white text-white hover:bg-white hover:text-primary' 
                          : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                        }`}
                      >
                        {language === 'fa' ? 'انتخاب' : 'Select'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchResults;