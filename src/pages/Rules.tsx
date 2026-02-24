import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Users, Wallet, RotateCcw, AlertTriangle, Bell, Lock, RefreshCw, CheckCircle2 } from 'lucide-react';
import heroImage from '@/assets/hero-train.jpg';

const Rules = () => {
  const sections = [
    {
      num: '۱',
      icon: Shield,
      title: 'ماهیت خدمات سفر بدون مرز',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      content: (
        <>
          <p>سرویس «سفر بدون مرز» یک پلتفرم هوشمند برای جستجو، رصد و خرید خودکار بلیط‌های کنسلی قطار از وب‌سایت‌های مرجع فروش بلیط است.</p>
          <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 mt-3">
            <p className="font-semibold text-foreground text-sm">⚠️ ثبت درخواست در سفر بدون مرز به معنای تضمین یا قطعیت صدور بلیط نیست.</p>
          </div>
          <p className="mt-3">خرید بلیط کاملاً وابسته به:</p>
          <ul className="list-disc pr-6 space-y-1 mt-1">
            <li>باز شدن ظرفیت در سامانه‌های مرجع</li>
            <li>سرعت و شرایط زیرساخت‌های فروش</li>
            <li>وضعیت سیستم‌های راه‌آهن و فروشندگان رسمی</li>
          </ul>
          <p className="mt-3">سفر بدون مرز صرفاً یک واسط فناورانه است که تلاش می‌کند در صورت ایجاد ظرفیت، بلیط را در سریع‌ترین زمان ممکن خریداری کند.</p>
        </>
      ),
    },
    {
      num: '۲',
      icon: Users,
      title: 'مسئولیت صحت اطلاعات مسافر',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      content: (
        <>
          <p>کاربر موظف است اطلاعات هویتی مسافران را کاملاً صحیح و مطابق مدارک رسمی وارد نماید، از جمله:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {['نام و نام خانوادگی', 'کد ملی', 'تاریخ تولد', 'جنسیت'].map(item => (
              <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
            ))}
          </div>
          <p className="font-semibold text-foreground mt-3">مسئولیت هرگونه اشتباه در اطلاعات وارد شده تماماً بر عهده کاربر است.</p>
          <Separator className="my-3" />
          <p>طبق قوانین حمل‌ونقل ریلی:</p>
          <ul className="list-disc pr-6 space-y-1 mt-1">
            <li>بلیط قطار غیرقابل انتقال به غیر است.</li>
            <li>اصلاح اطلاعات پس از صدور بلیط ممکن است غیرممکن یا مشمول جریمه باشد.</li>
          </ul>
          <p className="mt-3">سفر بدون مرز هیچ مسئولیتی در قبال عدم امکان سوار شدن به قطار، جریمه یا ابطال بلیط و مشکلات ناشی از اطلاعات اشتباه نخواهد داشت.</p>
        </>
      ),
    },
    {
      num: '۳',
      icon: Wallet,
      title: 'قوانین مالی و کیف پول',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      content: (
        <>
          <p>برای استفاده از خدمات، کاربر باید کیف پول خود را در سایت شارژ نماید.</p>
          <p className="mt-2">مبلغ شارژ شده صرف موارد زیر خواهد شد:</p>
          <ul className="list-disc pr-6 space-y-1 mt-1">
            <li>هزینه خرید بلیط از سایت مرجع</li>
            <li>کارمزد خدمات هوشمند سفر بدون مرز</li>
          </ul>
          <div className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/15 mt-3">
            <p className="font-semibold text-foreground text-sm mb-1">✅ عدم موفقیت در خرید بلیط:</p>
            <p className="text-sm">در صورتی که ربات سفر بدون مرز موفق به خرید بلیط نشود، کل مبلغ شامل هزینه بلیط و کارمزد خدمات به صورت کامل به کیف پول کاربر بازگردانده می‌شود.</p>
          </div>
          <p className="font-semibold text-foreground mt-3">موجودی کیف پول:</p>
          <ul className="list-disc pr-6 space-y-1 mt-1">
            <li>قابل استفاده برای درخواست‌های بعدی است.</li>
            <li>در صورت درخواست کاربر، قابل برداشت به حساب بانکی ثبت‌شده خواهد بود (طبق ضوابط مالی سایت).</li>
          </ul>
        </>
      ),
    },
    {
      num: '۴',
      icon: RotateCcw,
      title: 'قوانین کنسلی و استرداد',
      color: 'bg-red-500/10 text-red-600 dark:text-red-400',
      important: true,
      content: (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="bg-emerald-500/5 rounded-lg p-4 border border-emerald-500/15">
              <p className="font-semibold text-foreground mb-2 text-sm">✅ حالت اول: عدم موفقیت ربات</p>
              <p className="text-sm">اگر بلیط خریداری نشود، کل مبلغ بدون کسری بازگشت داده می‌شود.</p>
            </div>
            <div className="bg-destructive/5 rounded-lg p-4 border border-destructive/15">
              <p className="font-semibold text-foreground mb-2 text-sm">⚠️ حالت دوم: خرید موفق بلیط</p>
              <p className="text-sm">استرداد مطابق قوانین جریمه شرکت‌های ریلی انجام شده و مبلغ جریمه از اصل بلیط کسر می‌شود.</p>
            </div>
          </div>
          <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20 mt-3">
             <p className="font-bold text-destructive mb-1 text-sm">🚫 کارمزد سفر بدون مرز (غیرقابل استرداد)</p>
             <p className="text-sm">کارمزد خدمات هوشمند سفر بدون مرز در صورت خرید موفق بلیط <strong>به هیچ عنوان قابل استرداد نیست.</strong></p>
             <p className="text-xs mt-2 text-muted-foreground">دلیل: سرویس سفر بدون مرز وظیفه خود (شکار و خرید موفق بلیط) را انجام داده است. ثبت درخواست در سامانه به منزله پذیرش قطعی این بند توسط کاربر است.</p>
          </div>
        </>
      ),
    },
    {
      num: '۵',
      icon: AlertTriangle,
      title: 'سلب مسئولیت',
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
      content: (
        <>
          <p>سفر بدون مرز صرفاً ارائه‌دهنده خدمات نرم‌افزاری است و هیچ‌گونه دخالتی در عملیات حمل‌ونقل ریلی ندارد. لذا هیچ مسئولیتی در قبال موارد زیر بر عهده سفر بدون مرز نیست:</p>
          <div className="grid gap-1 mt-2 sm:grid-cols-2">
            {[
              'تأخیر یا تعجیل در حرکت قطار',
              'لغو یا تغییر برنامه حرکت',
              'تغییر نوع یا کلاس قطار',
              'کیفیت خدمات داخل قطار',
              'تغییر قوانین شرکت‌های ریلی',
              'قطعی سامانه‌های راه‌آهن',
              'اختلال سایت‌های فروشنده',
              'قطعی درگاه‌های پرداخت',
              'اختلالات زیرساخت اینترنت',
              'خطاهای سیستمی خارج از کنترل',
            ].map(item => (
              <div key={item} className="flex items-start gap-2 text-sm py-1">
                <span className="text-muted-foreground mt-0.5">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      num: '۶',
      icon: Bell,
      title: 'اطلاع‌رسانی و ارتباط با کاربر',
      color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
      content: (
        <>
          <p>کاربر موظف است شماره تلفن همراه معتبر و در دسترس وارد نماید.</p>
          <p className="mt-2">اطلاع‌رسانی‌ها از طریق پیامک یا اعلان:</p>
          <ul className="list-disc pr-6 space-y-1 mt-1">
            <li>وضعیت درخواست</li>
            <li>خرید موفق بلیط</li>
            <li>تغییرات مهم سفارش</li>
          </ul>
          <p className="mt-3">سفر بدون مرز هیچ مسئولیتی در قبال عدم دریافت پیامک به دلایل زیر ندارد:</p>
          <ul className="list-disc pr-6 space-y-1 mt-1">
            <li>مشکلات اپراتورهای مخابراتی</li>
            <li>مسدود بودن پیامک‌های خدماتی</li>
            <li>خاموش بودن تلفن همراه</li>
            <li>آنتن‌دهی یا اختلالات شبکه</li>
          </ul>
        </>
      ),
    },
    {
      num: '۷',
      icon: Lock,
      title: 'حریم خصوصی و حفاظت از اطلاعات',
      color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
      content: (
        <>
          <p>سفر بدون مرز متعهد است اطلاعات کاربران و مسافران را با بالاترین استانداردهای امنیتی حفظ کند.</p>
          <p className="mt-2">اطلاعات هویتی ثبت‌شده صرفاً برای خرید بلیط استفاده شده و در اختیار اشخاص یا نهادهای غیرمرتبط قرار نخواهد گرفت.</p>
          <p className="mt-2">دسترسی به اطلاعات تنها برای فرآیند خرید بلیط، پشتیبانی کاربران و الزامات قانونی مجاز خواهد بود.</p>
        </>
      ),
    },
    {
      num: '۸',
      icon: RefreshCw,
      title: 'تغییرات قوانین',
      color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
      content: (
        <>
          <p>سفر بدون مرز این حق را دارد که در هر زمان، قوانین و مقررات را به‌روزرسانی نماید.</p>
          <p className="mt-2">نسخه به‌روز قوانین از طریق وب‌سایت منتشر خواهد شد. ادامه استفاده از خدمات سایت به منزله پذیرش نسخه جدید قوانین است.</p>
        </>
      ),
    },
    {
      num: '۹',
      icon: CheckCircle2,
      title: 'پذیرش نهایی',
      color: 'bg-green-500/10 text-green-600 dark:text-green-400',
      content: (
        <>
          <p>با ثبت‌نام، شارژ کیف پول یا ثبت درخواست در سامانه سفر بدون مرز، کاربر تأیید می‌کند که:</p>
          <ul className="space-y-2 mt-3">
            {[
              'تمامی قوانین را مطالعه کرده است.',
              'از ماهیت غیرتضمینی سرویس آگاه است.',
              'شرایط مالی و کنسلی، به‌ویژه عدم استرداد کارمزد در خرید موفق، را می‌پذیرد.',
              'مسئولیت صحت اطلاعات وارد شده را بر عهده دارد.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-green-500 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
  ];

  return (
    <MainLayout>
      {/* Fixed Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-md py-12 border-b border-border/50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-3">قوانین و مقررات استفاده از خدمات «سفر بدون مرز»</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm">
              استفاده از خدمات این وب‌سایت به منزله مطالعه دقیق و پذیرش کامل کلیه قوانین، شرایط و ضوابط مندرج در این صفحه است.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="container mx-auto px-4 py-10 max-w-3xl">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute right-[19px] top-8 bottom-8 w-0.5 bg-border/60 hidden sm:block" />

            <div className="space-y-5">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.num} className="relative flex gap-4">
                    {/* Timeline dot */}
                    <div className={`hidden sm:flex size-10 rounded-full ${section.color} items-center justify-center shrink-0 z-10 border-2 border-background shadow-sm`}>
                      <Icon className="size-4" />
                    </div>

                    {/* Card */}
                    <Card className={`flex-1 bg-card/95 backdrop-blur-md border-border/50 overflow-hidden transition-shadow hover:shadow-md ${(section as any).important ? 'ring-1 ring-destructive/20' : ''}`}>
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`sm:hidden size-8 rounded-full ${section.color} flex items-center justify-center shrink-0`}>
                            <Icon className="size-3.5" />
                          </div>
                          <h2 className="font-bold text-base">
                            {section.num}. {section.title}
                          </h2>
                          {(section as any).important && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">مهم</Badge>
                          )}
                        </div>
                        <div className="text-muted-foreground text-sm leading-relaxed">
                          {section.content}
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Rules;
