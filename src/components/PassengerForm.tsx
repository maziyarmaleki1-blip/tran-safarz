import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import PersianCalendar from '@/components/PersianCalendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { User, CreditCard, Calendar as CalendarIcon, Phone, Lock, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { formatPersianDate } from '@/lib/persianDate';

export interface PassengerData {
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: Date;
}

export interface UserCredentials {
  mobile: string;
  password: string;
}

interface PassengerFormProps {
  passengerCount: number;
  foreignNational: boolean;
  onSubmit: (passengers: PassengerData[], credentials: UserCredentials) => void;
  onBack: () => void;
}

const PassengerForm: React.FC<PassengerFormProps> = ({
  passengerCount,
  foreignNational,
  onSubmit,
  onBack,
}) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const direction = language === 'fa' ? 'rtl' : 'ltr';
  
  const [passengers, setPassengers] = useState<PassengerData[]>(
    Array(passengerCount).fill(null).map(() => ({
      firstName: '',
      lastName: '',
      nationalId: '',
      birthDate: new Date(),
    }))
  );
  
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState<boolean[]>(
    Array(passengerCount).fill(false)
  );

  const BackArrow = direction === 'rtl' ? ArrowRight : ArrowLeft;

  const toggleDatePicker = (index: number, open: boolean) => {
    const newStates = [...datePickerOpen];
    newStates[index] = open;
    setDatePickerOpen(newStates);
  };

  const handleSubmit = () => {
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName || !p.lastName || !p.nationalId) {
        toast({
          title: language === 'fa' ? 'خطا' : 'Error',
          description: `${language === 'fa' ? 'اطلاعات مسافر' : 'Passenger info'} ${i + 1} ${language === 'fa' ? 'ناقص است' : 'is incomplete'}`,
          variant: 'destructive',
        });
        return;
      }
    }

    if (!mobile || mobile.length < 10) {
      toast({
        title: language === 'fa' ? 'خطا' : 'Error',
        description: language === 'fa' ? 'شماره موبایل نامعتبر است' : 'Invalid mobile number',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: language === 'fa' ? 'خطا' : 'Error',
        description: language === 'fa' ? 'رمز عبور باید حداقل 6 کاراکتر باشد' : 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: language === 'fa' ? 'خطا' : 'Error',
        description: language === 'fa' ? 'رمز عبور و تکرار آن مطابقت ندارند' : 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    onSubmit(passengers, { mobile, password });
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <BackArrow className="size-4" />
            <span>{language === 'fa' ? 'بازگشت' : 'Back'}</span>
          </button>
          <h1 className="text-lg font-bold text-foreground">
            {language === 'fa' ? 'مشخصات مسافر' : 'Passenger Info'}
          </h1>
        </div>
      </div>

      {/* All Passengers */}
      <div className="glass-card p-6 mb-4">
        {passengers.map((passenger, index) => (
          <div key={index} className={cn(
            "pb-6 mb-6",
            index < passengers.length - 1 && "border-b border-border/30"
          )}>
            {/* Passenger Label */}
            <div className="flex items-center gap-2 mb-4 justify-end">
              <span className="text-primary font-semibold">
                {language === 'fa' ? `مسافر ${index + 1}` : `Passenger ${index + 1}`}
              </span>
              <User className="size-4 text-primary" />
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-1.5 justify-end">
                  {language === 'fa' ? 'نام' : 'First Name'}
                </Label>
                <Input
                  value={passenger.firstName}
                  onChange={(e) => {
                    const updated = [...passengers];
                    updated[index] = { ...updated[index], firstName: e.target.value };
                    setPassengers(updated);
                  }}
                  className="h-9 text-sm"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-1.5 justify-end">
                  {language === 'fa' ? 'نام خانوادگی' : 'Last Name'}
                </Label>
                <Input
                  value={passenger.lastName}
                  onChange={(e) => {
                    const updated = [...passengers];
                    updated[index] = { ...updated[index], lastName: e.target.value };
                    setPassengers(updated);
                  }}
                  className="h-9 text-sm"
                />
              </div>

              {/* National ID */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-1.5 justify-end">
                  <CreditCard className="size-3.5" />
                  {foreignNational 
                    ? (language === 'fa' ? 'شماره پاسپورت' : 'Passport Number')
                    : (language === 'fa' ? 'کد ملی' : 'National ID')
                  }
                </Label>
                <Input
                  value={passenger.nationalId}
                  onChange={(e) => {
                    const updated = [...passengers];
                    updated[index] = { ...updated[index], nationalId: e.target.value };
                    setPassengers(updated);
                  }}
                  className="h-9 text-sm"
                  maxLength={foreignNational ? 20 : 10}
                />
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-1.5 justify-end">
                  <CalendarIcon className="size-3.5" />
                  {language === 'fa' ? 'تاریخ تولد' : 'Birth Date'}
                </Label>
                <Popover 
                  open={datePickerOpen[index]} 
                  onOpenChange={(open) => toggleDatePicker(index, open)}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-9 text-sm justify-start"
                    >
                      {passenger.birthDate
                        ? (language === 'fa' 
                            ? formatPersianDate(passenger.birthDate) 
                            : format(passenger.birthDate, 'PP', { locale: enUS }))
                        : (language === 'fa' ? 'انتخاب تاریخ' : 'Select date')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    {language === 'fa' ? (
                      <PersianCalendar
                        selected={passenger.birthDate}
                        onSelect={(date) => {
                          if (date) {
                            const updated = [...passengers];
                            updated[index] = { ...updated[index], birthDate: date };
                            setPassengers(updated);
                            toggleDatePicker(index, false);
                          }
                        }}
                        disabled={(date) => date > new Date()}
                        mode="past"
                      />
                    ) : (
                      <Calendar
                        mode="single"
                        selected={passenger.birthDate}
                        onSelect={(date) => {
                          if (date) {
                            const updated = [...passengers];
                            updated[index] = { ...updated[index], birthDate: date };
                            setPassengers(updated);
                            toggleDatePicker(index, false);
                          }
                        }}
                        initialFocus
                        locale={enUS}
                        className={cn("p-3 pointer-events-auto")}
                        disabled={(date) => date > new Date()}
                      />
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Account Creation Section */}
      <div className="glass-card p-6">
        {/* Info Note */}
        <div className="flex items-center gap-2 justify-end mb-4 text-muted-foreground">
          <p className="text-sm">
            {language === 'fa' 
              ? 'با ثبت رزرو، حساب کاربری برای شما ایجاد می‌شود' 
              : 'An account will be created for you upon reservation'}
          </p>
          <Info className="size-4" />
        </div>

        {/* Credentials Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Mobile */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-1.5 justify-end">
              <Phone className="size-3.5" />
              {language === 'fa' ? 'شماره موبایل' : 'Mobile'}
            </Label>
            <Input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="09xxxxxxxxx"
              className="h-9 text-sm"
              dir="ltr"
              maxLength={11}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-1.5 justify-end">
              <Lock className="size-3.5" />
              {language === 'fa' ? 'رمز عبور' : 'Password'}
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-1.5 justify-end">
              <Lock className="size-3.5" />
              {language === 'fa' ? 'تکرار رمز عبور' : 'Confirm Password'}
            </Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="h-9 bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-500/25"
          >
            {language === 'fa' ? 'تکمیل رزرو' : 'Complete Reservation'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PassengerForm;