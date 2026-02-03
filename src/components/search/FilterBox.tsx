import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface FilterBoxProps {
  onFilterChange?: (filters: FilterState) => void;
  onSubmit?: () => void;
}

export interface FilterState {
  priceRange: [number, number];
  departureTimeSlots: string[];
  compartmentTypes: string[];
}

const compartmentOptions = [
  { id: '6تخته3ستاره', label: '۶ تخته ۳ ستاره' },
  { id: '4تخته4ستاره', label: '۴ تخته ۴ ستاره' },
  { id: '4تخته5ستاره', label: '۴ تخته ۵ ستاره' },
];

const timeSlotOptions = [
  { id: '0-24', label: '۰', sublabel: '۲۴' },
  { id: '0-6', label: '۰', sublabel: '۶' },
  { id: '6-12', label: '۶', sublabel: '۱۲' },
  { id: '12-18', label: '۱۲', sublabel: '۱۸' },
  { id: '18-24', label: '۱۸', sublabel: '۲۴' },
];

export const FilterBox = ({ onFilterChange, onSubmit }: FilterBoxProps) => {
  const { language } = useLanguage();
  const isRtl = language === 'fa';

  const [priceRange, setPriceRange] = useState<[number, number]>([440000, 2450000]);
  const [departureTimeSlots, setDepartureTimeSlots] = useState<string[]>([]);
  const [compartmentTypes, setCompartmentTypes] = useState<string[]>([]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR');
  };

  const notifyChange = (newFilters: Partial<FilterState>) => {
    const filters: FilterState = {
      priceRange,
      departureTimeSlots,
      compartmentTypes,
      ...newFilters,
    };
    onFilterChange?.(filters);
  };

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
    notifyChange({ priceRange: value });
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

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [440000, 2450000],
      departureTimeSlots: [],
      compartmentTypes: [],
    };
    setPriceRange(defaultFilters.priceRange);
    setDepartureTimeSlots(defaultFilters.departureTimeSlots);
    setCompartmentTypes(defaultFilters.compartmentTypes);
    onFilterChange?.(defaultFilters);
  };

  return (
    <div className="bg-card/90 backdrop-blur-md rounded-2xl border border-border/50 p-4 shadow-soft sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
        <h3 className="font-bold text-foreground">
          {isRtl ? 'فیلتر نتایج' : 'Filter Results'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-destructive hover:text-destructive/80 text-xs gap-1"
        >
          <span className="material-symbols-outlined text-sm">filter_alt_off</span>
          {isRtl ? 'لغو فیلترها' : 'Clear'}
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['compartment', 'departure', 'price']} className="space-y-1">
        {/* Compartment Type - First */}
        <AccordionItem value="compartment" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline text-primary">
            {isRtl ? 'نوع سالن' : 'Compartment Type'}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-3">
              {compartmentOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center justify-between cursor-pointer text-sm"
                >
                  <span>{option.label}</span>
                  <Checkbox
                    checked={compartmentTypes.includes(option.id)}
                    onCheckedChange={() => toggleCompartment(option.id)}
                  />
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Departure Time Slots */}
        <AccordionItem value="departure" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline text-primary">
            {isRtl ? 'زمان حرکت (قطار رفت)' : 'Departure Time'}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <p className="text-xs text-muted-foreground mb-3">
              {isRtl ? 'بازه زمانی حضور در ایستگاه قطار' : 'Time range at station'}
            </p>
            <div className="grid grid-cols-5 gap-2">
              {timeSlotOptions.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => toggleTimeSlot(slot.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all",
                    departureTimeSlots.includes(slot.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 hover:border-primary/50"
                  )}
                >
                  <span className="text-lg mb-1">⏰</span>
                  <span className="text-base font-bold">{slot.label}</span>
                  <span className="text-xs text-muted-foreground">{slot.sublabel}</span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline text-primary">
            {isRtl ? 'بازه قیمت (تومان)' : 'Price Range (Toman)'}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <Slider
              value={priceRange}
              min={100000}
              max={3000000}
              step={50000}
              onValueChange={(value) => handlePriceChange(value as [number, number])}
              className="mb-3"
            />
            <div className="flex justify-between text-base font-semibold text-foreground" dir="ltr">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Submit Button */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <Button 
          onClick={onSubmit}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3"
          size="lg"
        >
          <span className="material-symbols-outlined ml-2">check_circle</span>
          {isRtl ? 'ثبت رزرو' : 'Submit Booking'}
        </Button>
      </div>
    </div>
  );
};
