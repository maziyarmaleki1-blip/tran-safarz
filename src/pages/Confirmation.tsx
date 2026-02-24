import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import heroImage from '@/assets/hero-train.jpg';

const cities: Record<string, string> = {
  tehran: 'تهران', mashhad: 'مشهد', isfahan: 'اصفهان', shiraz: 'شیراز',
  tabriz: 'تبریز', yazd: 'یزد', ahvaz: 'اهواز', bandarabbas: 'بندرعباس',
};

const Confirmation = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const trackingCode = searchParams.get('code') || '';
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const passengers = parseInt(searchParams.get('passengers') || '1');
  const deposit = parseInt(searchParams.get('deposit') || '0');

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

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
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="size-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-success text-5xl">check_circle</span>
          </div>
          <h1 className="text-2xl font-bold text-success mb-2">درخواست شکار بلیط ثبت شد!</h1>
          <p className="text-card-foreground bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">تیم ما در حال پیگیری بلیط شماست</p>
        </div>

        {/* Tracking Code */}
        <Card className="p-6 mb-6 text-center bg-card/95 backdrop-blur-md border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">{t('trackingCode')}</p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-3xl font-bold tracking-widest text-primary">{trackingCode}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigator.clipboard.writeText(trackingCode)}
              className="shrink-0"
            >
              <span className="material-symbols-outlined">content_copy</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">این کد را برای پیگیری درخواست خود نگه دارید</p>
        </Card>

        {/* Order Summary */}
        <Card className="p-6 mb-6 bg-card/95 backdrop-blur-md border-border/50">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">receipt</span>
            خلاصه درخواست
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">مسیر</span>
              <span className="font-medium">{cities[from] || from} → {cities[to] || to}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">تعداد مسافران</span>
              <span className="font-medium">{passengers} نفر</span>
            </div>
            {deposit > 0 && (
              <>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">مبلغ پرداخت شده (بیعانه + کارمزد)</span>
                  <span className="font-bold text-primary">{formatPrice(deposit)} {t('toman')}</span>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Steps Info */}
        <Card className="p-6 mb-6 bg-card/95 backdrop-blur-md border-border/50">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">timeline</span>
            مراحل بعدی
          </h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="size-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-success text-lg">check</span>
              </div>
              <div>
                <p className="font-medium text-sm">ثبت درخواست</p>
                <p className="text-xs text-muted-foreground">درخواست شما با موفقیت ثبت شد</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="size-8 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-warning text-lg">search</span>
              </div>
              <div>
                <p className="font-medium text-sm">جستجوی بلیط</p>
                <p className="text-xs text-muted-foreground">تیم ما در حال پیدا کردن بهترین بلیط برای شماست</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-muted-foreground text-lg">payments</span>
              </div>
              <div>
                <p className="font-medium text-sm">پرداخت مابقی</p>
                <p className="text-xs text-muted-foreground">پس از پیدا شدن بلیط، مابقی مبلغ از شما دریافت خواهد شد</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-muted-foreground text-lg">confirmation_number</span>
              </div>
              <div>
                <p className="font-medium text-sm">دریافت بلیط</p>
                <p className="text-xs text-muted-foreground">بلیط نهایی در داشبورد شما قابل مشاهده و دانلود خواهد بود</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 gap-2 gradient-primary" onClick={() => navigate('/dashboard')}>
            <span className="material-symbols-outlined">dashboard</span>
            رفتن به داشبورد
          </Button>
          <Button variant="outline" className="flex-1 gap-2" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined">home</span>
            بازگشت به صفحه اصلی
          </Button>
        </div>

        {/* Help Note */}
        <div className="bg-card/80 backdrop-blur-sm rounded-lg px-4 py-3 text-center mt-6">
          <p className="text-sm text-card-foreground flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            در صورت عدم موفقیت در شکار بلیط، کل مبلغ بیعانه به شما بازگردانده خواهد شد
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Confirmation;
