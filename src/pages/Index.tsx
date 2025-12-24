import { MainLayout } from '@/components/layout/MainLayout';
import { SearchBox } from '@/components/search/SearchBox';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(20, 60, 120, 0.85) 0%, rgba(15, 40, 80, 0.9) 100%), url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1920&q=80')`,
          }}
        />

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center size-20 rounded-2xl gradient-gold shadow-lg mb-6">
              <span className="material-symbols-outlined icon-filled text-4xl text-primary-foreground">train</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">{t('heroSubtitle')}</p>
          </div>
          <SearchBox />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">چرا سفیر ریل؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'speed', title: 'رزرو سریع', desc: 'در کمتر از ۲ دقیقه بلیط رزرو کنید' },
              { icon: 'verified_user', title: 'پرداخت امن', desc: 'تراکنش‌های امن با درگاه‌های بانکی' },
              { icon: 'support_agent', title: 'پشتیبانی ۲۴/۷', desc: 'تیم پشتیبانی همیشه در خدمت شماست' },
            ].map((f, i) => (
              <div key={i} className="bg-card rounded-xl p-6 text-center shadow-soft border border-border">
                <div className="inline-flex items-center justify-center size-14 rounded-xl gradient-primary mb-4">
                  <span className="material-symbols-outlined text-2xl text-primary-foreground">{f.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;