 import { useState } from 'react';
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
 } from '@/components/ui/dialog';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
 import { supabase } from '@/integrations/supabase/client';
 import { toast } from 'sonner';
 import { useAuth } from '@/hooks/useAuth';
 
 interface RefundDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   reservation: {
     id: string;
     reservation_code: string;
     total_price: number;
     user_id: string;
     refund_status?: string | null;
   } | null;
   onRefundComplete: () => void;
 }
 
 export const RefundDialog = ({ open, onOpenChange, reservation, onRefundComplete }: RefundDialogProps) => {
   const { user } = useAuth();
   const [refundMethod, setRefundMethod] = useState<'wallet' | 'card'>('wallet');
   const [cardNumber, setCardNumber] = useState('');
   const [processing, setProcessing] = useState(false);
 
   const formatPrice = (price: number) => {
     return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
   };
 
   const formatCardNumber = (value: string) => {
     const digits = value.replace(/\D/g, '').slice(0, 16);
     return digits.replace(/(.{4})/g, '$1-').replace(/-$/, '');
   };
 
   const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setCardNumber(formatCardNumber(e.target.value));
   };
 
   const validateCardNumber = () => {
     const digits = cardNumber.replace(/\D/g, '');
     return digits.length === 16;
   };
 
   const handleRefund = async () => {
     if (!reservation || !user) return;
 
     if (refundMethod === 'card' && !validateCardNumber()) {
       toast.error('شماره کارت باید ۱۶ رقم باشد');
       return;
     }
 
     try {
       setProcessing(true);
 
       if (refundMethod === 'wallet') {
         // Add amount to user's wallet
         const { data: profile, error: profileError } = await supabase
           .from('profiles')
           .select('balance')
           .eq('id', reservation.user_id)
           .single();
 
         if (profileError) throw profileError;
 
         const newBalance = (profile?.balance || 0) + reservation.total_price;
 
         const { error: updateError } = await supabase
           .from('profiles')
           .update({ balance: newBalance })
           .eq('id', reservation.user_id);
 
         if (updateError) throw updateError;
 
         // Create transaction record
         const { error: transactionError } = await supabase
           .from('transactions')
           .insert({
             user_id: reservation.user_id,
             type: 'refund',
             amount: reservation.total_price,
             description: `بازگشت وجه رزرو ${reservation.reservation_code}`,
             reference_id: reservation.id,
           });
 
         if (transactionError) throw transactionError;
       }
 
       // Update reservation with refund info
       const { error: reservationError } = await supabase
         .from('reservations')
         .update({
           refund_status: 'completed',
           refund_amount: reservation.total_price,
           refund_method: refundMethod,
           refund_by: user.id,
           refund_at: new Date().toISOString(),
           refund_card_number: refundMethod === 'card' ? cardNumber.replace(/-/g, '') : null,
         })
         .eq('id', reservation.id);
 
       if (reservationError) throw reservationError;
 
       toast.success(
         refundMethod === 'wallet'
           ? 'مبلغ با موفقیت به کیف پول مسافر برگشت داده شد'
           : 'بازگشت وجه به کارت بانکی ثبت شد'
       );
 
       onOpenChange(false);
       onRefundComplete();
       setCardNumber('');
       setRefundMethod('wallet');
     } catch (error) {
       console.error('Error processing refund:', error);
       toast.error('خطا در پردازش بازگشت وجه');
     } finally {
       setProcessing(false);
     }
   };
 
   if (!reservation) return null;
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-md" dir="rtl">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <span className="material-symbols-outlined text-success">payments</span>
             بازگشت وجه
           </DialogTitle>
           <DialogDescription>
             کد رزرو: {reservation.reservation_code}
           </DialogDescription>
         </DialogHeader>
 
         <div className="space-y-6">
           {/* Amount Display */}
           <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-center">
             <p className="text-sm text-muted-foreground mb-1">مبلغ قابل برگشت</p>
             <p className="text-2xl font-bold text-success">{formatPrice(reservation.total_price)}</p>
           </div>
 
           {/* Refund Method Selection */}
           <div className="space-y-3">
             <Label className="text-sm font-medium">روش بازگشت وجه</Label>
             <RadioGroup
               value={refundMethod}
               onValueChange={(value) => setRefundMethod(value as 'wallet' | 'card')}
               className="space-y-3"
             >
               <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                 <RadioGroupItem value="wallet" id="wallet" />
                 <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer flex-1">
                   <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                   <div>
                     <p className="font-medium">کیف پول</p>
                     <p className="text-xs text-muted-foreground">برگشت آنی به کیف پول مسافر</p>
                   </div>
                 </Label>
               </div>
               <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                 <RadioGroupItem value="card" id="card" />
                 <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                   <span className="material-symbols-outlined text-primary">credit_card</span>
                   <div>
                     <p className="font-medium">کارت بانکی</p>
                     <p className="text-xs text-muted-foreground">برگشت به کارت بانکی مسافر (۱-۳ روز کاری)</p>
                   </div>
                 </Label>
               </div>
             </RadioGroup>
           </div>
 
           {/* Card Number Input (only for card refund) */}
           {refundMethod === 'card' && (
             <div className="space-y-2">
               <Label htmlFor="cardNumber">شماره کارت مقصد</Label>
               <Input
                 id="cardNumber"
                 placeholder="XXXX-XXXX-XXXX-XXXX"
                 value={cardNumber}
                 onChange={handleCardChange}
                 className="text-center tracking-wider font-mono text-lg"
                 dir="ltr"
               />
               <p className="text-xs text-muted-foreground">
                 شماره کارت ۱۶ رقمی مسافر را وارد کنید
               </p>
             </div>
           )}
 
           {/* Action Buttons */}
           <div className="flex gap-3 pt-2">
             <Button
               variant="outline"
               className="flex-1"
               onClick={() => onOpenChange(false)}
               disabled={processing}
             >
               انصراف
             </Button>
             <Button
               className="flex-1 gap-2"
               onClick={handleRefund}
               disabled={processing || (refundMethod === 'card' && !validateCardNumber())}
             >
               {processing ? (
                 <>
                   <span className="material-symbols-outlined animate-spin">refresh</span>
                   در حال پردازش...
                 </>
               ) : (
                 <>
                   <span className="material-symbols-outlined">check_circle</span>
                   تأیید بازگشت وجه
                 </>
               )}
             </Button>
           </div>
         </div>
       </DialogContent>
     </Dialog>
   );
 };