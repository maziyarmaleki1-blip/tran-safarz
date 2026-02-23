import { MainLayout } from '@/components/layout/MainLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Users, Wallet, RotateCcw, AlertTriangle, Bell, Lock, RefreshCw, CheckCircle2 } from 'lucide-react';
import heroImage from '@/assets/hero-train.jpg';

const Rules = () => {
  const sections = [
    {
      id: '1',
      icon: <Shield className="size-5" />,
      title: '۱. ماهیت خدمات سفرز',
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>سرویس «سفرز» یک پلتفرم هوشمند برای جستجو، رصد و خرید خودکار بلیط‌های کنسلی قطار از وب‌سایت‌های مرجع فروش بلیط است.</p>
          <p className="font-semibold text-foreground">ثبت درخواست در سفرز به معنای تضمین یا قطعیت صدور بلیط نیست.</p>
          <p>خرید بلیط کاملاً وابسته به:</p>
          <ul className="list-disc pr-6 space-y-1">
            <li>باز شدن ظرفیت در سامانه‌های مرجع</li>
            <li>سرعت و شرایط زیرساخت‌های فروش</li>
            <li>وضعیت سیستم‌های راه‌آهن و فروشندگان رسمی</li>
          </ul>
          <p>سفرز صرفاً یک واسط فناورانه است که تلاش می‌کند در صورت ایجاد ظرفیت، بلیط را در سریع‌ترین زمان ممکن خریداری کند.</p>
        </div>
      ),
    },
    {
      id: '2',
      icon: <Users className="size-5" />,
      title: '۲. مسئولیت صحت اطلاعات مسافر',
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>کاربر موظف است اطلاعات هویتی مسافران را کاملاً صحیح و مطابق مدارک رسمی وارد نماید، از جمله:</p>
          <ul className="list-disc pr-6 space-y-1">
            <li>نام و نام خانوادگی</li>
            <li>کد ملی</li>
            <li>تاریخ تولد</li>
            <li>جنسیت</li>
          </ul>
          <p className="font-semibold text-foreground">مسئولیت هرگونه اشتباه در اطلاعات وارد شده تماماً بر عهده کاربر است.</p>
          <p>طبق قوانین حمل‌ونقل ریلی:</p>
          <ul className="list-disc pr-6 space-y-1">
            <li>بلیط قطار غیرقابل انتقال به غیر است.</li>
            <li>اصلاح اطلاعات پس از صدور بلیط ممکن است غیرممکن یا مشمول جریمه باشد.</li>
          </ul>
          <p>سفرز هیچ مسئولیتی در قبال عدم امکان سوار شدن به قطار، جریمه یا ابطال بلیط و مشکلات ناشی از اطلاعات اشتباه نخواهد داشت.</p>
        </div>
      ),
    },
    {
      id: '3',
      icon: <Wallet className="size-5" />,
      title: '۳. قوانین مالی و کیف پول',
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>برای استفاده از خدمات، کاربر باید کیف پول خود را در سایت شارژ نماید.</p>
          <p>مبلغ شارژ شده صرف موارد زیر خواهد شد:</p>
          <ul className="list-disc pr-6 space-y-1">
            <li>هزینه خرید بلیط از سایت مرجع</li>
            <li>کارمزد خدمات هوشمند سفرز</li>
          </ul>
          <Separator className="my-3" />
          <p className="font-semibold text-foreground">عدم موفقیت در خرید بلیط:</p>
          <p>در صورتی که ربات سفرز موفق به خرید بلیط نشود، کل مبلغ شامل هزینه بلیط و کارمزد خدمات به صورت کامل به کیف پول کاربر بازگردانده می‌شود.</p>
          <p className="font-semibold text-foreground">موجودی کیف پول:</p>
          <ul className="list-disc pr-6 space-y-1">
            <li>قابل استفاده برای درخواست‌های بعدی است.</li>
            <li>در صورت درخواست کاربر، قابل برداشت به حساب بانکی ثبت‌شده خواهد بود (طبق ضوابط مالی سایت).</li>
          </ul>
        </div>
      ),
    },
    {
      id: '4',
      icon: <RotateCcw className="size-5" />,
      title: '۴. قوانین کنسلی و استرداد (بسیار مهم)',
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <div className="bg-accent/50 rounded-lg p-4 border border-border/50">
            <p className="font-semibold text-foreground mb-2">حالت اول: عدم موفقیت ربات</p>
            <p>اگر بلیط خریداری نشود، کل مبلغ بدون کسری بازگشت داده می‌شود.</p>
          </div>
          <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20">
            <p className="font-semibold text-foreground mb-2">حالت دوم: خرید موفق بلیط</p>
            <p>در صورتی که ربات سفرز بلیط را با موفقیت خریداری کند اما کاربر از سفر منصرف شود:</p>
            <ul className="list-disc pr-6 space-y-1 mt-2">
              <li>استرداد بلیط مطابق قوانین و درصدهای جریمه شرکت‌های ریلی و راه‌آهن انجام می‌شود.</li>
              <li>مبلغ جریمه استرداد از اصل بلیط کسر خواهد شد.</li>
            </ul>
          </div>
          <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20">
            <p className="font-bold text-destructive mb-2">کارمزد سفرز (غیرقابل استرداد)</p>
            <p>کارمزد خدمات هوشمند سفرز در صورت خرید موفق بلیط <strong>به هیچ عنوان قابل استرداد نیست.</strong></p>
            <p className="mt-2">دلیل: سرویس سفرز وظیفه خود (شکار و خرید موفق بلیط) را انجام داده است.</p>
            <p className="mt-2 font-semibold text-foreground">ثبت درخواست در سامانه به منزله پذیرش قطعی این بند توسط کاربر است.</p>
          </div>
        </div>
      ),
    },
    {
      id: '5',
      icon: <AlertTriangle className="size-5" />,
      title: '۵. سلب مسئولیت',
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>سفرز صرفاً ارائه‌دهنده خدمات نرم‌افزاری است و هیچ‌گونه دخالتی در عملیات حمل‌ونقل ریلی ندارد. لذا هیچ مسئولیتی در قبال موارد زیر بر عهده سفرز نیست:</p>
          <ul className="list-disc pr-6 space-y-1">
            <li>تأخیر یا تعجیل در حرکت قطار</li>
            <li>لغو یا تغییر برنامه حرکت</li>
            <li>تغییر نوع یا کلاس قطار</li>
            <li>کیفیت خدمات داخل قطار</li>
            <li>تغییر قوانین شرکت‌های ریلی</li>
          </ul>
          <p>همچنین قطعی یا اختلال در موارد زیر:</p>
          <ul className="list-disc pr-6 space-y-1">
            <li>سامانه‌های راه‌آهن</li>
            <li>سایت‌های فروشنده مرجع</li>
            <li>درگاه‌های پرداخت</li>
            <li>زیرساخت‌های اینترنتی کشور</li>
            <li>بروز خطاهای سیستمی خارج از کنترل سفرز</li>
          </ul>
        </div>
      ),
    },
    {
      id: '6',
      icon: <Bell className="size-5" />,
      title: '۶. اطلاع‌رسانی و ارتباط با کاربر',
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>کاربر موظف است شماره تلفن همراه معتبر و در دسترس وارد نماید.</p>
          <p>اطلاع‌رسانی‌ها شامل موارد زیر از طریق پیامک یا اعلان انجام می‌شود:</p>
          <ul className="list-disc pr-6 space-y-1">
            <li>وضعیت درخواست</li>
            <li>خرید موفق بلیط</li>
            <li>تغییرات مهم سفارش</li>
          </ul>
          <p>سفرز هیچ مسئولیتی در قبال عدم دریافت پیامک به دلایل زیر ندارد:</p>
          <ul className="list-disc pr-6 space-y-1">
            <li>مشکلات اپراتورهای مخابراتی</li>
            <li>مسدود بودن پیامک‌های خدماتی</li>
            <li>خاموش بودن تلفن همراه</li>
            <li>آنتن‌دهی یا اختلالات شبکه</li>
          </ul>
        </div>
      ),
    },
    {
      id: '7',
      icon: <Lock className="size-5" />,
      title: '۷. حریم خصوصی و حفاظت از اطلاعات',
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>سفرز متعهد است اطلاعات کاربران و مسافران را با بالاترین استانداردهای امنیتی حفظ کند.</p>
          <p>اطلاعات هویتی ثبت‌شده:</p>
          <ul className="list-disc pr-6 space-y-1">
            <li>صرفاً برای خرید بلیط استفاده می‌شود.</li>
            <li>در اختیار اشخاص یا نهادهای غیرمرتبط قرار نخواهد گرفت.</li>
          </ul>
          <p>دسترسی به اطلاعات تنها برای:</p>
          <ul className="list-disc pr-6 space-y-1">
            <li>فرآیند خرید بلیط</li>
            <li>پشتیبانی کاربران</li>
            <li>الزامات قانونی</li>
          </ul>
          <p>مجاز خواهد بود.</p>
        </div>
      ),
    },
    {
      id: '8',
      icon: <RefreshCw className="size-5" />,
      title: '۸. تغییرات قوانین',
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>سفرز این حق را دارد که در هر زمان، قوانین و مقررات را به‌روزرسانی نماید.</p>
          <p>نسخه به‌روز قوانین از طریق وب‌سایت منتشر خواهد شد.</p>
          <p>ادامه استفاده از خدمات سایت به منزله پذیرش نسخه جدید قوانین است.</p>
        </div>
      ),
    },
    {
      id: '9',
      icon: <CheckCircle2 className="size-5" />,
      title: '۹. پذیرش نهایی',
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>با ثبت‌نام، شارژ کیف پول یا ثبت درخواست در سامانه سفرز، کاربر تأیید می‌کند که:</p>
          <ul className="list-disc pr-6 space-y-1">
            <li>تمامی قوانین را مطالعه کرده است.</li>
            <li>از ماهیت غیرتضمینی سرویس آگاه است.</li>
            <li>شرایط مالی و کنسلی، به‌ویژه عدم استرداد کارمزد در خرید موفق، را می‌پذیرد.</li>
            <li>مسئولیت صحت اطلاعات وارد شده را بر عهده دارد.</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      {/* Fixed Full-Screen Background */}
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
            <h1 className="text-3xl font-bold mb-3">قوانین و مقررات استفاده از خدمات «سفرز»</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm">
              به وب‌سایت «سفرز» خوش آمدید. استفاده از خدمات این وب‌سایت به منزله مطالعه دقیق و پذیرش کامل کلیه قوانین، شرایط و ضوابط مندرج در این صفحه است. لطفاً پیش از ثبت درخواست، مفاد زیر را با دقت مطالعه فرمایید.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              ثبت‌نام، شارژ کیف پول و ثبت درخواست در سامانه «سفرز» به معنای پذیرش تمامی این شرایط خواهد بود.
            </p>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Card className="bg-card/95 backdrop-blur-md border-border/50 overflow-hidden">
            <Accordion type="multiple" className="w-full">
              {sections.map((section) => (
                <AccordionItem key={section.id} value={section.id} className="border-border/50 px-6">
                  <AccordionTrigger className="text-base gap-3 hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="size-8 rounded-full gradient-primary text-primary-foreground flex items-center justify-center shrink-0">
                        {section.icon}
                      </span>
                      <span className="font-bold text-right">{section.title}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pr-11">
                    {section.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Rules;
