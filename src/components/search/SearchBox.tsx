import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns-jalali';
import { faIR } from 'date-fns-jalali/locale';

const cities = [
  { value: 'tehran', labelFa: 'تهران', labelEn: 'Tehran' },
  { value: 'mashhad', labelFa: 'مشهد', labelEn: 'Mashhad' },
  { value: 'isfahan', labelFa: 'اصفهان', labelEn: 'Isfahan' },
  { value: 'shiraz', labelFa: 'شیراز', labelEn: 'Shiraz' },
  { value: 'tabriz', labelFa: 'تبریز', labelEn: 'Tabriz' },
  { value: 'yazd', labelFa: 'یزد', labelEn: 'Yazd' },
  { value: 'ahvaz', labelFa: 'اهواز', labelEn: 'Ahvaz' },
  { value: 'bandarabbas', labelFa: 'بندرعباس', labelEn: 'Bandar Abbas' },
  { value: 'kermanshah', labelFa: 'کرمانشاه', labelEn: 'Kermanshah' },
  { value: 'qom', labelFa: 'قم', labelEn: 'Qom' },
];

export function SearchBox() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date>();
  const [passengers, setPassengers] = useState('1');

  const handleSearch = () => {
    if (origin && destination && date) {
      const searchParams = new URLSearchParams({
        from: origin,
        to: destination,
        date: date.toISOString(),
        passengers,
      });
      navigate(`/search?${searchParams.toString()}`);
    }
  };

  const getCityLabel = (city: typeof cities[0]) => 
    language === 'fa' ? city.labelFa : city.labelEn;

  return (
    <div className="bg-card/95 backdrop-blur-md rounded-2xl p-6 shadow-soft border border-border w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Origin */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <span className="material-symbols-outlined text-base">trip_origin</span>
            {t('origin')}
          </label>
          <Select value={origin} onValueChange={setOrigin}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t('selectCity')} />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {getCityLabel(city)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Destination */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <span className="material-symbols-outlined text-base">location_on</span>
            {t('destination')}
          </label>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t('selectCity')} />
            </SelectTrigger>
            <SelectContent>
              {cities.filter(c => c.value !== origin).map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {getCityLabel(city)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <span className="material-symbols-outlined text-base">calendar_month</span>
            {t('date')}
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-12 w-full justify-start text-start font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                {date ? (
                  format(date, 'yyyy/MM/dd', { locale: faIR })
                ) : (
                  <span>{t('selectDate')}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Passengers */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <span className="material-symbols-outlined text-base">group</span>
            {t('passengers')}
          </label>
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {t('passenger')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button
            onClick={handleSearch}
            className="h-12 w-full gradient-primary hover:opacity-90 transition-opacity text-base font-semibold gap-2"
            disabled={!origin || !destination || !date}
          >
            <span className="material-symbols-outlined">search</span>
            {t('search')}
          </Button>
        </div>
      </div>
    </div>
  );
}