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
    <div className="w-full max-w-4xl mx-auto" dir={direction}>
      {/* Main Glass Card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="px-8 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              <BackArrow className="size-4" />
              <span>{language === 'fa' ? 'بازگشت' : 'Back'}</span>
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              {language === 'fa' ? 'مشخصات مسافر' : 'Passenger Details'}
            </h1>
          </div>
        </div>

        {/* Passengers Section */}
        <div className="px-8 py-6">
          {passengers.map((passenger, index) => (
            <div key={index} className="mb-6 last:mb-0">
              {/* Passenger Row with Accent Line */}
              <div className="flex gap-4">
                {/* Accent Line */}
                <div className="w-1 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full" />
                
                {/* Passenger Content */}
                <div className="flex-1">
                  {/* Passenger Label */}
                  <div className="flex justify-end mb-4">
                    <span className="text-orange-500 font-semibold text-sm">
                      {language === 'fa' ? `مسافر ${index + 1}` : `Passenger ${index + 1}`}
                    </span>
                  </div>

                  {/* Form Fields - 4 Column Grid */}
                  <div className="grid grid-cols-4 gap-4">
                    {/* Birth Date - First in RTL */}
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-600 text-right">
                        {language === 'fa' ? 'تاریخ تولد' : 'Birth Date'}
                      </label>
                      <Popover 
                        open={datePickerOpen[index]} 
                        onOpenChange={(open) => toggleDatePicker(index, open)}
                      >
                        <PopoverTrigger asChild>
                          <button
                            className="w-full h-10 px-3 text-sm text-right bg-sky-50/80 border border-sky-100 rounded-lg hover:bg-sky-100/80 transition-colors"
                          >
                            {passenger.birthDate
                              ? (language === 'fa' 
                                  ? formatPersianDate(passenger.birthDate) 
                                  : format(passenger.birthDate, 'PP', { locale: enUS }))
                              : (language === 'fa' ? 'انتخاب تاریخ' : 'Select date')}
                          </button>
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

                    {/* National ID */}
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-600 text-right">
                        {foreignNational 
                          ? (language === 'fa' ? 'شماره پاسپورت' : 'Passport Number')
                          : (language === 'fa' ? 'کد ملی' : 'National ID')
                        }
                      </label>
                      <Input
                        value={passenger.nationalId}
                        onChange={(e) => {
                          const updated = [...passengers];
                          updated[index] = { ...updated[index], nationalId: e.target.value };
                          setPassengers(updated);
                        }}
                        className="h-10 text-sm bg-sky-50/80 border-sky-100 text-right"
                        maxLength={foreignNational ? 20 : 10}
                      />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-600 text-right">
                        {language === 'fa' ? 'نام خانوادگی' : 'Last Name'}
                      </label>
                      <Input
                        value={passenger.lastName}
                        onChange={(e) => {
                          const updated = [...passengers];
                          updated[index] = { ...updated[index], lastName: e.target.value };
                          setPassengers(updated);
                        }}
                        className="h-10 text-sm bg-sky-50/80 border-sky-100 text-right"
                      />
                    </div>

                    {/* First Name */}
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-600 text-right">
                        {language === 'fa' ? 'نام' : 'First Name'}
                      </label>
                      <Input
                        value={passenger.firstName}
                        onChange={(e) => {
                          const updated = [...passengers];
                          updated[index] = { ...updated[index], firstName: e.target.value };
                          setPassengers(updated);
                        }}
                        className="h-10 text-sm bg-sky-50/80 border-sky-100 text-right"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Account Creation Section */}
        <div className="px-8 py-6 border-t border-gray-100">
          <div className="flex gap-4">
            {/* Accent Line */}
            <div className="w-1 bg-gradient-to-b from-sky-400 to-sky-500 rounded-full" />
            
            {/* Account Content */}
            <div className="flex-1">
              {/* Info Note */}
              <div className="flex items-center gap-2 justify-end mb-4 text-gray-500">
                <p className="text-sm">
                  {language === 'fa' 
                    ? 'با ثبت رزرو، حساب کاربری برای شما ایجاد می‌شود' 
                    : 'An account will be created for you upon reservation'}
                </p>
                <Info className="size-4 text-sky-500" />
              </div>

              {/* Credentials Form - 4 Column Grid */}
              <div className="grid grid-cols-4 gap-4 items-end">
                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  className="h-10 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg"
                >
                  {language === 'fa' ? 'تکمیل رزرو' : 'Complete'}
                </Button>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-sm text-gray-600 text-right">
                    {language === 'fa' ? 'تکرار رمز عبور' : 'Confirm Password'}
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-10 text-sm bg-sky-50/80 border-sky-100"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm text-gray-600 text-right">
                    {language === 'fa' ? 'رمز عبور' : 'Password'}
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 text-sm bg-sky-50/80 border-sky-100"
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <label className="block text-sm text-gray-600 text-right">
                    {language === 'fa' ? 'شماره موبایل' : 'Mobile'}
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
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PassengerForm;
