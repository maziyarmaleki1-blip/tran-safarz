import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: 'ورود موفق', description: 'به داشبورد منتقل می‌شوید' });
      navigate('/dashboard');
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: 'ثبت نام موفق', description: 'حساب شما ایجاد شد' });
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center size-14 rounded-xl gradient-primary mb-4">
              <span className="material-symbols-outlined text-2xl text-primary-foreground icon-filled">train</span>
            </div>
            <h1 className="text-2xl font-bold">سفیر ریل</h1>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">{t('login')}</TabsTrigger>
              <TabsTrigger value="register">{t('register')}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('mobile')}</Label>
                  <Input type="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹" required />
                </div>
                <div className="space-y-2">
                  <Label>رمز عبور</Label>
                  <Input type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                  {loading ? 'در حال ورود...' : t('login')}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
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
                  <Label>{t('mobile')}</Label>
                  <Input type="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹" required />
                </div>
                <div className="space-y-2">
                  <Label>{t('email')}</Label>
                  <Input type="email" placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>رمز عبور</Label>
                  <Input type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                  {loading ? 'در حال ثبت نام...' : t('register')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-6">
            با ورود یا ثبت نام، <Link to="/rules" className="text-primary hover:underline">قوانین</Link> را می‌پذیرید
          </p>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Auth;