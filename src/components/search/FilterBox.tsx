import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface FilterBoxProps {
  onFilterChange?: (filters: FilterState) => void;
  onHasInteracted?: (interacted: boolean) => void;
}

export interface FilterState {
  priceRange: [number, number];
  departureTimeSlots: string[];
  compartmentTypes: string[];
  customerNotes: string;
  privateCompartment: boolean;
  foreignNational: boolean;
  passengerType?: string;
  adultsCount?: number;
  childrenCount?: number;
  botDuration?: string;
}

const compartmentOptions = [
  { id: '6تخته3ستاره', label: '۶ تخته ۳ ستاره', stars: 3 },
  { id: '4تخته4ستاره', label: '۴ تخته ۴ ستاره', stars: 4 },
  { id: '4تخته5ستاره', label: '۴ تخته ۵ ستاره', stars: 5 },
];

const timeSlotOptions = [
  { id: '0-24', label: 'همه', sublabel: '۰۰-۲۴' },
  { id: '0-6', label: 'صبح', sublabel: '۰۰-۰۶' },
  { id: '6-12', label: 'ظهر', sublabel: '۰۶-۱۲' },
  { id: '12-18', label: 'عصر', sublabel: '۱۲-۱۸' },
  { id: '18-24', label: 'شب', sublabel: '۱۸-۲۴' },
];

export const FilterBox = ({ onFilterChange, onHasInteracted }: FilterBoxProps) => {
  const { language } = useLanguage();
  const isRtl = language === 'fa';

  const [departureTimeSlots, setDepartureTimeSlots] = useState<string[]>(['0-24']);
  const [compartmentTypes, setCompartmentTypes] = useState<string[]>([]);
  const [customerNotes, setCustomerNotes] = useState<string>('ترجیحاً قطار آخر شب باشد');
  const [hasInteracted, setHasInteracted] = useState(false);

  // Notify parent on mount with defaults
  useEffect(() => {
    notifyChange({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notifyChange = (newFilters: Partial<FilterState>) => {
    const filters: FilterState = {
      priceRange: [440000, 2450000],
      departureTimeSlots,
      compartmentTypes,
      customerNotes,
      privateCompartment: false,
      foreignNational: false,
      ...newFilters,
    };
    onFilterChange?.(filters);
  };

  const toggleTimeSlot = (id: string) => {
    if (!hasInteracted) {
      setHasInteracted(true);
      onHasInteracted?.(true);
    }
    let newSlots: string[];
    if (id === '0-24') {
      newSlots = departureTimeSlots.includes('0-24') ? [] : ['0-24'];
    } else {
      const withoutAll = departureTimeSlots.filter(s => s !== '0-24');
      newSlots = withoutAll.includes(id)
        ? withoutAll.filter(s => s !== id)
        : [...withoutAll, id];
    }
    setDepartureTimeSlots(newSlots);
    notifyChange({ departureTimeSlots: newSlots });
  };

  const toggleCompartment = (id: string) => {
    if (!hasInteracted) {
      setHasInteracted(true);
      onHasInteracted?.(true);
    }
    const newTypes = compartmentTypes.includes(id)
      ? compartmentTypes.filter(c => c !== id)
      : [...compartmentTypes, id];
    setCompartmentTypes(newTypes);
    notifyChange({ compartmentTypes: newTypes });
  };

  const handleNotesChange = (notes: string) => {
    if (!hasInteracted) {
      setHasInteracted(true);
      onHasInteracted?.(true);
    }
    setCustomerNotes(notes);
    notifyChange({ customerNotes: notes });
  };

  const clearFilters = () => {
    setDepartureTimeSlots(['0-24']);
    setCompartmentTypes([]);
    setCustomerNotes('ترجیحاً قطار آخر شب باشد');
    setHasInteracted(false);
    onFilterChange?.({
      priceRange: [440000, 2450000],
      departureTimeSlots: ['0-24'],
      compartmentTypes: [],
      customerNotes: 'ترجیحاً قطار آخر شب باشد',
      privateCompartment: false,
      foreignNational: false,
    });
  };

  const renderStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <span key={i} className="text-accent-foreground text-xs" style={{ color: 'hsl(45, 93%, 47%)' }}>★</span>
    ));
  };

  return (
    <div className="bg-card/90 backdrop-blur-md rounded-2xl border border-border/50 shadow-soft flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <h3 className="font-bold text-foreground">
            {isRtl ? 'جزئیات رزرو' : 'Reservation Details'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-destructive hover:text-destructive/80 text-xs gap-1"
          >
            <span className="material-symbols-outlined text-sm">filter_alt_off</span>
            {isRtl ? 'پاک‌سازی' : 'Clear'}
          </Button>
        </div>

        {/* Departure Time - Horizontal pills */}
        <div>
          <Label className="text-sm font-semibold text-primary mb-3 block">
            {isRtl ? 'زمان حرکت' : 'Departure Time'}
          </Label>
          <div className="flex gap-1.5">
            {timeSlotOptions.map((slot) => {
              const isActive = departureTimeSlots.includes(slot.id);
              return (
                <button
                  key={slot.id}
                  onClick={() => toggleTimeSlot(slot.id)}
                  className={cn(
                    "flex-1 min-w-0 py-2.5 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border/60 bg-muted/30 text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className="font-bold leading-tight truncate text-xs">{slot.label}</div>
                  <div className="text-[10px] opacity-70">{slot.sublabel}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compartment Type - Card style */}
        <div>
          <Label className="text-sm font-semibold text-primary mb-3 block">
            {isRtl ? 'نوع سالن' : 'Compartment Type'}
          </Label>
          <div className="space-y-2">
            {compartmentOptions.map((option) => {
              const isSelected = compartmentTypes.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleCompartment(option.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-3 rounded-xl border transition-all text-sm",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border/40 bg-muted/20 hover:border-primary/40 hover:bg-muted/40"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className={cn("w-4 h-4 rounded border-2 flex items-center justify-center transition-colors", isSelected ? "border-primary bg-primary" : "border-muted-foreground/40")}>
                      {isSelected && <span className="text-primary-foreground text-[10px]">✓</span>}
                    </span>
                    <span className="font-medium">{option.label}</span>
                  </span>
                  <span className="flex gap-0.5">{renderStars(option.stars)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <Label className="text-sm font-semibold text-primary mb-2 block">
            {isRtl ? 'توضیحات تکمیلی (اجباری برای درخواست‌های خاص)' : 'Additional Notes (required for special requests)'}
          </Label>
          <Textarea
            placeholder={isRtl ? 'مثلاً: اگر بلیط پیدا نشد، روز بعد هم مشکلی ندارد / حتما کوپه دربست باشد...' : 'e.g.: If no ticket found, next day is also fine...'}
            value={customerNotes}
            onChange={(e) => handleNotesChange(e.target.value)}
            className="min-h-[100px] resize-none text-sm"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-1 text-left" dir="ltr">
            {customerNotes.length}/500
          </p>
        </div>
      </div>

    </div>
  );
};
