import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

const cities: Record<string, string> = {
  tehran: 'تهران', mashhad: 'مشهد', isfahan: 'اصفهان', shiraz: 'شیراز',
  tabriz: 'تبریز', yazd: 'یزد', ahvaz: 'اهواز', bandarabbas: 'بندرعباس',
};

const TicketView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const reservationId = searchParams.get('id');

  const [reservation, setReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ticketUrl, setTicketUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (reservationId && user) {
      fetchReservation();
    }
  }, [reservationId, user]);

  const fetchReservation = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', reservationId!)
        .single();

      if (error) throw error;
      setReservation(data);

      // Get ticket file URL
      if (data.ticket_file_path) {
        const { data: signedData, error: signedError } = await supabase.storage
          .from('tickets')
          .createSignedUrl(data.ticket_file_path, 3600); // 1 hour
        if (!signedError && signedData) {
          setTicketUrl(signedData.signedUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching reservation:', error);
      toast.error('خطا در بارگذاری اطلاعات بلیط');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric', month: 'long', day: 'numeric',
    }).format(new Date(dateStr));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const handleDownload = async () => {
    if (!reservation?.ticket_file_path) return;
    try {
      setDownloading(true);
      const { data, error } = await supabase.storage
        .from('tickets')
        .download(reservation.ticket_file_path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${reservation.reservation_code}.${reservation.ticket_file_path.split('.').pop()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('بلیط با موفقیت دانلود شد');
    } catch (error) {
      console.error('Error downloading ticket:', error);
      toast.error('خطا در دانلود بلیط');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    if (ticketUrl) {
      const printWindow = window.open(ticketUrl, '_blank');
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-3">
          <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">در حال بارگذاری بلیط...</p>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30" dir="rtl">
        <Card className="p-8 text-center max-w-md">
          <span className="material-symbols-outlined text-5xl text-muted-foreground mb-4">error</span>
          <h2 className="text-xl font-bold mb-2">بلیط یافت نشد</h2>
          <p className="text-muted-foreground mb-4">اطلاعات بلیط مورد نظر یافت نشد یا دسترسی ندارید.</p>
          <Button onClick={() => navigate('/dashboard')}>بازگشت به داشبورد</Button>
        </Card>
      </div>
    );
  }

  const isPdf = reservation.ticket_file_path?.endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(reservation.ticket_file_path || '');

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <img src={logo} alt="safarz" className="h-10" />
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="font-bold text-lg">مشاهده بلیط</h1>
          </div>
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate('/dashboard')}>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
            بازگشت
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Ticket Info Card */}
        <Card className="overflow-hidden">
          <div className="h-1.5 bg-success" />
          <div className="p-5">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-success text-2xl">confirmation_number</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg">
                    {cities[reservation.origin] || reservation.origin} → {cities[reservation.destination] || reservation.destination}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(reservation.departure_date)}
                    {reservation.passenger_count && ` · ${reservation.passenger_count} مسافر`}
                  </p>
                </div>
              </div>
              <div className="text-left">
                <Badge className="bg-success/10 text-success border-success/20" variant="outline">
                  ✅ بلیط صادر شده
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">کد: {reservation.reservation_code}</p>
              </div>
            </div>

            {/* Passengers */}
            {reservation.passengers && (
              <div className="border border-border rounded-lg p-4 mb-4">
                <h3 className="font-medium mb-3 flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-primary text-lg">group</span>
                  مسافران
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(reservation.passengers as any[]).map((p: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-lg p-2.5">
                      <span className="material-symbols-outlined text-muted-foreground text-sm">
                        {p.isChild ? 'child_care' : 'person'}
                      </span>
                      <span className="text-sm font-medium">{p.firstName} {p.lastName}</span>
                      {p.isChild && <Badge variant="secondary" className="text-xs">کودک</Badge>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Summary */}
            <div className="border border-border rounded-lg p-4 mb-4 space-y-2">
              <h3 className="font-medium mb-2 flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-primary text-lg">payments</span>
                اطلاعات مالی
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">بیعانه + کارمزد:</span>
                <span>{formatPrice(reservation.total_price)}</span>
              </div>
              {reservation.ticket_payment_amount && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">مبلغ بلیط (مابقی):</span>
                  <span>{formatPrice(reservation.ticket_payment_amount)}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
                <span>مجموع پرداختی:</span>
                <span className="text-primary">
                  {formatPrice(reservation.total_price + (reservation.ticket_payment_amount || 0))}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Ticket File Preview */}
        <Card className="overflow-hidden">
          <div className="p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">picture_as_pdf</span>
              فایل بلیط
            </h3>

            {ticketUrl ? (
              <div className="space-y-4">
                {/* Preview */}
                <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
                  {isPdf ? (
                    <iframe
                      src={ticketUrl}
                      className="w-full h-[500px] sm:h-[700px]"
                      title="Ticket Preview"
                    />
                  ) : isImage ? (
                    <img
                      src={ticketUrl}
                      alt="Ticket"
                      className="w-full max-h-[700px] object-contain mx-auto"
                    />
                  ) : (
                    <div className="p-8 text-center">
                      <span className="material-symbols-outlined text-5xl text-muted-foreground mb-2">description</span>
                      <p className="text-muted-foreground">پیش‌نمایش این فرمت پشتیبانی نمی‌شود</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button className="gap-2 flex-1 sm:flex-none" onClick={handleDownload} disabled={downloading}>
                    <span className="material-symbols-outlined text-sm">
                      {downloading ? 'refresh' : 'download'}
                    </span>
                    {downloading ? 'در حال دانلود...' : 'دانلود بلیط'}
                  </Button>
                  <Button variant="outline" className="gap-2 flex-1 sm:flex-none" onClick={handlePrint}>
                    <span className="material-symbols-outlined text-sm">print</span>
                    چاپ بلیط
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 flex-1 sm:flex-none"
                    onClick={() => {
                      if (ticketUrl) {
                        navigator.clipboard.writeText(ticketUrl);
                        toast.success('لینک بلیط کپی شد');
                      }
                    }}
                  >
                    <span className="material-symbols-outlined text-sm">link</span>
                    کپی لینک
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-muted/30 rounded-lg border border-border">
                <span className="material-symbols-outlined text-5xl text-muted-foreground mb-2">hourglass_empty</span>
                <p className="text-muted-foreground">فایل بلیط هنوز آپلود نشده است</p>
              </div>
            )}
          </div>
        </Card>

        {/* Help Note */}
        <Card className="p-4 bg-muted/30 border-dashed">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-lg mt-0.5">help</span>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">نکات مهم:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>لطفاً بلیط را دانلود و در دستگاه خود ذخیره کنید.</li>
                <li>هنگام سوار شدن به قطار، بلیط چاپ شده یا فایل دیجیتال آن را همراه داشته باشید.</li>
                <li>در صورت بروز مشکل با پشتیبانی تماس بگیرید.</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TicketView;
