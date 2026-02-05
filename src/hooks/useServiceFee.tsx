import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceFee {
  id: string;
  name: string;
  fee_type: 'fixed' | 'percentage';
  amount: number;
  is_active: boolean;
  updated_at: string;
}

export function useServiceFee() {
  const [serviceFee, setServiceFee] = useState<ServiceFee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiceFee();
  }, []);

  const fetchServiceFee = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_fees')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      setServiceFee(data as ServiceFee | null);
    } catch (error) {
      console.error('Error fetching service fee:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateServiceFee = async (amount: number, feeType: 'fixed' | 'percentage' = 'fixed') => {
    if (!serviceFee) return { error: 'No service fee found' };

    try {
      const { error } = await supabase
        .from('service_fees')
        .update({ 
          amount, 
          fee_type: feeType,
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceFee.id);

      if (error) throw error;

      await fetchServiceFee();
      return { error: null };
    } catch (error: any) {
      console.error('Error updating service fee:', error);
      return { error: error.message };
    }
  };

  const calculateFee = (ticketPrice: number): number => {
    if (!serviceFee || !serviceFee.is_active) return 0;
    
    if (serviceFee.fee_type === 'fixed') {
      return serviceFee.amount;
    } else {
      return Math.round((ticketPrice * serviceFee.amount) / 100);
    }
  };

  return { 
    serviceFee, 
    loading, 
    fetchServiceFee, 
    updateServiceFee,
    calculateFee 
  };
}
