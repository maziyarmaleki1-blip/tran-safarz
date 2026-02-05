 import { useState, useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Checkbox } from '@/components/ui/checkbox';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { supabase } from '@/integrations/supabase/client';
 import { toast } from 'sonner';
 
 interface AdminLoginProps {
   onLoginSuccess: () => void;
 }
 
 const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
   const navigate = useNavigate();
   const [phone, setPhone] = useState('');
   const [password, setPassword] = useState('');
   const [rememberMe, setRememberMe] = useState(false);
   const [loading, setLoading] = useState(false);
 
   // Load saved credentials on mount
   useEffect(() => {
     const savedPhone = localStorage.getItem('admin_saved_phone');
     const savedRemember = localStorage.getItem('admin_remember_me') === 'true';
     if (savedPhone && savedRemember) {
       setPhone(savedPhone);
       setRememberMe(true);
     }
   }, []);
 
   const handleLogin = async (e: React.FormEvent) => {
     e.preventDefault();
     
     if (!phone || !password) {
       toast.error('لطفاً شماره موبایل و رمز عبور را وارد کنید');
       return;
     }
 
     try {
       setLoading(true);
 
       // Convert phone to email format
       const email = `${phone}@phone.local`;
 
       // Sign in
       const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
         email,
         password,
       });
 
       if (authError) {
         toast.error('شماره موبایل یا رمز عبور اشتباه است');
         return;
       }
 
       // Check if user has admin or employee role
       const { data: roles, error: rolesError } = await supabase
         .from('user_roles')
         .select('role')
         .eq('user_id', authData.user.id);
 
       if (rolesError) {
         toast.error('خطا در بررسی دسترسی');
         await supabase.auth.signOut();
         return;
       }
 
       const userRoles = roles?.map(r => r.role) || [];
       const hasStaffRole = userRoles.includes('admin') || userRoles.includes('employee');
 
       if (!hasStaffRole) {
         toast.error('شما دسترسی به پنل مدیریت ندارید');
         await supabase.auth.signOut();
         return;
       }
 
       // Save credentials if remember me is checked
       if (rememberMe) {
         localStorage.setItem('admin_saved_phone', phone);
         localStorage.setItem('admin_remember_me', 'true');
       } else {
         localStorage.removeItem('admin_saved_phone');
         localStorage.removeItem('admin_remember_me');
       }
 
       toast.success('ورود موفق');
       onLoginSuccess();
     } catch (error) {
       console.error('Login error:', error);
       toast.error('خطا در ورود');
     } finally {
       setLoading(false);
     }
   };
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
       <Card className="w-full max-w-md shadow-xl border-primary/20">
         <CardHeader className="text-center space-y-3">
           <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
             <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
           </div>
           <CardTitle className="text-2xl font-bold">پنل مدیریت</CardTitle>
           <CardDescription>برای ورود، اطلاعات خود را وارد کنید</CardDescription>
         </CardHeader>
         <CardContent>
           <form onSubmit={handleLogin} className="space-y-5">
             {/* Phone Input */}
             <div className="space-y-2">
               <label className="text-sm font-medium text-right block">شماره موبایل</label>
               <div className="relative">
                 <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                   phone
                 </span>
                 <Input
                   type="tel"
                   value={phone}
                   onChange={(e) => setPhone(e.target.value)}
                   placeholder="09xxxxxxxxx"
                   className="pr-10 text-left"
                   dir="ltr"
                   maxLength={11}
                 />
               </div>
             </div>
 
             {/* Password Input */}
             <div className="space-y-2">
               <label className="text-sm font-medium text-right block">رمز عبور</label>
               <div className="relative">
                 <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                   lock
                 </span>
                 <Input
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="رمز عبور"
                   className="pr-10"
                 />
               </div>
             </div>
 
             {/* Remember Me */}
             <div className="flex items-center gap-2">
               <Checkbox
                 id="rememberMe"
                 checked={rememberMe}
                 onCheckedChange={(checked) => setRememberMe(checked === true)}
               />
               <label htmlFor="rememberMe" className="text-sm cursor-pointer">
                 ذخیره شماره موبایل
               </label>
             </div>
 
             {/* Submit Button */}
             <Button
               type="submit"
               className="w-full h-11 text-base"
               disabled={loading}
             >
               {loading ? (
                 <div className="flex items-center gap-2">
                   <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   <span>در حال ورود...</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-2">
                   <span className="material-symbols-outlined">login</span>
                   <span>ورود به پنل</span>
                 </div>
               )}
             </Button>
           </form>
 
           {/* Back to Home */}
           <div className="mt-6 text-center">
             <Button
               variant="ghost"
               onClick={() => navigate('/')}
               className="text-muted-foreground hover:text-foreground"
             >
               <span className="material-symbols-outlined text-sm ml-1">arrow_back</span>
               بازگشت به صفحه اصلی
             </Button>
           </div>
         </CardContent>
       </Card>
     </div>
   );
 };
 
 export default AdminLogin;