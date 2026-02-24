import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DepositSetting {
  id: string;
  wagon_type: string;
  amount: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const wagonTypeLabels: Record<string, string> = {
  '5_star': 'پنج ستاره',
  '4_star': 'چهار ستاره',
  '6_berth': 'شش تخته',
  '4_berth': 'چهار تخته',
  'seated': 'صندلی',
  'economy': 'اقتصادی',
};

export function useDepositSettings() {
  const [deposits, setDeposits] = useState<DepositSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('deposit_settings')
        .select('*')
        .order('amount', { ascending: false });

      if (error) throw error;
      setDeposits((data || []) as DepositSetting[]);
    } catch (error) {
      console.error('Error fetching deposit settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDeposit = async (id: string, amount: number, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('deposit_settings')
        .update({ amount, is_active: isActive })
        .eq('id', id);

      if (error) throw error;
      await fetchDeposits();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const addDeposit = async (wagonType: string, amount: number) => {
    try {
      const { error } = await supabase
        .from('deposit_settings')
        .insert({ wagon_type: wagonType, amount });

      if (error) throw error;
      await fetchDeposits();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const deleteDeposit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('deposit_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchDeposits();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const getDepositForWagonType = (wagonType: string): number => {
    const setting = deposits.find(d => d.wagon_type === wagonType && d.is_active);
    return setting?.amount || 0;
  };

  return {
    deposits,
    loading,
    fetchDeposits,
    updateDeposit,
    addDeposit,
    deleteDeposit,
    getDepositForWagonType,
    wagonTypeLabels,
  };
}
