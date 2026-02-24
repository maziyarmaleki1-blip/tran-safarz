import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Reservation } from '@/hooks/useReservations';
import { ReservationCard } from './ReservationCard';

interface ReservationsTabProps {
  reservations: Reservation[];
  loading: boolean;
  onRefresh: () => void;
}

export function ReservationsTab({ reservations, loading, onRefresh }: ReservationsTabProps) {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Split reservations into upcoming and past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingReservations = reservations.filter(r => {
    const departureDate = new Date(r.departure_date);
    departureDate.setHours(0, 0, 0, 0);
    return departureDate >= today && r.status !== 'cancelled';
  });
  
  const pastReservations = reservations.filter(r => {
    const departureDate = new Date(r.departure_date);
    departureDate.setHours(0, 0, 0, 0);
    return departureDate < today || r.status === 'cancelled';
  });
  
  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-6">درخواست‌های من</h1>
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
        <h1 className="text-2xl font-bold mb-6">درخواست‌های من</h1>
        <Card className="p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-muted-foreground mb-4">confirmation_number</span>
          <p className="text-muted-foreground">هنوز درخواستی ثبت نکردید</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      <h1 className="text-2xl font-bold mb-2">درخواست‌های من</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="upcoming" className="gap-2">
            <span className="material-symbols-outlined text-lg">upcoming</span>
            سفرهای پیش‌رو
            {upcomingReservations.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {upcomingReservations.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <span className="material-symbols-outlined text-lg">history</span>
            تاریخچه سفرها
            {pastReservations.length > 0 && (
              <span className="bg-muted-foreground/20 text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                {pastReservations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingReservations.length === 0 ? (
            <Card className="p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-muted-foreground mb-4">event_available</span>
              <p className="text-muted-foreground">سفری در برنامه ندارید</p>
            </Card>
          ) : (
            upcomingReservations.map((res) => (
              <ReservationCard key={res.id} reservation={res} onRefresh={onRefresh} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          {pastReservations.length === 0 ? (
            <Card className="p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-muted-foreground mb-4">history</span>
              <p className="text-muted-foreground">سفری در تاریخچه ندارید</p>
            </Card>
          ) : (
            pastReservations.map((res) => (
              <ReservationCard key={res.id} reservation={res} onRefresh={onRefresh} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
