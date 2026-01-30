import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Language = 'fa' | 'en';

interface Translations {
  [key: string]: {
    fa: string;
    en: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { fa: 'خانه', en: 'Home' },
  rules: { fa: 'قوانین', en: 'Rules' },
  contact: { fa: 'تماس با ما', en: 'Contact' },
  login: { fa: 'ورود', en: 'Login' },
  register: { fa: 'ثبت نام', en: 'Register' },
  dashboard: { fa: 'داشبورد', en: 'Dashboard' },
  logout: { fa: 'خروج', en: 'Logout' },
  
  // Hero Section
  heroTitle: { fa: 'سفر با قطار، لذت سفر', en: 'Travel by Train, Enjoy the Journey' },
  heroSubtitle: { fa: 'رزرو آسان بلیط قطار به سراسر ایران', en: 'Easy train ticket booking across Iran' },
  
  // Search Box
  origin: { fa: 'مبدأ', en: 'Origin' },
  destination: { fa: 'مقصد', en: 'Destination' },
  date: { fa: 'تاریخ', en: 'Date' },
  passengers: { fa: 'مسافران', en: 'Passengers' },
  search: { fa: 'جستجو', en: 'Search' },
  selectCity: { fa: 'انتخاب شهر', en: 'Select City' },
  selectDate: { fa: 'انتخاب تاریخ', en: 'Select Date' },
  passenger: { fa: 'مسافر', en: 'Passenger' },
  
  // Search Results
  searchResults: { fa: 'نتایج جستجو', en: 'Search Results' },
  trainNumber: { fa: 'شماره قطار', en: 'Train Number' },
  departure: { fa: 'حرکت', en: 'Departure' },
  arrival: { fa: 'رسیدن', en: 'Arrival' },
  duration: { fa: 'مدت سفر', en: 'Duration' },
  price: { fa: 'قیمت', en: 'Price' },
  availableSeats: { fa: 'صندلی خالی', en: 'Available Seats' },
  selectTrain: { fa: 'انتخاب', en: 'Select' },
  toman: { fa: 'تومان', en: 'Toman' },
  hour: { fa: 'ساعت', en: 'Hour' },
  minute: { fa: 'دقیقه', en: 'Min' },
  
  // Passenger Form
  passengerInfo: { fa: 'اطلاعات مسافر', en: 'Passenger Information' },
  firstName: { fa: 'نام', en: 'First Name' },
  lastName: { fa: 'نام خانوادگی', en: 'Last Name' },
  nationalId: { fa: 'کد ملی', en: 'National ID' },
  mobile: { fa: 'شماره موبایل', en: 'Mobile Number' },
  selectSeat: { fa: 'انتخاب صندلی', en: 'Select Seat' },
  continue: { fa: 'ادامه', en: 'Continue' },
  
  // Dashboard
  reservations: { fa: 'رزروها', en: 'Reservations' },
  profile: { fa: 'پروفایل', en: 'Profile' },
  security: { fa: 'امنیت', en: 'Security' },
  wallet: { fa: 'کیف پول', en: 'Wallet' },
  reservationNumber: { fa: 'شماره رزرو', en: 'Reservation No.' },
  route: { fa: 'مسیر', en: 'Route' },
  status: { fa: 'وضعیت', en: 'Status' },
  confirmed: { fa: 'تأیید شده', en: 'Confirmed' },
  pending: { fa: 'در انتظار', en: 'Pending' },
  cancelled: { fa: 'لغو شده', en: 'Cancelled' },
  saveChanges: { fa: 'ذخیره تغییرات', en: 'Save Changes' },
  email: { fa: 'ایمیل', en: 'Email' },
  currentPassword: { fa: 'رمز فعلی', en: 'Current Password' },
  newPassword: { fa: 'رمز جدید', en: 'New Password' },
  confirmPassword: { fa: 'تکرار رمز', en: 'Confirm Password' },
  changePassword: { fa: 'تغییر رمز عبور', en: 'Change Password' },
  balance: { fa: 'موجودی', en: 'Balance' },
  deposit: { fa: 'واریز وجه', en: 'Deposit' },
  withdraw: { fa: 'برداشت', en: 'Withdraw' },
  transactions: { fa: 'تراکنش‌ها', en: 'Transactions' },
  
  // Payment
  payment: { fa: 'پرداخت', en: 'Payment' },
  ticketDetails: { fa: 'جزئیات بلیط', en: 'Ticket Details' },
  paymentMethod: { fa: 'روش پرداخت', en: 'Payment Method' },
  cardPayment: { fa: 'پرداخت کارت بانکی', en: 'Bank Card Payment' },
  cardPaymentDesc: { fa: 'پرداخت از طریق درگاه بانکی', en: 'Pay via bank gateway' },
  walletPayment: { fa: 'کیف پول', en: 'Wallet' },
  walletPaymentDesc: { fa: 'پرداخت از موجودی کیف پول', en: 'Pay from wallet balance' },
  priceSummary: { fa: 'خلاصه قیمت', en: 'Price Summary' },
  ticketPrice: { fa: 'قیمت بلیط', en: 'Ticket Price' },
  passengerCount: { fa: 'تعداد مسافر', en: 'Passenger Count' },
  tax: { fa: 'مالیات', en: 'Tax' },
  free: { fa: 'رایگان', en: 'Free' },
  totalPrice: { fa: 'مبلغ قابل پرداخت', en: 'Total Price' },
  payNow: { fa: 'پرداخت', en: 'Pay Now' },
  processing: { fa: 'در حال پردازش...', en: 'Processing...' },
  securePayment: { fa: 'پرداخت امن با رمزنگاری SSL', en: 'Secure payment with SSL encryption' },
  
  // Confirmation
  paymentSuccess: { fa: 'پرداخت موفق', en: 'Payment Successful' },
  paymentSuccessDesc: { fa: 'بلیط شما با موفقیت صادر شد', en: 'Your ticket has been issued successfully' },
  trackingCode: { fa: 'کد رهگیری', en: 'Tracking Code' },
  trackingCodeNote: { fa: 'این کد را برای پیگیری رزرو نگه دارید', en: 'Keep this code for tracking your reservation' },
  printTicket: { fa: 'چاپ بلیط', en: 'Print Ticket' },
  downloadTicket: { fa: 'دانلود بلیط', en: 'Download Ticket' },
  goToDashboard: { fa: 'رفتن به داشبورد', en: 'Go to Dashboard' },
  confirmationNote: { fa: 'اطلاعات بلیط به شماره موبایل شما پیامک خواهد شد', en: 'Ticket details will be sent to your mobile' },
  
  // Cities
  tehran: { fa: 'تهران', en: 'Tehran' },
  mashhad: { fa: 'مشهد', en: 'Mashhad' },
  isfahan: { fa: 'اصفهان', en: 'Isfahan' },
  shiraz: { fa: 'شیراز', en: 'Shiraz' },
  tabriz: { fa: 'تبریز', en: 'Tabriz' },
  yazd: { fa: 'یزد', en: 'Yazd' },
  ahvaz: { fa: 'اهواز', en: 'Ahvaz' },
  bandarabbas: { fa: 'بندرعباس', en: 'Bandar Abbas' },
  kermanshah: { fa: 'کرمانشاه', en: 'Kermanshah' },
  qom: { fa: 'قم', en: 'Qom' },
  
  // General
  to: { fa: 'به', en: 'to' },
  from: { fa: 'از', en: 'from' },
  back: { fa: 'بازگشت', en: 'Back' },
  next: { fa: 'بعدی', en: 'Next' },
  cancel: { fa: 'لغو', en: 'Cancel' },
  confirm: { fa: 'تأیید', en: 'Confirm' },
  noResults: { fa: 'نتیجه‌ای یافت نشد', en: 'No results found' },
  loading: { fa: 'در حال بارگذاری...', en: 'Loading...' },
  
  // Footer
  aboutUs: { fa: 'درباره ما', en: 'About Us' },
  privacyPolicy: { fa: 'حریم خصوصی', en: 'Privacy Policy' },
  termsOfService: { fa: 'شرایط استفاده', en: 'Terms of Service' },
  allRightsReserved: { fa: 'تمامی حقوق محفوظ است', en: 'All Rights Reserved' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fa');

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, []);

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  const isRTL = language === 'fa';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}