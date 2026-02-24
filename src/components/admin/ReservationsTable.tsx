import { getCityNameFa } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
 import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { RefundDialog } from './RefundDialog';
import { TicketUploadDialog } from './TicketUploadDialog';
import { TicketPaymentDialog } from './TicketPaymentDialog';

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
  // Additional options
  private_compartment?: boolean;
  foreign_national?: boolean;
  // Passenger breakdown
  passenger_type?: string;
  adults_count?: number;
  children_count?: number;
   // Starring and notes
   is_starred?: boolean;
   internal_notes?: string | null;
   // Refund info
   refund_status?: string | null;
   refund_amount?: number | null;
   refund_method?: string | null;
   refund_by?: string | null;
   refund_at?: string | null;
   // Ticket info
   ticket_file_path?: string | null;
   ticket_uploaded_at?: string | null;
   // Cancel request
   cancel_requested?: boolean | null;
   cancel_requested_at?: string | null;
   // Ticket payment
   ticket_payment_status?: string | null;
   ticket_payment_amount?: number | null;
   ticket_payment_link?: string | null;
   ticket_paid_at?: string | null;
}

interface Employee {
  user_id: string;
  name: string;
  role: string;
}



interface ReservationsTableProps {
  reservations: Reservation[];
  loading: boolean;
  onRefresh: () => void;
  isAdmin: boolean;
}

export const ReservationsTable = ({ reservations, loading, onRefresh, isAdmin }: ReservationsTableProps) => {
  const { user } = useAuth();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isPassengerDialogOpen, setIsPassengerDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
   const [filterWagonType, setFilterWagonType] = useState<string>('all');
   const [filterApprover, setFilterApprover] = useState<string>('all');
   const [filterAssignedEmployee, setFilterAssignedEmployee] = useState<string>('all');
   const [filterDateRange, setFilterDateRange] = useState<string>('all');
   const [filterStarred, setFilterStarred] = useState<string>('all');
   const [filterCancelRequest, setFilterCancelRequest] = useState<string>('all');
   const [sortBy, setSortBy] = useState<string>('created_at_desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
   // Internal notes dialog
   const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
   const [editingNotes, setEditingNotes] = useState<string>('');
   const [savingNotes, setSavingNotes] = useState(false);
   
   // Refund dialog
   const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
   const [refundReservation, setRefundReservation] = useState<Reservation | null>(null);
 
  // Ticket upload dialog
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [ticketReservation, setTicketReservation] = useState<Reservation | null>(null);
 
  // Ticket payment dialog
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentReservation, setPaymentReservation] = useState<Reservation | null>(null);

  // Status change confirmation
  const [pendingStatusLocal, setPendingStatusLocal] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (error) throw error;

      const employeesWithNames: Employee[] = [];
      for (const role of roles || []) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', role.user_id)
          .maybeSingle();

        employeesWithNames.push({
          user_id: role.user_id,
          name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'بدون نام' : 'بدون نام',
          role: role.role,
        });
      }
      setEmployees(employeesWithNames);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Toggle employee assignment for a reservation (multi-select)
  const toggleEmployeeAssignment = async (reservationId: string, employeeId: string, currentAssignees: string[]) => {
    try {
      setUpdatingId(reservationId);
      const isAssigned = currentAssignees.includes(employeeId);
      const newAssignees = isAssigned
        ? currentAssignees.filter(id => id !== employeeId)
        : [...currentAssignees, employeeId];

      // Update both the new array column and legacy assigned_to for backward compatibility
      const { error } = await supabase
        .from('reservations')
        .update({
          assigned_employees: newAssignees,
          assigned_to: newAssignees.length > 0 ? newAssignees[0] : null,
          assigned_at: newAssignees.length > 0 ? new Date().toISOString() : null,
        })
        .eq('id', reservationId);

      if (error) throw error;

      toast.success(isAssigned ? 'کارمند حذف شد' : 'کارمند اضافه شد');
      onRefresh();
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast.error('خطا در به‌روزرسانی');
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper to get employee names from IDs
  const getEmployeeNames = (employeeIds: string[]) => {
    return employeeIds
      .map(id => employees.find(e => e.user_id === id)?.name || '')
      .filter(Boolean)
      .join('، ');
  };

  // Request status change (opens confirmation dialog)
  const requestStatusChange = (newStatus: string) => {
    setPendingStatusLocal(newStatus);
    setIsConfirmDialogOpen(true);
  };

  // Check if employee can change status (only if they haven't changed it before)
  const canEmployeeChangeStatus = (reservation: Reservation) => {
    // Admin can always change
    if (isAdmin) return true;
    // Employee can only change if they haven't changed it before (confirmed_by is not their id)
    return reservation.confirmed_by !== user?.id;
  };

  // Confirm and apply status change
  const confirmStatusChange = async () => {
    if (!selectedReservation || !pendingStatusLocal) return;
    
    try {
      // Both admin and employee can apply changes directly
      const updateData: any = { 
        status: pendingStatusLocal,
        confirmed_by: user?.id || null,
        confirmed_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('reservations')
        .update(updateData)
        .eq('id', selectedReservation.id);

      if (error) throw error;

      toast.success('وضعیت رزرو بروزرسانی شد');
      onRefresh();
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast.error('خطا در بروزرسانی وضعیت');
    } finally {
      setIsConfirmDialogOpen(false);
      setPendingStatusLocal(null);
    }
  };

  // No longer needed - removed pending approval system

  const cancelStatusChange = () => {
    setIsConfirmDialogOpen(false);
    setPendingStatusLocal(null);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      confirmed: 'تأیید شده',
      pending: 'در انتظار',
      cancelled: 'لغو شده',
    };
    return labels[status] || status;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-success/20 text-success border-success/30',
      pending: 'bg-gold/20 text-gold-dark border-gold/30',
      cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
    };
    const labels: Record<string, string> = {
      confirmed: 'تأیید شده',
      pending: 'در انتظار',
      cancelled: 'لغو شده',
    };
    return (
      <Badge variant="outline" className={styles[status] || styles.pending}>
        {labels[status] || status}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fa-IR').format(date);
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const formattedDate = new Intl.DateTimeFormat('fa-IR').format(date);
    const formattedTime = new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit' }).format(date);
    return { date: formattedDate, time: formattedTime };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // Get time range label based on departure time
  const getTimeRangeLabel = (time: string | null) => {
    if (!time) return 'نامشخص';
    const hour = parseInt(time.split(':')[0], 10);
    if (hour >= 0 && hour < 6) return '۰-۶';
    if (hour >= 6 && hour < 12) return '۶-۱۲';
    if (hour >= 12 && hour < 18) return '۱۲-۱۸';
    return '۱۸-۲۴';
  };

  const getCityName = (key: string) => getCityNameFa(key);

  const handleViewPassengers = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsPassengerDialogOpen(true);
  };

  const filteredReservations = reservations.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
     const matchesWagonType = filterWagonType === 'all' || 
       (r.selected_wagon_types && r.selected_wagon_types.includes(filterWagonType)) ||
       r.wagon_type === filterWagonType;
     const matchesApprover = filterApprover === 'all' || 
       (filterApprover === 'empty' && !r.confirmer_name && !r.pending_status_by_name) ||
       (filterApprover === 'has' && (r.confirmer_name || r.pending_status_by_name));
     const matchesAssignedEmployee = filterAssignedEmployee === 'all' ||
       (filterAssignedEmployee === 'none' && (!r.assigned_employees || r.assigned_employees.length === 0)) ||
       (r.assigned_employees && r.assigned_employees.includes(filterAssignedEmployee));
    const matchesSearch =
      searchQuery === '' ||
      r.reservation_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.passengers &&
        r.passengers.some(
          p =>
            p.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.nationalId?.includes(searchQuery) ||
            p.mobile?.includes(searchQuery)
        ));
      
      // Early return removed to allow subsequent filters to run
     
     // Date range filter
     let matchesDateRange = true;
     if (filterDateRange !== 'all') {
       const today = new Date();
       today.setHours(0, 0, 0, 0);
       const departureDate = new Date(r.departure_date);
       departureDate.setHours(0, 0, 0, 0);
       
       const tomorrow = new Date(today);
       tomorrow.setDate(tomorrow.getDate() + 1);
       
       const weekEnd = new Date(today);
       weekEnd.setDate(weekEnd.getDate() + 7);
       
       if (filterDateRange === 'today') {
         matchesDateRange = departureDate.getTime() === today.getTime();
       } else if (filterDateRange === 'tomorrow') {
         matchesDateRange = departureDate.getTime() === tomorrow.getTime();
       } else if (filterDateRange === 'week') {
         matchesDateRange = departureDate >= today && departureDate <= weekEnd;
       } else if (filterDateRange === 'past') {
         matchesDateRange = departureDate < today;
       }
     }
     
     // Starred filter
     const matchesStarred = filterStarred === 'all' || 
       (filterStarred === 'starred' && r.is_starred) ||
       (filterStarred === 'unstarred' && !r.is_starred);
     
     // Cancel request filter
     const matchesCancelRequest = filterCancelRequest === 'all' ||
       (filterCancelRequest === 'requested' && r.cancel_requested && r.status !== 'cancelled') ||
       (filterCancelRequest === 'none' && !r.cancel_requested);
     
     return matchesStatus && matchesWagonType && matchesApprover && matchesAssignedEmployee && matchesSearch && matchesDateRange && matchesStarred && matchesCancelRequest;
   });
   
   // Sorting
   const sortedReservations = [...filteredReservations].sort((a, b) => {
     switch (sortBy) {
       case 'created_at_desc':
         return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
       case 'created_at_asc':
         return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
       case 'departure_date_desc':
         return new Date(b.departure_date).getTime() - new Date(a.departure_date).getTime();
       case 'departure_date_asc':
         return new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime();
       case 'passenger_count_desc':
         return ((b.adults_count || 1) + (b.children_count || 0)) - ((a.adults_count || 1) + (a.children_count || 0));
       case 'passenger_count_asc':
         return ((a.adults_count || 1) + (a.children_count || 0)) - ((b.adults_count || 1) + (b.children_count || 0));
       case 'starred':
         return (b.is_starred ? 1 : 0) - (a.is_starred ? 1 : 0);
       default:
         return 0;
     }
   });
   
   // Toggle star
   const toggleStar = async (reservationId: string, currentStarred: boolean) => {
     try {
       setUpdatingId(reservationId);
       const { error } = await supabase
         .from('reservations')
         .update({ is_starred: !currentStarred })
         .eq('id', reservationId);
       
       if (error) throw error;
       toast.success(currentStarred ? 'ستاره برداشته شد' : 'ستاره‌گذاری شد');
       onRefresh();
     } catch (error) {
       console.error('Error toggling star:', error);
       toast.error('خطا در ستاره‌گذاری');
     } finally {
       setUpdatingId(null);
     }
   };
   
   // Save internal notes
   const saveInternalNotes = async () => {
     if (!selectedReservation) return;
     
     try {
       setSavingNotes(true);
       const { error } = await supabase
         .from('reservations')
         .update({ internal_notes: editingNotes })
         .eq('id', selectedReservation.id);
       
       if (error) throw error;
       toast.success('یادداشت ذخیره شد');
       setIsNotesDialogOpen(false);
       onRefresh();
     } catch (error) {
       console.error('Error saving notes:', error);
       toast.error('خطا در ذخیره یادداشت');
     } finally {
       setSavingNotes(false);
     }
   };
   
   // Open notes dialog
   const openNotesDialog = (reservation: Reservation) => {
     setSelectedReservation(reservation);
     setEditingNotes(reservation.internal_notes || '');
     setIsNotesDialogOpen(true);
   };
    
   // Open refund dialog
   const openRefundDialog = (reservation: Reservation) => {
     setRefundReservation(reservation);
     setIsRefundDialogOpen(true);
   };
   
   // Open ticket upload dialog
   const openTicketDialog = (reservation: Reservation) => {
     setTicketReservation(reservation);
     setIsTicketDialogOpen(true);
   };

   // Open ticket payment dialog
   const openPaymentDialog = (reservation: Reservation) => {
     setPaymentReservation(reservation);
     setIsPaymentDialogOpen(true);
   };
 
   // Export to Excel
   const exportToExcel = () => {
     const headers = ['کد رزرو', 'تاریخ رزرو', 'مبدأ', 'مقصد', 'تاریخ حرکت', 'بزرگسال', 'کودک', 'نوع سالن', 'وضعیت', 'یادداشت داخلی'];
     const rows = sortedReservations.map(r => [
       r.reservation_code,
       formatDateTime(r.created_at).date + ' ' + formatDateTime(r.created_at).time,
       getCityName(r.origin),
       getCityName(r.destination),
       formatDate(r.departure_date),
       r.adults_count || 1,
       r.children_count || 0,
       r.wagon_type || 'نامشخص',
       getStatusLabel(r.status),
       r.internal_notes || ''
     ]);
     
     const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
     const link = document.createElement('a');
     link.href = URL.createObjectURL(blob);
     link.download = `reservations_${new Date().toISOString().split('T')[0]}.csv`;
     link.click();
     toast.success('فایل اکسل دانلود شد');
   };

  return (
    <div dir="rtl">
      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
           <div className="flex flex-col gap-4">
             {/* Row 1: Search */}
            <div className="flex-1">
              <Input
                placeholder="جستجو با کد رزرو، نام مسافر یا شماره موبایل..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-10"
              />
            </div>

             {/* Row 2: Filters */}
             <div className="flex flex-wrap items-center gap-3">
               {/* نوع سالن */}
               <Select value={filterWagonType} onValueChange={setFilterWagonType}>
                 <SelectTrigger className="w-[150px] h-9">
                   <SelectValue placeholder="نوع سالن" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">همه سالن‌ها</SelectItem>
                   <SelectItem value="6تخته3ستاره">۶ تخته ۳ ستاره</SelectItem>
                   <SelectItem value="4تخته4ستاره">۴ تخته ۴ ستاره</SelectItem>
                   <SelectItem value="4تخته5ستاره">۴ تخته ۵ ستاره</SelectItem>
                 </SelectContent>
               </Select>
 
               {/* وضعیت - پیش‌فرض در انتظار */}
               <Select value={filterStatus} onValueChange={setFilterStatus}>
                 <SelectTrigger className="w-[140px] h-9">
                   <SelectValue placeholder="وضعیت" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                   <SelectItem value="pending">در انتظار</SelectItem>
                   <SelectItem value="confirmed">تأیید شده</SelectItem>
                   <SelectItem value="cancelled">لغو شده</SelectItem>
                 </SelectContent>
               </Select>
 
               {/* تأییدکننده */}
               <Select value={filterApprover} onValueChange={setFilterApprover}>
                 <SelectTrigger className="w-[150px] h-9">
                   <SelectValue placeholder="تأییدکننده" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">همه</SelectItem>
                   <SelectItem value="empty">تأییدکننده خالی</SelectItem>
                   <SelectItem value="has">دارای تأییدکننده</SelectItem>
                 </SelectContent>
               </Select>
 
               {/* در حال پیگیری - انتخاب کارمند */}
               <Select value={filterAssignedEmployee} onValueChange={setFilterAssignedEmployee}>
                 <SelectTrigger className="w-[160px] h-9">
                   <SelectValue placeholder="پیگیری توسط" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">همه</SelectItem>
                   <SelectItem value="none">بدون پیگیری</SelectItem>
                   {employees.map((emp) => (
                     <SelectItem key={emp.user_id} value={emp.user_id}>
                       {emp.name}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
 
               {/* Reset Filters Button */}
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => {
                   setFilterWagonType('all');
                   setFilterStatus('all');
                   setFilterApprover('all');
                   setFilterAssignedEmployee('all');
                   setFilterDateRange('all');
                   setFilterStarred('all');
                   setFilterCancelRequest('all');
                   setSearchQuery('');
                 }}
                 className="h-9 text-destructive hover:text-destructive/80 gap-1"
               >
                 <span className="material-symbols-outlined text-sm">filter_alt_off</span>
                 پاک کردن فیلترها
               </Button>
               
               {/* تاریخ حرکت */}
               <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                 <SelectTrigger className="w-[140px] h-9">
                   <SelectValue placeholder="تاریخ حرکت" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">همه تاریخ‌ها</SelectItem>
                   <SelectItem value="today">امروز</SelectItem>
                   <SelectItem value="tomorrow">فردا</SelectItem>
                   <SelectItem value="week">هفته آینده</SelectItem>
                   <SelectItem value="past">گذشته</SelectItem>
                 </SelectContent>
               </Select>
 
               {/* ستاره‌دار */}
               <Select value={filterStarred} onValueChange={setFilterStarred}>
                 <SelectTrigger className="w-[130px] h-9">
                   <SelectValue placeholder="ستاره" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">همه</SelectItem>
                   <SelectItem value="starred">⭐ ستاره‌دار</SelectItem>
                   <SelectItem value="unstarred">بدون ستاره</SelectItem>
                 </SelectContent>
               </Select>

               {/* درخواست لغو */}
               <Select value={filterCancelRequest} onValueChange={setFilterCancelRequest}>
                 <SelectTrigger className="w-[160px] h-9">
                   <SelectValue placeholder="درخواست لغو" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">همه</SelectItem>
                   <SelectItem value="requested">⚠️ درخواست لغو</SelectItem>
                   <SelectItem value="none">بدون درخواست</SelectItem>
                 </SelectContent>
               </Select>
               </div>
           </div>
         </CardContent>
       </Card>
 
       {/* Reservations Table */}
       <Card>
         <CardHeader>
           <div className="flex items-center justify-between flex-wrap gap-4">
             <CardTitle className="flex items-center gap-2">
               <span className="material-symbols-outlined">list_alt</span>
               لیست رزروها
               <Badge variant="secondary" className="text-sm font-bold">
                 {sortedReservations.length} رزرو
               </Badge>
             </CardTitle>
             <div className="flex items-center gap-3">
               {/* Sort */}
               <Select value={sortBy} onValueChange={setSortBy}>
                 <SelectTrigger className="w-[180px] h-9">
                   <span className="material-symbols-outlined text-sm ml-1">sort</span>
                   <SelectValue placeholder="مرتب‌سازی" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="created_at_desc">جدیدترین رزرو</SelectItem>
                   <SelectItem value="created_at_asc">قدیمی‌ترین رزرو</SelectItem>
                   <SelectItem value="departure_date_asc">نزدیک‌ترین حرکت</SelectItem>
                   <SelectItem value="departure_date_desc">دورترین حرکت</SelectItem>
                   <SelectItem value="passenger_count_desc">بیشترین مسافر</SelectItem>
                   <SelectItem value="passenger_count_asc">کمترین مسافر</SelectItem>
                   <SelectItem value="starred">ستاره‌دارها اول</SelectItem>
                 </SelectContent>
               </Select>
               {/* Export Button */}
               <Button
                 variant="outline"
                 size="sm"
                 onClick={exportToExcel}
                 className="h-9 gap-1"
               >
                 <span className="material-symbols-outlined text-sm">download</span>
                 خروجی اکسل
               </Button>
             </div>
           </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-24" />
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                     <TableHead className="text-right w-12">⭐</TableHead>
                    <TableHead className="text-right">کد رزرو</TableHead>
                    <TableHead className="text-right">تاریخ رزرو</TableHead>
                    <TableHead className="text-right">مسیر</TableHead>
                    <TableHead className="text-right">تاریخ حرکت</TableHead>
                    <TableHead className="text-right">تعداد</TableHead>
                    <TableHead className="text-right">فیلترها</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                    <TableHead className="text-right">بلیط / بازگشت</TableHead>
                    <TableHead className="text-right">تأییدکننده</TableHead>
                    <TableHead className="text-right">در حال پیگیری</TableHead>
                    <TableHead className="text-right">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                   {sortedReservations.map(reservation => (
                     <TableRow key={reservation.id} className={reservation.is_starred ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                       <TableCell>
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-8 w-8"
                           onClick={() => toggleStar(reservation.id, !!reservation.is_starred)}
                           disabled={updatingId === reservation.id}
                         >
                           <span className={`material-symbols-outlined text-lg ${reservation.is_starred ? 'text-amber-500' : 'text-muted-foreground'}`}>
                             {reservation.is_starred ? 'star' : 'star_outline'}
                           </span>
                         </Button>
                       </TableCell>
                      <TableCell className="font-medium text-primary">
                        {reservation.reservation_code}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex flex-col">
                          <span>{formatDateTime(reservation.created_at).date}</span>
                          <span className="text-xs text-muted-foreground">{formatDateTime(reservation.created_at).time}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {getCityName(reservation.origin)} به {getCityName(reservation.destination)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(reservation.departure_date)}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        <span className="text-primary">{reservation.adults_count || 1}ب</span>
                        <span className="text-muted-foreground">{reservation.children_count || 0}خ</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{reservation.wagon_type || 'نامشخص'}</span>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                              >
                                <span className="material-symbols-outlined text-sm text-muted-foreground">info</span>
                              </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-72 p-4" align="start" dir="rtl">
                            <div className="space-y-4">
                              {/* نوع سالن - Selected wagon types */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  <span className="material-symbols-outlined text-base text-primary">bed</span>
                                  <span>نوع سالن</span>
                                </div>
                                {reservation.selected_wagon_types && reservation.selected_wagon_types.length > 0 ? (
                                  <div className="space-y-1">
                                    {reservation.selected_wagon_types.map((type, idx) => (
                                      <div key={idx} className="bg-primary/10 text-primary rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        {type === '6تخته3ستاره' ? '۶ تخته ۳ ستاره' : 
                                         type === '4تخته4ستاره' ? '۴ تخته ۴ ستاره' : 
                                         type === '4تخته5ستاره' ? '۴ تخته ۵ ستاره' : type}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="bg-muted/50 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                                    فیلتری انتخاب نشده
                                  </div>
                                )}
                              </div>

                              {/* زمان حرکت - Selected time slots */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  <span className="material-symbols-outlined text-base text-primary">schedule</span>
                                  <span>بازه زمانی</span>
                                </div>
                                {reservation.selected_time_slots && reservation.selected_time_slots.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {reservation.selected_time_slots.map((slot, idx) => (
                                      <div key={idx} className="bg-primary/10 text-primary rounded-lg px-3 py-2 text-sm font-medium">
                                        ⏰ {slot.replace('-', ' تا ')}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="bg-muted/50 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                                    فیلتری انتخاب نشده
                                  </div>
                                )}
                              </div>

                              {/* بازه قیمت - Price range */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  <span className="material-symbols-outlined text-base text-primary">payments</span>
                                  <span>بازه قیمت</span>
                                </div>
                                {reservation.price_range_min && reservation.price_range_max ? (
                                  <div className="bg-success/10 text-success rounded-lg px-3 py-2 text-sm font-bold flex items-center justify-between">
                                    <span>{formatPrice(reservation.price_range_min)}</span>
                                    <span className="text-muted-foreground mx-2">تا</span>
                                    <span>{formatPrice(reservation.price_range_max)}</span>
                                  </div>
                                ) : (
                                  <div className="bg-muted/50 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                                    فیلتری انتخاب نشده
                                  </div>
                                )}
                              </div>

                              {/* توضیحات مشتری - Customer Notes */}
                              {reservation.customer_notes && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm font-medium">
                                    <span className="material-symbols-outlined text-base text-primary">notes</span>
                                    <span>توضیحات مسافر</span>
                                  </div>
                                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 text-sm">
                                    {reservation.customer_notes}
                                  </div>
                                </div>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(reservation.status)}
                          {reservation.cancel_requested && reservation.status !== 'cancelled' && (
                            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 text-[10px] gap-1">
                              <span className="material-symbols-outlined text-xs">warning</span>
                              درخواست لغو
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {/* Pending: show payment button, Confirmed: show ticket upload, Cancelled: show refund */}
                        {reservation.status === 'pending' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-7 text-xs gap-1 ${
                              reservation.ticket_payment_status === 'paid' 
                                ? 'text-success border-success/30 hover:bg-success/10' 
                                : 'text-primary border-primary/30 hover:bg-primary/10'
                            }`}
                            onClick={() => openPaymentDialog(reservation)}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {reservation.ticket_payment_status === 'paid' ? 'check_circle' : 'payments'}
                            </span>
                            {reservation.ticket_payment_status === 'paid' ? 'پرداخت شده' : 'پرداخت وجه'}
                          </Button>
                        ) : reservation.status === 'confirmed' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-7 text-xs gap-1 ${reservation.ticket_file_path ? 'text-success border-success/30 hover:bg-success/10' : ''}`}
                            onClick={() => openTicketDialog(reservation)}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {reservation.ticket_file_path ? 'task' : 'upload_file'}
                            </span>
                            {reservation.ticket_file_path ? 'بلیط آپلود شده' : 'ارسال بلیط'}
                          </Button>
                        ) : reservation.status === 'cancelled' && !reservation.refund_status ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                            onClick={() => openRefundDialog(reservation)}
                          >
                            <span className="material-symbols-outlined text-sm">payments</span>
                            بازگشت وجه
                          </Button>
                        ) : reservation.status === 'cancelled' && reservation.refund_status === 'completed' ? (
                          <div className="flex items-center gap-1 text-xs text-success">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            برگشت شد
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {reservation.pending_status_by_name ? (
                          <div className="flex items-center gap-1 text-sm">
                            <span className="material-symbols-outlined text-muted-foreground text-sm">
                              person
                            </span>
                            <span>{reservation.pending_status_by_name}</span>
                          </div>
                        ) : reservation.confirmer_name ? (
                          <div className="flex items-center gap-1 text-sm">
                            <span className="material-symbols-outlined text-muted-foreground text-sm">
                              person
                            </span>
                            <span>{reservation.confirmer_name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 min-w-[120px] justify-between gap-1"
                              disabled={updatingId === reservation.id}
                            >
                              {(reservation.assigned_employees?.length || 0) > 0 ? (
                                <div className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-sm">group</span>
                                  <span className="truncate max-w-[100px]">
                                    {getEmployeeNames(reservation.assigned_employees || [])}
                                  </span>
                                  <Badge variant="secondary" className="text-xs px-1">
                                    {reservation.assigned_employees?.length}
                                  </Badge>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <span className="material-symbols-outlined text-sm">person_add</span>
                                  <span>انتخاب کارمند</span>
                                </div>
                              )}
                              <span className="material-symbols-outlined text-sm">expand_more</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2" align="start" dir="rtl">
                            <div className="space-y-1">
                              <p className="text-sm font-medium mb-2 text-muted-foreground">انتخاب کارمند</p>
                              {employees.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-2">کارمندی یافت نشد</p>
                              ) : (
                                employees.map((employee) => {
                                  const currentAssignees = reservation.assigned_employees || [];
                                  const isChecked = currentAssignees.includes(employee.user_id);
                                  return (
                                    <div
                                      key={employee.user_id}
                                      className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
                                      onClick={() => toggleEmployeeAssignment(reservation.id, employee.user_id, currentAssignees)}
                                    >
                                      <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={() => toggleEmployeeAssignment(reservation.id, employee.user_id, currentAssignees)}
                                      />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium">{employee.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {employee.role === 'admin' ? 'مدیر' : 'کارمند'}
                                        </p>
                                      </div>
                                      {employee.user_id === user?.id && (
                                        <Badge variant="secondary" className="text-xs">شما</Badge>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPassengers(reservation)}
                          className="h-8 w-8 p-0"
                          title="مشاهده جزئیات"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </Button>
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => openNotesDialog(reservation)}
                           className="h-8 w-8 p-0"
                           title="یادداشت داخلی"
                         >
                           <span className={`material-symbols-outlined text-lg ${reservation.internal_notes ? 'text-primary' : 'text-muted-foreground'}`}>
                             {reservation.internal_notes ? 'sticky_note_2' : 'note_add'}
                           </span>
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredReservations.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  رزروی یافت نشد
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Passenger Details Dialog */}
      <Dialog open={isPassengerDialogOpen} onOpenChange={setIsPassengerDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0" dir="rtl">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-start justify-between">
            <DialogHeader className="flex-1">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <span className="material-symbols-outlined">visibility</span>
                  جزئیات رزرو
                </DialogTitle>
                {/* Mobile number in header */}
                {selectedReservation?.passengers?.[0]?.mobile && (
                  <a 
                    href={`tel:${selectedReservation.passengers[0].mobile}`}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors ml-4"
                    dir="ltr"
                  >
                    <span className="material-symbols-outlined text-base">phone</span>
                    <span className="font-medium text-sm">{selectedReservation.passengers[0].mobile}</span>
                  </a>
                )}
              </div>
              <DialogDescription>کد رزرو: {selectedReservation?.reservation_code}</DialogDescription>
            </DialogHeader>
            <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <span className="material-symbols-outlined text-xl">close</span>
              <span className="sr-only">بستن</span>
            </DialogClose>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(80vh-80px)] px-6 pb-6">
          {selectedReservation && (
            <div className="space-y-6">
              {/* Section 1: Summary Info - مشخصات کلی */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                {/* Row 1: Route + Date */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">train</span>
                    <span className="font-bold text-lg">
                      {getCityName(selectedReservation.origin)} به {getCityName(selectedReservation.destination)}
                    </span>
                  </div>
                  <span className="text-muted-foreground">|</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">calendar_month</span>
                    <span className="font-medium">{formatDate(selectedReservation.departure_date)}</span>
                  </div>
                </div>

                {/* Row 2: Passenger Count Breakdown */}
                <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-base">group</span>
                    <span className="text-muted-foreground">بزرگسال:</span>
                    <span className="font-bold">{selectedReservation.adults_count || 1}</span>
                  </div>
                  <span className="text-muted-foreground">|</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-base">child_care</span>
                    <span className="text-muted-foreground">کودک:</span>
                    <span className="font-bold">{selectedReservation.children_count || 0}</span>
                  </div>
                  {selectedReservation.passenger_type && selectedReservation.passenger_type !== 'regular' && (
                    <>
                      <span className="text-muted-foreground">|</span>
                      <div className="flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded">
                        <span className="material-symbols-outlined text-sm">star</span>
                        <span className="font-medium">
                          {selectedReservation.passenger_type === 'men' ? 'ویژه برادران' : 'ویژه خواهران'}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Row 3: Special Options */}
                {(selectedReservation.private_compartment || selectedReservation.foreign_national) && (
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/50">
                    {selectedReservation.private_compartment && (
                      <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-0.5 rounded text-sm">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        <span className="font-medium">کوپه دربست</span>
                      </div>
                    )}
                    {selectedReservation.foreign_national && (
                      <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded text-sm">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        <span className="font-medium">اتباع خارجی</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section 3: Applied Filters - فیلترهای اعمالی */}
              <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-gold-dark">filter_alt</span>
                  </div>
                  <h3 className="font-bold text-lg">فیلترهای اعمالی توسط مسافر</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Wagon Types */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="material-symbols-outlined text-base text-primary">bed</span>
                      <span>نوع سالن</span>
                    </div>
                    {selectedReservation.selected_wagon_types && selectedReservation.selected_wagon_types.length > 0 ? (
                      <div className="space-y-1">
                        {selectedReservation.selected_wagon_types.map((type, idx) => (
                          <div key={idx} className="bg-primary/10 text-primary rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            {type === '6تخته3ستاره' ? '۶ تخته ۳ ستاره' : 
                             type === '4تخته4ستاره' ? '۴ تخته ۴ ستاره' : 
                             type === '4تخته5ستاره' ? '۴ تخته ۵ ستاره' : type}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-muted/50 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                        فیلتری انتخاب نشده
                      </div>
                    )}
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="material-symbols-outlined text-base text-primary">schedule</span>
                      <span>بازه زمانی</span>
                    </div>
                    {selectedReservation.selected_time_slots && selectedReservation.selected_time_slots.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedReservation.selected_time_slots.map((slot, idx) => (
                          <div key={idx} className="bg-primary/10 text-primary rounded-lg px-3 py-2 text-sm font-medium">
                            ⏰ {slot.replace('-', ' تا ')}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-muted/50 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                        فیلتری انتخاب نشده
                      </div>
                    )}
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="material-symbols-outlined text-base text-primary">payments</span>
                      <span>بازه قیمت</span>
                    </div>
                    {selectedReservation.price_range_min && selectedReservation.price_range_max ? (
                      <div className="bg-success/10 text-success rounded-lg px-3 py-2 text-sm font-bold flex items-center gap-2">
                        <span>{formatPrice(selectedReservation.price_range_min)}</span>
                        <span className="text-muted-foreground">تا</span>
                        <span>{formatPrice(selectedReservation.price_range_max)}</span>
                      </div>
                    ) : (
                      <div className="bg-muted/50 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                        فیلتری انتخاب نشده
                      </div>
                    )}
                  </div>

                  {/* Customer Notes */}
                  {selectedReservation.customer_notes && (
                    <div className="space-y-2 col-span-full">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="material-symbols-outlined text-base text-primary">notes</span>
                        <span>توضیحات مسافر</span>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 text-sm">
                        {selectedReservation.customer_notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Passengers List - اسامی مسافران */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">group</span>
                  </div>
                  <h3 className="font-bold text-lg">اسامی و مشخصات مسافران</h3>
                  <Badge variant="outline" className="mr-auto">
                    {selectedReservation.passengers?.length || 0} نفر
                  </Badge>
                </div>

                {selectedReservation.passengers && selectedReservation.passengers.length > 0 ? (
                  <div className="space-y-3">
                    {selectedReservation.passengers.map((passenger, index) => (
                      <div key={passenger.id || index} className="p-4 bg-card border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium flex items-center gap-2">
                            <span
                              className={`material-symbols-outlined ${
                                passenger.isChild ? 'text-gold' : 'text-primary'
                              }`}
                            >
                              {passenger.isChild ? 'child_care' : 'person'}
                            </span>
                            مسافر {index + 1}
                            {passenger.isChild && (
                              <Badge variant="outline" className="text-xs">
                                خردسال
                              </Badge>
                            )}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-muted-foreground text-base">badge</span>
                            <span className="text-muted-foreground min-w-[80px]">نام:</span>
                            <span className="font-medium">{passenger.firstName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-muted-foreground text-base">badge</span>
                            <span className="text-muted-foreground min-w-[80px]">نام خانوادگی:</span>
                            <span className="font-medium">{passenger.lastName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-muted-foreground text-base">
                              credit_card
                            </span>
                            <span className="text-muted-foreground min-w-[80px]">کد ملی:</span>
                            <span className="font-medium">{passenger.nationalId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-muted-foreground text-base">
                              cake
                            </span>
                            <span className="text-muted-foreground min-w-[80px]">تاریخ تولد:</span>
                            <span className="font-medium">{passenger.birthDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">اطلاعات مسافران ثبت نشده</p>
                )}
              </div>

              {/* Status Update with Confirmation */}
              <div className="pt-4 border-t border-border space-y-3">
                <span className="text-sm text-muted-foreground block">تغییر وضعیت رزرو</span>
                
                <div className="flex items-center gap-3">
                  <Select
                    value={pendingStatusLocal || selectedReservation.status}
                    onValueChange={requestStatusChange}
                    disabled={!canEmployeeChangeStatus(selectedReservation)}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">تأیید شده</SelectItem>
                      <SelectItem value="pending">در انتظار</SelectItem>
                      <SelectItem value="cancelled">لغو شده</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Show message if employee already changed status */}
                  {!canEmployeeChangeStatus(selectedReservation) && (
                    <span className="text-sm text-muted-foreground">
                      شما قبلاً وضعیت این رزرو را تغییر داده‌اید
                    </span>
                  )}
                </div>

                {/* Show who confirmed */}
                {selectedReservation.confirmer_name && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    <span className="material-symbols-outlined text-base">verified_user</span>
                    <span>آخرین تغییر توسط:</span>
                    <span className="font-medium text-foreground">{selectedReservation.confirmer_name}</span>
                    {selectedReservation.confirmed_at && (
                      <span className="text-xs">
                        ({new Intl.DateTimeFormat('fa-IR').format(new Date(selectedReservation.confirmed_at))})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Change Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              تأیید تغییر وضعیت
            </DialogTitle>
            <DialogDescription>
              {isAdmin 
                ? `آیا از تغییر وضعیت رزرو به "${pendingStatusLocal ? getStatusLabel(pendingStatusLocal) : ''}" اطمینان دارید؟`
                : `درخواست تغییر وضعیت به "${pendingStatusLocal ? getStatusLabel(pendingStatusLocal) : ''}" برای تأیید مدیر ارسال می‌شود.`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-muted-foreground">confirmation_number</span>
              <span>کد رزرو:</span>
              <span className="font-medium">{selectedReservation?.reservation_code}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-muted-foreground">person</span>
              <span>تغییردهنده:</span>
              <span className="font-medium">{employees.find(e => e.user_id === user?.id)?.name || 'شما'}</span>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={cancelStatusChange}>
              انصراف
            </Button>
            <Button onClick={confirmStatusChange} className="gap-1">
              <span className="material-symbols-outlined text-base">check</span>
              تأیید تغییر
            </Button>
          </div>
        </DialogContent>
      </Dialog>
       
       {/* Internal Notes Dialog */}
       <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
         <DialogContent className="max-w-md" dir="rtl">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2">
               <span className="material-symbols-outlined">sticky_note_2</span>
               یادداشت داخلی
             </DialogTitle>
             <DialogDescription>
               کد رزرو: {selectedReservation?.reservation_code}
             </DialogDescription>
           </DialogHeader>
           <div className="space-y-4">
             <Textarea
               placeholder="یادداشت داخلی را وارد کنید... (فقط کارمندان می‌بینند)"
               value={editingNotes}
               onChange={(e) => setEditingNotes(e.target.value)}
               className="min-h-[120px] resize-none"
               maxLength={1000}
             />
             <p className="text-xs text-muted-foreground text-left" dir="ltr">
               {editingNotes.length}/1000
             </p>
             <div className="flex gap-2 justify-end">
               <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)}>
                 انصراف
               </Button>
               <Button onClick={saveInternalNotes} disabled={savingNotes}>
                 {savingNotes ? 'در حال ذخیره...' : 'ذخیره یادداشت'}
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
       
       {/* Refund Dialog */}
       <RefundDialog
         open={isRefundDialogOpen}
         onOpenChange={setIsRefundDialogOpen}
         reservation={refundReservation}
         onRefundComplete={onRefresh}
       />
       
        {/* Ticket Upload Dialog */}
        <TicketUploadDialog
          open={isTicketDialogOpen}
          onOpenChange={setIsTicketDialogOpen}
          reservation={ticketReservation}
          onUploadComplete={onRefresh}
        />

        {/* Ticket Payment Dialog */}
        <TicketPaymentDialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          reservation={paymentReservation}
          onSuccess={onRefresh}
        />
    </div>
  );
};
