import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { User, Baby } from 'lucide-react';

export type PassengerType = 'adult' | 'child';

interface PassengerTypeSelectorProps {
  type: PassengerType;
  onChange: (type: PassengerType) => void;
  index: number;
}

const PassengerTypeSelector: React.FC<PassengerTypeSelectorProps> = ({
  type,
  onChange,
  index,
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'fa';

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">
        {isRTL ? 'نوع:' : 'Type:'}
      </span>
      <div className="flex gap-1">
        <Button
          type="button"
          size="sm"
          variant={type === 'adult' ? 'default' : 'outline'}
          onClick={() => onChange('adult')}
          className={`h-7 px-2 text-xs gap-1 ${
            type === 'adult' 
              ? 'bg-sky-500 hover:bg-sky-600 text-white' 
              : 'bg-transparent border-sky-200 hover:bg-sky-50'
          }`}
        >
          <User className="size-3" />
          {isRTL ? 'بزرگسال' : 'Adult'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={type === 'child' ? 'default' : 'outline'}
          onClick={() => onChange('child')}
          className={`h-7 px-2 text-xs gap-1 ${
            type === 'child' 
              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
              : 'bg-transparent border-orange-200 hover:bg-orange-50'
          }`}
        >
          <Baby className="size-3" />
          {isRTL ? 'کودک' : 'Child'}
        </Button>
      </div>
    </div>
  );
};

export default PassengerTypeSelector;
