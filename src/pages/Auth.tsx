import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import heroImage from '@/assets/hero-train.jpg';

const Auth = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(loginEmail, loginPassword);
    
    if (error) {
      toast({ 
        title: 'خطا در ورود', 
        description: error.message === 'Invalid login credentials' 
          ? 'ایمیل یا رمز عبور اشتباه است' 
          : error.message,
        variant: 'destructive'
      });
    } else {
      toast({ title: 'ورود موفق', description: 'به داشبورد منتقل می‌شوید' });
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUp(registerEmail, registerPassword, {
      first_name: registerFirstName,
      last_name: registerLastName,
      phone_number: registerPhone,
    });
    
    if (error) {
      toast({ 
        title: 'خطا در ثبت نام', 
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({ 
        title: 'ثبت نام موفق', 
        description: 'لطفاً ایمیل خود را برای تایید بررسی کنید' 
      });
    }
    
    setLoading(false);
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

      <div className="relative z-10 min-h-[70vh] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md p-6 bg-card/95 backdrop-blur-md border-border/50">
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
                  <Label>{t('email')}</Label>
                  <Input 
                    type="email" 
                    placeholder="email@example.com" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required 
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>رمز عبور</Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required 
                    dir="ltr"
                  />
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
                    <Input 
                      placeholder="نام" 
                      value={registerFirstName}
                      onChange={(e) => setRegisterFirstName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('lastName')}</Label>
                    <Input 
                      placeholder="نام خانوادگی" 
                      value={registerLastName}
                      onChange={(e) => setRegisterLastName(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('mobile')}</Label>
                  <Input 
                    type="tel" 
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹" 
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('email')}</Label>
                  <Input 
                    type="email" 
                    placeholder="email@example.com" 
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>رمز عبور</Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required 
                    minLength={6}
                    dir="ltr"
                  />
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