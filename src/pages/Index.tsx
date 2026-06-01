import { MainLayout } from '@/components/layout/MainLayout';
import { ServiceTabs } from '@/components/search/ServiceTabs';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-train.jpg';

const Index = () => {
  const { t } = useLanguage();

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

      {/* Hero Section */}
      <section className="relative z-10 flex items-start justify-center overflow-hidden pt-8">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center size-20 rounded-2xl gradient-gold shadow-lg mb-6">
              <span className="material-symbols-outlined icon-filled text-4xl text-primary-foreground">train</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">{t('heroSubtitle')}</p>
          </div>
          <ServiceTabs />
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-10">
        <div className="container mx-auto px-4">
          <div className="bg-white/20 dark:bg-card/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8">چرا safarz؟</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: 'speed', title: 'رزرو سریع', desc: 'در کمتر از ۲ دقیقه بلیط رزرو کنید' },
                { icon: 'verified_user', title: 'پرداخت امن', desc: 'تراکنش‌های امن با درگاه‌های بانکی' },
                { icon: 'support_agent', title: 'پشتیبانی ۲۴/۷', desc: 'تیم پشتیبانی همیشه در خدمت شماست' },
              ].map((f, i) => (
                <div key={i} className="bg-white/50 dark:bg-card/50 rounded-xl p-6 text-center border border-white/20">
                  <div className="inline-flex items-center justify-center size-14 rounded-xl gradient-primary mb-4">
                    <span className="material-symbols-outlined text-2xl text-primary-foreground">{f.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;