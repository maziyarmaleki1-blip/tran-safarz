import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export type SortOption = 'default' | 'departure' | 'cheapest' | 'expensive' | 'owner';

interface SortOptionsProps {
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortOptions = ({ activeSort, onSortChange }: SortOptionsProps) => {
  const { language } = useLanguage();

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: language === 'fa' ? 'پیش فرض' : 'Default' },
    { value: 'departure', label: language === 'fa' ? 'ساعت حرکت' : 'Departure' },
    { value: 'cheapest', label: language === 'fa' ? 'ارزانترین' : 'Cheapest' },
    { value: 'expensive', label: language === 'fa' ? 'گرانترین' : 'Most Expensive' },
    { value: 'owner', label: language === 'fa' ? 'مالک' : 'Owner' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground ml-2">
        {language === 'fa' ? 'نمایش بر اساس' : 'Sort by'}:
      </span>
      {sortOptions.map((option) => (
        <Button
          key={option.value}
          variant={activeSort === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSortChange(option.value)}
          className={`text-xs ${
            activeSort === option.value 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-card/80 hover:bg-card'
          }`}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};
