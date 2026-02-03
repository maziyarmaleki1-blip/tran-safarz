import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 bg-sidebar text-sidebar-foreground mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-10 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground">
                <span className="material-symbols-outlined icon-filled">train</span>
              </div>
              <span className="text-xl font-bold">سفیر ریل</span>
            </div>
            <p className="text-sidebar-foreground/70 text-sm leading-relaxed">
              سفیر ریل، پلتفرم رزرو آنلاین بلیط قطار به سراسر ایران. سفری راحت و مطمئن را تجربه کنید.
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
                <span dir="ltr">021-12345678</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">mail</span>
                <span>info@safirrail.ir</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">location_on</span>
                <span>تهران، میدان آزادی</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sidebar-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-sidebar-foreground/60">
            © ۱۴۰۳ سفیر ریل - {t('allRightsReserved')}
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
              {t('privacyPolicy')}
            </Link>
            <Link to="/terms" className="text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
              {t('termsOfService')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}