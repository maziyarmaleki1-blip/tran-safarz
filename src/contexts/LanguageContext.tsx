import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Language = 'fa' | 'en' | 'ar';

interface Translations {
  [key: string]: {
    fa: string;
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { fa: 'خانه', en: 'Home', ar: 'الرئيسية' },
  rules: { fa: 'قوانین', en: 'Rules', ar: 'القوانين' },
  contact: { fa: 'تماس با ما', en: 'Contact', ar: 'اتصل بنا' },
  login: { fa: 'ورود', en: 'Login', ar: 'تسجيل الدخول' },
  register: { fa: 'ثبت نام', en: 'Register', ar: 'التسجيل' },
  signUp: { fa: 'عضویت', en: 'Sign Up', ar: 'إنشاء حساب' },
  dashboard: { fa: 'داشبورد', en: 'Dashboard', ar: 'لوحة التحكم' },
  logout: { fa: 'خروج', en: 'Logout', ar: 'تسجيل الخروج' },
  
  // Hero Section
  heroTitle: { fa: 'سفر با قطار، لذت سفر', en: 'Travel by Train, Enjoy the Journey', ar: 'السفر بالقطار، متعة الرحلة' },
  heroSubtitle: { fa: 'رزرو آسان بلیط قطار به سراسر ایران', en: 'Easy train ticket booking across Iran', ar: 'حجز سهل لتذاكر القطار في جميع أنحاء إيران' },
  
  // Search Box
  origin: { fa: 'مبدأ', en: 'Origin', ar: 'المغادرة' },
  destination: { fa: 'مقصد', en: 'Destination', ar: 'الوجهة' },
  date: { fa: 'تاریخ', en: 'Date', ar: 'التاريخ' },
  passengers: { fa: 'مسافران', en: 'Passengers', ar: 'المسافرون' },
  search: { fa: 'جستجو', en: 'Search', ar: 'بحث' },
  selectCity: { fa: 'انتخاب شهر', en: 'Select City', ar: 'اختر المدينة' },
  selectDate: { fa: 'انتخاب تاریخ', en: 'Select Date', ar: 'اختر التاريخ' },
  passenger: { fa: 'مسافر', en: 'Passenger', ar: 'مسافر' },
  
  // Search Results
  searchResults: { fa: 'نتایج جستجو', en: 'Search Results', ar: 'نتائج البحث' },
  trainNumber: { fa: 'شماره قطار', en: 'Train Number', ar: 'رقم القطار' },
  departure: { fa: 'حرکت', en: 'Departure', ar: 'المغادرة' },
  arrival: { fa: 'رسیدن', en: 'Arrival', ar: 'الوصول' },
  duration: { fa: 'مدت سفر', en: 'Duration', ar: 'مدة الرحلة' },
  price: { fa: 'قیمت', en: 'Price', ar: 'السعر' },
  availableSeats: { fa: 'صندلی خالی', en: 'Available Seats', ar: 'المقاعد المتاحة' },
  selectTrain: { fa: 'انتخاب', en: 'Select', ar: 'اختيار' },
  toman: { fa: 'تومان', en: 'Toman', ar: 'تومان' },
  hour: { fa: 'ساعت', en: 'Hour', ar: 'ساعة' },
  minute: { fa: 'دقیقه', en: 'Min', ar: 'دقيقة' },
  
  // Passenger Form
  passengerInfo: { fa: 'اطلاعات مسافر', en: 'Passenger Information', ar: 'معلومات المسافر' },
  firstName: { fa: 'نام', en: 'First Name', ar: 'الاسم الأول' },
  lastName: { fa: 'نام خانوادگی', en: 'Last Name', ar: 'اسم العائلة' },
  nationalId: { fa: 'کد ملی', en: 'National ID', ar: 'رقم الهوية' },
  mobile: { fa: 'شماره موبایل', en: 'Mobile Number', ar: 'رقم الجوال' },
  selectSeat: { fa: 'انتخاب صندلی', en: 'Select Seat', ar: 'اختر المقعد' },
  continue: { fa: 'ادامه', en: 'Continue', ar: 'متابعة' },
  
  // Dashboard
  reservations: { fa: 'رزروها', en: 'Reservations', ar: 'الحجوزات' },
  profile: { fa: 'پروفایل', en: 'Profile', ar: 'الملف الشخصي' },
  security: { fa: 'امنیت', en: 'Security', ar: 'الأمان' },
  wallet: { fa: 'کیف پول', en: 'Wallet', ar: 'المحفظة' },
  reservationNumber: { fa: 'شماره رزرو', en: 'Reservation No.', ar: 'رقم الحجز' },
  route: { fa: 'مسیر', en: 'Route', ar: 'المسار' },
  status: { fa: 'وضعیت', en: 'Status', ar: 'الحالة' },
  confirmed: { fa: 'تأیید شده', en: 'Confirmed', ar: 'مؤكد' },
  pending: { fa: 'در انتظار', en: 'Pending', ar: 'قيد الانتظار' },
  cancelled: { fa: 'لغو شده', en: 'Cancelled', ar: 'ملغي' },
  saveChanges: { fa: 'ذخیره تغییرات', en: 'Save Changes', ar: 'حفظ التغييرات' },
  email: { fa: 'ایمیل', en: 'Email', ar: 'البريد الإلكتروني' },
  currentPassword: { fa: 'رمز فعلی', en: 'Current Password', ar: 'كلمة المرور الحالية' },
  newPassword: { fa: 'رمز جدید', en: 'New Password', ar: 'كلمة المرور الجديدة' },
  confirmPassword: { fa: 'تکرار رمز', en: 'Confirm Password', ar: 'تأكيد كلمة المرور' },
  changePassword: { fa: 'تغییر رمز عبور', en: 'Change Password', ar: 'تغيير كلمة المرور' },
  balance: { fa: 'موجودی', en: 'Balance', ar: 'الرصيد' },
  deposit: { fa: 'واریز وجه', en: 'Deposit', ar: 'إيداع' },
  withdraw: { fa: 'برداشت', en: 'Withdraw', ar: 'سحب' },
  transactions: { fa: 'تراکنش‌ها', en: 'Transactions', ar: 'المعاملات' },
  myRequests: { fa: 'درخواست‌های من', en: 'My Requests', ar: 'طلباتي' },
  upcomingTrips: { fa: 'سفرهای پیش‌رو', en: 'Upcoming Trips', ar: 'الرحلات القادمة' },
  tripHistory: { fa: 'تاریخچه سفرها', en: 'Trip History', ar: 'سجل الرحلات' },
  noRequestsYet: { fa: 'هنوز درخواستی ثبت نکردید', en: 'No requests yet', ar: 'لا توجد طلبات بعد' },
  noUpcomingTrips: { fa: 'سفری در برنامه ندارید', en: 'No upcoming trips', ar: 'لا توجد رحلات قادمة' },
  noTripHistory: { fa: 'سفری در تاریخچه ندارید', en: 'No trip history', ar: 'لا يوجد سجل رحلات' },
  userProfile: { fa: 'پروفایل کاربری', en: 'User Profile', ar: 'الملف الشخصي' },
  saving: { fa: 'در حال ذخیره...', en: 'Saving...', ar: 'جارٍ الحفظ...' },
  changingPassword: { fa: 'در حال تغییر...', en: 'Changing...', ar: 'جارٍ التغيير...' },
  passwordMismatch: { fa: 'رمز عبور جدید با تکرار آن مطابقت ندارد', en: 'Passwords do not match', ar: 'كلمتا المرور غير متطابقتين' },
  passwordMinLength: { fa: 'رمز عبور باید حداقل ۶ کاراکتر باشد', en: 'Password must be at least 6 characters', ar: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' },
  passwordChanged: { fa: 'رمز عبور با موفقیت تغییر کرد', en: 'Password changed successfully', ar: 'تم تغيير كلمة المرور بنجاح' },
  quickCharge: { fa: 'شارژ سریع', en: 'Quick Charge', ar: 'شحن سريع' },
  noTransactions: { fa: 'تراکنشی وجود ندارد', en: 'No transactions', ar: 'لا توجد معاملات' },
  depositToWallet: { fa: 'واریز به کیف پول', en: 'Deposit to Wallet', ar: 'إيداع في المحفظة' },
  enterAmount: { fa: 'مبلغ مورد نظر را وارد کنید', en: 'Enter the amount', ar: 'أدخل المبلغ' },
  amountLabel: { fa: 'مبلغ (تومان)', en: 'Amount (Toman)', ar: 'المبلغ (تومان)' },
  minDeposit: { fa: 'حداقل ۱۰,۰۰۰ تومان', en: 'Minimum 10,000 Toman', ar: 'الحد الأدنى 10,000 تومان' },
  payViaGateway: { fa: 'پرداخت از طریق درگاه بانکی', en: 'Pay via bank gateway', ar: 'الدفع عبر البوابة البنكية' },
  redirectToGateway: { fa: 'پس از تأیید، به درگاه پرداخت منتقل می‌شوید', en: 'You will be redirected to the payment gateway', ar: 'سيتم توجيهك إلى بوابة الدفع' },
  cancelAction: { fa: 'انصراف', en: 'Cancel', ar: 'إلغاء' },
  withdrawFromWallet: { fa: 'برداشت از کیف پول', en: 'Withdraw from Wallet', ar: 'سحب من المحفظة' },
  enterAmountAndCard: { fa: 'مبلغ و شماره کارت را وارد کنید', en: 'Enter amount and card number', ar: 'أدخل المبلغ ورقم البطاقة' },
  withdrawAmount: { fa: 'مبلغ برداشت (تومان)', en: 'Withdraw Amount (Toman)', ar: 'مبلغ السحب (تومان)' },
  cardNumberLabel: { fa: 'شماره کارت', en: 'Card Number', ar: 'رقم البطاقة' },
  cardNumberDesc: { fa: 'شماره کارت ۱۶ رقمی به نام صاحب حساب', en: '16-digit card number', ar: 'رقم البطاقة المكون من 16 رقمًا' },
  withdrawNote: { fa: 'واریز ظرف ۲۴ ساعت کاری انجام می‌شود', en: 'Transfer within 24 business hours', ar: 'التحويل خلال 24 ساعة عمل' },
  submitRequest: { fa: 'ثبت درخواست', en: 'Submit Request', ar: 'تقديم الطلب' },
  depositSuccess: { fa: 'واریز با موفقیت انجام شد', en: 'Deposit successful', ar: 'تم الإيداع بنجاح' },
  withdrawSuccess: { fa: 'درخواست برداشت ثبت شد', en: 'Withdrawal request submitted', ar: 'تم تقديم طلب السحب' },
  currentBalance: { fa: 'موجودی فعلی', en: 'Current Balance', ar: 'الرصيد الحالي' },
  logoutAccount: { fa: 'خروج از حساب', en: 'Logout', ar: 'تسجيل الخروج' },

  // Dashboard - Reservation Card
  toCity: { fa: 'به', en: 'to', ar: 'إلى' },
  passengerLabel: { fa: 'مسافر', en: 'passenger', ar: 'مسافر' },
  code: { fa: 'کد', en: 'Code', ar: 'الرمز' },
  searching: { fa: 'در حال جستجو', en: 'Searching', ar: 'جارٍ البحث' },
  awaitingPayment: { fa: 'در انتظار پرداخت', en: 'Awaiting Payment', ar: 'في انتظار الدفع' },
  paidAwaitingConfirm: { fa: 'پرداخت شده · در انتظار تأیید', en: 'Paid · Awaiting Confirmation', ar: 'مدفوع · في انتظار التأكيد' },
  ticketReady: { fa: 'بلیط آماده مشاهده', en: 'Ticket Ready', ar: 'التذكرة جاهزة' },
  botSearching: { fa: 'ربات در حال رصد ثانیه‌ای ظرفیت‌هاست...', en: 'Bot is monitoring capacities every second...', ar: 'الروبوت يراقب السعة كل ثانية...' },
  payRemainder: { fa: 'پرداخت مابقی', en: 'Pay Remaining', ar: 'دفع المتبقي' },
  paymentLinkSoon: { fa: 'در انتظار پرداخت · لینک پرداخت به زودی ارسال می‌شود', en: 'Awaiting payment · Payment link coming soon', ar: 'في انتظار الدفع · رابط الدفع قريبًا' },
  paidWaitingTicket: { fa: 'پرداخت انجام شده · در انتظار تأیید و نمایش بلیط', en: 'Payment done · Awaiting ticket confirmation', ar: 'تم الدفع · في انتظار تأكيد التذكرة' },
  viewTicket: { fa: 'مشاهده بلیط', en: 'View Ticket', ar: 'عرض التذكرة' },
  requestCancel: { fa: 'درخواست لغو', en: 'Request Cancellation', ar: 'طلب الإلغاء' },
  cancelPendingReview: { fa: 'درخواست لغو در انتظار بررسی', en: 'Cancellation request under review', ar: 'طلب الإلغاء قيد المراجعة' },
  refundCompleted: { fa: 'وجه برگشت داده شد', en: 'Refund completed', ar: 'تم استرداد المبلغ' },
  refundPending: { fa: 'در انتظار بازگشت وجه', en: 'Refund pending', ar: 'في انتظار الاسترداد' },
  showDetails: { fa: 'مشاهده جزئیات', en: 'Show Details', ar: 'عرض التفاصيل' },
  hideDetails: { fa: 'بستن جزئیات', en: 'Hide Details', ar: 'إخفاء التفاصيل' },
  passengersLabel: { fa: 'مسافران', en: 'Passengers', ar: 'المسافرون' },
  adultLabel: { fa: 'بزرگسال', en: 'adult', ar: 'بالغ' },
  childLabel: { fa: 'کودک', en: 'child', ar: 'طفل' },
  financialInfo: { fa: 'اطلاعات مالی', en: 'Financial Info', ar: 'المعلومات المالية' },
  depositPaid: { fa: 'مبلغ بیعانه + کارمزد (پرداخت شده)', en: 'Deposit + fee (paid)', ar: 'العربون + الرسوم (مدفوع)' },
  ticketAmount: { fa: 'مبلغ بلیط (مابقی)', en: 'Ticket amount (remaining)', ar: 'مبلغ التذكرة (المتبقي)' },
  paid: { fa: 'پرداخت شده', en: 'Paid', ar: 'مدفوع' },
  registrationDate: { fa: 'تاریخ ثبت', en: 'Registration Date', ar: 'تاريخ التسجيل' },
  ticketIssueDate: { fa: 'تاریخ صدور بلیط', en: 'Ticket Issue Date', ar: 'تاريخ إصدار التذكرة' },
  confirmCancelTitle: { fa: 'درخواست لغو رزرو', en: 'Cancel Reservation Request', ar: 'طلب إلغاء الحجز' },
  confirmCancelDesc: { fa: 'آیا از درخواست لغو این رزرو مطمئن هستید؟', en: 'Are you sure you want to cancel this reservation?', ar: 'هل أنت متأكد من إلغاء هذا الحجز؟' },
  confirmCancelNote: { fa: 'در صورت عدم خرید بلیط، کل مبلغ بازگردانده می‌شود. در صورت خرید موفق، طبق قوانین استرداد عمل خواهد شد.', en: 'If no ticket was purchased, the full amount will be refunded. If a ticket was purchased, refund policies apply.', ar: 'إذا لم يتم شراء التذكرة، سيتم استرداد المبلغ بالكامل. إذا تم الشراء، تُطبق سياسة الاسترداد.' },
  confirmCancelBtn: { fa: 'بله، درخواست لغو', en: 'Yes, Cancel', ar: 'نعم، إلغاء' },
  cancellingRequest: { fa: 'در حال ثبت...', en: 'Submitting...', ar: 'جارٍ الإرسال...' },

  // Payment Page
  finalReview: { fa: 'بررسی نهایی و پرداخت', en: 'Final Review & Payment', ar: 'المراجعة النهائية والدفع' },
  cardToCard: { fa: 'کارت به کارت', en: 'Card to Card', ar: 'تحويل بطاقة لبطاقة' },
  cardToCardDesc: { fa: 'انتقال وجه مستقیم به شماره کارت', en: 'Direct transfer to card number', ar: 'تحويل مباشر إلى رقم البطاقة' },
  depositPerPerson: { fa: 'بیعانه (هر نفر)', en: 'Deposit (per person)', ar: 'العربون (للشخص)' },
  totalDeposit: { fa: 'جمع بیعانه', en: 'Total Deposit', ar: 'إجمالي العربون' },
  searchServiceFee: { fa: 'کارمزد خدمات جستجو', en: 'Search Service Fee', ar: 'رسوم خدمة البحث' },
  payableAmount: { fa: 'مبلغ قابل پرداخت', en: 'Payable Amount', ar: 'المبلغ المستحق' },
  remainderNote: { fa: 'پس از پیدا شدن بلیط، مابقی مبلغ (قیمت بلیط - بیعانه) از شما دریافت خواهد شد.', en: 'After the ticket is found, the remaining amount will be charged.', ar: 'بعد العثور على التذكرة، سيتم تحصيل المبلغ المتبقي.' },
  refundGuarantee: { fa: 'تضمین بازگشت وجه: در صورت عدم موفقیت ربات در شکار بلیط، کل مبلغ (به همراه کارمزد) فوراً به کیف پول شما باز می‌گردد یا طبق سیکل پایا به حساب بانکی واریز می‌شود.', en: 'Refund guarantee: If the bot fails to find a ticket, the full amount (including fees) will be instantly returned to your wallet or credited to your bank account.', ar: 'ضمان الاسترداد: إذا فشل الروبوت في العثور على التذكرة، سيتم إعادة المبلغ الكامل (بما في ذلك الرسوم) فورًا.' },

  // Confirmation Page
  huntRequestSubmitted: { fa: 'درخواست شکار بلیط ثبت شد!', en: 'Ticket hunt request submitted!', ar: 'تم تقديم طلب البحث عن التذكرة!' },
  teamFollowingUp: { fa: 'تیم ما در حال پیگیری بلیط شماست', en: 'Our team is working on your ticket', ar: 'فريقنا يعمل على تذكرتك' },
  keepCodeForTracking: { fa: 'این کد را برای پیگیری درخواست خود نگه دارید', en: 'Keep this code to track your request', ar: 'احتفظ بهذا الرمز لتتبع طلبك' },
  orderSummary: { fa: 'خلاصه درخواست', en: 'Order Summary', ar: 'ملخص الطلب' },
  routeLabel: { fa: 'مسیر', en: 'Route', ar: 'المسار' },
  passengerCountLabel: { fa: 'تعداد مسافران', en: 'Passengers', ar: 'عدد المسافرين' },
  persons: { fa: 'نفر', en: 'persons', ar: 'أشخاص' },
  amountPaid: { fa: 'مبلغ پرداخت شده (بیعانه + کارمزد)', en: 'Amount Paid (Deposit + Fee)', ar: 'المبلغ المدفوع (العربون + الرسوم)' },
  goToDashboardBtn: { fa: 'رفتن به داشبورد', en: 'Go to Dashboard', ar: 'الذهاب إلى لوحة التحكم' },
  backToHome: { fa: 'بازگشت به صفحه اصلی', en: 'Back to Home', ar: 'العودة إلى الرئيسية' },
  refundFailNote: { fa: 'در صورت عدم موفقیت در شکار بلیط، کل مبلغ بیعانه به شما بازگردانده خواهد شد', en: 'If ticket hunt fails, the full deposit will be refunded', ar: 'في حال فشل البحث، سيتم استرداد كامل العربون' },

  // Contact Page
  contactSubtitle: { fa: 'سوالی دارید؟ با ما در تماس باشید', en: 'Have a question? Get in touch', ar: 'هل لديك سؤال؟ تواصل معنا' },
  contactInfo: { fa: 'اطلاعات تماس', en: 'Contact Info', ar: 'معلومات الاتصال' },
  phone: { fa: 'تلفن', en: 'Phone', ar: 'الهاتف' },
  address: { fa: 'آدرس', en: 'Address', ar: 'العنوان' },
  workingHours: { fa: 'ساعات کاری', en: 'Working Hours', ar: 'ساعات العمل' },
  ourLocation: { fa: 'موقعیت ما روی نقشه', en: 'Our Location on Map', ar: 'موقعنا على الخريطة' },
  sendMessage: { fa: 'ارسال پیام', en: 'Send Message', ar: 'إرسال رسالة' },
  subject: { fa: 'موضوع', en: 'Subject', ar: 'الموضوع' },
  message: { fa: 'پیام', en: 'Message', ar: 'الرسالة' },
  messageSent: { fa: 'پیام ارسال شد', en: 'Message sent', ar: 'تم إرسال الرسالة' },
  messageSentDesc: { fa: 'به زودی با شما تماس می‌گیریم', en: 'We will contact you soon', ar: 'سنتواصل معك قريبًا' },

  // Rules Page
  rulesTitle: { fa: 'قوانین و مقررات استفاده از خدمات «سفر بدون مرز»', en: 'Terms & Conditions of Safarz Services', ar: 'شروط وأحكام استخدام خدمات سفرز' },
  rulesSubtitle: { fa: 'استفاده از خدمات این وب‌سایت به منزله مطالعه دقیق و پذیرش کامل کلیه قوانین، شرایط و ضوابط مندرج در این صفحه است.', en: 'By using this website, you agree to all the terms and conditions listed on this page.', ar: 'باستخدامك لهذا الموقع، فإنك توافق على جميع الشروط والأحكام المدرجة في هذه الصفحة.' },
  important: { fa: 'مهم', en: 'Important', ar: 'مهم' },
  
  // Payment
  payment: { fa: 'پرداخت', en: 'Payment', ar: 'الدفع' },
  ticketDetails: { fa: 'جزئیات بلیط', en: 'Ticket Details', ar: 'تفاصيل التذكرة' },
  paymentMethod: { fa: 'روش پرداخت', en: 'Payment Method', ar: 'طريقة الدفع' },
  cardPayment: { fa: 'پرداخت کارت بانکی', en: 'Bank Card Payment', ar: 'الدفع بالبطاقة البنكية' },
  cardPaymentDesc: { fa: 'پرداخت از طریق درگاه بانکی', en: 'Pay via bank gateway', ar: 'الدفع عبر البوابة البنكية' },
  walletPayment: { fa: 'کیف پول', en: 'Wallet', ar: 'المحفظة' },
  walletPaymentDesc: { fa: 'پرداخت از موجودی کیف پول', en: 'Pay from wallet balance', ar: 'الدفع من رصيد المحفظة' },
  priceSummary: { fa: 'خلاصه قیمت', en: 'Price Summary', ar: 'ملخص السعر' },
  ticketPrice: { fa: 'قیمت بلیط', en: 'Ticket Price', ar: 'سعر التذكرة' },
  passengerCount: { fa: 'تعداد مسافر', en: 'Passenger Count', ar: 'عدد المسافرين' },
  tax: { fa: 'مالیات', en: 'Tax', ar: 'الضريبة' },
  free: { fa: 'رایگان', en: 'Free', ar: 'مجاني' },
  totalPrice: { fa: 'مبلغ قابل پرداخت', en: 'Total Price', ar: 'المبلغ الإجمالي' },
  payNow: { fa: 'پرداخت', en: 'Pay Now', ar: 'ادفع الآن' },
  processing: { fa: 'در حال پردازش...', en: 'Processing...', ar: 'جارٍ المعالجة...' },
  securePayment: { fa: 'پرداخت امن با رمزنگاری SSL', en: 'Secure payment with SSL encryption', ar: 'دفع آمن بتشفير SSL' },
  
  // Confirmation
  paymentSuccess: { fa: 'پرداخت موفق', en: 'Payment Successful', ar: 'تم الدفع بنجاح' },
  paymentSuccessDesc: { fa: 'بلیط شما با موفقیت صادر شد', en: 'Your ticket has been issued successfully', ar: 'تم إصدار تذكرتك بنجاح' },
  trackingCode: { fa: 'کد رهگیری', en: 'Tracking Code', ar: 'رمز التتبع' },
  trackingCodeNote: { fa: 'این کد را برای پیگیری رزرو نگه دارید', en: 'Keep this code for tracking your reservation', ar: 'احتفظ بهذا الرمز لتتبع حجزك' },
  printTicket: { fa: 'چاپ بلیط', en: 'Print Ticket', ar: 'طباعة التذكرة' },
  downloadTicket: { fa: 'دانلود بلیط', en: 'Download Ticket', ar: 'تحميل التذكرة' },
  goToDashboard: { fa: 'رفتن به داشبورد', en: 'Go to Dashboard', ar: 'الذهاب إلى لوحة التحكم' },
  confirmationNote: { fa: 'اطلاعات بلیط به شماره موبایل شما پیامک خواهد شد', en: 'Ticket details will be sent to your mobile', ar: 'سيتم إرسال تفاصيل التذكرة إلى جوالك' },
  
  // Cities
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
  
  // General
  to: { fa: 'به', en: 'to', ar: 'إلى' },
  from: { fa: 'از', en: 'from', ar: 'من' },
  back: { fa: 'بازگشت', en: 'Back', ar: 'رجوع' },
  next: { fa: 'بعدی', en: 'Next', ar: 'التالي' },
  cancel: { fa: 'لغو', en: 'Cancel', ar: 'إلغاء' },
  confirm: { fa: 'تأیید', en: 'Confirm', ar: 'تأكيد' },
  noResults: { fa: 'نتیجه‌ای یافت نشد', en: 'No results found', ar: 'لم يتم العثور على نتائج' },
  loading: { fa: 'در حال بارگذاری...', en: 'Loading...', ar: 'جارٍ التحميل...' },
  
  // Footer
  aboutUs: { fa: 'درباره ما', en: 'About Us', ar: 'من نحن' },
  privacyPolicy: { fa: 'حریم خصوصی', en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  termsOfService: { fa: 'شرایط استفاده', en: 'Terms of Service', ar: 'شروط الخدمة' },
  allRightsReserved: { fa: 'تمامی حقوق محفوظ است', en: 'All Rights Reserved', ar: 'جميع الحقوق محفوظة' },

  // Search Results Page
  noTrainsFound: { fa: 'قطاری با این فیلترها یافت نشد', en: 'No trains found with these filters', ar: 'لم يتم العثور على قطارات بهذه الفلاتر' },
  submitBooking: { fa: 'ثبت رزرو', en: 'Submit Booking', ar: 'تأكيد الحجز' },
  previousDay: { fa: 'روز قبل', en: 'Previous Day', ar: 'اليوم السابق' },
  nextDay: { fa: 'روز بعد', en: 'Next Day', ar: 'اليوم التالي' },

  // Train Row
  time: { fa: 'ساعت', en: 'Time', ar: 'الوقت' },
  trainNo: { fa: 'شماره قطار', en: 'Train No.', ar: 'رقم القطار' },
  rial: { fa: 'ریال', en: 'Rial', ar: 'ريال' },
  dep: { fa: 'حرکت', en: 'Dep', ar: 'مغادرة' },
  arr: { fa: 'ورود', en: 'Arr', ar: 'وصول' },

  // Sort Options
  sortDefault: { fa: 'پیش فرض', en: 'Default', ar: 'افتراضي' },
  sortDeparture: { fa: 'ساعت حرکت', en: 'Departure', ar: 'وقت المغادرة' },
  sortCheapest: { fa: 'ارزانترین', en: 'Cheapest', ar: 'الأرخص' },
  sortExpensive: { fa: 'گرانترین', en: 'Most Expensive', ar: 'الأغلى' },
  sortOwner: { fa: 'مالک', en: 'Owner', ar: 'المالك' },
  sortBy: { fa: 'نمایش بر اساس', en: 'Sort by', ar: 'ترتيب حسب' },

  // Filter Box
  compartmentType: { fa: 'نوع سالن', en: 'Compartment Type', ar: 'نوع المقصورة' },
  departureTime: { fa: 'زمان حرکت (قطار رفت)', en: 'Departure Time', ar: 'وقت المغادرة' },
  departureTimeDesc: { fa: 'بازه زمانی حضور در ایستگاه قطار', en: 'Time range at the train station', ar: 'النطاق الزمني في محطة القطار' },
  priceRange: { fa: 'بازه قیمت (تومان)', en: 'Price Range (Toman)', ar: 'نطاق السعر (تومان)' },
  specialNotes: { fa: 'توضیحات خاص', en: 'Special Notes', ar: 'ملاحظات خاصة' },
  specialNotesPlaceholder: { fa: 'اگر توضیحات یا درخواست خاصی دارید اینجا بنویسید...', en: 'Write any special requests here...', ar: 'اكتب أي طلبات خاصة هنا...' },
  additionalOptions: { fa: 'گزینه‌های اضافی', en: 'Additional Options', ar: 'خيارات إضافية' },
  privateCompartment: { fa: 'کوپه دربست', en: 'Private Compartment', ar: 'مقصورة خاصة' },
  foreignNational: { fa: 'اتباع خارجی', en: 'Foreign National', ar: 'جنسية أجنبية' },

  // Passenger Form
  autoFilled: { fa: 'پر شدن خودکار', en: 'Auto-filled', ar: 'تم الملء تلقائياً' },
  autoFilledDesc: { fa: 'اطلاعات شما از پروفایل وارد شد', en: 'Your info was loaded from profile', ar: 'تم تحميل معلوماتك من الملف الشخصي' },
  passengerSelected: { fa: 'مسافر انتخاب شد', en: 'Passenger selected', ar: 'تم اختيار المسافر' },
  error: { fa: 'خطا', en: 'Error', ar: 'خطأ' },
  passengerInfoIncomplete: { fa: 'اطلاعات مسافر', en: 'Passenger info', ar: 'معلومات المسافر' },
  isIncomplete: { fa: 'ناقص است', en: 'is incomplete', ar: 'غير مكتملة' },
  invalidMobile: { fa: 'شماره موبایل نامعتبر است', en: 'Invalid mobile number', ar: 'رقم الجوال غير صالح' },
  acceptTerms: { fa: 'لطفاً قوانین و شرایط را بپذیرید', en: 'Please accept the terms and conditions', ar: 'يرجى قبول الشروط والأحكام' },
  selectFromList: { fa: 'انتخاب از لیست', en: 'Select saved', ar: 'اختر من القائمة' },

  // Passenger Type
  adult: { fa: 'بزرگسال', en: 'Adult', ar: 'بالغ' },
  child: { fa: 'کودک', en: 'Child', ar: 'طفل' },
  type: { fa: 'نوع:', en: 'Type:', ar: 'النوع:' },

  // Date Navigation
  // (already covered by previousDay / nextDay)

  // Misc labels used inline
  toLabel: { fa: 'تا', en: 'To', ar: 'إلى' },
  fromLabel: { fa: 'از', en: 'From', ar: 'من' },
  management: { fa: 'مدیریت', en: 'Management', ar: 'الإدارة' },

  // Booking Process Steps
  step1Title: { fa: 'ثبت درخواست', en: 'Submit Request', ar: 'تقديم الطلب' },
  step1Desc: { fa: 'فیلترها را انتخاب و رزرو ثبت کنید', en: 'Select filters & submit booking', ar: 'اختر الفلاتر وأرسل الحجز' },
  step2Title: { fa: 'وارد کردن مشخصات', en: 'Enter Details', ar: 'إدخال البيانات' },
  step2Desc: { fa: 'اطلاعات مسافران را وارد کنید', en: 'Enter passenger information', ar: 'أدخل معلومات المسافرين' },
  step3Title: { fa: 'پرداخت بیعانه', en: 'Pay Deposit', ar: 'دفع العربون' },
  step3Desc: { fa: 'بیعانه و کارمزد را پرداخت کنید', en: 'Pay the deposit & service fee', ar: 'ادفع العربون ورسوم الخدمة' },
  step4Title: { fa: 'جستجو خودکار', en: 'Auto Search', ar: 'بحث تلقائي' },
  step4Desc: { fa: 'ربات ما بلیط را برایتان پیدا می‌کند', en: 'Our bot finds your ticket', ar: 'يبحث الروبوت عن تذكرتك' },
  step5Title: { fa: 'دریافت بلیط', en: 'Get Ticket', ar: 'استلام التذكرة' },
  step5Desc: { fa: 'بلیط خود را دانلود یا چاپ کنید', en: 'Download or print your ticket', ar: 'حمّل أو اطبع تذكرتك' },
  howItWorks: { fa: 'مراحل شکار بلیط', en: 'How It Works', ar: 'كيف يعمل' },
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
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
  }, []);

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  const isRTL = language === 'fa' || language === 'ar';

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
