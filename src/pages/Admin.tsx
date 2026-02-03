import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isRTL } = useLanguage();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isPassengerDialogOpen, setIsPassengerDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const direction = isRTL ? 'rtl' : 'ltr';

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchAllReservations();
    }
  }, [user, authLoading, navigate]);

  const fetchAllReservations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match our interface
      const transformed = (data || []).map(item => ({
        ...item,
        passengers: Array.isArray(item.passengers) ? item.passengers as unknown as Passenger[] : null,
      }));
      setReservations(transformed as Reservation[]);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('خطا در دریافت رزروها');
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', reservationId);

      if (error) throw error;

      setReservations(prev =>
        prev.map(r => (r.id === reservationId ? { ...r, status: newStatus } : r))
      );
      
      if (selectedReservation?.id === reservationId) {
        setSelectedReservation(prev => prev ? { ...prev, status: newStatus } : null);
      }

      toast.success('وضعیت رزرو بروزرسانی شد');
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast.error('خطا در بروزرسانی وضعیت');
    }
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

  // Stats
  const totalReservations = reservations.length;
  const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length;
  const pendingReservations = reservations.filter(r => r.status === 'pending').length;
  const cancelledReservations = reservations.filter(r => r.status === 'cancelled').length;

  if (authLoading) {
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
          <p className="text-muted-foreground">مدیریت رزروها</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <span className="material-symbols-outlined text-primary text-2xl">description</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalReservations}</p>
                <p className="text-sm text-muted-foreground">کل رزروها</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <span className="material-symbols-outlined text-success text-2xl">check_circle</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{confirmedReservations}</p>
                <p className="text-sm text-muted-foreground">تأیید شده</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gold/10">
                <span className="material-symbols-outlined text-gold text-2xl">schedule</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingReservations}</p>
                <p className="text-sm text-muted-foreground">در انتظار</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <span className="material-symbols-outlined text-destructive text-2xl">cancel</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{cancelledReservations}</p>
                <p className="text-sm text-muted-foreground">لغو شده</p>
              </div>
            </CardContent>
          </Card>
        </div>

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
                      <TableHead className="text-right">مبلغ</TableHead>
                      <TableHead className="text-right">وضعیت</TableHead>
                      <TableHead className="text-right">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations.map(reservation => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium text-primary">
                          {reservation.reservation_code}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-sm">
                              <span className="material-symbols-outlined text-muted-foreground text-sm">
                                location_on
                              </span>
                              <span>{getCityName(reservation.origin)}</span>
                              <span className="text-muted-foreground">←</span>
                              <span>{getCityName(reservation.destination)}</span>
                            </div>
                            {reservation.train_name && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span className="material-symbols-outlined text-xs">train</span>
                                <span>{reservation.train_name}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="material-symbols-outlined text-muted-foreground text-sm">
                              calendar_today
                            </span>
                            {formatDate(reservation.departure_date)}
                          </div>
                          {reservation.departure_time && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {reservation.departure_time}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(reservation.total_price)}
                        </TableCell>
                        <TableCell>{getStatusBadge(reservation.status)}</TableCell>
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
      </main>

      {/* Passenger Details Dialog */}
      <Dialog open={isPassengerDialogOpen} onOpenChange={setIsPassengerDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir={direction}>
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

                <div className="pt-2 border-t border-border mt-2">
                  <span className="text-sm text-muted-foreground">مبلغ کل: </span>
                  <span className="font-bold text-primary">
                    {formatPrice(selectedReservation.total_price)}
                  </span>
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
                          <Label className="text-muted-foreground min-w-[80px]">نام:</Label>
                          <span className="font-medium">
                            {passenger.firstName} {passenger.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-muted-foreground text-base">
                            badge
                          </span>
                          <Label className="text-muted-foreground min-w-[80px]">کد ملی:</Label>
                          <span className="font-medium">{passenger.nationalId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-muted-foreground text-base">
                            cake
                          </span>
                          <Label className="text-muted-foreground min-w-[80px]">تولد:</Label>
                          <span className="font-medium">{passenger.birthDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-muted-foreground text-base">
                            phone
                          </span>
                          <Label className="text-muted-foreground min-w-[80px]">موبایل:</Label>
                          <span className="font-medium">{passenger.mobile || '-'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">اطلاعات مسافران ثبت نشده</p>
                )}
              </div>

              {/* Status Update */}
              <div className="pt-4 border-t border-border">
                <Label className="text-sm text-muted-foreground mb-2 block">تغییر وضعیت رزرو</Label>
                <Select
                  value={selectedReservation.status}
                  onValueChange={value => updateReservationStatus(selectedReservation.id, value)}
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
