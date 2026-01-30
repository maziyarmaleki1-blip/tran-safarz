import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchBox } from '@/components/search/SearchBox';
import { FilterBox, FilterState } from '@/components/search/FilterBox';
import heroImage from '@/assets/hero-train.jpg';

const trains = [
  { id: 1, name: 'غزال', number: '378', departure: '06:26', departureHour: 6, arrival: '13:08', duration: '۷ ساعت ۳۷ دقیقه', durationMinutes: 457, price: 1603370, compartmentType: '۴ تخته', compartmentId: '4نفره' },
  { id: 2, name: 'غزال', number: '827', departure: '08:46', departureHour: 8, arrival: '16:12', duration: '۸ ساعت ۵۱ دقیقه', durationMinutes: 531, price: 1435648, compartmentType: '۶ تخته', compartmentId: '6نفره' },
  { id: 3, name: 'غزال', number: '881', departure: '09:30', departureHour: 9, arrival: '14:36', duration: '۵ ساعت ۱۹ دقیقه', durationMinutes: 319, price: 1310465, compartmentType: 'اتوبوسی', compartmentId: 'اتوبوسی' },
  { id: 4, name: 'سبز', number: '304', departure: '20:00', departureHour: 20, arrival: '06:15', duration: '۱۰ ساعت ۱۵ دقیقه', durationMinutes: 615, price: 980000, compartmentType: '۴ تخته', compartmentId: '4نفره' },
  { id: 5, name: 'نور', number: '305', departure: '22:30', departureHour: 22, arrival: '08:45', duration: '۱۰ ساعت ۱۵ دقیقه', durationMinutes: 615, price: 1150000, compartmentType: '۶ تخته', compartmentId: '6نفره' },
];

const cities: Record<string, string> = {
  tehran: 'تهران', mashhad: 'مشهد', isfahan: 'اصفهان', shiraz: 'شیراز',
  tabriz: 'تبریز', yazd: 'یزد', ahvaz: 'اهواز', bandarabbas: 'بندرعباس',
  kermanshah: 'کرمانشاه', qom: 'قم',
};

const SearchResults = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedTrains, setSelectedTrains] = useState<number[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [440000, 2450000],
    departureTime: [0, 24],
    duration: [0, 12],
    compartmentTypes: [],
  });

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const passengers = searchParams.get('passengers') || '1';

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  const toggleTrain = (trainId: number) => {
    setSelectedTrains(prev => 
      prev.includes(trainId) 
        ? prev.filter(id => id !== trainId)
        : [...prev, trainId]
    );
  };

  // Apply filters to trains
  const filteredTrains = trains.filter(train => {
    // Price filter
    if (train.price < filters.priceRange[0] || train.price > filters.priceRange[1]) {
      return false;
    }
    // Departure time filter
    if (train.departureHour < filters.departureTime[0] || train.departureHour > filters.departureTime[1]) {
      return false;
    }
    // Duration filter (convert minutes to hours)
    const durationHours = train.durationMinutes / 60;
    if (durationHours < filters.duration[0] || durationHours > filters.duration[1]) {
      return false;
    }
    // Compartment type filter
    if (filters.compartmentTypes.length > 0 && !filters.compartmentTypes.includes(train.compartmentId)) {
      return false;
    }
    return true;
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSubmit = () => {
    if (selectedTrains.length > 0) {
      navigate(`/booking?trains=${selectedTrains.join(',')}&from=${from}&to=${to}&passengers=${passengers}`);
    }
  };

  return (
    <MainLayout>
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Search Box Section */}
        <div className="py-6">
          <div className="container mx-auto px-4">
            <SearchBox />
          </div>
        </div>

        <div className="container mx-auto px-4 py-4">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h1 className="text-xl font-bold text-foreground drop-shadow-sm">
              {language === 'fa' ? 'قطارهای موجود' : 'Available Trains'}
            </h1>
            <div className="bg-card/80 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-2 shadow-soft border border-border/50 text-sm">
              <span className="font-semibold">{cities[from]}</span>
              <span className="text-primary">←</span>
              <span className="font-semibold">{cities[to]}</span>
            </div>
          </div>

          {/* Main Layout: In RTL, first element appears on right */}
          <div className="flex gap-4">
            {/* Filter Box - Sidebar (First = Right in RTL) */}
            <div className="hidden lg:block w-72 shrink-0">
              <FilterBox onFilterChange={handleFilterChange} />
            </div>

            {/* Train Cards - Main Content */}
            <div className="flex-1">
              {/* Train List */}
              <div className="space-y-3">
                {filteredTrains.length === 0 ? (
                  <div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-muted-foreground mb-2">search_off</span>
                    <p className="text-muted-foreground">
                      {language === 'fa' ? 'قطاری با این فیلترها یافت نشد' : 'No trains found with these filters'}
                    </p>
                  </div>
                ) : (
                  filteredTrains.map((train) => (
                    <div
                      key={train.id}
                      className={`bg-card/90 backdrop-blur-md border rounded-2xl transition-all cursor-pointer hover:shadow-lg ${
                        selectedTrains.includes(train.id) 
                          ? 'border-primary ring-2 ring-primary/30' 
                          : 'border-border/50'
                      }`}
                      onClick={() => toggleTrain(train.id)}
                    >
                      <div className="p-4 sm:p-6">
                        {/* Main Row */}
                        <div className="flex items-center gap-4">
                          {/* Checkbox */}
                          <Checkbox 
                            checked={selectedTrains.includes(train.id)}
                            onCheckedChange={() => toggleTrain(train.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="shrink-0 size-5"
                          />

                          {/* Departure - Right side in RTL */}
                          <div className="text-center min-w-[100px]">
                            <p className="text-xs text-muted-foreground mb-1">
                              {language === 'fa' ? `از ${cities[from]}` : `From ${cities[from]}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {language === 'fa' ? 'زمان حرکت' : 'Departure'}
                            </p>
                            <p className="text-3xl sm:text-4xl font-bold text-foreground mt-1">{train.departure}</p>
                          </div>

                          {/* Center - Train Info with Timeline */}
                          <div className="flex-1 flex flex-col items-center gap-2">
                            {/* Timeline */}
                            <div className="flex items-center w-full max-w-[200px]">
                              <div className="size-3 rounded-full bg-muted-foreground/30" />
                              <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
                              <div className="size-10 rounded-full bg-muted/50 flex items-center justify-center mx-2">
                                <span className="material-symbols-outlined text-muted-foreground text-xl">train</span>
                              </div>
                              <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
                              <div className="size-3 rounded-full bg-muted-foreground/30" />
                            </div>
                            
                            {/* Train Details */}
                            <div className="text-center space-y-1">
                              <p className="text-sm font-medium text-foreground">
                                {language === 'fa' ? 'عنوان سالن' : 'Salon'}: {train.name} {train.number}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {language === 'fa' ? 'ظرفیت کوپه' : 'Compartment'}: {train.compartmentType}
                              </p>
                              <p className="text-xs text-muted-foreground">{train.duration}</p>
                            </div>
                          </div>

                          {/* Arrival - Left side in RTL */}
                          <div className="text-center min-w-[100px]">
                            <p className="text-xs text-muted-foreground mb-1">
                              {language === 'fa' ? `به ${cities[to]}` : `To ${cities[to]}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {language === 'fa' ? 'زمان ورود' : 'Arrival'}
                            </p>
                            <p className="text-3xl sm:text-4xl font-bold text-foreground mt-1">{train.arrival}</p>
                          </div>

                          {/* Price */}
                          <div className="text-center min-w-[110px] bg-primary/5 rounded-xl p-3">
                            <p className="text-xs text-muted-foreground mb-1">
                              {language === 'fa' ? 'قیمت هر نفر' : 'Per person'}
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-accent">{formatPrice(train.price)}</p>
                            <p className="text-xs text-muted-foreground">
                              {language === 'fa' ? 'تومان' : 'Toman'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Submit Button - Fixed at bottom when items selected */}
          {selectedTrains.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
              <Button 
                onClick={handleSubmit}
                className="gradient-primary hover:opacity-90 px-8 py-3 rounded-full shadow-lg text-base font-semibold gap-2"
              >
                <span className="material-symbols-outlined">check_circle</span>
                {language === 'fa' 
                  ? `رزرو ${selectedTrains.length} قطار انتخاب شده` 
                  : `Book ${selectedTrains.length} Selected Train(s)`
                }
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchResults;