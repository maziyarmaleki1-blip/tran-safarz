import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSavedPassengers } from '@/hooks/useSavedPassengers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import PersianCalendar from '@/components/PersianCalendar';
import TripSummary from '@/components/booking/TripSummary';
import PassengerTypeSelector, { PassengerType } from '@/components/booking/PassengerTypeSelector';
import SavedPassengerSelector, { SavedPassenger } from '@/components/booking/SavedPassengerSelector';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ArrowRight, ArrowLeft, Info, Save, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { formatPersianDate } from '@/lib/persianDate';
import { Link } from 'react-router-dom';

export interface PassengerData {
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: Date;
  type: PassengerType;
  saveForLater: boolean;
}

export interface UserCredentials {
  mobile: string;
  password: string;
}

interface TripInfo {
  from: string;
  to: string;
  date?: Date;
  trainName?: string;
  price?: number;
}

interface PassengerFormProps {
  passengerCount: number;
  foreignNational: boolean;
  tripInfo?: TripInfo;
  onSubmit: (passengers: PassengerData[], credentials: UserCredentials) => void;
  onBack: () => void;
}

const PassengerForm: React.FC<PassengerFormProps> = ({
  passengerCount,
  foreignNational,
  tripInfo,
  onSubmit,
  onBack,
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { savePassenger } = useSavedPassengers();
  const { toast } = useToast();
  const isRTL = language === 'fa';
  
  const [passengers, setPassengers] = useState<PassengerData[]>(
    Array(passengerCount).fill(null).map(() => ({
      firstName: '',
      lastName: '',
      nationalId: '',
      birthDate: new Date(),
      type: 'adult' as PassengerType,
      saveForLater: false,
    }))
  );
  
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasExistingAccount, setHasExistingAccount] = useState(false);
  const [acceptRules, setAcceptRules] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState<boolean[]>(
    Array(passengerCount).fill(false)
  );
  const [autoFilled, setAutoFilled] = useState(false);

  // Auto-fill first passenger from profile if logged in
  useEffect(() => {
    if (profile && !autoFilled && passengers[0].firstName === '') {
      const updated = [...passengers];
      updated[0] = {
        ...updated[0],
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
      };
      setPassengers(updated);
      
      if (profile.phone_number) {
        setMobile(profile.phone_number);
      }
      
      setAutoFilled(true);
      
      if (profile.first_name) {
        toast({
          title: isRTL ? 'پر شدن خودکار' : 'Auto-filled',
          description: isRTL 
            ? 'اطلاعات شما از پروفایل وارد شد' 
            : 'Your info was filled from profile',
        });
      }
    }
  }, [profile, autoFilled, passengers, isRTL, toast]);

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const toggleDatePicker = (index: number, open: boolean) => {
    const newStates = [...datePickerOpen];
    newStates[index] = open;
    setDatePickerOpen(newStates);
  };

  const handleSavedPassengerSelect = (index: number, saved: SavedPassenger) => {
    const updated = [...passengers];
    updated[index] = {
      ...updated[index],
      firstName: saved.first_name,
      lastName: saved.last_name,
      nationalId: saved.national_id,
      birthDate: new Date(saved.birth_date),
    };
    setPassengers(updated);
    
    toast({
      title: isRTL ? 'مسافر انتخاب شد' : 'Passenger selected',
      description: `${saved.first_name} ${saved.last_name}`,
    });
  };

  const handleSubmit = async () => {
    // Validate passengers
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

    // Validate mobile (skip if logged in)
    if (!user) {
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

      // Only check confirm password if registering new account
      if (!hasExistingAccount && password !== confirmPassword) {
        toast({
          title: isRTL ? 'خطا' : 'Error',
          description: isRTL ? 'رمز عبور و تکرار آن مطابقت ندارند' : 'Passwords do not match',
          variant: 'destructive',
        });
        return;
      }
    }

    // Validate rules acceptance
    if (!acceptRules) {
      toast({
        title: isRTL ? 'خطا' : 'Error',
        description: isRTL ? 'لطفاً قوانین و شرایط را بپذیرید' : 'Please accept the terms and conditions',
        variant: 'destructive',
      });
      return;
    }

    // Save passengers for later if checked
    if (user) {
      for (const p of passengers) {
        if (p.saveForLater) {
          await savePassenger({
            first_name: p.firstName,
            last_name: p.lastName,
            national_id: p.nationalId,
            birth_date: p.birthDate.toISOString().split('T')[0],
            is_foreign: foreignNational,
          });
        }
      }
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
          <label className={`block text-sm text-muted-foreground ${textAlign}`}>
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
        <label className={`block text-sm text-muted-foreground ${textAlign}`}>
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

  const getSelectedPassengerIds = () => {
    // This would track which saved passengers have been selected
    return [];
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Trip Summary */}
      {tripInfo && (
        <div className="mb-4">
          <TripSummary
            from={tripInfo.from}
            to={tripInfo.to}
            date={tripInfo.date}
            passengerCount={passengerCount}
            trainName={tripInfo.trainName}
            price={tripInfo.price}
          />
        </div>
      )}

      {/* Main Glass Card */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/40">
        
        {/* Header Section */}
        <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-white/30 bg-white/30">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm hover-scale"
            >
              <BackArrow className="size-4" />
              <span>{isRTL ? 'بازگشت' : 'Back'}</span>
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              {isRTL ? 'مشخصات مسافر' : 'Passenger Details'}
            </h1>
          </div>
        </div>

        {/* Passengers Section */}
        <div className="px-4 sm:px-8 py-4 sm:py-6">
          {passengers.map((passenger, index) => (
            <div key={index} className="mb-6 last:mb-0">
              {/* Passenger Row with Accent Line */}
              <div className="flex gap-3 sm:gap-4">
                {/* Passenger Content */}
                <div className="flex-1">
                  {/* Passenger Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-orange-500 font-semibold text-sm">
                        {isRTL ? `مسافر ${index + 1}` : `Passenger ${index + 1}`}
                      </span>
                      
                      {/* Passenger Type Selector */}
                      <PassengerTypeSelector
                        type={passenger.type}
                        onChange={(type) => {
                          const updated = [...passengers];
                          updated[index] = { ...updated[index], type };
                          setPassengers(updated);
                        }}
                        index={index}
                      />
                    </div>
                    
                    {/* Saved Passenger Selector */}
                    {user && (
                      <SavedPassengerSelector
                        onSelect={(saved) => handleSavedPassengerSelect(index, saved)}
                        excludeIds={getSelectedPassengerIds()}
                      />
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {['firstName', 'lastName', 'nationalId', 'birthDate'].map((field) => 
                      renderPassengerField(field, index, passenger)
                    )}
                  </div>

                  {/* Save for Later Checkbox */}
                  {user && (
                    <div className="mt-3 flex items-center gap-2">
                      <Checkbox
                        id={`save-${index}`}
                        checked={passenger.saveForLater}
                        onCheckedChange={(checked) => {
                          const updated = [...passengers];
                          updated[index] = { ...updated[index], saveForLater: checked === true };
                          setPassengers(updated);
                        }}
                      />
                      <label 
                        htmlFor={`save-${index}`} 
                        className="text-xs text-muted-foreground cursor-pointer flex items-center gap-1"
                      >
                        <Save className="size-3" />
                        {isRTL ? 'ذخیره برای رزروهای بعدی' : 'Save for future bookings'}
                      </label>
                    </div>
                  )}
                </div>

                {/* Accent Line */}
                <div className="w-1 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Account Creation Section (only show if not logged in) */}
        {!user && (
          <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-white/30 bg-white/20">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-1">
                {/* Existing account toggle */}
                <div className="flex items-center gap-3 mb-4">
                  <Checkbox
                    id="has-account"
                    checked={hasExistingAccount}
                    onCheckedChange={(checked) => setHasExistingAccount(checked === true)}
                  />
                  <label htmlFor="has-account" className="text-sm text-muted-foreground cursor-pointer">
                    {isRTL ? 'قبلاً ثبت‌نام کرده‌ام (ورود به حساب موجود)' : 'I already have an account (login)'}
                  </label>
                </div>

                <div className="flex items-center gap-2 mb-3 sm:mb-4 text-muted-foreground justify-end">
                  <p className="text-xs sm:text-sm">
                    {hasExistingAccount 
                      ? (isRTL ? 'شماره موبایل و رمز عبور حساب خود را وارد کنید' : 'Enter your account mobile and password')
                      : (isRTL ? 'با ثبت رزرو، حساب کاربری برای شما ایجاد می‌شود' : 'An account will be created for you upon reservation')}
                  </p>
                  <Info className="size-4 text-sky-500 shrink-0" />
                </div>

                <div className={`grid grid-cols-1 ${hasExistingAccount ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-3 sm:gap-4`}>
                  <div className="space-y-2">
                    <label className={`block text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
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

                  <div className="space-y-2">
                    <label className={`block text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                      {getFieldLabel('password')}
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn("h-10 text-sm bg-sky-50/80 border-sky-100", isRTL ? 'text-right' : 'text-left')}
                    />
                  </div>

                  {/* Only show confirm password for new registrations */}
                  {!hasExistingAccount && (
                    <div className="space-y-2">
                      <label className={`block text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                        {getFieldLabel('confirmPassword')}
                      </label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={cn("h-10 text-sm bg-sky-50/80 border-sky-100", isRTL ? 'text-right' : 'text-left')}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="w-1 bg-gradient-to-b from-sky-400 to-sky-500 rounded-full" />
            </div>
          </div>
        )}

        {/* Logged in user info */}
        {user && (
          <div className="px-4 sm:px-8 py-3 border-t border-white/30 bg-emerald-50/50">
            <div className="flex items-center gap-2 text-emerald-600">
              <UserCheck className="size-4" />
              <span className="text-sm">
                {isRTL 
                  ? `وارد شده با: ${profile?.email || user.email}` 
                  : `Logged in as: ${profile?.email || user.email}`}
              </span>
            </div>
          </div>
        )}

        {/* Terms & Submit Section */}
        <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-white/30 bg-white/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Terms Checkbox */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="accept-rules"
                checked={acceptRules}
                onCheckedChange={(checked) => setAcceptRules(checked === true)}
                className="mt-0.5"
              />
              <label htmlFor="accept-rules" className="text-sm text-muted-foreground cursor-pointer">
                {isRTL ? (
                  <>
                    <Link to="/rules" className="text-primary hover:underline">قوانین و شرایط</Link>
                    {' '}را مطالعه کرده و می‌پذیرم
                  </>
                ) : (
                  <>
                    I have read and accept the{' '}
                    <Link to="/rules" className="text-primary hover:underline">terms and conditions</Link>
                  </>
                )}
              </label>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="h-11 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg"
            >
              {isRTL ? 'تکمیل رزرو' : 'Complete Booking'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PassengerForm;
