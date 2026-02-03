import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { SearchBox } from '@/components/search/SearchBox';
import { FilterBox, FilterState } from '@/components/search/FilterBox';
import { TrainRow } from '@/components/search/TrainRow';
import { SortOptions, SortOption } from '@/components/search/SortOptions';
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
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [currentDate, setCurrentDate] = useState('سه شنبه ۱۴۰۴/۱۱/۱۴');
  
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [440000, 2450000],
    departureTime: [0, 24],
    duration: [0, 12],
    compartmentTypes: [],
  });

  const from = searchParams.get('from') || 'tehran';
  const to = searchParams.get('to') || 'mashhad';

  // Apply filters
  const filteredTrains = trains.filter(train => {
    if (train.price < filters.priceRange[0] || train.price > filters.priceRange[1]) return false;
    if (train.departureHour < filters.departureTime[0] || train.departureHour > filters.departureTime[1]) return false;
    const durationHours = train.durationMinutes / 60;
    if (durationHours < filters.duration[0] || durationHours > filters.duration[1]) return false;
    return true;
  });

  // Apply sorting
  const sortedTrains = [...filteredTrains].sort((a, b) => {
    switch (sortOption) {
      case 'departure':
        return a.departureHour - b.departureHour;
      case 'cheapest':
        return a.price - b.price;
      case 'expensive':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handlePrevDay = () => {
    // Placeholder - would decrement date
    setCurrentDate('دوشنبه ۱۴۰۴/۱۱/۱۳');
  };

  const handleNextDay = () => {
    // Placeholder - would increment date
    setCurrentDate('چهارشنبه ۱۴۰۴/۱۱/۱۵');
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
        {/* Search Box Section */}
        <div className="py-4 lg:py-6">
          <div className="container mx-auto px-4">
            <SearchBox />
          </div>
        </div>

        <div className="container mx-auto px-4 py-4">
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
                currentDate={currentDate}
                onPrevDay={handlePrevDay}
                onNextDay={handleNextDay}
              />
            </div>

            {/* Sort Options */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <SortOptions activeSort={sortOption} onSortChange={setSortOption} />
            </div>

            {/* Notice Banner */}
            <div className="mt-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-xs text-amber-800 dark:text-amber-200 text-center">
                {language === 'fa' 
                  ? 'مسافرین محترم توجه داشته باشید که هر روز بلیط های استردادی برای خرید، به لیست بلیط ها اضافه میشود و شما میتوانید آنها را خریداری نمایید، ساعات اضافه شدن به لیست فروش: (۰۵:۰۰، ۰۹:۰۰، ۱۲:۰۰، ۱۵:۰۰، ۱۷:۰۰ و ۱۹:۰۰)'
                  : 'Dear passengers, refunded tickets are added daily at 05:00, 09:00, 12:00, 15:00, 17:00 and 19:00'
                }
              </p>
            </div>
          </div>

          {/* Main Layout */}
          <div className="flex gap-4">
            {/* Filter Box - Sidebar (Desktop Only) */}
            <div className="hidden lg:block w-72 shrink-0">
              <FilterBox onFilterChange={handleFilterChange} />
            </div>

            {/* Train Rows - Main Content */}
            <div className="flex-1">
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
                {sortedTrains.length === 0 ? (
                  <div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-muted-foreground mb-2">search_off</span>
                    <p className="text-muted-foreground">
                      {language === 'fa' ? 'قطاری با این فیلترها یافت نشد' : 'No trains found with these filters'}
                    </p>
                  </div>
                ) : (
                  sortedTrains.map((train) => (
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
