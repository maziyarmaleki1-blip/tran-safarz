import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SearchBox } from './SearchBox';
import { HotelSearchBox } from './HotelSearchBox';
import { TourSearchBox } from './TourSearchBox';
import { cn } from '@/lib/utils';

type Service = 'train' | 'hotel' | 'tour';

export function ServiceTabs() {
  const { language } = useLanguage();
  const [active, setActive] = useState<Service>('train');

  const labels: Record<Service, { fa: string; en: string; ar: string; icon: string }> = {
    train: { fa: 'قطار', en: 'Train', ar: 'قطار', icon: 'train' },
    hotel: { fa: 'هتل', en: 'Hotel', ar: 'فندق', icon: 'hotel' },
    tour: { fa: 'تور', en: 'Tour', ar: 'جولة', icon: 'tour' },
  };

  const services: Service[] = ['train', 'hotel', 'tour'];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tab buttons */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex bg-card/60 backdrop-blur-md rounded-2xl p-1.5 border border-border shadow-soft gap-1">
          {services.map((s) => {
            const isActive = active === s;
            return (
              <button
                key={s}
                onClick={() => setActive(s)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all min-h-[44px]',
                  isActive
                    ? 'gradient-primary text-primary-foreground shadow-md scale-105'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                <span className="material-symbols-outlined text-xl">{labels[s].icon}</span>
                <span>{labels[s][language]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active box */}
      <div className="animate-fade-in" key={active}>
        {active === 'train' && <SearchBox />}
        {active === 'hotel' && <HotelSearchBox />}
        {active === 'tour' && <TourSearchBox />}
      </div>
    </div>
  );
}
