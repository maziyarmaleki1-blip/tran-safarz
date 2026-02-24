import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export type SortOption = 'default' | 'departure' | 'cheapest' | 'expensive' | 'owner';

interface SortOptionsProps {
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortOptions = ({ activeSort, onSortChange }: SortOptionsProps) => {
  const { t } = useLanguage();

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: t('sortDefault') },
    { value: 'departure', label: t('sortDeparture') },
    { value: 'cheapest', label: t('sortCheapest') },
    { value: 'expensive', label: t('sortExpensive') },
    { value: 'owner', label: t('sortOwner') },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground ml-2">
        {t('sortBy')}:
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
