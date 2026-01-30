import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { JalaliCalendar } from '@/components/ui/jalali-calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns-jalali';
import { faIR } from 'date-fns-jalali/locale';
import { ArrowLeftRight } from 'lucide-react';

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
  const [privateCompartment, setPrivateCompartment] = useState(false);
  const [foreignNational, setForeignNational] = useState(false);

  const handleSearch = () => {
    if (origin && destination && date) {
      const searchParams = new URLSearchParams({
        from: origin,
        to: destination,
        date: date.toISOString(),
        passengers,
        privateCompartment: privateCompartment.toString(),
        foreignNational: foreignNational.toString(),
      });
      navigate(`/search?${searchParams.toString()}`);
    }
  };

  const handleSwapCities = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const getCityLabel = (city: typeof cities[0]) => 
    language === 'fa' ? city.labelFa : city.labelEn;

  return (
    <div className="bg-card/95 backdrop-blur-md rounded-2xl p-4 shadow-soft border border-border w-full max-w-6xl mx-auto">
      {/* Main Search Row */}
      <div className="flex flex-wrap items-end gap-2">
        {/* Origin */}
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t('origin')}
          </label>
          <Select value={origin} onValueChange={setOrigin}>
            <SelectTrigger className="h-10 bg-background/50 text-sm">
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

        {/* Swap Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-primary/10 shrink-0"
          onClick={handleSwapCities}
          type="button"
        >
          <ArrowLeftRight className="w-4 h-4 text-primary" />
        </Button>

        {/* Destination */}
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t('destination')}
          </label>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className="h-10 bg-background/50 text-sm">
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
        <div className="flex-1 min-w-[130px]">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t('date')}
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full h-10 justify-start text-start font-normal bg-background/50 text-sm',
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
              <JalaliCalendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Passengers */}
        <div className="w-20">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            {t('passengers')}
          </label>
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger className="h-10 bg-background/50 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="h-10 px-6 shrink-0 gradient-primary hover:opacity-90 transition-opacity font-semibold gap-2"
          disabled={!origin || !destination || !date}
        >
          <span className="material-symbols-outlined text-lg">search</span>
          {t('search')}
        </Button>
      </div>

      {/* Radio Options Row */}
      <div className="flex flex-wrap items-center gap-6 mt-3 pt-3 border-t border-border/30">
        <div className="flex items-center gap-2">
          <RadioGroupItem
            value="privateCompartment"
            id="privateCompartment"
            checked={privateCompartment}
            onClick={() => setPrivateCompartment(!privateCompartment)}
            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <label htmlFor="privateCompartment" className="text-xs font-medium cursor-pointer">
            {language === 'fa' ? 'کوپه دربست' : 'Private Compartment'}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <RadioGroupItem
            value="foreignNational"
            id="foreignNational"
            checked={foreignNational}
            onClick={() => setForeignNational(!foreignNational)}
            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <label htmlFor="foreignNational" className="text-xs font-medium cursor-pointer">
            {language === 'fa' ? 'اتباع خارجی' : 'Foreign National'}
          </label>
        </div>
      </div>
    </div>
  );
}
