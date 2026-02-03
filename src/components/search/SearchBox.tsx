import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import PersianCalendar from '@/components/PersianCalendar';
import { TripTypeTabs, TripType } from './TripTypeTabs';
import { PassengerSelector, PassengerCount } from './PassengerSelector';
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
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ArrowLeftRight } from 'lucide-react';
import { formatPersianDate } from '@/lib/persianDate';

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
  const [tripType, setTripType] = useState<TripType>('one-way');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState<PassengerCount>({
    adults: 1,
    children: 0,
    passengerType: 'regular',
  });
  const [privateCompartment, setPrivateCompartment] = useState(false);
  const [foreignNational, setForeignNational] = useState(false);

  const handleSearch = () => {
    if (origin && destination && departureDate) {
      const totalPassengers = passengers.adults + passengers.children;
      const searchParams = new URLSearchParams({
        from: origin,
        to: destination,
        date: departureDate.toISOString(),
        passengers: totalPassengers.toString(),
        adults: passengers.adults.toString(),
        children: passengers.children.toString(),
        passengerType: passengers.passengerType,
        tripType,
        privateCompartment: privateCompartment.toString(),
        foreignNational: foreignNational.toString(),
      });
      if (tripType === 'round-trip' && returnDate) {
        searchParams.set('returnDate', returnDate.toISOString());
      }
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

  const dateLabels = {
    fa: { departure: 'تاریخ رفت', return: 'تاریخ برگشت' },
    en: { departure: 'Departure', return: 'Return' },
  };

  return (
    <div className="bg-card/75 backdrop-blur-md rounded-2xl p-4 shadow-soft border border-border w-full max-w-6xl mx-auto">
      {/* Trip Type Tabs */}
      <div className="flex justify-center mb-4">
        <TripTypeTabs value={tripType} onChange={setTripType} />
      </div>

      {/* Main Search - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-end gap-3">
        {/* Origin & Destination Row */}
        <div className="col-span-1 sm:col-span-2 lg:contents">
          <div className="flex items-end gap-2 sm:col-span-2 lg:contents">
            {/* Origin */}
            <div className="flex-1 lg:flex-1 lg:min-w-[120px]">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
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
            <div className="flex-1 lg:flex-1 lg:min-w-[120px]">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
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
          </div>
        </div>

        {/* Departure Date */}
        <div className="col-span-1 lg:flex-1 lg:min-w-[130px]">
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            {dateLabels[language].departure}
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full h-10 justify-start text-start font-normal bg-background/50 text-sm',
                  !departureDate && 'text-muted-foreground'
                )}
              >
                {departureDate 
                  ? (language === 'fa' ? formatPersianDate(departureDate) : format(departureDate, "PP", { locale: enUS }))
                  : <span>{t('selectDate')}</span>
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {language === 'fa' ? (
                <PersianCalendar
                  selected={departureDate}
                  onSelect={(d) => setDepartureDate(d)}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  mode="future"
                />
              ) : (
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  initialFocus
                  locale={enUS}
                  className={cn("p-3 pointer-events-auto")}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* Return Date (only for round-trip) */}
        {tripType === 'round-trip' && (
          <div className="col-span-1 lg:flex-1 lg:min-w-[130px]">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              {dateLabels[language].return}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full h-10 justify-start text-start font-normal bg-background/50 text-sm',
                    !returnDate && 'text-muted-foreground'
                  )}
                >
                  {returnDate 
                    ? (language === 'fa' ? formatPersianDate(returnDate) : format(returnDate, "PP", { locale: enUS }))
                    : <span>{t('selectDate')}</span>
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                {language === 'fa' ? (
                  <PersianCalendar
                    selected={returnDate}
                    onSelect={(d) => setReturnDate(d)}
                    disabled={(d) => d < (departureDate || new Date(new Date().setHours(0, 0, 0, 0)))}
                    mode="future"
                  />
                ) : (
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    initialFocus
                    locale={enUS}
                    className={cn("p-3 pointer-events-auto")}
                    disabled={(d) => d < (departureDate || new Date(new Date().setHours(0, 0, 0, 0)))}
                  />
                )}
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Passengers */}
        <div className="col-span-1 lg:w-32">
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            {t('passengers')}
          </label>
          <PassengerSelector value={passengers} onChange={setPassengers} />
        </div>

        {/* Search Button */}
        <div className="col-span-1 sm:col-span-2 lg:col-auto">
          <Button
            onClick={handleSearch}
            className="w-full lg:w-auto h-10 px-6 shrink-0 gradient-primary hover:opacity-90 transition-opacity font-semibold gap-2"
            disabled={!origin || !destination || !departureDate}
          >
            <span className="material-symbols-outlined text-lg">search</span>
            {t('search')}
          </Button>
        </div>
      </div>

      {/* Checkbox Options Row */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-3 pt-3 border-t border-border/30">
        <div className="flex items-center gap-2">
          <Checkbox
            id="privateCompartment"
            checked={privateCompartment}
            onCheckedChange={(checked) => setPrivateCompartment(checked === true)}
            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <label htmlFor="privateCompartment" className="text-sm font-medium cursor-pointer">
            {language === 'fa' ? 'کوپه دربست' : 'Private Compartment'}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="foreignNational"
            checked={foreignNational}
            onCheckedChange={(checked) => setForeignNational(checked === true)}
            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <label htmlFor="foreignNational" className="text-sm font-medium cursor-pointer">
            {language === 'fa' ? 'اتباع خارجی' : 'Foreign National'}
          </label>
        </div>
      </div>
    </div>
  );
}
