import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import heroImage from '@/assets/hero-train.jpg';

const sections = [
  {
    title: '۱. تعریف خدمات',
    content: 'سفر برون مرز (safarz) یک پلتفرم واسطه‌ جهت رزرو و خرید بلیط قطار است. این سایت صرفاً نقش واسطه‌گری بین مسافران و شرکت‌های حمل‌ونقل ریلی را ایفا می‌کند و مسئولیت مستقیم ارائه خدمات حمل‌ونقل را بر عهده ندارد.',
  },
  {
    title: '۲. شرایط ثبت‌نام و حساب کاربری',
    content: `• کاربر موظف است اطلاعات صحیح و معتبر برای ثبت‌نام ارائه دهد
• هر فرد فقط مجاز به داشتن یک حساب کاربری است
• حفظ امنیت حساب کاربری بر عهده کاربر است
• در صورت مشاهده استفاده غیرمجاز، سایت حق مسدودسازی حساب را دارد`,
  },
  {
    title: '۳. فرآیند رزرو و خرید',
    content: `• اطلاعات مسافران باید دقیقاً مطابق با مدارک شناسایی معتبر وارد شود
• رزرو پس از تأیید و پرداخت توسط تیم پشتیبانی پردازش می‌شود
• زمان تقریبی صدور بلیط پس از تأیید رزرو حداکثر ۲۴ ساعت کاری است
• در صورت عدم موجودی، مبلغ پرداختی به طور کامل بازگردانده می‌شود`,
  },
  {
    title: '۴. قیمت‌گذاری و کارمزد',
    content: `• قیمت نهایی بلیط شامل قیمت پایه بلیط به اضافه کارمزد خدمات سایت است
• کارمزد خدمات به ازای هر مسافر محاسبه و در زمان رزرو نمایش داده می‌شود
• قیمت‌ها بر اساس نرخ‌های رسمی شرکت‌های ریلی و با احتساب کارمزد خدمات تعیین می‌شود`,
  },
  {
    title: '۵. استرداد و لغو رزرو',
    content: `• درخواست لغو رزرو از طریق پنل کاربری یا تماس با پشتیبانی امکان‌پذیر است
• در صورت لغو قبل از صدور بلیط: بازگشت کامل مبلغ بلیط (بدون کارمزد خدمات)
• در صورت لغو پس از صدور بلیط: طبق قوانین استرداد شرکت ریلی مربوطه
• کارمزد خدمات سایت در هیچ شرایطی قابل استرداد نیست
• زمان بازگشت وجه: حداکثر ۷۲ ساعت کاری پس از تأیید لغو`,
    important: true,
  },
  {
    title: '۶. مسئولیت اطلاعات مسافران',
    content: `• صحت اطلاعات وارد شده (نام، کد ملی، تاریخ تولد) بر عهده کاربر است
• در صورت بروز مشکل به دلیل اطلاعات نادرست، مسئولیت با کاربر بوده و سایت تعهدی جهت استرداد ندارد
• تغییر مشخصات مسافر پس از صدور بلیط امکان‌پذیر نیست`,
    important: true,
  },
  {
    title: '۷. تعهدات سایت',
    content: `• ارائه اطلاعات دقیق و به‌روز درباره برنامه حرکت قطارها
• پیگیری و پردازش به‌موقع رزروها
• پشتیبانی و پاسخگویی در ساعات کاری اعلام شده
• حفاظت از اطلاعات شخصی کاربران مطابق با سیاست حریم خصوصی
• اطلاع‌رسانی تغییرات احتمالی در برنامه سفر`,
  },
  {
    title: '۸. محدودیت مسئولیت',
    content: `سایت مسئولیتی در قبال موارد زیر ندارد:
• تأخیر یا لغو سفر توسط شرکت‌های ریلی
• تغییر مسیر یا برنامه حرکت قطار توسط شرکت ریلی
• اختلالات ناشی از شرایط جوی، فنی یا فورس ماژور
• خسارات ناشی از اطلاعات نادرست وارد شده توسط کاربر`,
  },
  {
    title: '۹. قانون حاکم و حل اختلاف',
    content: 'این شرایط تابع قوانین جمهوری اسلامی ایران است. در صورت بروز اختلاف، طرفین ابتدا از طریق مذاکره و در صورت عدم حصول نتیجه، از طریق مراجع قضایی صالح اقدام خواهند کرد.',
  },
  {
    title: '۱۰. تغییرات در شرایط استفاده',
    content: 'سفر برون مرز حق تغییر این شرایط را در هر زمان برای خود محفوظ می‌دارد. تغییرات از طریق سایت اطلاع‌رسانی شده و ادامه استفاده از خدمات به منزله پذیرش شرایط جدید است.',
  },
];

const Terms = () => {
  return (
    <MainLayout>
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

      <div className="relative z-10">
        <div className="bg-card/80 backdrop-blur-md py-12 border-b border-border/50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center mb-2">شرایط استفاده از خدمات</h1>
            <p className="text-muted-foreground text-center">لطفاً پیش از استفاده از خدمات، شرایط زیر را مطالعه فرمایید</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="space-y-6">
            {sections.map((section, i) => (
              <Card key={i} className={`p-6 bg-card/95 backdrop-blur-md border-border/50 ${section.important ? 'border-destructive/50 border-2' : ''}`}>
                <h2 className="text-xl font-bold mb-3 text-primary">{section.title}</h2>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{section.content}</p>
                {section.important && (
                  <div className="mt-3 text-sm text-destructive font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">warning</span>
                    بند مهم - لطفاً با دقت مطالعه فرمایید
                  </div>
                )}
              </Card>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-sm mt-8">آخرین به‌روزرسانی: بهمن ۱۴۰۴</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Terms;
