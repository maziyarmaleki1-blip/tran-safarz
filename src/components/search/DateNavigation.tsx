import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface DateNavigationProps {
  currentDate: string;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export const DateNavigation = ({ currentDate, onPrevDay, onNextDay }: DateNavigationProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevDay}
        className="bg-card/80 hover:bg-card text-xs"
      >
        {t('previousDay')}
      </Button>
      
      <div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-lg px-4 py-2">
        <span className="font-semibold text-sm">{currentDate}</span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNextDay}
        className="bg-card/80 hover:bg-card text-xs"
      >
        {t('nextDay')}
      </Button>
    </div>
  );
};
