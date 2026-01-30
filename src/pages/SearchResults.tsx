import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchBox } from '@/components/search/SearchBox';
import { FilterBox } from '@/components/search/FilterBox';
import heroImage from '@/assets/hero-train.jpg';

const trains = [
  { id: 1, name: 'غزال', number: '378', departure: '06:26', arrival: '13:08', duration: '۷ ساعت ۳۷ دقیقه', price: 1603370 },
  { id: 2, name: 'غزال', number: '827', departure: '08:46', arrival: '16:12', duration: '۸ ساعت ۵۱ دقیقه', price: 1435648 },
  { id: 3, name: 'غزال', number: '881', departure: '09:30', arrival: '14:36', duration: '۵ ساعت ۱۹ دقیقه', price: 1310465 },
  { id: 4, name: 'سبز', number: '304', departure: '20:00', arrival: '06:15', duration: '۱۰ ساعت ۱۵ دقیقه', price: 980000 },
  { id: 5, name: 'نور', number: '305', departure: '22:30', arrival: '08:45', duration: '۱۰ ساعت ۱۵ دقیقه', price: 1150000 },
];

const cities: Record<string, string> = {
  tehran: 'تهران', mashhad: 'مشهد', isfahan: 'اصفهان', shiraz: 'شیراز',
  tabriz: 'تبریز', yazd: 'یزد', ahvaz: 'اهواز', bandarabbas: 'بندرعباس',
  kermanshah: 'کرمانشاه', qom: 'قم',
};

const SearchResults = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedTrains, setSelectedTrains] = useState<number[]>([]);

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const passengers = searchParams.get('passengers') || '1';

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  const toggleTrain = (trainId: number) => {
    setSelectedTrains(prev => 
      prev.includes(trainId) 
        ? prev.filter(id => id !== trainId)
        : [...prev, trainId]
    );
  };

  const handleSubmit = () => {
    if (selectedTrains.length > 0) {
      navigate(`/booking?trains=${selectedTrains.join(',')}&from=${from}&to=${to}&passengers=${passengers}`);
    }
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
        {/* Search Box Section */}
        <div className="py-6">
          <div className="container mx-auto px-4">
            <SearchBox />
          </div>
        </div>

        <div className="container mx-auto px-4 py-4">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h1 className="text-xl font-bold text-foreground drop-shadow-sm">
              {language === 'fa' ? 'قطارهای موجود' : 'Available Trains'}
            </h1>
            <div className="bg-card/80 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-2 shadow-soft border border-border/50 text-sm">
              <span className="font-semibold">{cities[from]}</span>
              <span className="text-primary">←</span>
              <span className="font-semibold">{cities[to]}</span>
            </div>
          </div>

          {/* Main Layout: Filter on right (RTL natural flow) */}
          <div className="flex gap-4">
            {/* Train Cards - Main Content */}
            <div className="flex-1 space-y-2">
              {trains.map((train) => (
                <div
                  key={train.id}
                  className={`bg-card/80 backdrop-blur-md border rounded-xl transition-all cursor-pointer hover:shadow-md ${
                    selectedTrains.includes(train.id) 
                      ? 'border-primary ring-1 ring-primary/50' 
                      : 'border-border/50'
                  }`}
                  onClick={() => toggleTrain(train.id)}
                >
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <Checkbox 
                        checked={selectedTrains.includes(train.id)}
                        onCheckedChange={() => toggleTrain(train.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0"
                      />

                      {/* Train Icon & Info */}
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <div className="size-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary-foreground text-lg">train</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">{train.name}</p>
                          <p className="text-xs text-muted-foreground">{train.number}</p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-4 flex-1 justify-center">
                        <div className="text-center">
                          <p className="text-lg font-bold">{train.departure}</p>
                          <p className="text-[10px] text-muted-foreground">{language === 'fa' ? 'حرکت' : 'Dep'}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          <span className="hidden sm:inline">{train.duration}</span>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{train.arrival}</p>
                          <p className="text-[10px] text-muted-foreground">{language === 'fa' ? 'ورود' : 'Arr'}</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-end min-w-[90px]">
                        <p className="text-lg font-bold text-accent">{formatPrice(train.price)}</p>
                        <p className="text-[10px] text-muted-foreground">{language === 'fa' ? 'تومان' : 'Toman'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter Box - Sidebar (Right side) */}
            <div className="hidden lg:block w-72 shrink-0">
              <FilterBox />
            </div>
          </div>

          {/* Submit Button - Fixed at bottom when items selected */}
          {selectedTrains.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
              <Button 
                onClick={handleSubmit}
                className="gradient-primary hover:opacity-90 px-8 py-3 rounded-full shadow-lg text-base font-semibold gap-2"
              >
                <span className="material-symbols-outlined">check_circle</span>
                {language === 'fa' 
                  ? `رزرو ${selectedTrains.length} قطار انتخاب شده` 
                  : `Book ${selectedTrains.length} Selected Train(s)`
                }
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchResults;