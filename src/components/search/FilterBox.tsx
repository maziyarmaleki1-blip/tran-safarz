import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Clock, Sunrise, Sun, Sunset, Moon, ChevronUp, ChevronDown } from 'lucide-react';

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
  
}

const compartmentOptions = [
  { id: '6تخته3ستاره', label: '۶ تخته ۳ ستاره', stars: 3 },
  { id: '4تخته4ستاره', label: '۴ تخته ۴ ستاره', stars: 4 },
  { id: '4تخته5ستاره', label: '۴ تخته ۵ ستاره', stars: 5 },
];

const timeSlotOptions = [
  { id: '0-24', sublabel: '۰\n۲۴', icon: Clock },
  { id: '0-6', sublabel: '۰\n۶', icon: Sunrise },
  { id: '6-12', sublabel: '۶\n۱۲', icon: Sun },
  { id: '12-18', sublabel: '۱۲\n۱۸', icon: Sunset },
  { id: '18-24', sublabel: '۱۸\n۲۴', icon: Moon },
];

// Collapsible section component
const Section = ({ 
  title, 
  icon, 
  defaultOpen = true, 
  children 
}: { 
  title: string; 
  icon?: React.ReactNode; 
  defaultOpen?: boolean; 
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/30 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
};

export const FilterBox = ({ onFilterChange, onHasInteracted }: FilterBoxProps) => {
  const { language } = useLanguage();
  const isRtl = language === 'fa';

  const [departureTimeSlots, setDepartureTimeSlots] = useState<string[]>(['0-24']);
  const [compartmentTypes, setCompartmentTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([440000, 2450000]);
  const [customerNotes, setCustomerNotes] = useState('');
  const [privateCompartment, setPrivateCompartment] = useState(false);
  const [foreignNational, setForeignNational] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const formatPrice = useCallback((value: number) => {
    return new Intl.NumberFormat('fa-IR').format(value);
  }, []);

  useEffect(() => {
    notifyChange({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markInteracted = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      onHasInteracted?.(true);
    }
  };

  const notifyChange = (newFilters: Partial<FilterState>) => {
    const filters: FilterState = {
      priceRange,
      departureTimeSlots,
      compartmentTypes,
      customerNotes,
      privateCompartment,
      foreignNational,
      ...newFilters,
    };
    onFilterChange?.(filters);
  };

  const toggleTimeSlot = (id: string) => {
    markInteracted();
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
    markInteracted();
    const newTypes = compartmentTypes.includes(id)
      ? compartmentTypes.filter(c => c !== id)
      : [...compartmentTypes, id];
    setCompartmentTypes(newTypes);
    notifyChange({ compartmentTypes: newTypes });
  };

  return (
    <div className="bg-card/90 backdrop-blur-md rounded-2xl border border-border/50 shadow-soft" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
      <div className="overflow-y-auto p-4">

        {/* نوع سالن */}
        <Section title={isRtl ? 'نوع سالن' : 'Compartment Type'}>
          <div className="space-y-3">
            {compartmentOptions.map((option) => {
              const isSelected = compartmentTypes.includes(option.id);
              return (
                <label
                  key={option.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleCompartment(option.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">{option.label}</span>
                </label>
              );
            })}
          </div>
        </Section>

        {/* زمان حرکت */}
        <Section title={isRtl ? 'زمان حرکت (قطار رفت)' : 'Departure Time'}>
          <p className="text-xs text-muted-foreground mb-3">
            {isRtl ? 'بازه زمانی حضور در ایستگاه قطار' : 'Time range at the train station'}
          </p>
          <div className="flex gap-2 justify-between">
            {timeSlotOptions.map((slot) => {
              const isActive = departureTimeSlots.includes(slot.id);
              const IconComp = slot.icon;
              const [top, bottom] = slot.sublabel.split('\n');
              return (
                <button
                  key={slot.id}
                  onClick={() => toggleTimeSlot(slot.id)}
                  className={cn(
                    "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-lg border transition-all aspect-square max-w-[52px]",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 bg-muted/20 text-muted-foreground hover:border-primary/40"
                  )}
                >
                  <IconComp size={16} />
                  <div className="flex flex-col items-center leading-none text-[11px] font-bold">
                    <span>{top}</span>
                    <span>{bottom}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        {/* بازه قیمت */}
        <Section 
          title={isRtl ? 'بازه قیمت (تومان)' : 'Price Range (Toman)'} 
          defaultOpen={true}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{isRtl ? 'از' : 'From'}: <span className="font-bold text-foreground">{formatPrice(priceRange[0])}</span></span>
              <span>{isRtl ? 'تا' : 'To'}: <span className="font-bold text-foreground">{formatPrice(priceRange[1])}</span></span>
            </div>
            <div dir="ltr">
              <Slider
                value={priceRange}
                min={100000}
                max={5000000}
                step={50000}
                onValueChange={(value) => {
                  markInteracted();
                  const newRange: [number, number] = [value[0], value[1]];
                  setPriceRange(newRange);
                  notifyChange({ priceRange: newRange });
                }}
                dir="ltr"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground" dir="ltr">
              <span>{formatPrice(100000)}</span>
              <span>{formatPrice(5000000)}</span>
            </div>
          </div>
        </Section>

        {/* گزینه‌های اضافی */}
        <Section title={isRtl ? 'گزینه‌های اضافی' : 'Additional Options'}>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={privateCompartment}
                onCheckedChange={(checked) => {
                  markInteracted();
                  setPrivateCompartment(!!checked);
                  notifyChange({ privateCompartment: !!checked });
                }}
              />
              <span className="text-sm group-hover:text-primary transition-colors">
                {isRtl ? 'کوپه دربست' : 'Private Compartment'}
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={foreignNational}
                onCheckedChange={(checked) => {
                  markInteracted();
                  setForeignNational(!!checked);
                  notifyChange({ foreignNational: !!checked });
                }}
              />
              <span className="text-sm group-hover:text-primary transition-colors">
                {isRtl ? 'اتباع خارجی' : 'Foreign National'}
              </span>
            </label>
          </div>
        </Section>

        {/* توضیحات خاص */}
        <div className="pt-3">
          <Label className="text-sm font-semibold text-primary mb-2 block">
            {isRtl ? 'توضیحات خاص' : 'Special Notes'}
          </Label>
          <Textarea
            placeholder={isRtl ? 'اگر توضیحات یا درخواست خاصی دارید اینجا بنویسید...' : 'Write any special requests here...'}
            value={customerNotes}
            onChange={(e) => {
              markInteracted();
              setCustomerNotes(e.target.value);
              notifyChange({ customerNotes: e.target.value });
            }}
            className="min-h-[80px] resize-none text-sm"
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
