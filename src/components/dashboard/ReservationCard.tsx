 import { useState } from 'react';
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
   const [isExpanded, setIsExpanded] = useState(false);
   const [downloadingTicket, setDownloadingTicket] = useState(false);
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
 
   // Calculate timeline stage
   const getTimelineStage = () => {
     if (reservation.status === 'cancelled') return 'cancelled';
     if (reservation.status === 'pending') return 'pending';
     if (reservation.status === 'confirmed' && !reservation.ticket_file_path) return 'confirmed';
     if (reservation.ticket_file_path) {
       const today = new Date();
       const departureDate = new Date(reservation.departure_date);
       if (departureDate < today) return 'completed';
       return 'ticket_ready';
     }
     return 'pending';
   };
 
   const stage = getTimelineStage();
 
   const downloadTicket = async () => {
     if (!reservation.ticket_file_path) return;
     
     try {
       setDownloadingTicket(true);
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
 
       toast.success('بلیط دانلود شد');
     } catch (error) {
       console.error('Error downloading ticket:', error);
       toast.error('خطا در دانلود بلیط');
     } finally {
       setDownloadingTicket(false);
     }
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
 
   // Timeline steps configuration
    const timelineSteps = [
      { key: 'submitted', label: 'ثبت درخواست', icon: 'edit_note' },
      { key: 'confirmed', label: stage === 'pending' ? '🤖 رصد ربات' : 'تأیید رزرو', icon: stage === 'pending' ? 'radar' : 'verified' },
      { key: 'ticket', label: 'صدور بلیط', icon: 'confirmation_number' },
      { key: 'travel', label: 'سفر', icon: 'train' },
    ];
 
   const getStepStatus = (stepKey: string) => {
     if (reservation.status === 'cancelled') {
       return stepKey === 'submitted' ? 'completed' : 'cancelled';
     }
     
     const stageOrder = ['pending', 'confirmed', 'ticket_ready', 'completed'];
     const stepOrder = ['submitted', 'confirmed', 'ticket', 'travel'];
     
     const currentStageIndex = stageOrder.indexOf(stage);
     const stepIndex = stepOrder.indexOf(stepKey);
     
     if (stepIndex < currentStageIndex) return 'completed';
     if (stepIndex === currentStageIndex) return 'current';
     return 'upcoming';
   };
 
   return (
     <>
       <Card className="overflow-hidden">
         {/* Header with status indicator */}
         <div className={`h-1.5 ${
           stage === 'cancelled' ? 'bg-destructive' :
           stage === 'completed' ? 'bg-muted' :
           stage === 'ticket_ready' ? 'bg-success' :
           stage === 'confirmed' ? 'bg-primary' :
           'bg-gold'
         }`} />
         
         <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
           {/* Main content */}
           <div className="p-4">
             {/* Top row: Route and status */}
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
                     {reservation.departure_time && ` - ساعت ${reservation.departure_time}`}
                   </p>
                 </div>
               </div>
               
               <div className="text-left">
                  <Badge variant="outline" className={`mb-1 ${
                    reservation.status === 'confirmed' ? 'bg-success/10 text-success border-success/20' :
                    reservation.status === 'cancelled' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                    'bg-orange-500/10 text-orange-600 border-orange-500/20'
                  }`}>
                    {reservation.status === 'confirmed' ? 'تأیید شده' :
                     reservation.status === 'cancelled' ? 'لغو شده' : (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        🤖 ربات در حال رصد...
                      </span>
                     )}
                  </Badge>
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
                         status === 'completed' ? 'bg-success' :
                         status === 'cancelled' ? 'bg-muted' :
                         'bg-muted'
                       }`} />
                     )}
                   </div>
                 );
               })}
             </div>
 
             {/* Action buttons */}
             <div className="flex items-center gap-2 flex-wrap">
               {/* Download ticket */}
               {reservation.ticket_file_path && (
                 <Button
                   size="sm"
                   className="gap-2 bg-success hover:bg-success/90"
                   onClick={downloadTicket}
                   disabled={downloadingTicket}
                 >
                   <span className="material-symbols-outlined text-sm">
                     {downloadingTicket ? 'refresh' : 'download'}
                   </span>
                   {downloadingTicket ? 'در حال دانلود...' : 'دریافت بلیط'}
                 </Button>
               )}
 
                {/* Bot actively searching */}
                {reservation.status === 'pending' && (
                  <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>🤖 ربات در حال رصد ثانیه‌ای ظرفیت‌هاست...</span>
                  </div>
                )}

                {/* Ticket in preparation */}
                {reservation.status === 'confirmed' && !reservation.ticket_file_path && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                    <span className="material-symbols-outlined text-sm animate-pulse">hourglass_empty</span>
                    بلیط در حال آماده‌سازی
                  </div>
                )}
 
               {/* Request cancellation */}
               {(reservation.status === 'pending' || reservation.status === 'confirmed') && 
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
 
           {/* Expanded content */}
           <CollapsibleContent>
             <div className="border-t border-border px-4 py-4 space-y-4 bg-muted/30">
               {/* Passengers */}
               <div>
                 <h4 className="font-medium mb-2 flex items-center gap-2">
                   <span className="material-symbols-outlined text-primary text-lg">group</span>
                   مسافران ({reservation.adults_count || 1} بزرگسال
                   {(reservation.children_count || 0) > 0 && ` و ${reservation.children_count} کودک`})
                 </h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                   {reservation.passengers?.map((passenger: any, idx: number) => (
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
 
               {/* Payment details */}
               <div>
                 <h4 className="font-medium mb-2 flex items-center gap-2">
                   <span className="material-symbols-outlined text-primary text-lg">payments</span>
                   جزئیات پرداخت
                 </h4>
                 <div className="bg-background rounded-lg p-3 border border-border">
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                     <div>
                       <span className="text-muted-foreground">مبلغ کل:</span>
                       <p className="font-bold text-primary">{formatPrice(reservation.total_price)}</p>
                     </div>
                     <div>
                       <span className="text-muted-foreground">تاریخ پرداخت:</span>
                       <p>{formatDate(reservation.created_at)}</p>
                     </div>
                     <div>
                       <span className="text-muted-foreground">روش پرداخت:</span>
                       <p>درگاه آنلاین</p>
                     </div>
                   </div>
                 </div>
               </div>
 
               {/* Reservation info */}
               <div className="text-xs text-muted-foreground flex items-center gap-4 flex-wrap">
                 <span>تاریخ ثبت: {formatDateTime(reservation.created_at)}</span>
                 {reservation.ticket_uploaded_at && (
                   <span>تاریخ صدور بلیط: {formatDateTime(reservation.ticket_uploaded_at)}</span>
                 )}
               </div>
             </div>
           </CollapsibleContent>
         </Collapsible>
       </Card>
 
       {/* Cancel confirmation dialog */}
       <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
         <DialogContent className="max-w-md" dir="rtl">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2 text-destructive">
               <span className="material-symbols-outlined">warning</span>
               درخواست لغو رزرو
             </DialogTitle>
             <DialogDescription>
               آیا مطمئن هستید که می‌خواهید درخواست لغو این رزرو را ثبت کنید؟
             </DialogDescription>
           </DialogHeader>
 
           <div className="bg-muted/50 rounded-lg p-4 space-y-2">
             <div className="flex justify-between text-sm">
               <span className="text-muted-foreground">مسیر:</span>
               <span className="font-medium">
                 {cities[reservation.origin]} → {cities[reservation.destination]}
               </span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-muted-foreground">تاریخ سفر:</span>
               <span>{formatDate(reservation.departure_date)}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-muted-foreground">مبلغ:</span>
               <span className="font-medium text-primary">{formatPrice(reservation.total_price)}</span>
             </div>
           </div>
 
           <p className="text-sm text-muted-foreground">
             پس از تأیید لغو توسط پشتیبانی، مبلغ به کیف پول یا کارت بانکی شما بازگردانده خواهد شد.
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