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
import { ArrowRight, Info, Calendar } from 'lucide-react';
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
  const isRTL = language === 'fa';

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

  // Glassmorphism styles
  const glassCard = "relative bg-white/70 dark:bg-card/60 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]";
  const inputStyle = "h-11 bg-primary/5 border-0 rounded-lg placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary/30";
  const labelStyle = "text-sm font-medium text-muted-foreground mb-2 block";

  return (
    <div className="space-y-6">
      {/* Main Glass Card */}
      <div className={cn(glassCard, "p-6 sm:p-8")}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-foreground">مشخصات مسافر</h2>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>بازگشت</span>
            <ArrowRight className="size-4" />
          </button>
        </div>

        {/* Passenger Forms */}
        {passengers.map((passenger, index) => (
          <div key={index} className="mb-6 last:mb-0">
            {/* Passenger Label */}
            <div className="flex items-center justify-end mb-4">
              <span className="text-primary font-semibold">مسافر {index + 1}</span>
            </div>

            {/* Form Fields - Horizontal Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* First Name */}
              <div>
                <label className={labelStyle}>نام</label>
                <Input
                  placeholder="نام"
                  value={passenger.firstName}
                  onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                  className={inputStyle}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className={labelStyle}>نام خانوادگی</label>
                <Input
                  placeholder="نام خانوادگی"
                  value={passenger.lastName}
                  onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                  className={inputStyle}
                />
              </div>

              {/* National ID */}
              <div>
                <label className={labelStyle}>{foreignNational ? 'شماره پاسپورت' : 'کد ملی'}</label>
                <Input
                  placeholder={foreignNational ? 'شماره پاسپورت' : 'کد ملی ۱۰ رقمی'}
                  value={passenger.nationalId}
                  onChange={(e) => updatePassenger(index, 'nationalId', e.target.value)}
                  className={inputStyle}
                  maxLength={foreignNational ? 20 : 10}
                />
              </div>

              {/* Birth Date */}
              <div>
                <label className={labelStyle}>تاریخ تولد</label>
                <Popover 
                  open={datePickerOpen[index]} 
                  onOpenChange={(open) => toggleDatePicker(index, open)}
                >
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full h-11 px-3 flex items-center justify-between text-right rounded-lg",
                        "bg-primary/5 hover:bg-primary/10 transition-colors",
                        !passenger.birthDate && "text-muted-foreground/60"
                      )}
                    >
                      <Calendar className="size-4 opacity-50" />
                      <span>
                        {passenger.birthDate 
                          ? formatPersianDate(passenger.birthDate)
                          : 'انتخاب تاریخ'
                        }
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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
              <div className="mt-6 border-t border-border/30" />
            )}
          </div>
        ))}
      </div>

      {/* Account Creation Glass Card */}
      <div className={cn(glassCard, "p-6 sm:p-8")}>
        {/* Info Note */}
        <div className="flex items-center justify-end gap-2 mb-6 text-muted-foreground">
          <span className="text-sm">با ثبت رزرو، حساب کاربری برای شما ایجاد می‌شود</span>
          <Info className="size-4" />
        </div>

        {/* Credentials Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Mobile */}
          <div>
            <label className={labelStyle}>شماره موبایل</label>
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

          {/* Password */}
          <div>
            <label className={labelStyle}>رمز عبور</label>
            <Input
              type="password"
              placeholder="حداقل ۶ کاراکتر"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className={inputStyle}
              dir="ltr"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className={labelStyle}>تکرار رمز عبور</label>
            <Input
              type="password"
              placeholder="تکرار رمز عبور"
              value={credentials.confirmPassword}
              onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
              className={inputStyle}
              dir="ltr"
            />
          </div>

          {/* Submit Button */}
          <div>
            <Button
              onClick={handleSubmit}
              className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/25 transition-all"
            >
              تکمیل رزرو
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerForm;
