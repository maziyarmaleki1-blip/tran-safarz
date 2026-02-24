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
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {t('type')}
      </span>
      <div className="flex gap-1">
        <Button
          type="button"
          size="sm"
          variant={type === 'adult' ? 'default' : 'outline'}
          onClick={() => onChange('adult')}
          className={`h-7 px-2 text-xs gap-1 ${
            type === 'adult' 
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
              : 'bg-transparent border-primary/20 hover:bg-primary/5'
          }`}
        >
          <User className="size-3" />
          {t('adult')}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={type === 'child' ? 'default' : 'outline'}
          onClick={() => onChange('child')}
          className={`h-7 px-2 text-xs gap-1 ${
            type === 'child' 
              ? 'bg-accent hover:bg-accent/90 text-accent-foreground' 
              : 'bg-transparent border-accent/20 hover:bg-accent/5'
          }`}
        >
          <Baby className="size-3" />
          {t('child')}
        </Button>
      </div>
    </div>
  );
};

export default PassengerTypeSelector;
