import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Train, MapPin, Calendar, Users } from 'lucide-react';
import { formatPersianDate } from '@/lib/persianDate';

interface TripSummaryProps {
  from: string;
  to: string;
  date?: Date;
  passengerCount: number;
  trainName?: string;
  price?: number;
}

import { getCityName } from '@/lib/constants';

const TripSummary: React.FC<TripSummaryProps> = ({
  from,
  to,
  date,
  passengerCount,
  trainName,
  price,
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'fa';

  const getCity = (code: string) => getCityName(code, isRTL ? 'fa' : 'en');

  const formatPrice = (p: number) => p.toLocaleString(isRTL ? 'fa-IR' : 'en-US');

  return (
    <div className="bg-white/70 backdrop-blur-2xl rounded-2xl p-4 border border-white/40 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Route */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
            <MapPin className="size-5 text-sky-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">{getCity(from)}</span>
            <span className="material-symbols-outlined text-gray-400 text-sm">
              {isRTL ? 'arrow_back' : 'arrow_forward'}
            </span>
            <span className="font-bold text-gray-800">{getCity(to)}</span>
          </div>
        </div>

        {/* Date */}
        {date && (
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {isRTL ? formatPersianDate(date) : date.toLocaleDateString('en-US', { dateStyle: 'medium' })}
            </span>
          </div>
        )}

        {/* Train */}
        {trainName && (
          <div className="flex items-center gap-2">
            <Train className="size-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {isRTL ? `قطار ${trainName}` : `Train ${trainName}`}
            </span>
          </div>
        )}

        {/* Passengers */}
        <div className="flex items-center gap-2">
          <Users className="size-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {passengerCount} {isRTL ? 'مسافر' : 'Passenger(s)'}
          </span>
        </div>

        {/* Price */}
        {price && (
          <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-lg">
            <span className="text-sm font-bold text-emerald-700">
              {formatPrice(price)} {isRTL ? 'تومان' : 'Toman'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripSummary;
