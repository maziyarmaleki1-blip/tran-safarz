import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Reservation {
  id: string;
  reservation_code: string;
  origin: string;
  destination: string;
  departure_date: string;
  departure_time: string | null;
  train_name: string | null;
  wagon_type: string | null;
  passenger_count: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  passengers: any;
  created_at: string;
  updated_at: string;
  ticket_file_path?: string | null;
  ticket_uploaded_at?: string | null;
}

export function useReservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReservations();
    } else {
      setReservations([]);
      setLoading(false);
    }
  }, [user]);

  const fetchReservations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data as Reservation[]);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (reservation: Omit<Reservation, 'id' | 'created_at' | 'updated_at'> & { user_id: string }) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert(reservation)
        .select()
        .single();

      if (error) throw error;
      setReservations(prev => [data as Reservation, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating reservation:', error);
      return { data: null, error };
    }
  };

  return { reservations, loading, fetchReservations, createReservation };
}
