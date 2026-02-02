import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import PersianCalendar from '@/components/PersianCalendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ArrowRight, ArrowLeft, Info } from 'lucide-react';
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
  const { language } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === 'fa';
  
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

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

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
          title: isRTL ? 'خطا' : 'Error',
          description: `${isRTL ? 'اطلاعات مسافر' : 'Passenger info'} ${i + 1} ${isRTL ? 'ناقص است' : 'is incomplete'}`,
          variant: 'destructive',
        });
        return;
      }
    }

    if (!mobile || mobile.length < 10) {
      toast({
        title: isRTL ? 'خطا' : 'Error',
        description: isRTL ? 'شماره موبایل نامعتبر است' : 'Invalid mobile number',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: isRTL ? 'خطا' : 'Error',
        description: isRTL ? 'رمز عبور باید حداقل 6 کاراکتر باشد' : 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: isRTL ? 'خطا' : 'Error',
        description: isRTL ? 'رمز عبور و تکرار آن مطابقت ندارند' : 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    onSubmit(passengers, { mobile, password });
  };

  const getFieldLabel = (field: string) => {
    const labels: Record<string, { fa: string; en: string }> = {
      firstName: { fa: 'نام', en: 'First Name' },
      lastName: { fa: 'نام خانوادگی', en: 'Last Name' },
      nationalId: { 
        fa: foreignNational ? 'شماره پاسپورت' : 'کد ملی', 
        en: foreignNational ? 'Passport Number' : 'National ID' 
      },
      birthDate: { fa: 'تاریخ تولد', en: 'Birth Date' },
      mobile: { fa: 'شماره موبایل', en: 'Mobile' },
      password: { fa: 'رمز عبور', en: 'Password' },
      confirmPassword: { fa: 'تکرار رمز عبور', en: 'Confirm Password' },
    };
    return isRTL ? labels[field]?.fa : labels[field]?.en;
  };

  const renderPassengerField = (field: string, index: number, passenger: PassengerData) => {
    const textAlign = isRTL ? 'text-right' : 'text-left';

    if (field === 'birthDate') {
      return (
        <div key={field} className="space-y-2">
          <label className={`block text-sm text-gray-600 ${textAlign}`}>
            {getFieldLabel(field)}
          </label>
          <Popover 
            open={datePickerOpen[index]} 
            onOpenChange={(open) => toggleDatePicker(index, open)}
          >
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full h-10 px-3 text-sm bg-sky-50/80 border border-sky-100 rounded-lg hover:bg-sky-100/80 transition-colors",
                  textAlign
                )}
              >
                {passenger.birthDate
                  ? (isRTL 
                      ? formatPersianDate(passenger.birthDate) 
                      : format(passenger.birthDate, 'PP', { locale: enUS }))
                  : (isRTL ? 'انتخاب تاریخ' : 'Select date')}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {isRTL ? (
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
                  className="p-3 pointer-events-auto"
                  disabled={(date) => date > new Date()}
                />
              )}
            </PopoverContent>
          </Popover>
        </div>
      );
    }

    const fieldKey = field as keyof PassengerData;
    return (
      <div key={field} className="space-y-2">
        <label className={`block text-sm text-gray-600 ${textAlign}`}>
          {getFieldLabel(field)}
        </label>
        <Input
          value={passenger[fieldKey] as string}
          onChange={(e) => {
            const updated = [...passengers];
            updated[index] = { ...updated[index], [fieldKey]: e.target.value };
            setPassengers(updated);
          }}
          className={cn("h-10 text-sm bg-sky-50/80 border-sky-100", textAlign)}
          maxLength={field === 'nationalId' ? (foreignNational ? 20 : 10) : undefined}
        />
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Main Glass Card - Glassmorphism */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/40">
        
        {/* Header Section */}
        <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-white/30 bg-white/30">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors text-sm hover-scale"
            >
              <BackArrow className="size-4" />
              <span>{isRTL ? 'بازگشت' : 'Back'}</span>
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">
              {isRTL ? 'مشخصات مسافر' : 'Passenger Details'}
            </h1>
          </div>
        </div>

        {/* Passengers Section */}
        <div className="px-4 sm:px-8 py-4 sm:py-6">
          {passengers.map((passenger, index) => (
            <div key={index} className="mb-6 last:mb-0">
              {/* Passenger Row with Accent Line on RIGHT for RTL */}
              <div className="flex gap-3 sm:gap-4">
                {/* Passenger Content */}
                <div className="flex-1">
                  {/* Passenger Label - Always Right */}
                  <div className="flex justify-end mb-3 sm:mb-4">
                    <span className="text-orange-500 font-semibold text-sm">
                      {isRTL ? `مسافر ${index + 1}` : `Passenger ${index + 1}`}
                    </span>
                  </div>

                  {/* Form Fields - Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {['firstName', 'lastName', 'nationalId', 'birthDate'].map((field) => 
                      renderPassengerField(field, index, passenger)
                    )}
                  </div>
                </div>

                {/* Accent Line - RIGHT side */}
                <div className="w-1 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Account Creation Section */}
        <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-white/30 bg-white/20">
          <div className="flex gap-3 sm:gap-4">
            {/* Account Content */}
            <div className="flex-1">
              {/* Info Note - Always Right */}
              <div className="flex items-center gap-2 mb-3 sm:mb-4 text-gray-600 justify-end">
                <p className="text-xs sm:text-sm">
                  {isRTL 
                    ? 'با ثبت رزرو، حساب کاربری برای شما ایجاد می‌شود'
                    : 'An account will be created for you upon reservation'}
                </p>
                <Info className="size-4 text-sky-500 shrink-0" />
              </div>

              {/* Credentials Form - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
                {/* Mobile */}
                <div className="space-y-2">
                  <label className={`block text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {getFieldLabel('mobile')}
                  </label>
                  <Input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="09xxxxxxxxx"
                    className="h-10 text-sm bg-sky-50/80 border-sky-100"
                    dir="ltr"
                    maxLength={11}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className={`block text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {getFieldLabel('password')}
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn("h-10 text-sm bg-sky-50/80 border-sky-100", isRTL ? 'text-right' : 'text-left')}
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className={`block text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {getFieldLabel('confirmPassword')}
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn("h-10 text-sm bg-sky-50/80 border-sky-100", isRTL ? 'text-right' : 'text-left')}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  className="h-10 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg"
                >
                  {isRTL ? 'تکمیل رزرو' : 'Complete'}
                </Button>
              </div>
            </div>

            {/* Accent Line - RIGHT side */}
            <div className="w-1 bg-gradient-to-b from-sky-400 to-sky-500 rounded-full" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PassengerForm;
