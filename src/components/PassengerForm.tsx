import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PersianCalendar from '@/components/PersianCalendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ArrowRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { formatPersianDate } from '@/lib/persianDate';

export interface PassengerData {
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: Date | null;
}

export interface UserCredentials {
  mobile: string;
  password: string;
}

interface PassengerFormProps {
  passengerCount: number;
  foreignNational?: boolean;
  onSubmit: (passengers: PassengerData[], credentials: UserCredentials) => void;
  onBack: () => void;
}

const PassengerForm: React.FC<PassengerFormProps> = ({
  passengerCount,
  foreignNational = false,
  onSubmit,
  onBack,
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();

  const [passengers, setPassengers] = useState<PassengerData[]>(
    Array(passengerCount).fill(null).map(() => ({
      firstName: '',
      lastName: '',
      nationalId: '',
      birthDate: null,
    }))
  );

  const [credentials, setCredentials] = useState<UserCredentials & { confirmPassword: string }>({
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [datePickerOpen, setDatePickerOpen] = useState<boolean[]>(
    Array(passengerCount).fill(false)
  );

  const updatePassenger = (index: number, field: keyof PassengerData, value: string | Date | null) => {
    const newPassengers = [...passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setPassengers(newPassengers);
  };

  const validateForm = (): boolean => {
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName.trim()) {
        toast({ title: 'خطا', description: `نام مسافر ${i + 1} را وارد کنید`, variant: 'destructive' });
        return false;
      }
      if (!p.lastName.trim()) {
        toast({ title: 'خطا', description: `نام خانوادگی مسافر ${i + 1} را وارد کنید`, variant: 'destructive' });
        return false;
      }
      if (!p.nationalId.trim()) {
        toast({ title: 'خطا', description: `کد ملی مسافر ${i + 1} را وارد کنید`, variant: 'destructive' });
        return false;
      }
      if (!foreignNational && p.nationalId.length !== 10) {
        toast({ title: 'خطا', description: `کد ملی مسافر ${i + 1} باید ۱۰ رقم باشد`, variant: 'destructive' });
        return false;
      }
      if (!p.birthDate) {
        toast({ title: 'خطا', description: `تاریخ تولد مسافر ${i + 1} را وارد کنید`, variant: 'destructive' });
        return false;
      }
    }
    if (!credentials.mobile.trim() || !/^09\d{9}$/.test(credentials.mobile)) {
      toast({ title: 'خطا', description: 'شماره موبایل معتبر نیست', variant: 'destructive' });
      return false;
    }
    if (!credentials.password || credentials.password.length < 6) {
      toast({ title: 'خطا', description: 'رمز عبور باید حداقل ۶ کاراکتر باشد', variant: 'destructive' });
      return false;
    }
    if (credentials.password !== credentials.confirmPassword) {
      toast({ title: 'خطا', description: 'رمز عبور و تکرار آن مطابقت ندارند', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(passengers, { mobile: credentials.mobile, password: credentials.password });
    }
  };

  const toggleDatePicker = (index: number, open: boolean) => {
    const newStates = [...datePickerOpen];
    newStates[index] = open;
    setDatePickerOpen(newStates);
  };

  // Styles matching the reference exactly
  const inputStyle = "h-10 bg-sky-50/80 border border-sky-100 rounded-md text-sm placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary/30";

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Single Glass Card Container */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/60 overflow-hidden">
        
        {/* Top Section - Passenger Info */}
        <div className="p-6 pb-5">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">مشخصات مسافر</h2>
            <button 
              onClick={onBack}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <span>بازگشت</span>
              <ArrowRight className="size-4" />
            </button>
          </div>

          {/* Passengers */}
          {passengers.map((passenger, index) => (
            <div key={index} className="mb-5 last:mb-0">
              {/* Passenger Label - Right aligned */}
              <div className="flex justify-end mb-3">
                <span className="text-primary font-semibold text-sm">مسافر {index + 1}</span>
              </div>

              {/* 4-Column Form Row */}
              <div className="grid grid-cols-4 gap-3">
                {/* Column 1: نام (rightmost in RTL) */}
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground block text-right">نام</label>
                  <Input
                    value={passenger.firstName}
                    onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                    className={inputStyle}
                  />
                </div>

                {/* Column 2: نام خانوادگی */}
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground block text-right">نام خانوادگی</label>
                  <Input
                    value={passenger.lastName}
                    onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                    className={inputStyle}
                  />
                </div>

                {/* Column 3: کد ملی */}
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground block text-right">
                    {foreignNational ? 'شماره پاسپورت' : 'کد ملی'}
                  </label>
                  <Input
                    value={passenger.nationalId}
                    onChange={(e) => updatePassenger(index, 'nationalId', e.target.value)}
                    className={inputStyle}
                    maxLength={foreignNational ? 20 : 10}
                  />
                </div>

                {/* Column 4: تاریخ تولد (leftmost in RTL) */}
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground block text-right">تاریخ تولد</label>
                  <Popover 
                    open={datePickerOpen[index]} 
                    onOpenChange={(open) => toggleDatePicker(index, open)}
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "w-full h-10 px-3 flex items-center justify-end text-right rounded-md text-sm",
                          "bg-sky-50/80 border border-sky-100 hover:bg-sky-100/50 transition-colors",
                          !passenger.birthDate && "text-muted-foreground/50"
                        )}
                      >
                        {passenger.birthDate 
                          ? formatPersianDate(passenger.birthDate)
                          : 'انتخاب تاریخ'
                        }
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <PersianCalendar
                        selected={passenger.birthDate || undefined}
                        onSelect={(date) => {
                          updatePassenger(index, 'birthDate', date);
                          toggleDatePicker(index, false);
                        }}
                        mode="past"
                        disabled={(date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Divider between passengers */}
              {index < passengers.length - 1 && (
                <div className="mt-5 border-t border-border/20" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom Section - Account Info */}
        <div className="bg-gradient-to-b from-white/40 to-white/70 border-t border-white/50 p-6 pt-5">
          {/* Info Note - Right aligned */}
          <div className="flex items-center justify-end gap-2 mb-4">
            <span className="text-xs text-muted-foreground">با ثبت رزرو، حساب کاربری برای شما ایجاد می‌شود</span>
            <Info className="size-3.5 text-muted-foreground" />
          </div>

          {/* 4-Column Credentials Row */}
          <div className="grid grid-cols-4 gap-3 items-end">
            {/* Column 1: شماره موبایل (rightmost in RTL) */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground block text-right">شماره موبایل</label>
              <Input
                type="tel"
                placeholder="09xxxxxxxxx"
                value={credentials.mobile}
                onChange={(e) => setCredentials({ ...credentials, mobile: e.target.value })}
                className={inputStyle}
                dir="ltr"
                maxLength={11}
              />
            </div>

            {/* Column 2: رمز عبور */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground block text-right">رمز عبور</label>
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className={inputStyle}
                dir="ltr"
              />
            </div>

            {/* Column 3: تکرار رمز عبور */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground block text-right">تکرار رمز عبور</label>
              <Input
                type="password"
                value={credentials.confirmPassword}
                onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                className={inputStyle}
                dir="ltr"
              />
            </div>

            {/* Column 4: Submit Button (leftmost in RTL) */}
            <div>
              <Button
                onClick={handleSubmit}
                className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-md shadow-md shadow-emerald-500/20 transition-all"
              >
                تکمیل رزرو
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerForm;