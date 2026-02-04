import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Simple notification sound using Web Audio API
const createNotificationSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const playBeep = (frequency: number, duration: number, startTime: number) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };

  // Play a pleasant two-tone notification
  const currentTime = audioContext.currentTime;
  playBeep(880, 0.15, currentTime); // A5
  playBeep(1100, 0.15, currentTime + 0.15); // C#6
  playBeep(1320, 0.2, currentTime + 0.3); // E6
};

export function useReservationNotification(
  enabled: boolean = true, 
  onNewReservation?: () => void
) {
  const isFirstLoad = useRef(true);
  const lastReservationId = useRef<string | null>(null);

  const playNotification = useCallback(() => {
    try {
      createNotificationSound();
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Subscribe to new reservations
    const channel = supabase
      .channel('admin-reservations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reservations',
        },
        (payload) => {
          // Skip first load to avoid playing sound on page refresh
          if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
          }

          // Avoid duplicate notifications
          if (payload.new.id === lastReservationId.current) return;
          lastReservationId.current = payload.new.id;

          // Play notification sound
          playNotification();

          // Show toast notification
          toast.info('رزرو جدید ثبت شد!', {
            description: `کد رزرو: ${payload.new.reservation_code}`,
            duration: 5000,
          });

          // Call refresh callback if provided
          onNewReservation?.();
        }
      )
      .subscribe();

    // Mark as loaded after a short delay
    const timer = setTimeout(() => {
      isFirstLoad.current = false;
    }, 2000);

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [enabled, playNotification, onNewReservation]);

  return { playNotification };
}
