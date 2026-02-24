import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

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
  // Refund info
  refund_status?: string | null;
  refund_amount?: number | null;
  refund_method?: string | null;
  refund_at?: string | null;
  // Passenger breakdown
  adults_count?: number | null;
  children_count?: number | null;
  // Cancel request
  cancel_requested?: boolean | null;
  cancel_requested_at?: string | null;
  // Ticket payment
  ticket_payment_status?: string | null;
  ticket_payment_amount?: number | null;
  ticket_payment_link?: string | null;
  ticket_paid_at?: string | null;
}

const cities: Record<string, string> = {
  tehran: 'تهران', mashhad: 'مشهد', isfahan: 'اصفهان', shiraz: 'شیراز',
  tabriz: 'تبریز', yazd: 'یزد', ahvaz: 'اهواز', bandarabbas: 'بندرعباس',
};

const getStatusLabel = (status: string, ticketPaymentStatus?: string | null, ticketFilePath?: string | null) => {
  if (status === 'cancelled') return '❌ رزرو شما لغو شد';
  if (status === 'confirmed') {
    if (ticketFilePath) return '🎫 بلیط شما آماده مشاهده است!';
    if (ticketPaymentStatus === 'confirmed') return '✅ پرداخت تأیید شد · بلیط در حال آماده‌سازی';
    if (ticketPaymentStatus === 'paid') return '⏳ پرداخت شما دریافت شد · در انتظار تأیید';
    return '💳 بلیط پیدا شد! لطفاً مابقی را پرداخت کنید';
  }
  return '';
};

export function useReservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchReservations();
    } else {
      setReservations([]);
      setLoading(false);
    }
  }, [user, fetchReservations]);

  // Realtime subscription for reservation updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user-reservations')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reservations',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as any;
          const old = payload.old as any;

          // Update local state
          setReservations(prev =>
            prev.map(r => r.id === updated.id ? { ...r, ...updated } as Reservation : r)
          );

          // Show notification based on what changed
          if (old.status !== updated.status) {
            const msg = getStatusLabel(updated.status, updated.ticket_payment_status, updated.ticket_file_path);
            if (msg) {
              const route = `${cities[updated.origin] || updated.origin} به ${cities[updated.destination] || updated.destination}`;
              toast.info(msg, { description: route, duration: 8000 });
            }
          } else if (old.ticket_file_path !== updated.ticket_file_path && updated.ticket_file_path) {
            const route = `${cities[updated.origin] || updated.origin} به ${cities[updated.destination] || updated.destination}`;
            toast.success('🎫 بلیط شما آماده مشاهده است!', { description: route, duration: 8000 });
          } else if (old.ticket_payment_status !== updated.ticket_payment_status) {
            const msg = getStatusLabel(updated.status, updated.ticket_payment_status, updated.ticket_file_path);
            if (msg) {
              const route = `${cities[updated.origin] || updated.origin} به ${cities[updated.destination] || updated.destination}`;
              toast.info(msg, { description: route, duration: 8000 });
            }
          } else if (!old.ticket_payment_link && updated.ticket_payment_link) {
            const route = `${cities[updated.origin] || updated.origin} به ${cities[updated.destination] || updated.destination}`;
            toast.info('💳 لینک پرداخت ارسال شد', { description: route, duration: 8000 });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

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
