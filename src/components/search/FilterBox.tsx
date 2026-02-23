import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Clock, Sunrise, Sun, Sunset, Moon } from 'lucide-react';

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
  { id: '0-24', label: '0-24', icon: Clock },
  { id: '0-6', label: '۰۰-۰۶', icon: Sunrise },
  { id: '6-12', label: '۰۶-۱۲', icon: Sun },
  { id: '12-18', label: '۱۲-۱۸', icon: Sunset },
  { id: '18-24', label: '۱۸-۲۴', icon: Moon },
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
    <div className="bg-card rounded-2xl border border-border/30 shadow-lg flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-primary inline-block" />
            {isRtl ? 'جزئیات رزرو' : 'Reservation Details'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-destructive text-xs gap-1 h-7 px-2"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
            {isRtl ? 'بازنشانی' : 'Reset'}
          </Button>
        </div>

        {/* Departure Time */}
        <div className="space-y-3">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
            {isRtl ? 'زمان حرکت' : 'Departure Time'}
          </Label>
          <div className="flex gap-1.5 bg-muted/40 rounded-xl p-1.5">
            {timeSlotOptions.map((slot) => {
              const isActive = departureTimeSlots.includes(slot.id);
              const IconComp = slot.icon;
              return (
                <button
                  key={slot.id}
                  onClick={() => toggleTimeSlot(slot.id)}
                  className={cn(
                    "flex-1 min-w-0 py-2.5 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-1.5",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-background hover:text-foreground hover:shadow-sm"
                  )}
                >
                  <span className="font-bold text-xs leading-none">{slot.label}</span>
                  <IconComp size={11} className={cn("transition-colors", isActive ? "text-primary-foreground/70" : "text-muted-foreground/50")} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/30" />

        {/* Compartment Type */}
        <div className="space-y-3">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
            {isRtl ? 'نوع سالن' : 'Compartment Type'}
          </Label>
          <div className="space-y-1.5">
            {compartmentOptions.map((option) => {
              const isSelected = compartmentTypes.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleCompartment(option.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all text-sm group",
                    isSelected
                      ? "bg-primary/8 ring-1 ring-primary/30"
                      : "hover:bg-muted/50"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={cn(
                      "w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all",
                      isSelected
                        ? "border-primary bg-primary scale-100"
                        : "border-muted-foreground/30 group-hover:border-muted-foreground/50"
                    )}>
                      {isSelected && <span className="text-primary-foreground text-[10px] font-bold">✓</span>}
                    </span>
                    <span className={cn("font-medium transition-colors", isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>{option.label}</span>
                  </span>
                  <span className="flex gap-0.5">{renderStars(option.stars)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/30" />

        {/* Description */}
        <div className="space-y-2.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
            {isRtl ? 'توضیحات تکمیلی' : 'Additional Notes'}
          </Label>
          <Textarea
            placeholder={isRtl ? 'مثلاً: اگر بلیط پیدا نشد، روز بعد هم مشکلی ندارد / حتما کوپه دربست باشد...' : 'e.g.: If no ticket found, next day is also fine...'}
            value={customerNotes}
            onChange={(e) => handleNotesChange(e.target.value)}
            className="min-h-[90px] resize-none text-sm bg-muted/30 border-border/40 focus:bg-background rounded-xl"
            maxLength={500}
          />
          <p className="text-[10px] text-muted-foreground/60 text-left" dir="ltr">
            {customerNotes.length}/500
          </p>
        </div>
      </div>
    </div>
  );
};
