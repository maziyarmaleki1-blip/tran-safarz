import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SavedPassenger {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  national_id: string;
  birth_date: string;
  is_foreign: boolean;
  created_at: string;
  updated_at: string;
}

export function useSavedPassengers() {
  const { user } = useAuth();
  const [savedPassengers, setSavedPassengers] = useState<SavedPassenger[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedPassengers();
    } else {
      setSavedPassengers([]);
      setLoading(false);
    }
  }, [user]);

  const fetchSavedPassengers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_passengers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedPassengers(data as SavedPassenger[]);
    } catch (error) {
      console.error('Error fetching saved passengers:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePassenger = async (passenger: {
    first_name: string;
    last_name: string;
    national_id: string;
    birth_date: string;
    is_foreign?: boolean;
  }) => {
    if (!user) return { data: null, error: new Error('Not authenticated') };
    
    try {
      // Check if passenger with same national_id already exists
      const existing = savedPassengers.find(
        (p) => p.national_id === passenger.national_id
      );
      
      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('saved_passengers')
          .update({
            first_name: passenger.first_name,
            last_name: passenger.last_name,
            birth_date: passenger.birth_date,
            is_foreign: passenger.is_foreign || false,
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        
        setSavedPassengers((prev) =>
          prev.map((p) => (p.id === existing.id ? (data as SavedPassenger) : p))
        );
        return { data, error: null };
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('saved_passengers')
          .insert({
            user_id: user.id,
            ...passenger,
            is_foreign: passenger.is_foreign || false,
          })
          .select()
          .single();

        if (error) throw error;
        
        setSavedPassengers((prev) => [data as SavedPassenger, ...prev]);
        return { data, error: null };
      }
    } catch (error) {
      console.error('Error saving passenger:', error);
      return { data: null, error };
    }
  };

  const deletePassenger = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_passengers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSavedPassengers((prev) => prev.filter((p) => p.id !== id));
      return { error: null };
    } catch (error) {
      console.error('Error deleting passenger:', error);
      return { error };
    }
  };

  return {
    savedPassengers,
    loading,
    fetchSavedPassengers,
    savePassenger,
    deletePassenger,
  };
}
