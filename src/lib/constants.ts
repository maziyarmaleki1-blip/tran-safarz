// ==============================
// Shared Constants
// Centralized data used across the app
// ==============================

export const CITIES: Record<string, { fa: string; en: string; ar: string }> = {
  tehran: { fa: 'تهران', en: 'Tehran', ar: 'طهران' },
  mashhad: { fa: 'مشهد', en: 'Mashhad', ar: 'مشهد' },
  isfahan: { fa: 'اصفهان', en: 'Isfahan', ar: 'أصفهان' },
  shiraz: { fa: 'شیراز', en: 'Shiraz', ar: 'شيراز' },
  tabriz: { fa: 'تبریز', en: 'Tabriz', ar: 'تبريز' },
  yazd: { fa: 'یزد', en: 'Yazd', ar: 'يزد' },
  ahvaz: { fa: 'اهواز', en: 'Ahvaz', ar: 'الأهواز' },
  bandarabbas: { fa: 'بندرعباس', en: 'Bandar Abbas', ar: 'بندر عباس' },
  kermanshah: { fa: 'کرمانشاه', en: 'Kermanshah', ar: 'كرمانشاه' },
  qom: { fa: 'قم', en: 'Qom', ar: 'قم' },
};

/** Get city name by key and language */
export function getCityName(key: string, language: string = 'fa'): string {
  const city = CITIES[key];
  if (!city) return key;
  return city[language as keyof typeof city] || city.fa;
}

/** Get simple Persian city map (for backward compatibility) */
export function getCityNameFa(key: string): string {
  return CITIES[key]?.fa || key;
}

export const SEARCH_TRAINS = [
  { id: 1, name: 'اکونومی پلاس', number: '۵۸۴', departure: '06:22', departureHour: 6, arrival: '13:08', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1990000, compartmentType: 'کوپه ای ۴ نفره', compartmentId: '4تخته5ستاره', rating: '۵ ستاره', amenities: 'با شام و پانیها', status: 'sold_out' as const },
  { id: 2, name: 'ایران', number: '۳۲۴', departure: '17:35', departureHour: 17, arrival: '00:21', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1990000, compartmentType: 'کوپه ای ۴ نفره', compartmentId: '4تخته5ستاره', rating: '۵ ستاره', amenities: 'با پذیرایی و شام', status: 'sold_out' as const },
  { id: 3, name: 'اکونومی پلاس فدک', number: '۳۴۴', departure: '20:30', departureHour: 20, arrival: '03:16', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1990000, compartmentType: 'کوپه ای ۴ نفره', compartmentId: '4تخته5ستاره', rating: '۵ ستاره', status: 'sold_out' as const },
  { id: 4, name: 'رویال', number: '۳۸۶', departure: '20:50', departureHour: 20, arrival: '03:36', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1850000, compartmentType: 'کوپه ای ۴ نفره', compartmentId: '4تخته4ستاره', rating: '۴ ستاره', amenities: 'با پذیرایی عصرانه و شام', status: 'sold_out' as const },
  { id: 5, name: 'اکونومی پلاس', number: '۳۶۶', departure: '21:10', departureHour: 21, arrival: '03:56', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1990000, compartmentType: 'کوپه ای ۴ نفره', compartmentId: '4تخته5ستاره', rating: '۵ ستاره', status: 'available' as const },
  { id: 6, name: 'اکونومی پلاس', number: '۳۶۲', departure: '21:50', departureHour: 21, arrival: '04:36', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1650000, compartmentType: 'کوپه ای ۶ نفره', compartmentId: '6تخته3ستاره', rating: '۳ ستاره', status: 'few_left' as const },
  { id: 7, name: 'زمرد', number: '۱۶۶', departure: '22:50', departureHour: 22, arrival: '05:36', duration: '۶ ساعت ۴۶ دقیقه', durationMinutes: 406, price: 1750000, compartmentType: 'کوپه ای ۴ نفره', compartmentId: '4تخته4ستاره', rating: '۴ ستاره', amenities: 'با پذیرایی و شام', status: 'available' as const },
];

export const BOOKING_TRAINS: Record<number, { name: string; number: string; departure: string; arrival: string; duration: string; price: number }> = {
  1: { name: 'فدک', number: '301', departure: '06:00', arrival: '16:30', duration: '10:30', price: 250000 },
  2: { name: 'غزال', number: '302', departure: '08:30', arrival: '18:45', duration: '10:15', price: 320000 },
  3: { name: 'پردیس', number: '303', departure: '14:00', arrival: '23:30', duration: '9:30', price: 450000 },
  4: { name: 'سبز', number: '304', departure: '20:00', arrival: '06:15', duration: '10:15', price: 280000 },
  5: { name: 'نور', number: '305', departure: '22:30', arrival: '08:45', duration: '10:15', price: 350000 },
};

/** Format price in Persian locale */
export function formatPriceFa(price: number): string {
  return price.toLocaleString('fa-IR');
}
