 import { useState, useRef } from 'react';
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
 } from '@/components/ui/dialog';
 import { Button } from '@/components/ui/button';
 import { supabase } from '@/integrations/supabase/client';
 import { toast } from 'sonner';
 import { useAuth } from '@/hooks/useAuth';
 
 interface TicketUploadDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   reservation: {
     id: string;
     reservation_code: string;
     ticket_file_path?: string | null;
   } | null;
   onUploadComplete: () => void;
 }
 
 export const TicketUploadDialog = ({ open, onOpenChange, reservation, onUploadComplete }: TicketUploadDialogProps) => {
   const { user } = useAuth();
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [uploading, setUploading] = useState(false);
   const [dragOver, setDragOver] = useState(false);
 
   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
       validateAndSetFile(file);
     }
   };
 
   const validateAndSetFile = (file: File) => {
     // Accept PDF, images
     const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
     if (!allowedTypes.includes(file.type)) {
       toast.error('فقط فایل‌های PDF و تصویر (JPG, PNG) مجاز هستند');
       return;
     }
     
     // Max 10MB
     if (file.size > 10 * 1024 * 1024) {
       toast.error('حداکثر حجم فایل ۱۰ مگابایت است');
       return;
     }
     
     setSelectedFile(file);
   };
 
   const handleDrop = (e: React.DragEvent) => {
     e.preventDefault();
     setDragOver(false);
     const file = e.dataTransfer.files?.[0];
     if (file) {
       validateAndSetFile(file);
     }
   };
 
   const handleUpload = async () => {
     if (!reservation || !selectedFile || !user) return;
 
     try {
       setUploading(true);
 
       // Create file path: reservationId/filename
       const fileExt = selectedFile.name.split('.').pop();
       const fileName = `${reservation.id}/ticket-${Date.now()}.${fileExt}`;
 
       // Delete old file if exists
       if (reservation.ticket_file_path) {
         await supabase.storage
           .from('tickets')
           .remove([reservation.ticket_file_path]);
       }
 
       // Upload new file
       const { error: uploadError } = await supabase.storage
         .from('tickets')
         .upload(fileName, selectedFile, {
           cacheControl: '3600',
           upsert: true,
         });
 
       if (uploadError) throw uploadError;
 
       // Update reservation with file path
       const { error: updateError } = await supabase
         .from('reservations')
         .update({
           ticket_file_path: fileName,
           ticket_uploaded_at: new Date().toISOString(),
           ticket_uploaded_by: user.id,
         })
         .eq('id', reservation.id);
 
       if (updateError) throw updateError;
 
       toast.success('بلیط با موفقیت آپلود شد');
       onOpenChange(false);
       onUploadComplete();
       setSelectedFile(null);
     } catch (error) {
       console.error('Error uploading ticket:', error);
       toast.error('خطا در آپلود بلیط');
     } finally {
       setUploading(false);
     }
   };
 
   const handleClose = () => {
     onOpenChange(false);
     setSelectedFile(null);
   };
 
   if (!reservation) return null;
 
   return (
     <Dialog open={open} onOpenChange={handleClose}>
       <DialogContent className="max-w-md" dir="rtl">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <span className="material-symbols-outlined text-primary">upload_file</span>
             آپلود بلیط
           </DialogTitle>
           <DialogDescription>
             کد رزرو: {reservation.reservation_code}
           </DialogDescription>
         </DialogHeader>
 
         <div className="space-y-4">
           {/* Current ticket status */}
           {reservation.ticket_file_path && (
             <div className="p-3 bg-success/10 border border-success/20 rounded-lg flex items-center gap-2">
               <span className="material-symbols-outlined text-success">check_circle</span>
               <span className="text-sm text-success">بلیط قبلاً آپلود شده است</span>
             </div>
           )}
 
           {/* Drop zone */}
           <div
             className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
               dragOver 
                 ? 'border-primary bg-primary/5' 
                 : 'border-border hover:border-primary/50'
             }`}
             onClick={() => fileInputRef.current?.click()}
             onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
             onDragLeave={() => setDragOver(false)}
             onDrop={handleDrop}
           >
             <input
               ref={fileInputRef}
               type="file"
               accept=".pdf,.jpg,.jpeg,.png,.webp"
               className="hidden"
               onChange={handleFileSelect}
             />
             
             {selectedFile ? (
               <div className="space-y-2">
                 <span className="material-symbols-outlined text-4xl text-success">description</span>
                 <p className="font-medium">{selectedFile.name}</p>
                 <p className="text-sm text-muted-foreground">
                   {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                 </p>
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                 >
                   تغییر فایل
                 </Button>
               </div>
             ) : (
               <div className="space-y-2">
                 <span className="material-symbols-outlined text-4xl text-muted-foreground">cloud_upload</span>
                 <p className="font-medium">فایل بلیط را اینجا بکشید</p>
                 <p className="text-sm text-muted-foreground">یا کلیک کنید برای انتخاب</p>
                 <p className="text-xs text-muted-foreground">PDF, JPG, PNG - حداکثر ۱۰ مگابایت</p>
               </div>
             )}
           </div>
 
           {/* Action buttons */}
           <div className="flex gap-3 pt-2">
             <Button
               variant="outline"
               className="flex-1"
               onClick={handleClose}
               disabled={uploading}
             >
               انصراف
             </Button>
             <Button
               className="flex-1 gap-2"
               onClick={handleUpload}
               disabled={!selectedFile || uploading}
             >
               {uploading ? (
                 <>
                   <span className="material-symbols-outlined animate-spin">refresh</span>
                   در حال آپلود...
                 </>
               ) : (
                 <>
                   <span className="material-symbols-outlined">upload</span>
                   {reservation.ticket_file_path ? 'جایگزینی بلیط' : 'آپلود بلیط'}
                 </>
               )}
             </Button>
           </div>
         </div>
       </DialogContent>
     </Dialog>
   );
 };