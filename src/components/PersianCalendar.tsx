import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  generatePersianCalendar,
  getPersianDayNames,
  getPersianMonthName,
  gregorianToJalali,
  toPersianDigits,
  persianMonths,
} from '@/lib/persianDate';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PersianCalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  mode?: 'future' | 'past'; // future for search, past for birthdate
}

const PersianCalendar: React.FC<PersianCalendarProps> = ({
  selected,
  onSelect,
  disabled,
  className,
  mode = 'future',
}) => {
  const today = new Date();
  const [currentJy, currentJm] = gregorianToJalali(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );
  
  // Generate years based on mode
  const years = useMemo(() => {
    const result = [];
    if (mode === 'past') {
      // For birth date, years going back ~100 years
      for (let y = currentJy; y >= currentJy - 100; y--) {
        result.push(y);
      }
    } else {
      // For future dates (search), current year + 1 year ahead
      for (let y = currentJy; y <= currentJy + 1; y++) {
        result.push(y);
      }
    }
    return result;
  }, [currentJy, mode]);
  
  const [viewYear, setViewYear] = useState(currentJy);
  const [viewMonth, setViewMonth] = useState(currentJm);
  
  const dayNames = getPersianDayNames();
  
  const weeks = useMemo(() => {
    return generatePersianCalendar(viewYear, viewMonth);
  }, [viewYear, viewMonth]);
  
  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };
  
  const isSelected = (date: Date) => {
    if (!selected) return false;
    return (
      date.getFullYear() === selected.getFullYear() &&
      date.getMonth() === selected.getMonth() &&
      date.getDate() === selected.getDate()
    );
  };
  
  const isToday = (date: Date) => {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };
  
  return (
    <div className={cn("p-3 pointer-events-auto", className)} dir="rtl">
      {/* Header with Year/Month Selects */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Select
            value={viewMonth.toString()}
            onValueChange={(v) => setViewMonth(parseInt(v))}
          >
            <SelectTrigger className="h-8 w-24 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {persianMonths.map((month, idx) => (
                <SelectItem key={idx} value={(idx + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={viewYear.toString()}
            onValueChange={(v) => setViewYear(parseInt(v))}
          >
            <SelectTrigger className="h-8 w-20 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {toPersianDigits(year)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={handlePrevMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, i) => (
          <div
            key={i}
            className="text-center text-xs text-muted-foreground font-medium h-8 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Days */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((dayData, dayIndex) => {
              const isDisabled = disabled ? disabled(dayData.date) : false;
              
              return (
                <button
                  key={dayIndex}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && onSelect(dayData.date)}
                  className={cn(
                    "h-9 w-9 text-sm rounded-md transition-colors flex items-center justify-center",
                    !dayData.isCurrentMonth && "text-muted-foreground opacity-50",
                    dayData.isCurrentMonth && !isSelected(dayData.date) && !isToday(dayData.date) && 
                      "hover:bg-accent hover:text-accent-foreground",
                    isSelected(dayData.date) && "bg-primary text-primary-foreground",
                    isToday(dayData.date) && !isSelected(dayData.date) && "bg-accent text-accent-foreground",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {toPersianDigits(dayData.day)}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersianCalendar;
