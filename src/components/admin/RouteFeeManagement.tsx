import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Route } from 'lucide-react';
import { toast } from 'sonner';

const CITIES = [
  'تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'اهواز',
  'کرمان', 'یزد', 'بندرعباس', 'رشت', 'کرمانشاه', 'همدان',
  'قم', 'ساری', 'گرگان', 'زنجان', 'اردبیل', 'سمنان',
  'قزوین', 'خرم‌آباد',
];

interface RouteFee {
  id: string;
  origin: string;
  destination: string;
  fixed_fee: number;
  percentage_fee: number;
  is_active: boolean;
  created_at: string;
}

const RouteFeeManagement = () => {
  const [routes, setRoutes] = useState<RouteFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteFee | null>(null);

  // Form state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [fixedFee, setFixedFee] = useState('');
  const [percentageFee, setPercentageFee] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('route_fees')
        .select('*')
        .order('origin', { ascending: true });

      if (error) throw error;
      setRoutes(data || []);
    } catch (error) {
      console.error('Error fetching routes:', error);
      toast.error('خطا در دریافت مسیرها');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setOrigin('');
    setDestination('');
    setFixedFee('');
    setPercentageFee('');
    setEditingRoute(null);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (route: RouteFee) => {
    setEditingRoute(route);
    setOrigin(route.origin);
    setDestination(route.destination);
    setFixedFee(route.fixed_fee.toString());
    setPercentageFee(route.percentage_fee.toString());
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!origin || !destination) {
      toast.error('مبدأ و مقصد را انتخاب کنید');
      return;
    }
    if (origin === destination) {
      toast.error('مبدأ و مقصد نمی‌توانند یکسان باشند');
      return;
    }

    const fee = parseFloat(fixedFee) || 0;
    const pct = parseFloat(percentageFee) || 0;

    try {
      if (editingRoute) {
        const { error } = await supabase
          .from('route_fees')
          .update({
            origin,
            destination,
            fixed_fee: fee,
            percentage_fee: pct,
          })
          .eq('id', editingRoute.id);

        if (error) throw error;
        toast.success('مسیر با موفقیت ویرایش شد');
      } else {
        const { error } = await supabase
          .from('route_fees')
          .insert({
            origin,
            destination,
            fixed_fee: fee,
            percentage_fee: pct,
          });

        if (error) {
          if (error.code === '23505') {
            toast.error('این مسیر قبلاً تعریف شده است');
            return;
          }
          throw error;
        }
        toast.success('مسیر جدید با موفقیت اضافه شد');
      }

      setDialogOpen(false);
      resetForm();
      fetchRoutes();
    } catch (error) {
      console.error('Error saving route:', error);
      toast.error('خطا در ذخیره مسیر');
    }
  };

  const toggleActive = async (route: RouteFee) => {
    try {
      const { error } = await supabase
        .from('route_fees')
        .update({ is_active: !route.is_active })
        .eq('id', route.id);

      if (error) throw error;
      fetchRoutes();
      toast.success(route.is_active ? 'مسیر غیرفعال شد' : 'مسیر فعال شد');
    } catch (error) {
      console.error('Error toggling route:', error);
      toast.error('خطا در تغییر وضعیت');
    }
  };

  const deleteRoute = async (id: string) => {
    if (!confirm('آیا از حذف این مسیر مطمئن هستید؟')) return;

    try {
      const { error } = await supabase
        .from('route_fees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('مسیر حذف شد');
      fetchRoutes();
    } catch (error) {
      console.error('Error deleting route:', error);
      toast.error('خطا در حذف مسیر');
    }
  };

  const formatPrice = (n: number) =>
    n.toLocaleString('fa-IR') + ' تومان';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Route className="size-5 text-primary" />
          <h2 className="text-lg font-bold">کارمزد مسیرها</h2>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5" onClick={openAddDialog}>
              <Plus className="size-4" />
              مسیر جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>
                {editingRoute ? 'ویرایش مسیر' : 'افزودن مسیر جدید'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>مبدأ</Label>
                  <Select value={origin} onValueChange={setOrigin}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب شهر" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>مقصد</Label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب شهر" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.filter((c) => c !== origin).map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>کارمزد ثابت (تومان)</Label>
                  <Input
                    type="number"
                    value={fixedFee}
                    onChange={(e) => setFixedFee(e.target.value)}
                    placeholder="مثلاً 100000"
                    dir="ltr"
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <Label>کارمزد درصدی (%)</Label>
                  <Input
                    type="number"
                    value={percentageFee}
                    onChange={(e) => setPercentageFee(e.target.value)}
                    placeholder="مثلاً 5"
                    dir="ltr"
                    min={0}
                    max={100}
                    step={0.5}
                  />
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                {editingRoute ? 'ذخیره تغییرات' : 'افزودن مسیر'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Routes Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">مبدأ</TableHead>
              <TableHead className="text-right">مقصد</TableHead>
              <TableHead className="text-right">کارمزد ثابت</TableHead>
              <TableHead className="text-right">کارمزد درصدی</TableHead>
              <TableHead className="text-center">وضعیت</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  در حال بارگذاری...
                </TableCell>
              </TableRow>
            ) : routes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  هنوز مسیری تعریف نشده است
                </TableCell>
              </TableRow>
            ) : (
              routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.origin}</TableCell>
                  <TableCell className="font-medium">{route.destination}</TableCell>
                  <TableCell>{formatPrice(route.fixed_fee)}</TableCell>
                  <TableCell>{route.percentage_fee}%</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={route.is_active}
                      onCheckedChange={() => toggleActive(route)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => openEditDialog(route)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={() => deleteRoute(route.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default RouteFeeManagement;
