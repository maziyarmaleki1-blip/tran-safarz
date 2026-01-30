import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SearchBox } from '@/components/search/SearchBox';

const trains = [
  { id: 1, name: 'فدک', number: '301', departure: '06:00', arrival: '16:30', duration: '10:30', price: 250000, seats: 45 },
  { id: 2, name: 'غزال', number: '302', departure: '08:30', arrival: '18:45', duration: '10:15', price: 320000, seats: 23 },
  { id: 3, name: 'پردیس', number: '303', departure: '14:00', arrival: '23:30', duration: '9:30', price: 450000, seats: 12 },
  { id: 4, name: 'سبز', number: '304', departure: '20:00', arrival: '06:15', duration: '10:15', price: 280000, seats: 67 },
  { id: 5, name: 'نور', number: '305', departure: '22:30', arrival: '08:45', duration: '10:15', price: 350000, seats: 34 },
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
      {/* Search Box Section */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-8">
        <div className="container mx-auto px-4">
          <SearchBox />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header with Title and Route Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">{t('searchResults')}</h1>
          <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="font-semibold">{cities[from]}</span>
            <span className="material-symbols-outlined text-primary">arrow_back</span>
            <span className="font-semibold">{cities[to]}</span>
          </div>
        </div>

        <div className="space-y-4">
          {trains.map((train, index) => (
            <Card
              key={train.id}
              className={`p-4 sm:p-6 transition-all cursor-pointer hover:shadow-lg overflow-hidden ${
                selectedTrain === train.id ? 'ring-2 ring-primary' : ''
              } ${index === 0 ? 'bg-gradient-to-l from-primary/10 via-primary/5 to-transparent' : ''}`}
              onClick={() => setSelectedTrain(train.id)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Train Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="size-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary-foreground">train</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{train.name}</h3>
                    <p className="text-sm text-muted-foreground">{language === 'fa' ? 'شماره قطار:' : 'Train No:'} {train.number}</p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-6 flex-1 justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{train.departure}</p>
                    <p className="text-xs text-muted-foreground">{language === 'fa' ? 'حرکت' : 'Departure'}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {train.duration}
                    </div>
                    <div className="w-20 h-0.5 bg-border relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 size-2 rounded-full bg-primary" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2 rounded-full bg-success" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{train.arrival}</p>
                    <p className="text-xs text-muted-foreground">{language === 'fa' ? 'ورود' : 'Arrival'}</p>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                  <div className="text-start lg:text-end">
                    <p className="text-2xl font-bold text-accent">{formatPrice(train.price)}</p>
                    <p className="text-xs text-muted-foreground">{language === 'fa' ? 'تومان' : 'Toman'}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(train.id);
                    }} 
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    {language === 'fa' ? 'انتخاب' : 'Select'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchResults;