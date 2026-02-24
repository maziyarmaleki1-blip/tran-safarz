import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 bg-sidebar text-sidebar-foreground mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <img src={logo} alt="safarz - سفر برون مرز" className="h-20 brightness-0 invert" />
            </div>
            <p className="text-sidebar-foreground/70 text-sm leading-relaxed">
              سفر برون مرز - پلتفرم رزرو آنلاین بلیط قطار به سراسر ایران. سفری راحت و مطمئن را تجربه کنید.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">لینک‌های سریع</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/rules" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  {t('rules')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">{t('contact')}</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">phone</span>
                <span dir="ltr">09158800515</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">mail</span>
                <span>info@safarz.ir</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">location_on</span>
                <span>مشهد، خیابان کامیاب</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-sidebar-border mt-8 pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* eNamad & Payment Badges - Left Side */}
            <div className="flex items-center gap-4">
              <div className="w-28 h-32 rounded-lg border-2 border-dashed border-sidebar-foreground/30 bg-sidebar-foreground/5 flex flex-col items-center justify-center gap-2 text-sidebar-foreground/40">
                <span className="material-symbols-outlined text-2xl">verified</span>
                <span className="text-[10px] text-center leading-tight">نماد اعتماد<br/>الکترونیکی</span>
              </div>
              <div className="w-28 h-32 rounded-lg border-2 border-dashed border-sidebar-foreground/30 bg-sidebar-foreground/5 flex flex-col items-center justify-center gap-2 text-sidebar-foreground/40">
                <span className="material-symbols-outlined text-2xl">credit_card</span>
                <span className="text-[10px] text-center leading-tight">مجوز درگاه<br/>پرداخت</span>
              </div>
            </div>

            {/* Copyright & Links */}
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-4">
                <Link to="/privacy" className="text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
                  {t('privacyPolicy')}
                </Link>
                <Link to="/terms" className="text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
                  {t('termsOfService')}
                </Link>
              </div>
              <p className="text-sm text-sidebar-foreground/60">
                © ۱۴۰۴ safarz - {t('allRightsReserved')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}