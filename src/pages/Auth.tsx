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
import { Smartphone, CheckCircle2 } from 'lucide-react';
import heroImage from '@/assets/hero-train.jpg';
import logo from '@/assets/logo.png';
import { cn } from '@/lib/utils';

const Auth = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  // Shared states
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Register extra fields
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');

  // Track active tab
  const [activeTab, setActiveTab] = useState('login');

  // Helper to convert phone to email format for Supabase
  const phoneToEmail = (p: string) => `${p.replace(/\s/g, '')}@phone.local`;

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Reset OTP state when switching tabs
  useEffect(() => {
    setOtpSent(false);
    setOtpCode('');
  }, [activeTab]);

  const handleSendOtp = () => {
    if (!phone || phone.length < 11) {
      toast({
        title: 'خطا',
        description: 'لطفاً شماره موبایل معتبر وارد کنید',
        variant: 'destructive',
      });
      return;
    }
    setOtpSent(true);
    toast({
      title: 'ارسال پیامک',
      description: `کد تایید به ${phone} ارسال شد`,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 5) {
      toast({ title: 'خطا', description: 'کد تایید ۵ رقمی را وارد کنید', variant: 'destructive' });
      return;
    }
    setLoading(true);

    // Using OTP code as password for now (simulated)
    const email = phoneToEmail(phone);
    const { error } = await signIn(email, otpCode);

    if (error) {
      toast({
        title: 'خطا در ورود',
        description: 'شماره موبایل یا کد تایید اشتباه است',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'ورود موفق', description: 'به داشبورد منتقل می‌شوید' });
      navigate('/dashboard');
    }

    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 5) {
      toast({ title: 'خطا', description: 'کد تایید ۵ رقمی را وارد کنید', variant: 'destructive' });
      return;
    }
    setLoading(true);

    const email = phoneToEmail(phone);
    const { error } = await signUp(email, otpCode, {
      first_name: registerFirstName,
      last_name: registerLastName,
      phone_number: phone,
    });

    if (error) {
      toast({
        title: 'خطا در ثبت نام',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'ثبت نام موفق',
        description: 'حساب شما با موفقیت ایجاد شد',
      });
      navigate('/dashboard');
    }

    setLoading(false);
  };

  const otpValid = otpCode.length === 5;

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
            <img src={logo} alt="safarz - سفر برون مرز" className="h-28 mx-auto" />
          </div>

          <Tabs defaultValue="login" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">{t('login')}</TabsTrigger>
              <TabsTrigger value="register">{t('register')}</TabsTrigger>
            </TabsList>

            {/* ===== LOGIN TAB ===== */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Phone + Send OTP */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Smartphone className="size-4 text-sky-500" />
                    {t('mobile')}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      placeholder="09xxxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-11 flex-1"
                      dir="ltr"
                      maxLength={11}
                      required
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="h-11 px-4 bg-sky-500 hover:bg-sky-600 text-white text-xs whitespace-nowrap"
                      onClick={handleSendOtp}
                      disabled={otpSent}
                    >
                      {otpSent ? '✓ ارسال شد' : 'ارسال کد'}
                    </Button>
                  </div>
                </div>

                {/* OTP Input */}
                <div className="space-y-2">
                  <Label>کد تایید پیامکی</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="_ _ _ _ _"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className={cn(
                        "h-11 text-center tracking-widest text-lg",
                        !otpSent && "opacity-50 cursor-not-allowed",
                        otpValid && "border-emerald-400 bg-emerald-50/50"
                      )}
                      dir="ltr"
                      maxLength={5}
                      disabled={!otpSent}
                    />
                    {otpValid && (
                      <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500" />
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-primary h-11"
                  disabled={loading || !otpValid}
                >
                  {loading ? 'در حال ورود...' : t('login')}
                </Button>
              </form>
            </TabsContent>

            {/* ===== REGISTER TAB ===== */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
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

                {/* Phone + Send OTP */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Smartphone className="size-4 text-sky-500" />
                    {t('mobile')}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      placeholder="09xxxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-11 flex-1"
                      dir="ltr"
                      maxLength={11}
                      required
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="h-11 px-4 bg-sky-500 hover:bg-sky-600 text-white text-xs whitespace-nowrap"
                      onClick={handleSendOtp}
                      disabled={otpSent}
                    >
                      {otpSent ? '✓ ارسال شد' : 'ارسال کد'}
                    </Button>
                  </div>
                </div>

                {/* OTP Input */}
                <div className="space-y-2">
                  <Label>کد تایید پیامکی</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="_ _ _ _ _"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className={cn(
                        "h-11 text-center tracking-widest text-lg",
                        !otpSent && "opacity-50 cursor-not-allowed",
                        otpValid && "border-emerald-400 bg-emerald-50/50"
                      )}
                      dir="ltr"
                      maxLength={5}
                      disabled={!otpSent}
                    />
                    {otpValid && (
                      <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500" />
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-primary h-11"
                  disabled={loading || !otpValid}
                >
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
