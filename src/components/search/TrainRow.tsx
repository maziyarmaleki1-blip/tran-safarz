import { useLanguage } from '@/contexts/LanguageContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TrainRowProps {
  train: {
    id: number;
    name: string;
    number: string;
    departure: string;
    arrival: string;
    duration: string;
    price: number;
    compartmentType: string;
    rating?: string;
    amenities?: string;
    status?: 'available' | 'sold_out' | 'few_left';
  };
  date: string;
  from: string;
  to: string;
}

const cities: Record<string, string> = {
  tehran: 'تهران',
  mashhad: 'مشهد',
  isfahan: 'اصفهان',
  shiraz: 'شیراز',
  tabriz: 'تبریز',
  yazd: 'یزد',
  ahvaz: 'اهواز',
  bandarabbas: 'بندرعباس',
  kermanshah: 'کرمانشاه',
  qom: 'قم',
};

export const TrainRow = ({ train, date, from, to }: TrainRowProps) => {
  const { t } = useLanguage();
  
  const formatPrice = (price: number) => price.toLocaleString('fa-IR');
  
  const getStatusText = (status?: string) => {
    switch (status) {
      case 'sold_out':
        return { text: 'شکار این بلیط 🎯', className: 'sniper-btn', isButton: true };
      case 'few_left':
        return { text: 'چند صندلی', className: 'text-amber-600' };
      default:
        return { text: 'موجود', className: 'text-green-600' };
    }
  };

  const statusInfo = getStatusText(train.status) as { text: string; className: string; isButton?: boolean };

  const StatusDisplay = () => {
    if (statusInfo.isButton) {
      return (
        <button className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all hover:shadow-[0_0_25px_rgba(249,115,22,0.6)]">
          {statusInfo.text}
        </button>
      );
    }
    return (
      <span className={`font-semibold ${statusInfo.className}`}>{statusInfo.text}</span>
    );
  };

  return (
    <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-xl hover:shadow-md transition-all">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center gap-4 p-4">
        {/* Train Logo/Icon */}
        <div className="w-16 h-12 bg-muted/50 rounded-lg flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-2xl text-primary">train</span>
        </div>

        {/* Date & Time */}
        <div className="text-center min-w-[100px]">
          <p className="text-xs text-muted-foreground">{date}</p>
          <p className="text-lg font-bold">{t('time')} {train.departure}</p>
        </div>

        {/* Train Number */}
        <div className="text-center min-w-[80px]">
          <p className="text-xs text-muted-foreground">{t('trainNo')}</p>
          <p className="text-lg font-bold">{train.number}</p>
        </div>

        {/* Train Name & Amenities */}
        <div className="flex-1 text-center">
          <p className="font-medium text-sm">
            {train.rating || '۵ ستاره'} {train.name}
            {train.amenities && <span className="text-muted-foreground"> ({train.amenities})</span>}
          </p>
          <p className="text-xs text-muted-foreground">{train.compartmentType}</p>
        </div>

        {/* Price */}
        <div className="text-center min-w-[120px]">
          <p className="text-xs text-muted-foreground">{t('rial')}</p>
          <div className="flex items-center justify-center gap-1">
            <p className="text-lg font-bold text-accent">{formatPrice(train.price * 10)}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="material-symbols-outlined text-sm text-muted-foreground/60 cursor-help hover:text-muted-foreground transition-colors">info</span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px] text-center text-xs">
                  <p>قیمت شامل کارمزد خدمات رزرو خودکار است</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Status */}
        <div className="text-center min-w-[120px]">
          <StatusDisplay />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden p-5 space-y-4">
        {/* Header Row: Logo + Name + Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-muted/50 rounded-xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl text-primary">train</span>
            </div>
            <div>
              <p className="font-semibold text-base leading-tight">{train.rating || '۵ ستاره'} {train.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('trainNo')} {train.number}</p>
            </div>
          </div>
          <StatusDisplay />
        </div>

        {/* Info Row */}
        <div className="flex items-center justify-between bg-muted/30 rounded-xl p-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">{t('dep')}</p>
            <p className="font-bold text-lg">{train.departure}</p>
          </div>
          <div className="text-center flex-1 px-2">
            <p className="text-xs text-muted-foreground mb-1">{train.duration}</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-8 border-t border-dashed border-muted-foreground/50" />
              <span className="material-symbols-outlined text-sm text-muted-foreground">arrow_back</span>
              <div className="w-8 border-t border-dashed border-muted-foreground/50" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">{t('arr')}</p>
            <p className="font-bold text-lg">{train.arrival}</p>
          </div>
        </div>

        {/* Bottom Row: Compartment + Price */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-muted-foreground">{train.compartmentType}</p>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold text-accent">{formatPrice(train.price * 10)}</span>
            <span className="text-xs text-muted-foreground">{t('rial')}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="material-symbols-outlined text-sm text-muted-foreground/60 cursor-help p-1">info</span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px] text-center text-xs">
                  <p>قیمت شامل کارمزد خدمات رزرو خودکار است</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
