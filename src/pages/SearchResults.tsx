import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
  const { t } = useLanguage();
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
      <div className="bg-primary/5 py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-1">
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
              {t('back')}
            </Button>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span className="material-symbols-outlined text-primary">train</span>
              <span>{cities[from]}</span>
              <span className="material-symbols-outlined text-muted-foreground">arrow_back</span>
              <span>{cities[to]}</span>
            </div>
            <span className="text-muted-foreground text-sm">({passengers} {t('passenger')})</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{t('searchResults')}</h1>

        <div className="space-y-4">
          {trains.map((train) => (
            <Card
              key={train.id}
              className={`p-4 sm:p-6 transition-all cursor-pointer hover:shadow-lg ${
                selectedTrain === train.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedTrain(train.id)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Train Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="size-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary-foreground">train</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">قطار {train.name}</h3>
                    <p className="text-sm text-muted-foreground">شماره {train.number}</p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-6 flex-1 justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{train.departure}</p>
                    <p className="text-xs text-muted-foreground">{t('departure')}</p>
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
                    <p className="text-xs text-muted-foreground">{t('arrival')}</p>
                  </div>
                </div>

                {/* Seats */}
                <div className="text-center px-4">
                  <p className="text-lg font-semibold text-success">{train.seats}</p>
                  <p className="text-xs text-muted-foreground">{t('availableSeats')}</p>
                </div>

                {/* Price & Action */}
                <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                  <div className="text-start lg:text-end">
                    <p className="text-2xl font-bold text-primary">{formatPrice(train.price)}</p>
                    <p className="text-xs text-muted-foreground">{t('toman')}</p>
                  </div>
                  <Button onClick={() => handleSelect(train.id)} className="gradient-primary gap-1">
                    {t('selectTrain')}
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
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