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

interface FilterBoxProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: [number, number];
  departureTime: [number, number];
  duration: [number, number];
  compartmentTypes: string[];
  stops: number[];
}

const compartmentOptions = [
  { id: 'اتوبوسی', label: 'اتوبوسی' },
  { id: '6نفره', label: '۶ نفره' },
  { id: '4نفره', label: '۴ نفره' },
];

const stopOptions = [
  { id: 0, label: '۰' },
  { id: 1, label: '۱' },
  { id: 2, label: '۲' },
  { id: 3, label: '۳+' },
];

export const FilterBox = ({ onFilterChange }: FilterBoxProps) => {
  const { language } = useLanguage();
  const isRtl = language === 'fa';

  const [priceRange, setPriceRange] = useState<[number, number]>([440000, 2450000]);
  const [departureTime, setDepartureTime] = useState<[number, number]>([0, 24]);
  const [duration, setDuration] = useState<[number, number]>([0, 12]);
  const [compartmentTypes, setCompartmentTypes] = useState<string[]>([]);
  const [stops, setStops] = useState<number[]>([]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR');
  };

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:۰۰`;
  };

  const toggleCompartment = (id: string) => {
    setCompartmentTypes(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleStop = (id: number) => {
    setStops(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setPriceRange([440000, 2450000]);
    setDepartureTime([0, 24]);
    setDuration([0, 12]);
    setCompartmentTypes([]);
    setStops([]);
  };

  return (
    <div className="bg-card/90 backdrop-blur-md rounded-2xl border border-border/50 p-4 shadow-soft sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
        <h3 className="font-bold text-foreground">
          {isRtl ? 'فیلترها' : 'Filters'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          <span className="material-symbols-outlined text-sm ml-1">close</span>
          {isRtl ? 'لغو فیلترها' : 'Clear'}
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['price', 'departure', 'duration', 'compartment']} className="space-y-1">
        {/* Price Range */}
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
            {isRtl ? 'بازه قیمت (تومان)' : 'Price Range (Toman)'}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <Slider
              value={priceRange}
              min={100000}
              max={3000000}
              step={50000}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="mb-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Departure Time */}
        <AccordionItem value="departure" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
            {isRtl ? 'زمان حرکت (ساعت)' : 'Departure Time'}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <Slider
              value={departureTime}
              min={0}
              max={24}
              step={1}
              onValueChange={(value) => setDepartureTime(value as [number, number])}
              className="mb-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(departureTime[0])}</span>
              <span>{formatTime(departureTime[1])}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Duration */}
        <AccordionItem value="duration" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
            {isRtl ? 'مدت سفر (ساعت)' : 'Travel Duration'}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <Slider
              value={duration}
              min={0}
              max={15}
              step={1}
              onValueChange={(value) => setDuration(value as [number, number])}
              className="mb-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{duration[0].toLocaleString('fa-IR')} ساعت</span>
              <span>{duration[1].toLocaleString('fa-IR')} ساعت</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Compartment Type */}
        <AccordionItem value="compartment" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
            {isRtl ? 'نوع سالن' : 'Compartment Type'}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-2">
              {compartmentOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Checkbox
                    checked={compartmentTypes.includes(option.id)}
                    onCheckedChange={() => toggleCompartment(option.id)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Number of Stops */}
        <AccordionItem value="stops" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
            {isRtl ? 'تعداد توقف' : 'Number of Stops'}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-2">
              {stopOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Checkbox
                    checked={stops.includes(option.id)}
                    onCheckedChange={() => toggleStop(option.id)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
