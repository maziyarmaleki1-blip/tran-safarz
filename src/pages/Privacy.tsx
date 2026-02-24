import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import heroImage from '@/assets/hero-train.jpg';

const sections = [
  {
    title: '۱. مقدمه',
    content: 'سفر برون مرز (safarz) به حریم خصوصی کاربران خود احترام می‌گذارد. این سیاست‌نامه توضیح می‌دهد که چه اطلاعاتی از شما جمع‌آوری می‌شود، چگونه از آن‌ها استفاده می‌شود و چه اقداماتی برای حفاظت از اطلاعات شما انجام می‌دهیم.',
  },
  {
    title: '۲. اطلاعاتی که جمع‌آوری می‌کنیم',
    content: `• اطلاعات هویتی: نام، نام خانوادگی، کد ملی و تاریخ تولد مسافران برای صدور بلیط
• اطلاعات تماس: شماره تلفن همراه و آدرس ایمیل برای ارسال اطلاعیه‌ها و پیگیری رزرو
• اطلاعات مالی: شماره کارت بانکی صرفاً جهت فرآیند استرداد وجه (اطلاعات پرداخت مستقیماً توسط درگاه‌های بانکی پردازش می‌شود)
• اطلاعات فنی: آدرس IP، نوع مرورگر و سیستم عامل برای بهبود عملکرد سایت`,
  },
  {
    title: '۳. نحوه استفاده از اطلاعات',
    content: `• ثبت و پیگیری رزرو بلیط قطار
• ارسال اطلاعیه‌های مربوط به وضعیت رزرو و سفر
• پردازش درخواست‌های استرداد وجه
• بهبود خدمات و تجربه کاربری سایت
• پاسخگویی به درخواست‌ها و سوالات پشتیبانی
• رعایت الزامات قانونی و مقررات حمل‌ونقل ریلی`,
  },
  {
    title: '۴. اشتراک‌گذاری اطلاعات',
    content: `اطلاعات شما فقط در موارد زیر با اشخاص ثالث به اشتراک گذاشته می‌شود:
• شرکت‌های راه‌آهن و حمل‌ونقل ریلی جهت صدور بلیط
• درگاه‌های پرداخت بانکی جهت پردازش تراکنش‌ها
• مراجع قانونی در صورت الزام قانونی
ما هرگز اطلاعات شخصی شما را به اشخاص ثالث برای مقاصد تبلیغاتی نمی‌فروشیم.`,
  },
  {
    title: '۵. امنیت اطلاعات',
    content: `• استفاده از رمزنگاری SSL/TLS برای انتقال امن داده‌ها
• ذخیره‌سازی اطلاعات حساس به صورت رمزنگاری شده
• دسترسی محدود کارکنان به اطلاعات کاربران بر اساس نقش
• بررسی‌های امنیتی دوره‌ای و به‌روزرسانی مداوم سیستم‌ها`,
  },
  {
    title: '۶. حقوق کاربران',
    content: `شما حق دارید:
• به اطلاعات شخصی خود دسترسی داشته باشید
• اصلاح یا به‌روزرسانی اطلاعات خود را درخواست کنید
• حذف حساب کاربری و اطلاعات مرتبط را درخواست کنید
• از دریافت پیام‌های تبلیغاتی انصراف دهید
برای اعمال این حقوق، از طریق صفحه تماس با ما ارتباط برقرار کنید.`,
  },
  {
    title: '۷. کوکی‌ها',
    content: 'سایت ما از کوکی‌ها برای بهبود تجربه کاربری، حفظ وضعیت ورود و تحلیل عملکرد سایت استفاده می‌کند. شما می‌توانید تنظیمات کوکی را از طریق مرورگر خود مدیریت کنید.',
  },
  {
    title: '۸. تغییرات در سیاست حریم خصوصی',
    content: 'ما حق تغییر این سیاست‌نامه را داریم. هرگونه تغییر از طریق سایت اطلاع‌رسانی خواهد شد. ادامه استفاده از خدمات پس از اعمال تغییرات به معنای پذیرش سیاست جدید است.',
  },
  {
    title: '۹. تماس با ما',
    content: 'در صورت هرگونه سوال یا نگرانی درباره حریم خصوصی، لطفاً از طریق ایمیل info@safarz.ir یا شماره تماس ۰۹۱۵۸۸۰۰۵۱۵ با ما در ارتباط باشید.',
  },
];

const Privacy = () => {
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
            <h1 className="text-3xl font-bold text-center mb-2">سیاست حریم خصوصی</h1>
            <p className="text-muted-foreground text-center">حفاظت از اطلاعات شما اولویت ماست</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="space-y-6">
            {sections.map((section, i) => (
              <Card key={i} className="p-6 bg-card/95 backdrop-blur-md border-border/50">
                <h2 className="text-xl font-bold mb-3 text-primary">{section.title}</h2>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{section.content}</p>
              </Card>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-sm mt-8">آخرین به‌روزرسانی: بهمن ۱۴۰۴</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Privacy;
