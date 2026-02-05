import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { UserPlus, Users } from 'lucide-react';

export interface SavedPassenger {
  id: string;
  first_name: string;
  last_name: string;
  national_id: string;
  birth_date: string;
  is_foreign: boolean;
}

interface SavedPassengerSelectorProps {
  onSelect: (passenger: SavedPassenger) => void;
  excludeIds?: string[];
}

const SavedPassengerSelector: React.FC<SavedPassengerSelectorProps> = ({
  onSelect,
  excludeIds = [],
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isRTL = language === 'fa';
  const [savedPassengers, setSavedPassengers] = useState<SavedPassenger[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSavedPassengers();
    }
  }, [user]);

  const fetchSavedPassengers = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_passengers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedPassengers(data || []);
    } catch (error) {
      console.error('Error fetching saved passengers:', error);
    } finally {
      setLoading(false);
    }
  };

  const availablePassengers = savedPassengers.filter(
    (p) => !excludeIds.includes(p.id)
  );

  if (!user || availablePassengers.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Users className="size-4 text-sky-500" />
      <Select
        onValueChange={(value) => {
          const passenger = savedPassengers.find((p) => p.id === value);
          if (passenger) onSelect(passenger);
        }}
      >
        <SelectTrigger className="h-8 text-xs bg-sky-50/80 border-sky-100 w-[180px]">
          <SelectValue placeholder={isRTL ? 'انتخاب از لیست' : 'Select saved'} />
        </SelectTrigger>
        <SelectContent>
          {availablePassengers.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.first_name} {p.last_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SavedPassengerSelector;
