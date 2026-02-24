import { useState } from 'react';
import { useDepositSettings, DepositSetting } from '@/hooks/useDepositSettings';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

const DepositSettingsManagement = () => {
  const { deposits, loading, updateDeposit, addDeposit, deleteDeposit, wagonTypeLabels } = useDepositSettings();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newType, setNewType] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  const availableTypes = Object.keys(wagonTypeLabels).filter(
    type => !deposits.some(d => d.wagon_type === type)
  );

  const handleSave = async (id: string, isActive: boolean) => {
    const amount = parseInt(editAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error('مبلغ نامعتبر است');
      return;
    }
    const { error } = await updateDeposit(id, amount, isActive);
    if (error) {
      toast.error('خطا در ذخیره');
    } else {
      toast.success('ذخیره شد');
      setEditingId(null);
    }
  };

  const handleToggle = async (deposit: DepositSetting) => {
    const { error } = await updateDeposit(deposit.id, deposit.amount, !deposit.is_active);
    if (error) toast.error('خطا');
    else toast.success(deposit.is_active ? 'غیرفعال شد' : 'فعال شد');
  };

  const handleAdd = async () => {
    if (!newType || !newAmount) {
      toast.error('لطفاً تمام فیلدها را پر کنید');
      return;
    }
    const amount = parseInt(newAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error('مبلغ نامعتبر است');
      return;
    }
    const { error } = await addDeposit(newType, amount);
    if (error) toast.error('خطا در افزودن');
    else {
      toast.success('اضافه شد');
      setDialogOpen(false);
      setNewType('');
      setNewAmount('');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئنید؟')) return;
    const { error } = await deleteDeposit(id);
    if (error) toast.error('خطا در حذف');
    else toast.success('حذف شد');
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center gap-3">
          <div className="size-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <span className="text-muted-foreground">در حال بارگذاری...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">تنظیمات بیعانه</h2>
          <p className="text-sm text-muted-foreground">مبلغ بیعانه به ازای هر مسافر بر اساس نوع سالن</p>
        </div>
        {availableTypes.length > 0 && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <span className="material-symbols-outlined text-lg">add</span>
                افزودن نوع سالن
              </Button>
            </DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader>
                <DialogTitle>افزودن بیعانه جدید</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>نوع سالن</Label>
                  <Select value={newType} onValueChange={setNewType}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {wagonTypeLabels[type] || type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>مبلغ بیعانه (تومان)</Label>
                  <Input
                    type="number"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    placeholder="مثلاً 200000"
                    dir="ltr"
                  />
                </div>
                <Button onClick={handleAdd} className="w-full">ذخیره</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">نوع سالن</TableHead>
              <TableHead className="text-right">مبلغ بیعانه (هر نفر)</TableHead>
              <TableHead className="text-center">وضعیت</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deposits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  هیچ تنظیمی وجود ندارد
                </TableCell>
              </TableRow>
            ) : (
              deposits.map(deposit => (
                <TableRow key={deposit.id}>
                  <TableCell className="font-medium">
                    {wagonTypeLabels[deposit.wagon_type] || deposit.wagon_type}
                  </TableCell>
                  <TableCell>
                    {editingId === deposit.id ? (
                      <Input
                        type="number"
                        value={editAmount}
                        onChange={e => setEditAmount(e.target.value)}
                        className="w-40"
                        dir="ltr"
                      />
                    ) : (
                      <span>{formatPrice(deposit.amount)} تومان</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={deposit.is_active}
                      onCheckedChange={() => handleToggle(deposit)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      {editingId === deposit.id ? (
                        <>
                          <Button size="sm" onClick={() => handleSave(deposit.id, deposit.is_active)}>
                            ذخیره
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                            لغو
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(deposit.id);
                              setEditAmount(deposit.amount.toString());
                            }}
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => handleDelete(deposit.id)}
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          💡 بیعانه مبلغی است که مسافر هنگام ثبت درخواست شکار بلیط پرداخت می‌کند. پس از پیدا شدن بلیط، مابقی مبلغ (قیمت بلیط + کارمزد - بیعانه) از مسافر دریافت خواهد شد.
        </p>
      </Card>
    </div>
  );
};

export default DepositSettingsManagement;
