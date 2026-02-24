import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Profile } from '@/hooks/useProfile';

interface ProfileTabProps {
  profile: Profile | null;
  loading: boolean;
  onUpdate: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

export function ProfileTab({ profile, loading, onUpdate }: ProfileTabProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ first_name: '', last_name: '', phone_number: '', email: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({ first_name: profile.first_name || '', last_name: profile.last_name || '', phone_number: profile.phone_number || '', email: profile.email || '' });
    }
  }, [profile]);

  const handleSubmit = async () => { setSaving(true); await onUpdate(formData); setSaving(false); };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('userProfile')}</h1>
        <Card className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (<div key={i} className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('userProfile')}</h1>
      <Card className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>{t('firstName')}</Label><Input value={formData.first_name} onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))} /></div>
          <div className="space-y-2"><Label>{t('lastName')}</Label><Input value={formData.last_name} onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))} /></div>
          <div className="space-y-2"><Label>{t('mobile')}</Label><Input value={formData.phone_number} onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))} /></div>
          <div className="space-y-2"><Label>{t('email')}</Label><Input value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} disabled /></div>
        </div>
        <Button className="mt-6 gradient-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? t('saving') : t('saveChanges')}
        </Button>
      </Card>
    </div>
  );
}
