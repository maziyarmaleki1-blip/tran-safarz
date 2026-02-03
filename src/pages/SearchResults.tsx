import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';

import { FilterBox, FilterState } from '@/components/search/FilterBox';
import { TrainRow } from '@/components/search/TrainRow';
import { DateNavigation } from '@/components/search/DateNavigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-train.jpg';

const trains = [
  { id: 1, name: 'اکونومی پلاس', number: '۵۸۴', departure: '06:22', departureHour: 6, arrival: '13:08', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1990000, compartmentType: 'کوپه ای ۴ نفره', rating: '۵ ستاره', amenities: 'با شام و پانیها', status: 'sold_out' as const },
  { id: 2, name: 'ایران', number: '۳۲۴', departure: '17:35', departureHour: 17, arrival: '00:21', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1990000, compartmentType: 'کوپه ای ۴ نفره', rating: '۵ ستاره', amenities: 'با پذیرایی و شام', status: 'sold_out' as const },
  { id: 3, name: 'اکونومی پلاس فدک', number: '۳۴۴', departure: '20:30', departureHour: 20, arrival: '03:16', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1990000, compartmentType: 'کوپه ای ۴ نفره', rating: '۵ ستاره', status: 'sold_out' as const },
  { id: 4, name: 'رویال', number: '۳۸۶', departure: '20:50', departureHour: 20, arrival: '03:36', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1990000, compartmentType: 'کوپه ای ۴ نفره', rating: '۵ ستاره', amenities: 'با پذیرایی عصرانه و شام', status: 'sold_out' as const },
  { id: 5, name: 'اکونومی پلاس', number: '۳۶۶', departure: '21:10', departureHour: 21, arrival: '03:56', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1990000, compartmentType: 'کوپه ای ۴ نفره', rating: '۵ ستاره', status: 'available' as const },
  { id: 6, name: 'اکونومی پلاس', number: '۳۶۲', departure: '21:50', departureHour: 21, arrival: '04:36', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1990000, compartmentType: 'کوپه ای ۴ نفره', rating: '۵ ستاره', status: 'few_left' as const },
  { id: 7, name: 'زمرد', number: '۱۶۶', departure: '22:50', departureHour: 22, arrival: '05:36', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1990000, compartmentType: 'کوپه ای ۴ نفره', rating: '۵ ستاره', amenities: 'با پذیرایی و شام', status: 'available' as const },
];

const cities: Record<string, string> = {
  tehran: 'تهران', mashhad: 'مشهد', isfahan: 'اصفهان', shiraz: 'شیراز',
  tabriz: 'تبریز', yazd: 'یزد', ahvaz: 'اهواز', bandarabbas: 'بندرعباس',
  kermanshah: 'کرمانشاه', qom: 'قم',
};

const SearchResults = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('سه شنبه ۱۴۰۴/۱۱/۱۴');

  const handlePrevDay = () => {
    // TODO: Implement actual date logic
    setCurrentDate('دوشنبه ۱۴۰۴/۱۱/۱۳');
  };

  const handleNextDay = () => {
    // TODO: Implement actual date logic
    setCurrentDate('چهارشنبه ۱۴۰۴/۱۱/۱۵');
  };
  
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [440000, 2450000],
    departureTimeSlots: [],
    compartmentTypes: [],
  });

  const from = searchParams.get('from') || 'tehran';
  const to = searchParams.get('to') || 'mashhad';

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
    
    return true;
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
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
          {/* Main Layout */}
          <div className="flex gap-4">
            {/* Filter Box - Sidebar (Desktop Only) */}
            <div className="hidden lg:block w-72 shrink-0">
              <FilterBox onFilterChange={handleFilterChange} />
            </div>

            {/* Train Rows - Main Content */}
            <div className="flex-1">
              {/* Header with Route Info and Date Navigation */}
              <div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl p-4 mb-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* Route Info */}
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-2xl text-primary">train</span>
                    <div className="text-center md:text-right">
                      <h2 className="font-bold text-lg">
                        {cities[from] || from} → {cities[to] || to}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {language === 'fa' ? 'انتخاب قطار رفت' : 'Select Outbound Train'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Date Navigation */}
                  <DateNavigation 
                    currentDate={currentDate}
                    onPrevDay={handlePrevDay}
                    onNextDay={handleNextDay}
                  />
                </div>
              </div>

              {/* Booking Instructions Banner */}
              <div className="bg-primary/10 backdrop-blur-md border border-primary/30 rounded-xl p-3 mb-4">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-lg mt-0.5">info</span>
                  <p className="text-sm text-foreground">
                    {language === 'fa' 
                      ? 'ابتدا فیلترهای مورد نظر خود را انتخاب کنید، سپس دکمه «ثبت رزرو» را بزنید تا به مرحله تکمیل اطلاعات مسافران منتقل شوید.'
                      : 'First select your desired filters, then click "Submit Booking" to proceed to passenger information.'}
                  </p>
                </div>
              </div>

              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-3">
                <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 bg-card/80 backdrop-blur-md">
                      <span className="material-symbols-outlined text-lg">tune</span>
                      {language === 'fa' ? 'فیلتر نتایج' : 'Filter Results'}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 p-0">
                    <div className="p-4">
                      <FilterBox onFilterChange={handleFilterChange} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Train List */}
              <div className="space-y-2">
                {filteredTrains.length === 0 ? (
                  <div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-muted-foreground mb-2">search_off</span>
                    <p className="text-muted-foreground">
                      {language === 'fa' ? 'قطاری با این فیلترها یافت نشد' : 'No trains found with these filters'}
                    </p>
                  </div>
                ) : (
                  filteredTrains.map((train) => (
                    <TrainRow 
                      key={train.id}
                      train={train}
                      date={currentDate}
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
    </MainLayout>
  );
};

export default SearchResults;
