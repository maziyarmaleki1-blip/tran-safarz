import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Employee {
  id: string;
  user_id: string;
  role: 'admin' | 'employee';
  permissions: string[];
  created_at: string;
  profile?: {
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    email: string | null;
  };
}

const AVAILABLE_PERMISSIONS = [
  { key: 'reservations', label: 'رزروها', icon: 'confirmation_number' },
  { key: 'support', label: 'پشتیبانی', icon: 'headset_mic' },
] as const;

interface EmployeeManagementProps {
  isAdmin: boolean;
}

export const EmployeeManagement = ({ isAdmin }: EmployeeManagementProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'employee' as 'admin' | 'employee',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles for each employee
      const employeesWithProfiles: Employee[] = [];
      for (const role of roles || []) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone_number, email')
          .eq('id', role.user_id)
          .maybeSingle();

        employeesWithProfiles.push({
          ...role,
          profile: profile || undefined,
        });
      }

      setEmployees(employeesWithProfiles);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('خطا در دریافت لیست کارمندان');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    if (!formData.phoneNumber || !formData.firstName || !formData.lastName || !formData.password) {
      toast.error('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    try {
      setSubmitting(true);

      // Create user account using the phone@phone.local format
      const email = `${formData.phoneNumber}@phone.local`;
      
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone_number: formData.phoneNumber,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('کاربر ایجاد نشد');

      // Add role for the new user
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: formData.role,
        });

      if (roleError) throw roleError;

      toast.success('کارمند با موفقیت اضافه شد');
      setIsAddDialogOpen(false);
      setFormData({
        phoneNumber: '',
        firstName: '',
        lastName: '',
        password: '',
        role: 'employee',
      });
      fetchEmployees();
    } catch (error: any) {
      console.error('Error adding employee:', error);
      if (error.message?.includes('already registered')) {
        toast.error('این شماره موبایل قبلاً ثبت شده است');
      } else {
        toast.error('خطا در ایجاد کارمند');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveEmployee = async (employeeId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', employeeId);

      if (error) throw error;

      toast.success('دسترسی کارمند حذف شد');
      fetchEmployees();
    } catch (error) {
      console.error('Error removing employee:', error);
      toast.error('خطا در حذف دسترسی');
    }
  };

  const handleTogglePermission = async (employee: Employee, permKey: string) => {
    if (employee.role === 'admin') return; // Admins always have all permissions
    
    const current = employee.permissions || ['reservations'];
    const updated = current.includes(permKey)
      ? current.filter(p => p !== permKey)
      : [...current, permKey];
    
    // Must have at least one permission
    if (updated.length === 0) {
      toast.error('کارمند باید حداقل یک دسترسی داشته باشد');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ permissions: updated } as any)
        .eq('id', employee.id);

      if (error) throw error;

      setEmployees(prev => prev.map(e => 
        e.id === employee.id ? { ...e, permissions: updated } : e
      ));
      toast.success('دسترسی‌ها به‌روزرسانی شد');
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('خطا در به‌روزرسانی دسترسی‌ها');
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return (
        <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
          مدیر
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
        کارمند
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('fa-IR').format(new Date(dateStr));
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          شما دسترسی به این بخش ندارید
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="material-symbols-outlined">group</span>
            مدیریت کارمندان
          </CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <span className="material-symbols-outlined text-lg ml-1">person_add</span>
            افزودن کارمند
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-24" />
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نام</TableHead>
                  <TableHead className="text-right">موبایل</TableHead>
                  <TableHead className="text-right">نقش</TableHead>
                  <TableHead className="text-right">دسترسی‌ها</TableHead>
                  <TableHead className="text-right">تاریخ عضویت</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map(employee => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      {employee.profile?.first_name} {employee.profile?.last_name}
                    </TableCell>
                    <TableCell dir="ltr" className="text-right">
                      {employee.profile?.phone_number || '-'}
                    </TableCell>
                    <TableCell>{getRoleBadge(employee.role)}</TableCell>
                    <TableCell>
                      {employee.role === 'admin' ? (
                        <span className="text-xs text-muted-foreground">دسترسی کامل</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {AVAILABLE_PERMISSIONS.map(perm => (
                            <label key={perm.key} className="flex items-center gap-1.5 cursor-pointer">
                              <Checkbox
                                checked={(employee.permissions || ['reservations']).includes(perm.key)}
                                onCheckedChange={() => handleTogglePermission(employee, perm.key)}
                              />
                              <span className="text-xs">{perm.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(employee.created_at)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEmployee(employee.id, employee.user_id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title="حذف دسترسی"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {employees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      هیچ کارمندی ثبت نشده است
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-symbols-outlined">person_add</span>
              افزودن کارمند جدید
            </DialogTitle>
            <DialogDescription>
              اطلاعات کارمند جدید را وارد کنید
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نام</Label>
                <Input
                  placeholder="نام"
                  value={formData.firstName}
                  onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>نام خانوادگی</Label>
                <Input
                  placeholder="نام خانوادگی"
                  value={formData.lastName}
                  onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>شماره موبایل</Label>
              <Input
                placeholder="09123456789"
                dir="ltr"
                className="text-left"
                value={formData.phoneNumber}
                onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>رمز عبور</Label>
              <Input
                type="password"
                placeholder="حداقل ۶ کاراکتر"
                value={formData.password}
                onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>نقش</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'admin' | 'employee') =>
                  setFormData(prev => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">کارمند</SelectItem>
                  <SelectItem value="admin">مدیر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full mt-4"
              onClick={handleAddEmployee}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin ml-2">progress_activity</span>
                  در حال ثبت...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined ml-2">check</span>
                  ثبت کارمند
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
