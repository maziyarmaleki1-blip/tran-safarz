import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
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
  // Selected filters from search
  selected_wagon_types?: string[];
  selected_time_slots?: string[];
  price_range_min?: number | null;
  price_range_max?: number | null;
  customer_notes?: string | null;
}

interface Employee {
  user_id: string;
  name: string;
  role: string;
}

const cities: Record<string, string> = {
  tehran: 'تهران',
  mashhad: 'مشهد',
  isfahan: 'اصفهان',
  shiraz: 'شیراز',
  tabriz: 'تبریز',
  yazd: 'یزد',
  ahvaz: 'اهواز',
  bandarabbas: 'بندرعباس',
};

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
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
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

  const getCityName = (key: string) => cities[key] || key;

  const handleViewPassengers = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsPassengerDialogOpen(true);
  };

  const filteredReservations = reservations.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      r.reservation_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.passengers &&
        r.passengers.some(
          p =>
            p.firstName?.includes(searchQuery) ||
            p.lastName?.includes(searchQuery) ||
            p.nationalId?.includes(searchQuery)
        ));
    return matchesStatus && matchesSearch;
  });

  return (
    <div dir="rtl">
      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="جستجو با کد رزرو یا نام مسافر..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px] h-10">
                <SelectValue placeholder="وضعیت بلیط" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه</SelectItem>
                <SelectItem value="confirmed">تأیید شده</SelectItem>
                <SelectItem value="pending">در انتظار</SelectItem>
                <SelectItem value="cancelled">لغو شده</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="material-symbols-outlined">list_alt</span>
            لیست رزروها
          </CardTitle>
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
                    <TableHead className="text-right">کد رزرو</TableHead>
                    <TableHead className="text-right">مسیر</TableHead>
                    <TableHead className="text-right">تاریخ</TableHead>
                    <TableHead className="text-right">فیلترها</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                    <TableHead className="text-right">تأییدکننده</TableHead>
                    <TableHead className="text-right">در حال پیگیری</TableHead>
                    <TableHead className="text-right">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map(reservation => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium text-primary">
                        {reservation.reservation_code}
                      </TableCell>
                      <TableCell className="text-sm">
                        {getCityName(reservation.origin)} به {getCityName(reservation.destination)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(reservation.departure_date)}
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
                      <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                      <TableCell>
                        {reservation.confirmer_name ? (
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-symbols-outlined">group</span>
              مشخصات رزرو
            </DialogTitle>
            <DialogDescription>کد رزرو: {selectedReservation?.reservation_code}</DialogDescription>
          </DialogHeader>

          {selectedReservation && (
            <div className="space-y-6">
              {/* Reservation Info */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-muted-foreground text-base">
                      location_on
                    </span>
                    <span>مسیر:</span>
                    <span className="font-medium">
                      {getCityName(selectedReservation.origin)} →{' '}
                      {getCityName(selectedReservation.destination)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-muted-foreground text-base">
                      calendar_today
                    </span>
                    <span>تاریخ:</span>
                    <span className="font-medium">
                      {formatDate(selectedReservation.departure_date)}
                    </span>
                  </div>
                  {selectedReservation.train_name && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-muted-foreground text-base">
                        train
                      </span>
                      <span>قطار:</span>
                      <span className="font-medium">{selectedReservation.train_name}</span>
                    </div>
                  )}
                  {selectedReservation.departure_time && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-muted-foreground text-base">
                        schedule
                      </span>
                      <span>ساعت:</span>
                      <span className="font-medium">{selectedReservation.departure_time}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-border mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">مبلغ کل: </span>
                    <span className="font-bold text-primary">
                      {formatPrice(selectedReservation.total_price)}
                    </span>
                  </div>
                  {selectedReservation.confirmer_name && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">تأیید توسط: </span>
                      <span className="font-medium">{selectedReservation.confirmer_name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Passengers List */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined">group</span>
                  لیست مسافران
                  <span className="text-sm text-muted-foreground font-normal">
                    ({selectedReservation.passengers?.length || 0} نفر)
                  </span>
                </h4>

                {selectedReservation.passengers && selectedReservation.passengers.length > 0 ? (
                  selectedReservation.passengers.map((passenger, index) => (
                    <div key={passenger.id || index} className="p-4 border border-border rounded-lg bg-card">
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
                          <span className="text-muted-foreground min-w-[80px]">نام:</span>
                          <span className="font-medium">
                            {passenger.firstName} {passenger.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-muted-foreground text-base">
                            badge
                          </span>
                          <span className="text-muted-foreground min-w-[80px]">کد ملی:</span>
                          <span className="font-medium">{passenger.nationalId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-muted-foreground text-base">
                            cake
                          </span>
                          <span className="text-muted-foreground min-w-[80px]">تولد:</span>
                          <span className="font-medium">{passenger.birthDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-muted-foreground text-base">
                            phone
                          </span>
                          <span className="text-muted-foreground min-w-[80px]">موبایل:</span>
                          <span className="font-medium">{passenger.mobile || '-'}</span>
                        </div>
                      </div>
                    </div>
                  ))
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
    </div>
  );
};
