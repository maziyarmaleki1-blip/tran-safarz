// Persian (Jalali) date utilities

const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const persianDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

// Convert Gregorian to Jalali
export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy: number;
  
  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }
  
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + 
             Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
  
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  
  return [jy, jm, jd];
}

// Convert Jalali to Gregorian
export function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  let gy: number;
  
  if (jy > 979) {
    gy = 1600;
    jy -= 979;
  } else {
    gy = 621;
  }
  
  let days = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor((jy % 33 + 3) / 4) +
             78 + jd + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  
  gy += 400 * Math.floor(days / 146097);
  days %= 146097;
  
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  
  const gd = days + 1;
  const sal_a = [0, 31, (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28, 
                 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm: number;
  let v = gd;
  for (gm = 0; gm < 13 && v > sal_a[gm]; gm++) {
    v -= sal_a[gm];
  }
  
  return [gy, gm, v];
}

// Format date to Persian
export function formatPersianDate(date: Date): string {
  const [jy, jm, jd] = gregorianToJalali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  return `${jd} ${persianMonths[jm - 1]} ${jy}`;
}

// Convert number to Persian digits
export function toPersianDigits(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}

// Get Persian month name
export function getPersianMonthName(month: number): string {
  return persianMonths[month - 1] || '';
}

// Get days in Jalali month
export function getDaysInJalaliMonth(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  // 12th month (Esfand)
  const isLeap = ((jy - (jy > 0 ? 474 : 473)) % 2820 + 474 + 38) * 682 % 2816 < 682;
  return isLeap ? 30 : 29;
}

// Generate Persian calendar for a month
export function generatePersianCalendar(jy: number, jm: number): { day: number; isCurrentMonth: boolean; date: Date }[][] {
  const daysInMonth = getDaysInJalaliMonth(jy, jm);
  const [gy, gm, gd] = jalaliToGregorian(jy, jm, 1);
  const firstDayOfMonth = new Date(gy, gm - 1, gd);
  // Saturday = 0 in our Persian week
  let dayOfWeek = firstDayOfMonth.getDay();
  dayOfWeek = dayOfWeek === 6 ? 0 : dayOfWeek + 1; // Convert to Saturday-based week
  
  const weeks: { day: number; isCurrentMonth: boolean; date: Date }[][] = [];
  let week: { day: number; isCurrentMonth: boolean; date: Date }[] = [];
  
  // Fill previous month days
  const prevMonth = jm === 1 ? 12 : jm - 1;
  const prevYear = jm === 1 ? jy - 1 : jy;
  const daysInPrevMonth = getDaysInJalaliMonth(prevYear, prevMonth);
  
  for (let i = dayOfWeek - 1; i >= 0; i--) {
    const prevDay = daysInPrevMonth - i;
    const [pgy, pgm, pgd] = jalaliToGregorian(prevYear, prevMonth, prevDay);
    week.push({
      day: prevDay,
      isCurrentMonth: false,
      date: new Date(pgy, pgm - 1, pgd)
    });
  }
  
  // Fill current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const [cgy, cgm, cgd] = jalaliToGregorian(jy, jm, d);
    week.push({
      day: d,
      isCurrentMonth: true,
      date: new Date(cgy, cgm - 1, cgd)
    });
    
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  
  // Fill next month days
  let nextDay = 1;
  const nextMonth = jm === 12 ? 1 : jm + 1;
  const nextYear = jm === 12 ? jy + 1 : jy;
  
  while (week.length < 7 && week.length > 0) {
    const [ngy, ngm, ngd] = jalaliToGregorian(nextYear, nextMonth, nextDay);
    week.push({
      day: nextDay,
      isCurrentMonth: false,
      date: new Date(ngy, ngm - 1, ngd)
    });
    nextDay++;
  }
  
  if (week.length > 0) {
    weeks.push(week);
  }
  
  return weeks;
}

// Get Persian day names
export function getPersianDayNames(): string[] {
  return persianDays;
}

// Get current Jalali date
export function getCurrentJalaliDate(): [number, number, number] {
  const now = new Date();
  return gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export { persianMonths };
