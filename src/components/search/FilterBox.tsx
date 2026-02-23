import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FilterBoxProps {
  onFilterChange?: (filters: FilterState) => void;
  onSubmit?: () => void;
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
  { id: '6تخته3ستاره', label: '۶ تخته ۳ ستاره', icon: '🛏️' },
  { id: '4تخته4ستاره', label: '۴ تخته ۴ ستاره', icon: '⭐' },
  { id: '4تخته5ستاره', label: '۴ تخته ۵ ستاره', icon: '🌟' },
];

const timeSlotCards = [
  { id: '6-12', label: 'صبح', sublabel: '۶ تا ۱۲', icon: '🌅' },
  { id: '12-18', label: 'ظهر', sublabel: '۱۲ تا ۱۸', icon: '☀️' },
  { id: '18-24', label: 'عصر', sublabel: '۱۸ تا ۲۴', icon: '🌇' },
  { id: '0-6', label: 'شب', sublabel: '۰ تا ۶', icon: '🌙' },
];

export const FilterBox = ({ onFilterChange, onSubmit }: FilterBoxProps) => {
  const { language } = useLanguage();
  const isRtl = language === 'fa';

  const [departureTimeSlots, setDepartureTimeSlots] = useState<string[]>([]);
  const [compartmentTypes, setCompartmentTypes] = useState<string[]>([]);
  const [customerNotes, setCustomerNotes] = useState<string>('');

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
    const newSlots = departureTimeSlots.includes(id)
      ? departureTimeSlots.filter(s => s !== id)
      : [...departureTimeSlots, id];
    setDepartureTimeSlots(newSlots);
    notifyChange({ departureTimeSlots: newSlots });
  };

  const toggleCompartment = (id: string) => {
    const newTypes = compartmentTypes.includes(id)
      ? compartmentTypes.filter(c => c !== id)
      : [...compartmentTypes, id];
    setCompartmentTypes(newTypes);
    notifyChange({ compartmentTypes: newTypes });
  };

  const handleNotesChange = (notes: string) => {
    setCustomerNotes(notes);
    notifyChange({ customerNotes: notes });
  };

  const clearFilters = () => {
    setDepartureTimeSlots([]);
    setCompartmentTypes([]);
    setCustomerNotes('');
    onFilterChange?.({
      priceRange: [440000, 2450000],
      departureTimeSlots: [],
      compartmentTypes: [],
      customerNotes: '',
      privateCompartment: false,
      foreignNational: false,
    });
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

        {/* Departure Time - 2x2 Grid Cards */}
        <div>
          <Label className="text-sm font-semibold text-primary mb-3 block">
            {isRtl ? 'زمان حرکت' : 'Departure Time'}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {timeSlotCards.map((slot) => {
              const isActive = departureTimeSlots.includes(slot.id);
              return (
                <button
                  key={slot.id}
                  onClick={() => toggleTimeSlot(slot.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all min-h-[72px]",
                    isActive
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border/50 bg-muted/30 hover:border-primary/40 hover:bg-muted/50"
                  )}
                >
                  <span className="text-xl mb-1">{slot.icon}</span>
                  <span className="text-sm font-bold">{slot.label}</span>
                  <span className="text-[11px] text-muted-foreground">({slot.sublabel})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compartment Type */}
        <div>
          <Label className="text-sm font-semibold text-primary mb-3 block">
            {isRtl ? 'نوع سالن' : 'Compartment Type'}
          </Label>
          <div className="space-y-1">
            {compartmentOptions.map((option) => (
              <label
                key={option.id}
                className={cn(
                  "flex items-center justify-between cursor-pointer text-sm px-3 py-3 rounded-lg transition-colors",
                  compartmentTypes.includes(option.id)
                    ? "bg-primary/5"
                    : "hover:bg-muted/50"
                )}
              >
                <span className="flex items-center gap-2">
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </span>
                <Checkbox
                  checked={compartmentTypes.includes(option.id)}
                  onCheckedChange={() => toggleCompartment(option.id)}
                />
              </label>
            ))}
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

      {/* Sticky Submit Button */}
      <div className="p-4 border-t border-border/50 bg-card/95 backdrop-blur-md rounded-b-2xl">
        <Button
          onClick={onSubmit}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 text-base"
          size="lg"
        >
          <span className="material-symbols-outlined ml-2">check_circle</span>
          {isRtl ? 'ثبت رزرو' : 'Submit Booking'}
        </Button>
      </div>
    </div>
  );
};
