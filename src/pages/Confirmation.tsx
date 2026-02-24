import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProcessSteps } from '@/components/ProcessSteps';
import heroImage from '@/assets/hero-train.jpg';

import { getCityNameFa } from '@/lib/constants';

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
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl px-6 py-6 inline-block">
            <div className="size-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-success text-5xl">check_circle</span>
            </div>
            <h1 className="text-2xl font-bold text-success mb-2">درخواست شکار بلیط ثبت شد!</h1>
            <p className="text-card-foreground">تیم ما در حال پیگیری بلیط شماست</p>
          </div>
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
              <span className="font-medium">{getCityNameFa(from)} → {getCityNameFa(to)}</span>
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

        {/* Process Steps */}
        <ProcessSteps activeStep={4} className="mb-6" />

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
