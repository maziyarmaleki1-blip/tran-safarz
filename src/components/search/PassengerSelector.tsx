import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Minus, Plus, Users } from 'lucide-react';

export type PassengerType = 'regular' | 'men' | 'women';

export interface PassengerCount {
  adults: number;
  children: number;
  passengerType: PassengerType;
}

interface PassengerSelectorProps {
  value: PassengerCount;
  onChange: (value: PassengerCount) => void;
}

export function PassengerSelector({ value, onChange }: PassengerSelectorProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const totalPassengers = value.adults + value.children;

  const updateAdults = (delta: number) => {
    const newAdults = Math.max(1, Math.min(6, value.adults + delta));
    onChange({ ...value, adults: newAdults });
  };

  const updateChildren = (delta: number) => {
    const newChildren = Math.max(0, Math.min(6, value.children + delta));
    onChange({ ...value, children: newChildren });
  };

  const labels = {
    fa: {
      passengers: 'مسافر',
      adults: 'بزرگسال',
      adultsAge: '۱۲ سال به بالا',
      children: 'کودک',
      childrenAge: '۲ تا ۱۲ سال',
      passengerType: 'نوع مسافر',
      regular: 'مسافرین عادی',
      men: 'ویژه برادران',
      women: 'ویژه خواهران',
      selectCapacity: 'امکان انتخاب مسافر تا ظرفیت کوپه کامل',
      confirm: 'تایید',
    },
    en: {
      passengers: 'Passenger(s)',
      adults: 'Adult',
      adultsAge: '12+ years',
      children: 'Child',
      childrenAge: '2-12 years',
      passengerType: 'Passenger Type',
      regular: 'Regular',
      men: 'Men Only',
      women: 'Women Only',
      selectCapacity: 'Select passengers up to full compartment capacity',
      confirm: 'Confirm',
    },
  };

  const t = labels[language];

  const getPassengerTypeLabel = (type: PassengerType) => {
    switch (type) {
      case 'regular': return t.regular;
      case 'men': return t.men;
      case 'women': return t.women;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-10 justify-start text-start font-normal bg-background/50 text-sm gap-2"
        >
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{totalPassengers} {t.passengers}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        {/* Info Banner */}
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg mb-4 text-xs text-muted-foreground">
          <span className="material-symbols-outlined text-base">info</span>
          <span>{t.selectCapacity}</span>
        </div>

        {/* Adults Counter */}
        <div className="flex items-center justify-between py-3 border-b border-border/50">
          <div>
            <p className="font-medium text-foreground">{t.adults}</p>
            <p className="text-xs text-muted-foreground">{t.adultsAge}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => updateAdults(-1)}
              disabled={value.adults <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-6 text-center font-medium">{value.adults}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => updateAdults(1)}
              disabled={value.adults >= 6}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Children Counter */}
        <div className="flex items-center justify-between py-3 border-b border-border/50">
          <div>
            <p className="font-medium text-foreground">{t.children}</p>
            <p className="text-xs text-muted-foreground">{t.childrenAge}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => updateChildren(-1)}
              disabled={value.children <= 0}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-6 text-center font-medium">{value.children}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => updateChildren(1)}
              disabled={value.children >= 6}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Passenger Type */}
        <div className="pt-4">
          <RadioGroup
            value={value.passengerType}
            onValueChange={(type) => onChange({ ...value, passengerType: type as PassengerType })}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="regular" id="regular" className="border-primary" />
              <Label htmlFor="regular" className="cursor-pointer text-sm font-normal">
                {t.regular}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="men" id="men" className="border-primary" />
              <Label htmlFor="men" className="cursor-pointer text-sm font-normal">
                {t.men}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="women" id="women" className="border-primary" />
              <Label htmlFor="women" className="cursor-pointer text-sm font-normal">
                {t.women}
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Confirm Button */}
        <Button
          className="w-full mt-4 gradient-primary"
          onClick={() => setIsOpen(false)}
        >
          {t.confirm}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
