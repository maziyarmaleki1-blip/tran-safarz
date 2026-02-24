import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPersianDate, gregorianToJalali, toPersianDigits } from '@/lib/persianDate';

import { FilterBox, FilterState } from '@/components/search/FilterBox';
import { TrainRow } from '@/components/search/TrainRow';
import { DateNavigation } from '@/components/search/DateNavigation';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-train.jpg';
import { format, addDays, subDays } from 'date-fns';

const trains = [
  { id: 1, name: 'اکونومی پلاس', number: '۵۸۴', departure: '06:22', departureHour: 6, arrival: '13:08', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1990000, compartmentType: 'کوپه ای ۴ نفره', compartmentId: '4تخته5ستاره', rating: '۵ ستاره', amenities: 'با شام و پانیها', status: 'sold_out' as const },
  { id: 2, name: 'ایران', number: '۳۲۴', departure: '17:35', departureHour: 17, arrival: '00:21', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1990000, compartmentType: 'کوپه ای ۴ نفره', compartmentId: '4تخته5ستاره', rating: '۵ ستاره', amenities: 'با پذیرایی و شام', status: 'sold_out' as const },
  { id: 3, name: 'اکونومی پلاس فدک', number: '۳۴۴', departure: '20:30', departureHour: 20, arrival: '03:16', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1990000, compartmentType: 'کوپه ای ۴ نفره', compartmentId: '4تخته5ستاره', rating: '۵ ستاره', status: 'sold_out' as const },
  { id: 4, name: 'رویال', number: '۳۸۶', departure: '20:50', departureHour: 20, arrival: '03:36', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1850000, compartmentType: 'کوپه ای ۴ نفره', compartmentId: '4تخته4ستاره', rating: '۴ ستاره', amenities: 'با پذیرایی عصرانه و شام', status: 'sold_out' as const },
  { id: 5, name: 'اکونومی پلاس', number: '۳۶۶', departure: '21:10', departureHour: 21, arrival: '03:56', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1990000, compartmentType: 'کوپه ای ۴ نفره', compartmentId: '4تخته5ستاره', rating: '۵ ستاره', status: 'available' as const },
  { id: 6, name: 'اکونومی پلاس', number: '۳۶۲', departure: '21:50', departureHour: 21, arrival: '04:36', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1650000, compartmentType: 'کوپه ای ۶ نفره', compartmentId: '6تخته3ستاره', rating: '۳ ستاره', status: 'few_left' as const },
  { id: 7, name: 'زمرد', number: '۱۶۶', departure: '22:50', departureHour: 22, arrival: '05:36', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1750000, compartmentType: 'کوپه ای ۴ نفره', compartmentId: '4تخته4ستاره', rating: '۴ ستاره', amenities: 'با پذیرایی و شام', status: 'available' as const },
];

const cities: Record<string, string> = {
  tehran: 'تهران', mashhad: 'مشهد', isfahan: 'اصفهان', shiraz: 'شیراز',
  tabriz: 'تبریز', yazd: 'یزد', ahvaz: 'اهواز', bandarabbas: 'بندرعباس',
  kermanshah: 'کرمانشاه', qom: 'قم',
};

const persianWeekDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

const getPersianWeekDay = (date: Date) => {
  const day = date.getDay();
  return persianWeekDays[day];
};

const formatPersianFullDate = (date: Date) => {
  const [jy, jm, jd] = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const weekDay = getPersianWeekDay(date);
  return `${weekDay} ${toPersianDigits(jy)}/${toPersianDigits(jm.toString().padStart(2, '0'))}/${toPersianDigits(jd.toString().padStart(2, '0'))}`;
};

const SearchResults = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [440000, 2450000],
    departureTimeSlots: [],
    compartmentTypes: [],
    customerNotes: '',
    privateCompartment: false,
    foreignNational: false,
  });

  const from = searchParams.get('from') || 'tehran';
  const to = searchParams.get('to') || 'mashhad';
  const passengerType = searchParams.get('passengerType') || 'regular';
  const adultsCount = parseInt(searchParams.get('adults') || '1');
  const childrenCount = parseInt(searchParams.get('children') || '0');
  const dateParam = searchParams.get('date');
  const currentDate = useMemo(() => {
    return dateParam ? new Date(dateParam) : new Date();
  }, [dateParam]);

  const formattedDate = language === 'fa' 
    ? formatPersianFullDate(currentDate) 
    : format(currentDate, 'EEEE yyyy/MM/dd');

  // Apply filters
  const filteredTrains = trains.filter(train => {
    if (train.price < filters.priceRange[0] || train.price > filters.priceRange[1]) return false;
    
    // Filter by time slots
    if (filters.departureTimeSlots.length > 0) {
      const matchesSlot = filters.departureTimeSlots.some(slot => {
        const [start, end] = slot.split('-').map(Number);
        return train.departureHour >= start && train.departureHour < end;
      });
      if (!matchesSlot) return false;
    }

    // Filter by compartment type
    if (filters.compartmentTypes.length > 0) {
      if (!filters.compartmentTypes.includes(train.compartmentId)) return false;
    }
    
    return true;
  });

  const sortedTrains = filteredTrains;

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handlePrevDay = () => {
    const newDate = subDays(currentDate, 1);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('date', newDate.toISOString());
    setSearchParams(newParams);
  };

  const handleNextDay = () => {
    const newDate = addDays(currentDate, 1);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('date', newDate.toISOString());
    setSearchParams(newParams);
  };

  const handleSubmitBooking = () => {
    // Save selected filters to session storage for later use in Payment
    sessionStorage.setItem('selectedFilters', JSON.stringify({
      compartmentTypes: filters.compartmentTypes,
      departureTimeSlots: filters.departureTimeSlots,
      priceRangeMin: filters.priceRange[0],
      priceRangeMax: filters.priceRange[1],
      customerNotes: filters.customerNotes,
      privateCompartment: filters.privateCompartment,
      foreignNational: filters.foreignNational,
      passengerType,
      adultsCount,
      childrenCount,
    }));
    
    // Navigate to booking page with search params
    const bookingParams = new URLSearchParams({
      from,
      to,
      date: currentDate.toISOString(),
      passengers: searchParams.get('passengers') || '1',
      adults: searchParams.get('adults') || '1',
      children: searchParams.get('children') || '0',
    });
    navigate(`/booking?${bookingParams.toString()}`);
  };

  return (
    <MainLayout>
      {/* Fixed Full-Screen Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-6">
          {/* Header with Route Info */}
          <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl p-4 mb-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Route Title */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">train</span>
                </div>
                <h1 className="text-lg font-bold">
                  {language === 'fa' 
                    ? `انتخاب قطار رفت ${cities[from]} به ${cities[to]}`
                    : `Select Train from ${cities[from]} to ${cities[to]}`
                  }
                </h1>
              </div>

              {/* Date Navigation */}
              <DateNavigation 
                currentDate={formattedDate}
                onPrevDay={handlePrevDay}
                onNextDay={handleNextDay}
              />
            </div>

              {/* Step-by-Step Process Guide */}
            <div className="mt-4 bg-muted/40 border border-border/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-3 text-center">{t('howItWorks')}</p>
              <div className="grid grid-cols-4 gap-1 sm:gap-2 relative">
                {[
                  { icon: 'edit_note', title: t('step1Title'), desc: t('step1Desc'), active: true },
                  { icon: 'manage_search', title: t('step2Title'), desc: t('step2Desc'), active: false },
                  { icon: 'payments', title: t('step3Title'), desc: t('step3Desc'), active: false },
                  { icon: 'confirmation_number', title: t('step4Title'), desc: t('step4Desc'), active: false },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-1.5 relative">
                    {/* Connector line */}
                    {i < 3 && (
                      <div className="hidden sm:block absolute top-5 start-[calc(50%+16px)] w-[calc(100%-32px)] h-0.5 bg-border/60 z-0" />
                    )}
                    <div className={`relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      step.active
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted border border-border text-muted-foreground'
                    }`}>
                      <span className="material-symbols-outlined text-lg sm:text-xl">{step.icon}</span>
                    </div>
                    <span className={`text-[10px] sm:text-xs font-bold leading-tight ${step.active ? 'text-primary' : 'text-foreground'}`}>
                      {step.title}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight hidden sm:block">
                      {step.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

            {/* Mobile Filter - Above Train List */}
          <div className="lg:hidden mb-4">
            <FilterBox onFilterChange={handleFilterChange} onHasInteracted={setHasInteracted} />
          </div>

            {/* Main Layout */}
          <div className="flex gap-4">
            {/* Filter Box - Sidebar (Desktop/Tablet Only) */}
            <div className="hidden lg:block w-72 shrink-0">
              <FilterBox onFilterChange={handleFilterChange} onHasInteracted={setHasInteracted} />
            </div>

            {/* Train Rows - Main Content */}
            <div className="flex-1">
              {/* Train List */}
              <div className="space-y-2">
                {sortedTrains.length === 0 ? (
                  <div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-muted-foreground mb-2">search_off</span>
                    <p className="text-muted-foreground">
                      {t('noTrainsFound')}
                    </p>
                  </div>
                ) : (
                  sortedTrains.map((train) => (
                    <TrainRow 
                      key={train.id}
                      train={train}
                      date={formattedDate}
                      from={from}
                      to={to}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Submit Button */}
      {hasInteracted && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <Button
            onClick={handleSubmitBooking}
            className="relative overflow-hidden bg-primary/80 hover:bg-primary text-primary-foreground font-bold h-14 px-16 text-lg rounded-full shadow-xl transition-all duration-500 hover:shadow-primary/30 hover:shadow-2xl hover:scale-[1.02] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700"
            size="lg"
          >
            <span className="material-symbols-outlined ml-2">check_circle</span>
            {t('submitBooking')}
          </Button>
        </div>
      )}
    </MainLayout>
  );
};

export default SearchResults;
