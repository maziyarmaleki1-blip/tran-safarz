import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Reservation } from '@/hooks/useReservations';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const cities: Record<string, string> = {
  tehran: 'تهران', mashhad: 'مشهد', isfahan: 'اصفهان', shiraz: 'شیراز',
  tabriz: 'تبریز', yazd: 'یزد', ahvaz: 'اهواز', bandarabbas: 'بندرعباس',
};

interface ReservationCardProps {
  reservation: Reservation;
  onRefresh: () => void;
}

export function ReservationCard({ reservation, onRefresh }: ReservationCardProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [requestingCancel, setRequestingCancel] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fa-IR').format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Stage logic based on ticket-hunting workflow
  const getStage = () => {
    if (reservation.status === 'cancelled') return 'cancelled';
    if (reservation.status === 'pending') return 'searching';
    if (reservation.status === 'confirmed') {
      if (reservation.ticket_file_path) return 'ticket_ready';
      if (reservation.ticket_payment_status === 'confirmed') return 'ticket_ready';
      if (reservation.ticket_payment_status === 'paid') return 'awaiting_confirmation';
      return 'awaiting_payment';
    }
    return 'searching';
  };

  const stage = getStage();

  // Timeline steps for ticket-hunting model
  const timelineSteps = [
    { key: 'submitted', label: 'ثبت درخواست', icon: 'edit_note' },
    { key: 'searching', label: 'جستجوی بلیط', icon: 'radar' },
    { key: 'payment', label: 'پرداخت مابقی', icon: 'payments' },
    { key: 'ticket', label: 'دریافت بلیط', icon: 'confirmation_number' },
  ];

  const getStepStatus = (stepKey: string) => {
    if (stage === 'cancelled') {
      return stepKey === 'submitted' ? 'completed' : 'cancelled';
    }

    const stageMap: Record<string, number> = {
      searching: 1,
      awaiting_payment: 2,
      awaiting_confirmation: 2,
      ticket_ready: 3,
    };
    const stepMap: Record<string, number> = {
      submitted: 0,
      searching: 1,
      payment: 2,
      ticket: 3,
    };

    const currentIndex = stageMap[stage] ?? 0;
    const stepIndex = stepMap[stepKey] ?? 0;

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const getHeaderColor = () => {
    switch (stage) {
      case 'cancelled': return 'bg-destructive';
      case 'ticket_ready': return 'bg-success';
      case 'awaiting_payment': return 'bg-primary';
      case 'awaiting_confirmation': return 'bg-primary';
      case 'searching': return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  const getStatusBadge = () => {
    switch (stage) {
      case 'searching':
        return (
          <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              🤖 در حال جستجو
            </span>
          </Badge>
        );
      case 'awaiting_payment':
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            💳 در انتظار پرداخت
          </Badge>
        );
      case 'awaiting_confirmation':
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <span className="material-symbols-outlined text-sm ml-1 animate-pulse">hourglass_empty</span>
            پرداخت شده · در انتظار تأیید
          </Badge>
        );
      case 'ticket_ready':
        return (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            ✅ بلیط آماده مشاهده
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            لغو شده
          </Badge>
        );
      default:
        return null;
    }
  };

  const viewTicket = () => {
    navigate(`/ticket?id=${reservation.id}`);
  };

  const requestCancellation = async () => {
    try {
      setRequestingCancel(true);
      const { error } = await supabase
        .from('reservations')
        .update({
          cancel_requested: true,
          cancel_requested_at: new Date().toISOString(),
        })
        .eq('id', reservation.id);
      if (error) throw error;
      toast.success('درخواست لغو ثبت شد');
      setIsCancelDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error('Error requesting cancellation:', error);
      toast.error('خطا در ثبت درخواست');
    } finally {
      setRequestingCancel(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className={`h-1.5 ${getHeaderColor()}`} />

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="p-4">
            {/* Route & Status */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl">train</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {cities[reservation.origin] || reservation.origin} → {cities[reservation.destination] || reservation.destination}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(reservation.departure_date)}
                    {reservation.passenger_count && ` · ${reservation.passenger_count} مسافر`}
                  </p>
                </div>
              </div>

              <div className="text-left space-y-1">
                {getStatusBadge()}
                <p className="text-xs text-muted-foreground">کد: {reservation.reservation_code}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center justify-between mb-4 px-2">
              {timelineSteps.map((step, index) => {
                const status = getStepStatus(step.key);
                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`size-8 rounded-full flex items-center justify-center transition-all ${
                        status === 'completed' ? 'bg-success text-success-foreground' :
                        status === 'current' ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                        status === 'cancelled' ? 'bg-muted text-muted-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        <span className="material-symbols-outlined text-sm">
                          {status === 'completed' ? 'check' : step.icon}
                        </span>
                      </div>
                      <span className={`text-[10px] mt-1 text-center ${
                        status === 'current' ? 'text-primary font-medium' :
                        status === 'completed' ? 'text-success' :
                        'text-muted-foreground'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {index < timelineSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${
                        status === 'completed' ? 'bg-success' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Area */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Searching indicator */}
              {stage === 'searching' && (
                <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>🤖 ربات در حال رصد ثانیه‌ای ظرفیت‌هاست...</span>
                </div>
              )}

              {/* Payment link for remainder */}
              {stage === 'awaiting_payment' && reservation.ticket_payment_link && (
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => window.open(reservation.ticket_payment_link!, '_blank')}
                >
                  <span className="material-symbols-outlined text-sm">payments</span>
                  پرداخت مابقی ({reservation.ticket_payment_amount ? formatPrice(reservation.ticket_payment_amount) : ''})
                </Button>
              )}

              {stage === 'awaiting_payment' && !reservation.ticket_payment_link && (
                <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg">
                  <span className="material-symbols-outlined text-sm">info</span>
                  در انتظار پرداخت · لینک پرداخت به زودی ارسال می‌شود
                </div>
              )}

              {/* Awaiting confirmation after payment */}
              {stage === 'awaiting_confirmation' && (
                <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg">
                  <span className="material-symbols-outlined text-sm animate-pulse">hourglass_empty</span>
                  پرداخت انجام شده · در انتظار تأیید و نمایش بلیط
                </div>
              )}

              {/* View ticket */}
              {stage === 'ticket_ready' && (
                <Button
                  size="sm"
                  className="gap-2 bg-success hover:bg-success/90"
                  onClick={viewTicket}
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  مشاهده بلیط
                </Button>
              )}

              {/* Request cancellation */}
              {(stage === 'searching' || stage === 'awaiting_payment') &&
                !reservation.cancel_requested && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => setIsCancelDialogOpen(true)}
                >
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  درخواست لغو
                </Button>
              )}

              {/* Cancel requested badge */}
              {reservation.cancel_requested && reservation.status !== 'cancelled' && (
                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                  <span className="material-symbols-outlined text-sm ml-1">pending</span>
                  درخواست لغو در انتظار بررسی
                </Badge>
              )}

              {/* Refund status */}
              {reservation.status === 'cancelled' && reservation.refund_status && (
                <Badge variant="outline" className={`${
                  reservation.refund_status === 'completed'
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-orange-50 text-orange-600 border-orange-200'
                }`}>
                  <span className="material-symbols-outlined text-sm ml-1">
                    {reservation.refund_status === 'completed' ? 'check_circle' : 'schedule'}
                  </span>
                  {reservation.refund_status === 'completed'
                    ? `وجه برگشت داده شد${reservation.refund_method === 'wallet' ? ' (کیف پول)' : ' (کارت بانکی)'}`
                    : 'در انتظار بازگشت وجه'}
                </Badge>
              )}

              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 mr-auto">
                  <span className="material-symbols-outlined text-sm transition-transform" style={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)'
                  }}>
                    expand_more
                  </span>
                  {isExpanded ? 'بستن جزئیات' : 'مشاهده جزئیات'}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          {/* Expanded Details */}
          <CollapsibleContent>
            <div className="border-t border-border px-4 py-4 space-y-4 bg-muted/30">
              {/* Passengers */}
              {reservation.passengers && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">group</span>
                    مسافران ({reservation.adults_count || 1} بزرگسال
                    {(reservation.children_count || 0) > 0 && ` و ${reservation.children_count} کودک`})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(reservation.passengers as any[])?.map((passenger: any, idx: number) => (
                      <div key={idx} className="bg-background rounded-lg p-3 border border-border">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-muted-foreground">
                            {passenger.isChild ? 'child_care' : 'person'}
                          </span>
                          <div>
                            <p className="font-medium text-sm">
                              {passenger.firstName} {passenger.lastName}
                              {passenger.isChild && (
                                <Badge variant="secondary" className="mr-2 text-xs">کودک</Badge>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">کد ملی: {passenger.nationalId}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">payments</span>
                  اطلاعات مالی
                </h4>
                <div className="bg-background rounded-lg p-3 border border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">مبلغ بیعانه + کارمزد (پرداخت شده):</span>
                    <span className="font-bold text-primary">{formatPrice(reservation.total_price)}</span>
                  </div>
                  {reservation.ticket_payment_amount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">مبلغ بلیط (مابقی):</span>
                      <span className="font-medium">
                        {formatPrice(reservation.ticket_payment_amount)}
                        {reservation.ticket_payment_status === 'paid' && (
                          <Badge variant="outline" className="mr-2 bg-success/10 text-success text-xs">پرداخت شده</Badge>
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">تاریخ ثبت:</span>
                    <span>{formatDate(reservation.created_at)}</span>
                  </div>
                  {reservation.ticket_uploaded_at && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">تاریخ صدور بلیط:</span>
                      <span>{formatDateTime(reservation.ticket_uploaded_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Guarantee note */}
              <div className="bg-muted/50 border border-border rounded-lg p-3 text-sm text-muted-foreground text-right">
                🛡️ تضمین بازگشت وجه: در صورت عدم موفقیت در شکار بلیط، کل مبلغ بیعانه به شما بازگردانده خواهد شد.
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Cancel Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <span className="material-symbols-outlined">warning</span>
              درخواست لغو رزرو
            </DialogTitle>
            <DialogDescription>
              آیا مطمئن هستید که می‌خواهید درخواست لغو را ثبت کنید؟
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">مسیر:</span>
              <span className="font-medium">
                {cities[reservation.origin] || reservation.origin} → {cities[reservation.destination] || reservation.destination}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">تاریخ سفر:</span>
              <span>{formatDate(reservation.departure_date)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">مبلغ بیعانه:</span>
              <span className="font-medium text-primary">{formatPrice(reservation.total_price)}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            پس از تأیید لغو، مبلغ بیعانه به کیف پول یا کارت بانکی شما بازگردانده خواهد شد.
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={requestingCancel}
            >
              انصراف
            </Button>
            <Button
              variant="destructive"
              className="flex-1 gap-2"
              onClick={requestCancellation}
              disabled={requestingCancel}
            >
              {requestingCancel ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                  در حال ثبت...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  ثبت درخواست لغو
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
