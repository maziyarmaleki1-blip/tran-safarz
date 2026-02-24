import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function SecurityTab() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({ title: t('passwordMismatch'), variant: 'destructive' });
      return;
    }
    if (passwords.new.length < 6) {
      toast({ title: t('passwordMinLength'), variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.new });
      if (error) throw error;
      toast({ title: t('passwordChanged') });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      toast({ title: error.message || t('error'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('changePassword')}</h1>
      <Card className="p-6">
        <div className="space-y-4 max-w-md">
          <div className="space-y-2"><Label>{t('currentPassword')}</Label><Input type="password" placeholder="••••••••" value={passwords.current} onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))} /></div>
          <div className="space-y-2"><Label>{t('newPassword')}</Label><Input type="password" placeholder="••••••••" value={passwords.new} onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))} /></div>
          <div className="space-y-2"><Label>{t('confirmPassword')}</Label><Input type="password" placeholder="••••••••" value={passwords.confirm} onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))} /></div>
          <Button className="gradient-primary" onClick={handleChangePassword} disabled={loading}>
            {loading ? t('changingPassword') : t('changePassword')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
