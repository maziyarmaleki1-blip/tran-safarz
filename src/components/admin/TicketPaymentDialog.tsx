import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TicketPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: {
    id: string;
    reservation_code: string;
    total_price: number;
    ticket_payment_status?: string | null;
    ticket_payment_amount?: number | null;
    ticket_payment_link?: string | null;
    passengers?: { mobile?: string }[] | null;
  } | null;
  onSuccess: () => void;
}

export function TicketPaymentDialog({
  open,
  onOpenChange,
  reservation,
  onSuccess,
}: TicketPaymentDialogProps) {
  const [ticketAmount, setTicketAmount] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);

  // Generate a mock payment link
  const generatePaymentLink = async () => {
    if (!reservation) return;

    const amount = ticketAmount ? parseInt(ticketAmount, 10) : reservation.total_price;
    if (!amount || amount <= 0) {
      toast.error('لطفاً مبلغ معتبر وارد کنید');
      return;
    }

    try {
      setIsGenerating(true);
      
      // Generate a mock payment link (in production, this would integrate with a payment gateway)
      const paymentLink = `${window.location.origin}/pay/${reservation.reservation_code}?amount=${amount}`;
      
      const { error } = await supabase
        .from('reservations')
        .update({
          ticket_payment_amount: amount,
          ticket_payment_link: paymentLink,
          ticket_payment_status: 'pending',
        })
        .eq('id', reservation.id);

      if (error) throw error;

      toast.success('لینک پرداخت ایجاد شد');
      onSuccess();
    } catch (error) {
      console.error('Error generating payment link:', error);
      toast.error('خطا در ایجاد لینک پرداخت');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy payment link to clipboard
  const copyPaymentLink = () => {
    if (reservation?.ticket_payment_link) {
      navigator.clipboard.writeText(reservation.ticket_payment_link);
      setIsCopied(true);
      toast.success('لینک کپی شد');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Mark as paid manually
  const markAsPaid = async () => {
    if (!reservation) return;

    try {
      setIsMarkingPaid(true);
      
      const { error } = await supabase
        .from('reservations')
        .update({
          ticket_payment_status: 'paid',
          ticket_paid_at: new Date().toISOString(),
        })
        .eq('id', reservation.id);

      if (error) throw error;

      toast.success('پرداخت تأیید شد');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error marking as paid:', error);
      toast.error('خطا در تأیید پرداخت');
    } finally {
      setIsMarkingPaid(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const passengerMobile = reservation?.passengers?.[0]?.mobile || 'شماره‌ای ثبت نشده';
  const isPaid = reservation?.ticket_payment_status === 'paid';
  const hasLink = !!reservation?.ticket_payment_link;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">payments</span>
            پرداخت وجه بلیط
          </DialogTitle>
          <DialogDescription>
            کد رزرو: {reservation?.reservation_code}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isPaid ? (
            <div className="bg-success/10 border border-success/30 rounded-lg p-4 text-center">
              <span className="material-symbols-outlined text-success text-4xl mb-2">check_circle</span>
              <p className="text-success font-bold text-lg">پرداخت انجام شده</p>
              <p className="text-sm text-muted-foreground mt-1">
                مبلغ: {formatPrice(reservation?.ticket_payment_amount || 0)} تومان
              </p>
            </div>
          ) : (
            <>
              {/* Passenger mobile info */}
              <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-muted-foreground">phone</span>
                <span className="text-sm">شماره مسافر: {passengerMobile}</span>
              </div>

              {/* Amount input */}
              <div className="space-y-2">
                <Label>مبلغ بلیط (تومان)</Label>
                <Input
                  type="number"
                  value={ticketAmount}
                  onChange={(e) => setTicketAmount(e.target.value)}
                  placeholder={formatPrice(reservation?.total_price || 0)}
                  className="text-left"
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground">
                  مبلغ پیش‌فرض: {formatPrice(reservation?.total_price || 0)} تومان
                </p>
              </div>

              {/* Payment link section */}
              {hasLink ? (
                <div className="space-y-3">
                  <Label>لینک پرداخت</Label>
                  <div className="flex gap-2">
                    <Input
                      value={reservation?.ticket_payment_link || ''}
                      readOnly
                      className="text-xs font-mono"
                      dir="ltr"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyPaymentLink}
                      className="shrink-0"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isCopied ? 'check' : 'content_copy'}
                      </span>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    مبلغ: {formatPrice(reservation?.ticket_payment_amount || 0)} تومان
                  </p>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={markAsPaid}
                      disabled={isMarkingPaid}
                      className="flex-1 bg-success hover:bg-success/90"
                    >
                      {isMarkingPaid ? (
                        <span className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          تأیید پرداخت
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={generatePaymentLink}
                      disabled={isGenerating}
                    >
                      <span className="material-symbols-outlined text-sm">refresh</span>
                      لینک جدید
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={generatePaymentLink}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <span className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">link</span>
                      ایجاد لینک پرداخت
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
