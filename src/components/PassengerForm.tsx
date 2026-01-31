import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PersianCalendar from '@/components/PersianCalendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ArrowRight, ArrowLeft, Info, Calendar, User, CreditCard, Phone, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { formatPersianDate } from '@/lib/persianDate';
import { Card } from '@/components/ui/card';

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
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === 'fa';

  // Initialize passengers array
  const [passengers, setPassengers] = useState<PassengerData[]>(
    Array(passengerCount).fill(null).map(() => ({
      firstName: '',
      lastName: '',
      nationalId: '',
      birthDate: null,
    }))
  );

  // User credentials for account creation
  const [credentials, setCredentials] = useState<UserCredentials & { confirmPassword: string }>({
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  // Date picker open states
  const [datePickerOpen, setDatePickerOpen] = useState<boolean[]>(
    Array(passengerCount).fill(false)
  );

  const updatePassenger = (index: number, field: keyof PassengerData, value: string | Date | null) => {
    const newPassengers = [...passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setPassengers(newPassengers);
  };

  const validateForm = (): boolean => {
    // Validate passengers
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName.trim()) {
        toast({
          title: isRTL ? 'خطا' : 'Error',
          description: isRTL ? `نام مسافر ${i + 1} را وارد کنید` : `Enter first name for passenger ${i + 1}`,
          variant: 'destructive',
        });
        return false;
      }
      if (!p.lastName.trim()) {
        toast({
          title: isRTL ? 'خطا' : 'Error',
          description: isRTL ? `نام خانوادگی مسافر ${i + 1} را وارد کنید` : `Enter last name for passenger ${i + 1}`,
          variant: 'destructive',
        });
        return false;
      }
      if (!p.nationalId.trim()) {
        toast({
          title: isRTL ? 'خطا' : 'Error',
          description: isRTL 
            ? `${foreignNational ? 'شماره پاسپورت' : 'کد ملی'} مسافر ${i + 1} را وارد کنید` 
            : `Enter ${foreignNational ? 'passport number' : 'national ID'} for passenger ${i + 1}`,
          variant: 'destructive',
        });
        return false;
      }
      if (!foreignNational && p.nationalId.length !== 10) {
        toast({
          title: isRTL ? 'خطا' : 'Error',
          description: isRTL ? `کد ملی مسافر ${i + 1} باید ۱۰ رقم باشد` : `National ID for passenger ${i + 1} must be 10 digits`,
          variant: 'destructive',
        });
        return false;
      }
      if (!p.birthDate) {
        toast({
          title: isRTL ? 'خطا' : 'Error',
          description: isRTL ? `تاریخ تولد مسافر ${i + 1} را وارد کنید` : `Enter birth date for passenger ${i + 1}`,
          variant: 'destructive',
        });
        return false;
      }
    }

    // Validate credentials
    if (!credentials.mobile.trim()) {
      toast({
        title: isRTL ? 'خطا' : 'Error',
        description: isRTL ? 'شماره موبایل را وارد کنید' : 'Enter mobile number',
        variant: 'destructive',
      });
      return false;
    }
    if (!/^09\d{9}$/.test(credentials.mobile)) {
      toast({
        title: isRTL ? 'خطا' : 'Error',
        description: isRTL ? 'شماره موبایل معتبر نیست' : 'Invalid mobile number',
        variant: 'destructive',
      });
      return false;
    }
    if (!credentials.password) {
      toast({
        title: isRTL ? 'خطا' : 'Error',
        description: isRTL ? 'رمز عبور را وارد کنید' : 'Enter password',
        variant: 'destructive',
      });
      return false;
    }
    if (credentials.password.length < 6) {
      toast({
        title: isRTL ? 'خطا' : 'Error',
        description: isRTL ? 'رمز عبور باید حداقل ۶ کاراکتر باشد' : 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return false;
    }
    if (credentials.password !== credentials.confirmPassword) {
      toast({
        title: isRTL ? 'خطا' : 'Error',
        description: isRTL ? 'رمز عبور و تکرار آن مطابقت ندارند' : 'Passwords do not match',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(passengers, {
        mobile: credentials.mobile,
        password: credentials.password,
      });
    }
  };

  const toggleDatePicker = (index: number, open: boolean) => {
    const newStates = [...datePickerOpen];
    newStates[index] = open;
    setDatePickerOpen(newStates);
  };

  return (
    <div className="space-y-6">
      {/* Passenger Forms */}
      {passengers.map((passenger, index) => (
        <Card key={index} className="p-5 sm:p-6 bg-card/80 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">
                {isRTL ? `مسافر ${index + 1}` : `Passenger ${index + 1}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'اطلاعات هویتی' : 'Identity information'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {isRTL ? 'نام' : 'First Name'} <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder={isRTL ? 'نام به فارسی' : 'First name'}
                value={passenger.firstName}
                onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                className="h-11"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {isRTL ? 'نام خانوادگی' : 'Last Name'} <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder={isRTL ? 'نام خانوادگی به فارسی' : 'Last name'}
                value={passenger.lastName}
                onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                className="h-11"
              />
            </div>

            {/* National ID / Passport */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="size-4 text-muted-foreground" />
                {foreignNational 
                  ? (isRTL ? 'شماره پاسپورت' : 'Passport Number')
                  : (isRTL ? 'کد ملی' : 'National ID')
                } <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder={foreignNational 
                  ? (isRTL ? 'شماره پاسپورت' : 'Passport number')
                  : (isRTL ? 'کد ملی ۱۰ رقمی' : '10-digit national ID')
                }
                value={passenger.nationalId}
                onChange={(e) => updatePassenger(index, 'nationalId', e.target.value)}
                className="h-11"
                maxLength={foreignNational ? 20 : 10}
              />
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                {isRTL ? 'تاریخ تولد' : 'Birth Date'} <span className="text-destructive">*</span>
              </Label>
              <Popover 
                open={datePickerOpen[index]} 
                onOpenChange={(open) => toggleDatePicker(index, open)}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-right font-normal",
                      !passenger.birthDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="size-4 ml-2 opacity-50" />
                    {passenger.birthDate 
                      ? (isRTL ? formatPersianDate(passenger.birthDate) : passenger.birthDate.toLocaleDateString())
                      : (isRTL ? 'انتخاب تاریخ' : 'Select date')
                    }
                  </Button>
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

          {/* Info note */}
          <div className="mt-4 p-3 rounded-lg bg-muted/50 flex items-start gap-2">
            <Info className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              {isRTL 
                ? 'اطلاعات مسافر باید دقیقاً مطابق با مدارک هویتی باشد.'
                : 'Passenger information must match identity documents exactly.'
              }
            </p>
          </div>
        </Card>
      ))}

      {/* Account Creation Section */}
      <Card className="p-5 sm:p-6 bg-card/80 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50">
          <div className="size-10 rounded-xl bg-secondary/50 flex items-center justify-center">
            <Lock className="size-5 text-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">
              {isRTL ? 'اطلاعات حساب کاربری' : 'Account Information'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRTL ? 'برای پیگیری سفارش و دریافت بلیط' : 'For order tracking and ticket delivery'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Mobile */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Phone className="size-4 text-muted-foreground" />
              {isRTL ? 'شماره موبایل' : 'Mobile Number'} <span className="text-destructive">*</span>
            </Label>
            <Input
              type="tel"
              placeholder={isRTL ? '۰۹۱۲۳۴۵۶۷۸۹' : '09123456789'}
              value={credentials.mobile}
              onChange={(e) => setCredentials({ ...credentials, mobile: e.target.value })}
              className="h-11"
              dir="ltr"
              maxLength={11}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Lock className="size-4 text-muted-foreground" />
              {isRTL ? 'رمز عبور' : 'Password'} <span className="text-destructive">*</span>
            </Label>
            <Input
              type="password"
              placeholder={isRTL ? 'حداقل ۶ کاراکتر' : 'At least 6 characters'}
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="h-11"
              dir="ltr"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {isRTL ? 'تکرار رمز عبور' : 'Confirm Password'} <span className="text-destructive">*</span>
            </Label>
            <Input
              type="password"
              placeholder={isRTL ? 'تکرار رمز عبور' : 'Repeat password'}
              value={credentials.confirmPassword}
              onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
              className="h-11"
              dir="ltr"
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onBack}
          className="h-12 gap-2 order-2 sm:order-1"
        >
          {isRTL ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
          {isRTL ? 'بازگشت' : 'Back'}
        </Button>
        <Button
          onClick={handleSubmit}
          className="h-12 flex-1 gap-2 gradient-primary text-lg order-1 sm:order-2"
        >
          {isRTL ? 'ادامه و پرداخت' : 'Continue to Payment'}
          {isRTL ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
        </Button>
      </div>
    </div>
  );
};

export default PassengerForm;
