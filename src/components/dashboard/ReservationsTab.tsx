import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Reservation } from '@/hooks/useReservations';

const cities: Record<string, string> = {
  tehran: 'تهران', mashhad: 'مشهد', isfahan: 'اصفهان', shiraz: 'شیراز',
  tabriz: 'تبریز', yazd: 'یزد', ahvaz: 'اهواز', bandarabbas: 'بندرعباس',
};

interface ReservationsTabProps {
  reservations: Reservation[];
  loading: boolean;
}

export function ReservationsTab({ reservations, loading }: ReservationsTabProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-success/10 text-success border-success/20',
      pending: 'bg-gold/10 text-gold-dark border-gold/20',
      cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    const labels = { confirmed: 'تأیید شده', pending: 'در انتظار', cancelled: 'لغو شده' };
    return <Badge variant="outline" className={styles[status as keyof typeof styles]}>{labels[status as keyof typeof labels]}</Badge>;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fa-IR').format(date);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-6">رزروهای من</h1>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="size-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-6">رزروهای من</h1>
        <Card className="p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-muted-foreground mb-4">confirmation_number</span>
          <p className="text-muted-foreground">هنوز رزروی ندارید</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-6">رزروهای من</h1>
      {reservations.map((res) => (
        <Card key={res.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary">confirmation_number</span>
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <div><span className="text-muted-foreground">کد: </span>{res.reservation_code}</div>
            <div><span className="text-muted-foreground">مسیر: </span>{cities[res.origin] || res.origin} → {cities[res.destination] || res.destination}</div>
            <div><span className="text-muted-foreground">تاریخ: </span>{formatDate(res.departure_date)}</div>
            <div>{getStatusBadge(res.status)}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}
