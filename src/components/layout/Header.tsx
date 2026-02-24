import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';

export function Header() {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { profile } = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    if (user) {
      checkStaffRole();
    } else {
      setIsStaff(false);
    }
  }, [user]);

  const checkStaffRole = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      const roles = data?.map(r => r.role) || [];
      setIsStaff(roles.includes('admin') || roles.includes('employee'));
    } catch (error) {
      console.error('Error checking staff role:', error);
    }
  };

  const baseNavLinks = [
    { href: '/', label: t('home') },
    { href: '/rules', label: t('rules') },
    { href: '/contact', label: t('contact') },
    { href: '/dashboard', label: t('dashboard') },
  ];

  // Only show admin link to staff members
  const navLinks = isStaff
    ? [...baseNavLinks, { href: '/admin', label: t('management') }]
    : baseNavLinks;

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const displayName = profile?.first_name || user?.email?.split('@')[0] || 'کاربر';

  return (
    <header className="sticky top-0 z-50 w-full glass-effect border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="group">
            <img src={logo} alt="safarz - سفر برون مرز" className="h-20 group-hover:scale-105 transition-transform" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <span className="material-symbols-outlined text-lg">language</span>
                  <span className="hidden sm:inline text-xs uppercase">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('fa')}>
                  فارسی
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ar')}>
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Buttons - Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              {loading ? (
                <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <div className="size-7 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                        {displayName.charAt(0)}
                      </div>
                      <span className="hidden lg:inline">{displayName}</span>
                      <span className="material-symbols-outlined text-sm">expand_more</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">dashboard</span>
                        {t('dashboard')}
                      </Link>
                    </DropdownMenuItem>
                    {isStaff && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                           {t('management')}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <span className="material-symbols-outlined text-lg">logout</span>
                      {t('logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">{t('login')}</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/login">{t('signUp')}</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <span className="material-symbols-outlined">menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-4 mt-8">
                  {user && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg">
                      <div className="size-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                        {displayName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{displayName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  )}
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive(link.href)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <hr className="border-border" />
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 rounded-lg font-medium bg-primary text-primary-foreground"
                      >
                        {t('dashboard')}
                      </Link>
                    <button
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                        className="px-4 py-3 rounded-lg font-medium text-destructive hover:bg-destructive/10 text-start"
                      >
                        {t('logoutAccount')}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted"
                      >
                        {t('login')}
                      </Link>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 rounded-lg font-medium bg-primary text-primary-foreground"
                      >
                        {t('signUp')}
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
