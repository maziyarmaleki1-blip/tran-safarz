import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-train.jpg';

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'پیام ارسال شد', description: 'به زودی با شما تماس می‌گیریم' });
  };

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
        <div className="bg-card/80 backdrop-blur-md py-12 border-b border-border/50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center mb-2">{t('contact')}</h1>
            <p className="text-muted-foreground text-center">سوالی دارید؟ با ما در تماس باشید</p>
          </div>
        </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">اطلاعات تماس</h2>
            {[
              { icon: 'phone', title: 'تلفن', value: '۰۹۱۵۸۸۰۰۵۱۵' },
              { icon: 'mail', title: 'ایمیل', value: 'info@safarz.ir' },
              { icon: 'location_on', title: 'آدرس', value: 'مشهد، خیابان کامیاب' },
              { icon: 'schedule', title: 'ساعات کاری', value: 'شنبه تا پنجشنبه ۸ صبح تا ۸ شب' },
            ].map((item, i) => (
              <Card key={i} className="p-4 flex items-center gap-4 bg-card/95 backdrop-blur-md border-border/50">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">{item.icon}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              </Card>
            ))}

            {/* Map */}
            <Card className="overflow-hidden bg-card/95 backdrop-blur-md border-border/50">
              <div className="p-4 pb-2">
                <h3 className="font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">map</span>
                  موقعیت ما روی نقشه
                </h3>
              </div>
              <div className="px-4 pb-4">
                <div className="rounded-lg overflow-hidden border border-border/50">
                  <iframe
                    title="نقشه آدرس سفرز"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=59.56%2C36.30%2C59.62%2C36.33&layer=mapnik&marker=36.315%2C59.588"
                    width="100%"
                    height="280"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="p-6 bg-card/95 backdrop-blur-md border-border/50 h-fit">
            <h2 className="text-2xl font-bold mb-6">ارسال پیام</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('firstName')}</Label>
                  <Input placeholder="نام" required />
                </div>
                <div className="space-y-2">
                  <Label>{t('lastName')}</Label>
                  <Input placeholder="نام خانوادگی" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('email')}</Label>
                <Input type="email" placeholder="email@example.com" required />
              </div>
              <div className="space-y-2">
                <Label>موضوع</Label>
                <Input placeholder="موضوع پیام" required />
              </div>
              <div className="space-y-2">
                <Label>پیام</Label>
                <Textarea placeholder="پیام خود را بنویسید..." rows={5} required />
              </div>
              <Button type="submit" className="w-full gradient-primary">ارسال پیام</Button>
            </form>
          </Card>
        </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;