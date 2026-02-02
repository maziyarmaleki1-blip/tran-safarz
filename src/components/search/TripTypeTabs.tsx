import { useLanguage } from '@/contexts/LanguageContext';

export type TripType = 'one-way' | 'round-trip';

interface TripTypeTabsProps {
  value: TripType;
  onChange: (value: TripType) => void;
}

export function TripTypeTabs({ value, onChange }: TripTypeTabsProps) {
  const { language } = useLanguage();

  const labels = {
    fa: {
      oneWay: 'یک طرفه',
      roundTrip: 'رفت و برگشت',
    },
    en: {
      oneWay: 'One Way',
      roundTrip: 'Round Trip',
    },
  };

  const t = labels[language];

  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-fit">
      <button
        type="button"
        onClick={() => onChange('one-way')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          value === 'one-way'
            ? 'bg-background text-primary shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {t.oneWay}
      </button>
      <span className="text-muted-foreground/50">|</span>
      <button
        type="button"
        onClick={() => onChange('round-trip')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          value === 'round-trip'
            ? 'bg-background text-primary shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {t.roundTrip}
      </button>
    </div>
  );
}
