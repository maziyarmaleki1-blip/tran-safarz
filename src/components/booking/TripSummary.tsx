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

const cities: Record<string, { fa: string; en: string }> = {
  tehran: { fa: 'تهران', en: 'Tehran' },
  mashhad: { fa: 'مشهد', en: 'Mashhad' },
  isfahan: { fa: 'اصفهان', en: 'Isfahan' },
  shiraz: { fa: 'شیراز', en: 'Shiraz' },
  tabriz: { fa: 'تبریز', en: 'Tabriz' },
  yazd: { fa: 'یزد', en: 'Yazd' },
  ahvaz: { fa: 'اهواز', en: 'Ahvaz' },
  bandarabbas: { fa: 'بندرعباس', en: 'Bandar Abbas' },
};

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

  const getCityName = (code: string) => {
    const city = cities[code.toLowerCase()];
    return city ? (isRTL ? city.fa : city.en) : code;
  };

  const formatPrice = (p: number) => p.toLocaleString(isRTL ? 'fa-IR' : 'en-US');

  return (
    <div className="bg-gradient-to-r from-sky-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl p-4 border border-white/30">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Route */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
            <MapPin className="size-5 text-sky-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">{getCityName(from)}</span>
            <span className="material-symbols-outlined text-gray-400 text-sm">
              {isRTL ? 'arrow_back' : 'arrow_forward'}
            </span>
            <span className="font-bold text-gray-800">{getCityName(to)}</span>
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
