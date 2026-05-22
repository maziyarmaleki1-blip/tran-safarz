# پرامپ کامل پروژه "سفر بدون مرز" (safarz)

## معرفی پروژه

این پروژه یک پلتفرم رزرو بلیط قطار بین‌المللی است با نام برند **«سفر بدون مرز»** که قابلیت کلیدی آن **«ربات شکارچی بلیط» (Sniper Bot)** است. پروژه سه‌زبانه (فارسی، انگلیسی، عربی) و RTL-first طراحی شده است.

### تکنولوژی‌ها
- **Frontend**: React 18 + Vite 5 + TypeScript 5
- **Styling**: Tailwind CSS v3 + shadcn/ui + Glassmorphism
- **Backend**: Lovable Cloud (Supabase managed)
- **Auth**: مسافر → موبایل + OTP پنج رقمی (۶۰ ثانیه شمارش معکوس) | ادمین → شماره + رمز
- **Routing**: React Router v6
- **State**: React Query (TanStack) + Context API
- **Date**: `date-fns-jalali` برای تقویم شمسی
- **i18n**: Context محلی (fa, en, ar)

### قوانین برند و طراحی
- اسم برند: «سفر بدون مرز»، تأکید بر «ربات شکارچی بلیط»
- از کلمه **"Requests"** استفاده شود نه **"Reservations"** در UI انگلیسی
- پس‌زمینه ثابت `hero-train.jpg` با gradient overlay
- Border radius بزرگ، حداقل تاچ تارگت 44px
- داده‌های مشترک (شهرها، قطارها) در `src/lib/constants.ts`
- پنل ادمین: ردیف‌های موجود **نباید** با Realtime auto-refresh شوند (پرش UI)؛ فقط برای رکوردهای جدید alert

---

## ساختار پروژه

```
.
├── index.html                          # نقطه ورود HTML، meta tags، لینک fonts.css لوکال
├── vite.config.ts                      # کانفیگ Vite (alias @/, پورت‌ها)
├── tailwind.config.ts                  # design tokens، رنگ‌های HSL، فونت‌ها
├── tsconfig.json / tsconfig.app.json   # کانفیگ TypeScript
├── components.json                     # کانفیگ shadcn/ui
├── package.json                        # وابستگی‌ها
├── .env                                # متغیرهای محیطی Supabase (auto-managed)
│
├── public/
│   ├── fonts/
│   │   ├── fonts.css                   # @font-face برای Vazirmatn، Inter، Material Symbols لوکال
│   │   ├── vazirmatn/                  # فونت فارسی (وزن 100-900)
│   │   └── inter/                      # فونت لاتین (وزن 400-700)
│   ├── icons/material-symbols/         # آیکون‌های Material Symbols (وزن 100-700)
│   ├── placeholder.svg                 # تصویر placeholder
│   └── robots.txt                      # کانفیگ خزنده‌های موتور جستجو
│
├── src/
│   ├── main.tsx                        # bootstrap اپ React
│   ├── App.tsx                         # تعریف Routes و Providerهای سراسری
│   ├── App.css / index.css             # استایل سراسری + تعریف design tokens (HSL)
│   ├── vite-env.d.ts                   # تایپ‌های محیط Vite
│   │
│   ├── pages/                          # صفحات اصلی (هر کدام یک Route)
│   │   ├── Index.tsx                   # صفحه اصلی: hero، فرم جستجو، معرفی Sniper Bot
│   │   ├── Auth.tsx                    # ورود/ثبت‌نام مسافر با موبایل + OTP 5 رقمی
│   │   ├── SearchResults.tsx           # نتایج جستجوی قطارها با فیلتر و تاریخ
│   │   ├── Booking.tsx                 # فرم اطلاعات مسافران (مرحله 2)
│   │   ├── Payment.tsx                 # انتخاب روش پرداخت + بررسی نهایی (مرحله 3)
│   │   ├── Confirmation.tsx            # تأیید ثبت درخواست رزرو
│   │   ├── Dashboard.tsx               # داشبورد مسافر: رزروها، پروفایل، کیف پول
│   │   ├── TicketView.tsx              # نمایش/دانلود بلیط آپلود شده توسط ادمین
│   │   ├── Admin.tsx                   # پنل مدیریت کامل (رزروها، کارمندان، تنظیمات)
│   │   ├── OperatorDashboard.tsx       # داشبورد اپراتور پشتیبانی برای پاسخ به چت
│   │   ├── Rules.tsx                   # قوانین استفاده از سرویس
│   │   ├── Terms.tsx                   # شرایط و ضوابط
│   │   ├── Privacy.tsx                 # سیاست حریم خصوصی
│   │   ├── Contact.tsx                 # صفحه تماس با ما
│   │   └── NotFound.tsx                # صفحه 404
│   │
│   ├── components/
│   │   ├── PassengerForm.tsx           # فرم اطلاعات هر مسافر (نام، کد ملی، تاریخ تولد)
│   │   ├── PersianCalendar.tsx         # تقویم شمسی برای انتخاب تاریخ
│   │   ├── ProcessSteps.tsx            # نمایش مراحل رزرو (1: جستجو → 5: بلیط)
│   │   │
│   │   ├── layout/
│   │   │   ├── MainLayout.tsx          # Layout سراسری (Header + main + Footer)
│   │   │   ├── Header.tsx              # هدر با لوگو، منو، تغییر زبان، ورود
│   │   │   └── Footer.tsx              # فوتر با لینک‌های قانونی و تماس
│   │   │
│   │   ├── search/
│   │   │   ├── SearchBox.tsx           # کادر جستجو (مبدا، مقصد، تاریخ، مسافر)
│   │   │   ├── PassengerSelector.tsx   # انتخاب تعداد مسافر (بزرگسال، کودک، نوزاد)
│   │   │   ├── TripTypeTabs.tsx        # تب رفت / رفت‌وبرگشت
│   │   │   ├── DateNavigation.tsx      # ناوبری تاریخ ±n روز در صفحه نتایج
│   │   │   ├── FilterBox.tsx           # فیلتر نتایج (نوع قطار، ساعت، قیمت)
│   │   │   └── TrainRow.tsx            # ردیف نمایش یک قطار در لیست نتایج
│   │   │
│   │   ├── booking/
│   │   │   ├── PassengerTypeSelector.tsx  # انتخاب نوع مسافر (ایرانی/خارجی)
│   │   │   ├── SavedPassengerSelector.tsx # انتخاب از مسافران ذخیره‌شده
│   │   │   └── TripSummary.tsx            # خلاصه سفر در صفحه رزرو
│   │   │
│   │   ├── payment/
│   │   │   └── BookingReview.tsx       # بررسی نهایی رزرو قبل از پرداخت
│   │   │
│   │   ├── dashboard/
│   │   │   ├── ReservationsTab.tsx     # تب لیست درخواست‌های رزرو مسافر
│   │   │   ├── ReservationCard.tsx     # کارت نمایش یک رزرو با وضعیت
│   │   │   ├── ProfileTab.tsx          # تب ویرایش پروفایل کاربر
│   │   │   └── WalletTab.tsx           # تب کیف پول: واریز/برداشت با RPC اتمیک
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminLogin.tsx              # فرم ورود ادمین (شماره + رمز)
│   │   │   ├── StatsCards.tsx              # کارت‌های آماری داشبورد ادمین
│   │   │   ├── ReservationsTable.tsx       # جدول مدیریت رزروها (بدون Realtime auto-refresh)
│   │   │   ├── EmployeeManagement.tsx      # مدیریت کارمندان و نقش‌ها
│   │   │   ├── DepositSettingsManagement.tsx # تنظیمات حداقل واریز/برداشت
│   │   │   ├── PaymentMethodsManagement.tsx  # مدیریت روش‌های پرداخت
│   │   │   ├── RouteFeeManagement.tsx      # تعرفه کارمزد هر مسیر
│   │   │   ├── RefundDialog.tsx            # دیالوگ بازگشت وجه با RPC increment_balance
│   │   │   ├── TicketUploadDialog.tsx      # آپلود فایل بلیط نهایی برای مسافر
│   │   │   ├── TicketPaymentDialog.tsx     # درخواست پرداخت نهایی بلیط
│   │   │   └── SupportTab.tsx              # تب مدیریت چت‌های پشتیبانی
│   │   │
│   │   ├── support/
│   │   │   ├── ChatWidget.tsx          # ویجت شناور چت پایین صفحه
│   │   │   ├── ChatWindow.tsx          # پنجره باز شده چت
│   │   │   ├── ChatMessage.tsx         # تک پیام در چت
│   │   │   └── TypingIndicator.tsx     # انیمیشن «در حال تایپ»
│   │   │
│   │   └── ui/                         # کامپوننت‌های shadcn/ui (button، card، dialog و...)
│   │
│   ├── hooks/
│   │   ├── useAuth.tsx                 # AuthProvider: signIn/signUp/signOut، session state
│   │   ├── useProfile.tsx              # دریافت و آپدیت پروفایل کاربر
│   │   ├── useReservations.tsx         # CRUD رزروهای کاربر
│   │   ├── useTransactions.tsx         # لیست تراکنش‌های کیف پول
│   │   ├── useSavedPassengers.tsx      # مدیریت مسافران ذخیره‌شده
│   │   ├── useDepositSettings.tsx      # خواندن تنظیمات حداقل واریز
│   │   ├── useServiceFee.tsx           # محاسبه کارمزد سرویس بر اساس مسیر
│   │   ├── useReservationNotification.tsx # نوتیفیکیشن رزرو جدید برای ادمین
│   │   ├── use-mobile.tsx              # تشخیص دستگاه موبایل
│   │   └── use-toast.ts                # هوک toast
│   │
│   ├── contexts/
│   │   └── LanguageContext.tsx         # سه‌زبانه (fa/en/ar)، RTL/LTR، تابع t()
│   │
│   ├── lib/
│   │   ├── constants.ts                # داده‌های ثابت: شهرها، قطارها، نوع کلاس‌ها
│   │   ├── persianDate.ts              # توابع کمکی تاریخ شمسی
│   │   └── utils.ts                    # cn() و helperهای عمومی
│   │
│   ├── services/
│   │   └── supportApi.ts               # API لایه چت پشتیبانی (sync با bot خارجی)
│   │
│   ├── types/
│   │   └── support.ts                  # تایپ‌های پیام/سشن پشتیبانی
│   │
│   └── integrations/supabase/
│       ├── client.ts                   # ⚠️ auto-generated، هرگز edit نشود
│       └── types.ts                    # ⚠️ auto-generated از schema دیتابیس
│
└── supabase/
    ├── config.toml                     # کانفیگ پروژه Supabase (project_id)
    └── migrations/                     # تاریخچه مهاجرت‌های SQL (timestamp prefix)
        └── *.sql                       # ساخت جداول، RLS policies، RPC functions
```

---

## معماری Backend (Lovable Cloud)

### جداول کلیدی
- `profiles` — اطلاعات کاربر + موجودی کیف پول (balance)
- `user_roles` — نقش‌ها (admin/operator/user) با enum app_role، **هرگز روی profiles ذخیره نشود**
- `reservations` — درخواست‌های رزرو با status، ticket_payment_status، ticket_file_path
- `transactions` — تراکنش‌های کیف پول
- `train_types`, `routes`, `route_fees` — داده‌های قطار و تعرفه
- `payment_methods`, `deposit_settings` — تنظیمات پرداخت
- `saved_passengers` — مسافران ذخیره‌شده هر کاربر
- `support_sessions`, `support_messages` — چت پشتیبانی
- `employees` — کارمندان پنل ادمین

### RPC Functions امن
- `has_role(_user_id, _role)` — SECURITY DEFINER برای جلوگیری از recursion در RLS
- `increment_balance(_user_id, _amount)` — افزایش اتمیک موجودی (واریز/refund)
- `decrement_balance(_user_id, _amount)` — کاهش اتمیک موجودی (برداشت/پرداخت)

### قوانین امنیتی
- **همه** جداول RLS فعال دارند
- هیچ public read policy روی جداول کاربر (profiles، reservations، user_roles)
- چک کردن admin در کلاینت فقط برای UI، اعمال واقعی توسط RLS
- HIBP leaked-password protection فعال
- استفاده اجباری از RPC برای عملیات کیف پول (no race condition)

---

## مراحل فرآیند کاربری (ProcessSteps)

1. **جستجو** — انتخاب مبدا/مقصد/تاریخ در `Index` یا `SearchResults`
2. **اطلاعات مسافر** — پر کردن فرم در `Booking`
3. **پرداخت بیعانه** — `Payment` (مبلغ پایه + کارمزد مسیر)
4. **شکار بلیط توسط ربات** — وضعیت در `Dashboard` → tab Reservations
5. **پرداخت نهایی + دریافت بلیط** — `TicketPaymentDialog` → `TicketView`

---

## نکات مهم برای توسعه آینده

- ❌ **هرگز** `src/integrations/supabase/{client,types}.ts` را edit نکنید
- ❌ **هرگز** auto-confirm email signups را فعال نکنید مگر صراحتاً درخواست شود
- ❌ **هرگز** anonymous sign up استفاده نکنید
- ✅ برای داده‌های مشترک (شهر، قطار) از `src/lib/constants.ts` استفاده شود
- ✅ همه رنگ‌ها به صورت HSL در `index.css` و `tailwind.config.ts`
- ✅ هیچ کلاس رنگ مستقیم (`text-white`, `bg-black`) در کامپوننت‌ها — فقط semantic token
- ✅ مهاجرت‌های جدید دیتابیس فقط از طریق migration tool
- ✅ Edge Functions برای منطق سنگین/امن سرور
- ✅ Lovable AI Gateway برای قابلیت‌های AI (بدون نیاز به API key)

---

## نحوه استفاده از این پرامپ

این فایل را در ابتدای هر گفتگو با Lovable به‌عنوان context بدهید تا agent با ساختار، قراردادها و قوانین پروژه آشنا باشد. هنگام درخواست feature جدید، به فایل/پوشه مرتبط ارجاع دهید تا تغییرات دقیق و سازگار با معماری موجود اعمال شود.
