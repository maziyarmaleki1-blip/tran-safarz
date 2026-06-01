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

export function TourSearchBox() {
  const { language } = useLanguage();
  const [destination, setDestination] = useState('');
  const [tourType, setTourType] = useState('domestic');
  const [startDate, setStartDate] = useState<Date>();
  const [duration, setDuration] = useState(3);
  const [travelers, setTravelers] = useState(2);
  const [dateOpen, setDateOpen] = useState(false);

  const labels = {
    fa: {
      destination: 'مقصد تور',
      selectDestination: 'انتخاب مقصد',
      tourType: 'نوع تور',
      domestic: 'داخلی',
      international: 'خارجی',
      startDate: 'تاریخ شروع',
      selectDate: 'انتخاب تاریخ',
      duration: 'مدت (شب)',
      travelers: 'تعداد مسافران',
      search: 'جستجوی تور',
      soon: 'به زودی فعال می‌شود',
    },
    en: {
      destination: 'Tour Destination',
      selectDestination: 'Select Destination',
      tourType: 'Tour Type',
      domestic: 'Domestic',
      international: 'International',
      startDate: 'Start Date',
      selectDate: 'Select Date',
      duration: 'Nights',
      travelers: 'Travelers',
      search: 'Search Tours',
      soon: 'Coming soon',
    },
    ar: {
      destination: 'وجهة الجولة',
      selectDestination: 'اختر الوجهة',
      tourType: 'نوع الجولة',
      domestic: 'داخلية',
      international: 'دولية',
      startDate: 'تاريخ البدء',
      selectDate: 'اختر التاريخ',
      duration: 'الليالي',
      travelers: 'المسافرون',
      search: 'بحث الجولات',
      soon: 'قريباً',
    },
  }[language];

  const destinations = [
    { value: 'kish', fa: 'کیش', en: 'Kish', ar: 'كيش' },
    { value: 'qeshm', fa: 'قشم', en: 'Qeshm', ar: 'قشم' },
    { value: 'mashhad', fa: 'مشهد', en: 'Mashhad', ar: 'مشهد' },
    { value: 'istanbul', fa: 'استانبول', en: 'Istanbul', ar: 'إسطنبول' },
    { value: 'dubai', fa: 'دبی', en: 'Dubai', ar: 'دبي' },
    { value: 'antalya', fa: 'آنتالیا', en: 'Antalya', ar: 'أنطاليا' },
    { value: 'baghdad', fa: 'بغداد', en: 'Baghdad', ar: 'بغداد' },
  ];

  const handleSearch = () => {
    if (!destination || !startDate) return;
    toast.info(labels.soon);
  };

  return (
    <div className="bg-card/75 backdrop-blur-md rounded-2xl p-4 shadow-soft border border-border w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-end gap-3">
        {/* Tour type */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">{labels.tourType}</label>
          <Select value={tourType} onValueChange={setTourType}>
            <SelectTrigger className="h-10 bg-background/50 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="domestic">{labels.domestic}</SelectItem>
              <SelectItem value="international">{labels.international}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">{labels.destination}</label>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className="h-10 bg-background/50 text-sm">
              <SelectValue placeholder={labels.selectDestination} />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c[language]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start date */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">{labels.startDate}</label>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn('w-full h-10 justify-start text-start font-normal bg-background/50 text-sm', !startDate && 'text-muted-foreground')}
              >
                {startDate
                  ? language !== 'en' ? formatPersianDate(startDate) : format(startDate, 'PP', { locale: enUS })
                  : labels.selectDate}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {language !== 'en' ? (
                <PersianCalendar
                  selected={startDate}
                  onSelect={(d) => { setStartDate(d); setDateOpen(false); }}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  mode="future"
                />
              ) : (
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(d) => { setStartDate(d); setDateOpen(false); }}
                  initialFocus
                  locale={enUS}
                  className="p-3 pointer-events-auto"
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">{labels.duration}</label>
          <Input
            type="number"
            min={1}
            max={30}
            value={duration}
            onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
            className="h-10 bg-background/50"
          />
        </div>

        {/* Travelers */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">{labels.travelers}</label>
          <Input
            type="number"
            min={1}
            max={20}
            value={travelers}
            onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
            className="h-10 bg-background/50"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          onClick={handleSearch}
          disabled={!destination || !startDate}
          className="h-11 px-8 gradient-primary hover:opacity-90 font-semibold gap-2 text-base"
        >
          <span className="material-symbols-outlined text-xl">search</span>
          {labels.search}
        </Button>
      </div>
    </div>
  );
}
