import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPersianDate, gregorianToJalali, toPersianDigits } from '@/lib/persianDate';

interface PassengerInfo {
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: string;
  type?: string;
}

interface SelectedFilters {
  compartmentTypes?: string[];
  departureTimeSlots?: string[];
  priceRangeMin?: number;
  priceRangeMax?: number;
  customerNotes?: string;
  privateCompartment?: boolean;
  foreignNational?: boolean;
  passengerType?: string;
  adultsCount?: number;
  childrenCount?: number;
}

interface BookingReviewProps {
  from: string;
  to: string;
  trainName: string;
  trainNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  passengerCount: number;
  dateStr?: string;
}

const cities: Record<string, string> = {
  tehran: 'تهران', mashhad: 'مشهد', isfahan: 'اصفهان', shiraz: 'شیراز',
  tabriz: 'تبریز', yazd: 'یزد', ahvaz: 'اهواز', bandarabbas: 'بندرعباس',
};

const wagonTypeLabels: Record<string, string> = {
  'compartment-6': 'کوپه ۶ نفره',
  'compartment-4': 'کوپه ۴ نفره',
  'seat': 'صندلی',
  'vip': 'VIP',
};

const timeSlotLabels: Record<string, string> = {
  'morning': 'صبح (۶-۱۲)',
  'afternoon': 'بعدازظهر (۱۲-۱۸)',
  'evening': 'شب (۱۸-۲۴)',
  'night': 'نیمه‌شب (۰-۶)',
};

const passengerTypeLabels: Record<string, string> = {
  'regular': 'عادی',
  'men': 'ویژه برادران',
  'women': 'ویژه خواهران',
};

const BookingReview: React.FC<BookingReviewProps> = ({
  from, to, trainName, trainNumber, departure, arrival, duration, passengerCount, dateStr,
}) => {
  const passengerData: PassengerInfo[] = JSON.parse(sessionStorage.getItem('passengerData') || '[]');
  const selectedFilters: SelectedFilters = JSON.parse(sessionStorage.getItem('selectedFilters') || '{}');

  const formatDate = () => {
    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) return formatPersianDate(d);
    }
    return formatPersianDate(new Date());
  };

  const adultsCount = selectedFilters.adultsCount || passengerCount;
  const childrenCount = selectedFilters.childrenCount || 0;

  return (
    <div className="space-y-5">
      {/* Route & Date Header */}
      <Card className="p-5 bg-card/95 backdrop-blur-md border-border/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1.5 h-full bg-sky-500 rounded-r-lg" />
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2 pr-3">
          <span className="material-symbols-outlined text-sky-500">route</span>
          مشخصات سفر
        </h2>

        {/* Route */}
        <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-xl mb-4">
          <div className="size-12 rounded-xl bg-sky-500/15 flex items-center justify-center">
            <span className="material-symbols-outlined text-sky-600">train</span>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 font-bold text-base">
              <span>{cities[from] || from}</span>
              <span className="material-symbols-outlined text-muted-foreground text-sm">arrow_back</span>
              <span>{cities[to] || to}</span>
            </div>
            <p className="text-sm text-muted-foreground">قطار {trainName} — شماره {trainNumber}</p>
          </div>
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <InfoCell icon="calendar_month" label="تاریخ حرکت" value={formatDate()} />
          <InfoCell icon="schedule" label="ساعت حرکت" value={departure} />
          <InfoCell icon="flag" label="ساعت رسیدن" value={arrival} />
          <InfoCell icon="timer" label="مدت سفر" value={duration} />
        </div>

        {/* Passenger breakdown */}
        <div className="flex items-center gap-3 mt-4 p-3 bg-muted/30 rounded-lg">
          <span className="material-symbols-outlined text-primary">group</span>
          <span className="text-sm">
            {toPersianDigits(adultsCount)} بزرگسال
            {childrenCount > 0 && <> و {toPersianDigits(childrenCount)} کودک</>}
          </span>
          {selectedFilters.passengerType && selectedFilters.passengerType !== 'regular' && (
            <Badge variant="secondary" className="text-xs">
              {passengerTypeLabels[selectedFilters.passengerType] || selectedFilters.passengerType}
            </Badge>
          )}
        </div>
      </Card>

      {/* Selected Preferences */}
      {hasPreferences(selectedFilters) && (
        <Card className="p-5 bg-card/95 backdrop-blur-md border-border/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500 rounded-r-lg" />
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2 pr-3">
            <span className="material-symbols-outlined text-amber-500">tune</span>
            ترجیحات انتخاب‌شده
          </h2>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.compartmentTypes?.map(t => (
              <Badge key={t} variant="outline" className="gap-1.5 py-1.5">
                <span className="material-symbols-outlined text-sm">airline_seat_recline_normal</span>
                {wagonTypeLabels[t] || t}
              </Badge>
            ))}
            {selectedFilters.departureTimeSlots?.map(s => (
              <Badge key={s} variant="outline" className="gap-1.5 py-1.5">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {timeSlotLabels[s] || s}
              </Badge>
            ))}
            {selectedFilters.privateCompartment && (
              <Badge variant="outline" className="gap-1.5 py-1.5 border-amber-300 text-amber-700">
                <span className="material-symbols-outlined text-sm">lock</span>
                کوپه دربست
              </Badge>
            )}
            {selectedFilters.foreignNational && (
              <Badge variant="outline" className="gap-1.5 py-1.5 border-blue-300 text-blue-700">
                <span className="material-symbols-outlined text-sm">public</span>
                اتباع خارجی
              </Badge>
            )}
          </div>
          {selectedFilters.customerNotes && (
            <div className="mt-3 p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground">
              <span className="font-medium text-foreground">توضیحات: </span>
              {selectedFilters.customerNotes}
            </div>
          )}
        </Card>
      )}

      {/* Passenger Details */}
      {passengerData.length > 0 && (
        <Card className="p-5 bg-card/95 backdrop-blur-md border-border/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500 rounded-r-lg" />
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2 pr-3">
            <span className="material-symbols-outlined text-emerald-500">badge</span>
            مشخصات مسافران
          </h2>
          <div className="space-y-3">
            {passengerData.map((p, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="size-10 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <span className="text-emerald-700 font-bold text-sm">{toPersianDigits(idx + 1)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{p.firstName} {p.lastName}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>کد ملی: {toPersianDigits(p.nationalId)}</span>
                    {p.birthDate && (
                      <span>تولد: {formatPersianDate(new Date(p.birthDate))}</span>
                    )}
                  </div>
                </div>
                {p.type && p.type !== 'adult' && (
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {p.type === 'child' ? 'کودک' : p.type === 'infant' ? 'نوزاد' : p.type}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

function InfoCell({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="p-3 bg-muted/30 rounded-lg text-center">
      <span className="material-symbols-outlined text-primary text-lg mb-1 block">{icon}</span>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-bold text-sm mt-0.5">{value}</p>
    </div>
  );
}

function hasPreferences(f: SelectedFilters): boolean {
  return !!(
    (f.compartmentTypes && f.compartmentTypes.length > 0) ||
    (f.departureTimeSlots && f.departureTimeSlots.length > 0) ||
    f.privateCompartment ||
    f.foreignNational ||
    f.customerNotes
  );
}

export default BookingReview;
