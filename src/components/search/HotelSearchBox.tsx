import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import PersianCalendar from '@/components/PersianCalendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { formatPersianDate } from '@/lib/persianDate';
import { toast } from 'sonner';

export function HotelSearchBox() {
  const { language } = useLanguage();
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  const labels = {
    fa: {
      city: 'شهر مقصد',
      selectCity: 'انتخاب شهر',
      checkIn: 'تاریخ ورود',
      checkOut: 'تاریخ خروج',
      selectDate: 'انتخاب تاریخ',
      guests: 'تعداد مهمان',
      rooms: 'تعداد اتاق',
      search: 'جستجوی هتل',
      soon: 'به زودی فعال می‌شود',
    },
    en: {
      city: 'Destination City',
      selectCity: 'Select City',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      selectDate: 'Select Date',
      guests: 'Guests',
      rooms: 'Rooms',
      search: 'Search Hotels',
      soon: 'Coming soon',
    },
    ar: {
      city: 'مدينة الوجهة',
      selectCity: 'اختر المدينة',
      checkIn: 'تاريخ الوصول',
      checkOut: 'تاريخ المغادرة',
      selectDate: 'اختر التاريخ',
      guests: 'الضيوف',
      rooms: 'الغرف',
      search: 'بحث الفنادق',
      soon: 'قريباً',
    },
  }[language];

  const cities = [
    { value: 'tehran', fa: 'تهران', en: 'Tehran', ar: 'طهران' },
    { value: 'mashhad', fa: 'مشهد', en: 'Mashhad', ar: 'مشهد' },
    { value: 'isfahan', fa: 'اصفهان', en: 'Isfahan', ar: 'أصفهان' },
    { value: 'shiraz', fa: 'شیراز', en: 'Shiraz', ar: 'شيراز' },
    { value: 'kish', fa: 'کیش', en: 'Kish', ar: 'كيش' },
    { value: 'qeshm', fa: 'قشم', en: 'Qeshm', ar: 'قشم' },
  ];

  const handleSearch = () => {
    if (!city || !checkIn || !checkOut) return;
    toast.info(labels.soon);
  };

  return (
    <div className="bg-card/75 backdrop-blur-md rounded-2xl p-4 shadow-soft border border-border w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 items-end gap-3">
        {/* City */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">{labels.city}</label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="h-10 bg-background/50 text-sm">
              <SelectValue placeholder={labels.selectCity} />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c[language]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Check-in */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">{labels.checkIn}</label>
          <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn('w-full h-10 justify-start text-start font-normal bg-background/50 text-sm', !checkIn && 'text-muted-foreground')}
              >
                {checkIn
                  ? language !== 'en' ? formatPersianDate(checkIn) : format(checkIn, 'PP', { locale: enUS })
                  : labels.selectDate}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {language !== 'en' ? (
                <PersianCalendar
                  selected={checkIn}
                  onSelect={(d) => { setCheckIn(d); setCheckInOpen(false); }}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  mode="future"
                />
              ) : (
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={(d) => { setCheckIn(d); setCheckInOpen(false); }}
                  initialFocus
                  locale={enUS}
                  className="p-3 pointer-events-auto"
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">{labels.checkOut}</label>
          <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn('w-full h-10 justify-start text-start font-normal bg-background/50 text-sm', !checkOut && 'text-muted-foreground')}
              >
                {checkOut
                  ? language !== 'en' ? formatPersianDate(checkOut) : format(checkOut, 'PP', { locale: enUS })
                  : labels.selectDate}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {language !== 'en' ? (
                <PersianCalendar
                  selected={checkOut}
                  onSelect={(d) => { setCheckOut(d); setCheckOutOpen(false); }}
                  disabled={(d) => d < (checkIn || new Date(new Date().setHours(0, 0, 0, 0)))}
                  mode="future"
                />
              ) : (
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={(d) => { setCheckOut(d); setCheckOutOpen(false); }}
                  initialFocus
                  locale={enUS}
                  className="p-3 pointer-events-auto"
                  disabled={(d) => d < (checkIn || new Date(new Date().setHours(0, 0, 0, 0)))}
                />
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">{labels.guests}</label>
          <Input
            type="number"
            min={1}
            max={20}
            value={guests}
            onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
            className="h-10 bg-background/50"
          />
        </div>

        {/* Rooms */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">{labels.rooms}</label>
          <Input
            type="number"
            min={1}
            max={10}
            value={rooms}
            onChange={(e) => setRooms(Math.max(1, parseInt(e.target.value) || 1))}
            className="h-10 bg-background/50"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          onClick={handleSearch}
          disabled={!city || !checkIn || !checkOut}
          className="h-11 px-8 gradient-primary hover:opacity-90 font-semibold gap-2 text-base"
        >
          <span className="material-symbols-outlined text-xl">search</span>
          {labels.search}
        </Button>
      </div>
    </div>
  );
}
