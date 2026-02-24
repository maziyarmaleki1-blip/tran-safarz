import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPersianDate, gregorianToJalali, toPersianDigits } from '@/lib/persianDate';
import { getCityNameFa } from '@/lib/constants';

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
  from, to, passengerCount, dateStr,
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
    <div className="space-y-4">
      {/* Route & Date — compact grid */}
      <Card className="p-5 bg-card/95 backdrop-blur-md border-border/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1.5 h-full bg-primary rounded-r-lg" />
        <h2 className="font-bold text-base mb-4 flex items-center gap-2 pr-3">
          <span className="material-symbols-outlined text-primary">route</span>
          مشخصات سفر
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <InfoCell icon="my_location" label="مبدأ" value={getCityNameFa(from)} />
          <InfoCell icon="location_on" label="مقصد" value={getCityNameFa(to)} />
          <InfoCell icon="calendar_month" label="تاریخ" value={formatDate()} />
          <InfoCell icon="group" label="تعداد" value={`${toPersianDigits(adultsCount)} بزرگسال${childrenCount > 0 ? ` و ${toPersianDigits(childrenCount)} کودک` : ''}`} />
        </div>
      </Card>

      {/* Selected Preferences */}
      {hasPreferences(selectedFilters) && (
        <Card className="p-5 bg-card/95 backdrop-blur-md border-border/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-accent rounded-r-lg" />
          <h2 className="font-bold text-base mb-3 flex items-center gap-2 pr-3">
            <span className="material-symbols-outlined text-accent-foreground">tune</span>
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
              <Badge variant="outline" className="gap-1.5 py-1.5 border-accent text-accent-foreground">
                <span className="material-symbols-outlined text-sm">lock</span>
                کوپه دربست
              </Badge>
            )}
            {selectedFilters.foreignNational && (
              <Badge variant="outline" className="gap-1.5 py-1.5 border-primary text-primary">
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
          <div className="absolute top-0 right-0 w-1.5 h-full bg-secondary rounded-r-lg" />
          <h2 className="font-bold text-base mb-4 flex items-center gap-2 pr-3">
            <span className="material-symbols-outlined text-secondary-foreground">badge</span>
            مشخصات مسافران
          </h2>
          <div className="space-y-3">
            {passengerData.map((p, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-sm">{toPersianDigits(idx + 1)}</span>
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
    <div className="p-3 bg-muted/30 rounded-xl text-center space-y-1">
      <span className="material-symbols-outlined text-primary text-xl block">{icon}</span>
      <p className="text-[11px] text-muted-foreground leading-tight">{label}</p>
      <p className="font-bold text-sm leading-tight">{value}</p>
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
