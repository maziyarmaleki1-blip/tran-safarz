import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayPickerProps } from "react-day-picker";
import { format, addMonths, subMonths, setMonth, setYear, getMonth, getYear } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type JalaliCalendarProps = DayPickerProps;

const jalaliMonths = [
  { value: 0, label: "فروردین" },
  { value: 1, label: "اردیبهشت" },
  { value: 2, label: "خرداد" },
  { value: 3, label: "تیر" },
  { value: 4, label: "مرداد" },
  { value: 5, label: "شهریور" },
  { value: 6, label: "مهر" },
  { value: 7, label: "آبان" },
  { value: 8, label: "آذر" },
  { value: 9, label: "دی" },
  { value: 10, label: "بهمن" },
  { value: 11, label: "اسفند" },
];

const jalaliWeekdays = ["ش", "۱ش", "۲ش", "۳ش", "۴ش", "۵ش", "ج"];

// Convert number to Persian numerals
const toPersianDigits = (num: number | string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(num).replace(/\d/g, (d) => persianDigits[parseInt(d)]);
};

// Get Jalali year range
const getJalaliYears = () => {
  const currentYear = parseInt(format(new Date(), "yyyy", { locale: faIR }));
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i);
  }
  return years;
};

function JalaliCalendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: JalaliCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    props.defaultMonth || new Date()
  );

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleMonthChange = (monthValue: string) => {
    const newMonth = setMonth(currentMonth, parseInt(monthValue));
    setCurrentMonth(newMonth);
  };

  const handleYearChange = (yearValue: string) => {
    // Convert Jalali year to Gregorian for date-fns-jalali
    const targetYear = parseInt(yearValue);
    const currentJalaliYear = parseInt(format(currentMonth, "yyyy", { locale: faIR }));
    const diff = targetYear - currentJalaliYear;
    const newDate = addMonths(currentMonth, diff * 12);
    setCurrentMonth(newDate);
  };

  const currentJalaliMonth = getMonth(currentMonth);
  const currentJalaliYear = format(currentMonth, "yyyy", { locale: faIR });

  return (
    <div className={cn("p-3 pointer-events-auto", className)}>
      {/* Custom Header with Month/Year Selectors */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          )}
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <Select
            value={currentJalaliMonth.toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="h-8 w-24 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {jalaliMonths.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentJalaliYear}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-8 w-20 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getJalaliYears().map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {toPersianDigits(year)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={handleNextMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          )}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="flex mb-2">
        {jalaliWeekdays.map((day, i) => (
          <div
            key={i}
            className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <DayPicker
        showOutsideDays={showOutsideDays}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        locale={faIR}
        weekStartsOn={6}
        formatters={{
          formatDay: (date) => toPersianDigits(format(date, "d", { locale: faIR })),
          formatCaption: () => "", // We use custom header
          formatWeekdayName: () => "", // We use custom weekday headers
        }}
        classNames={{
          months: "flex flex-col",
          month: "",
          caption: "hidden",
          caption_label: "hidden",
          nav: "hidden",
          nav_button: "hidden",
          nav_button_previous: "hidden",
          nav_button_next: "hidden",
          table: "w-full border-collapse",
          head_row: "hidden",
          head_cell: "hidden",
          row: "flex w-full mt-1",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        {...props}
      />
    </div>
  );
}
JalaliCalendar.displayName = "JalaliCalendar";

export { JalaliCalendar };
