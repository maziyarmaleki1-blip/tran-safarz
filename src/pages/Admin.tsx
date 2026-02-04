import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useReservationNotification } from '@/hooks/useReservationNotification';
import { Header } from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StatsCards } from '@/components/admin/StatsCards';
import { ReservationsTable } from '@/components/admin/ReservationsTable';
import { EmployeeManagement } from '@/components/admin/EmployeeManagement';

interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: string;
  mobile: string;
  isChild: boolean;
}

interface Reservation {
  id: string;
  reservation_code: string;
  origin: string;
  destination: string;
  departure_date: string;
  departure_time: string | null;
  train_name: string | null;
  wagon_type: string | null;
  passenger_count: number | null;
  passengers: Passenger[] | null;
  total_price: number;
  status: string;
  created_at: string;
  user_id: string;
  confirmed_by: string | null;
  confirmed_at: string | null;
  confirmer_name?: string;
  assigned_to: string | null;
  assigned_at: string | null;
  assignee_name?: string;
  assigned_employees?: string[];
  // Pending status change
  pending_status?: string | null;
  pending_status_by?: string | null;
  pending_status_at?: string | null;
  pending_status_by_name?: string;
  // Selected filters from search
  selected_wagon_types?: string[];
  selected_time_slots?: string[];
  price_range_min?: number | null;
  price_range_max?: number | null;
  customer_notes?: string | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isRTL } = useLanguage();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);


  const direction = isRTL ? 'rtl' : 'ltr';

  // TEMPORARY: Auth check disabled for development
  useEffect(() => {
    // if (!authLoading && !user) {
    //   navigate('/login');
    //   return;
    // }
    // if (user) {
    //   checkUserRole();
    // }
    
    // Temporarily set as admin for development
    setIsAdmin(true);
    setIsStaff(true);
    setCheckingRole(false);
    fetchAllReservations();
  }, []);

  const checkUserRole = async () => {
    if (!user) return;
    
    try {
      setCheckingRole(true);
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) throw error;

      const userRoles = roles?.map(r => r.role) || [];
      const hasAdminRole = userRoles.includes('admin');
      const hasStaffRole = userRoles.includes('admin') || userRoles.includes('employee');

      setIsAdmin(hasAdminRole);
      setIsStaff(hasStaffRole);

      if (!hasStaffRole) {
        toast.error('شما دسترسی به این صفحه ندارید');
        navigate('/');
        return;
      }

      fetchAllReservations();
    } catch (error) {
      console.error('Error checking role:', error);
      toast.error('خطا در بررسی دسترسی');
      navigate('/');
    } finally {
      setCheckingRole(false);
    }
  };

  const fetchAllReservations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch confirmer and assignee names
      const reservationsWithNames: Reservation[] = [];
      for (const item of data || []) {
        let confirmerName = undefined;
        let assigneeName = undefined;
        
        if (item.confirmed_by) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', item.confirmed_by)
            .maybeSingle();
          
          if (profile) {
            confirmerName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          }
        }

        if (item.assigned_to) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', item.assigned_to)
            .maybeSingle();
          
          if (profile) {
            assigneeName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          }
        }

        let pendingStatusByName = undefined;
        if (item.pending_status_by) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', item.pending_status_by)
            .maybeSingle();
          
          if (profile) {
            pendingStatusByName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          }
        }

        reservationsWithNames.push({
          ...item,
          passengers: Array.isArray(item.passengers) ? item.passengers as unknown as Passenger[] : null,
          confirmer_name: confirmerName,
          assignee_name: assigneeName,
          assigned_employees: Array.isArray(item.assigned_employees) ? item.assigned_employees : [],
          pending_status_by_name: pendingStatusByName,
        });
      }

      setReservations(reservationsWithNames);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('خطا در دریافت رزروها');
    } finally {
      setLoading(false);
    }
  };

  // Enable notification sound for new reservations and auto-refresh
  useReservationNotification(true, fetchAllReservations);

  // Stats
  const totalReservations = reservations.length;
  const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length;
  const pendingReservations = reservations.filter(r => r.status === 'pending').length;
  const cancelledReservations = reservations.filter(r => r.status === 'cancelled').length;

  if (authLoading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-3">
          <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">پنل مدیریت</h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'مدیریت رزروها و کارمندان' : 'مدیریت رزروها'}
          </p>
        </div>

        <Tabs defaultValue="reservations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="reservations" className="gap-2">
              <span className="material-symbols-outlined text-lg">confirmation_number</span>
              رزروها
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="employees" className="gap-2">
                <span className="material-symbols-outlined text-lg">group</span>
                کارمندان
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="reservations" className="space-y-6">
            <StatsCards
              total={totalReservations}
              confirmed={confirmedReservations}
              pending={pendingReservations}
              cancelled={cancelledReservations}
            />

            <ReservationsTable
              reservations={reservations}
              loading={loading}
              onRefresh={fetchAllReservations}
              isAdmin={isAdmin}
            />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="employees">
              <EmployeeManagement isAdmin={isAdmin} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
