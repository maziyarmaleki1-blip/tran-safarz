import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

interface PaymentMethod {
  id: string;
  type: 'card_transfer' | 'gateway' | 'wallet';
  name: string;
  is_active: boolean;
  card_number: string | null;
  card_holder_name: string | null;
  bank_name: string | null;
  gateway_provider: string | null;
  merchant_id: string | null;
  min_balance: number | null;
  description: string | null;
  display_order: number;
  created_at: string;
}

const BANK_NAMES = [
  'بانک ملی', 'بانک ملت', 'بانک صادرات', 'بانک تجارت', 'بانک سپه',
  'بانک پاسارگاد', 'بانک پارسیان', 'بانک سامان', 'بانک اقتصاد نوین',
  'بانک آینده', 'بانک شهر', 'بانک دی', 'بانک رسالت', 'بانک کشاورزی',
];

const GATEWAY_PROVIDERS = [
  { value: 'zarinpal', label: 'زرین‌پال' },
  { value: 'idpay', label: 'آی‌دی پی' },
  { value: 'payping', label: 'پی‌پینگ' },
  { value: 'nextpay', label: 'نکست‌پی' },
  { value: 'jibit', label: 'جیبیت' },
  { value: 'sep', label: 'سپ (سامان)' },
  { value: 'mellat', label: 'به‌پرداخت ملت' },
  { value: 'parsian', label: 'پارسیان' },
];

const PaymentMethodsManagement = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formType, setFormType] = useState<'card_transfer' | 'gateway' | 'wallet'>('card_transfer');
  const [formName, setFormName] = useState('');
  const [formCardNumber, setFormCardNumber] = useState('');
  const [formCardHolder, setFormCardHolder] = useState('');
  const [formBankName, setFormBankName] = useState('');
  const [formGatewayProvider, setFormGatewayProvider] = useState('');
  const [formMerchantId, setFormMerchantId] = useState('');
  const [formMinBalance, setFormMinBalance] = useState('0');
  const [formDescription, setFormDescription] = useState('');

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('type')
        .order('display_order');

      if (error) throw error;
      setMethods((data as unknown as PaymentMethod[]) || []);
    } catch (error) {
      console.error(error);
      toast.error('خطا در دریافت روش‌های پرداخت');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1-');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const resetForm = () => {
    setFormType('card_transfer');
    setFormName('');
    setFormCardNumber('');
    setFormCardHolder('');
    setFormBankName('');
    setFormGatewayProvider('');
    setFormMerchantId('');
    setFormMinBalance('0');
    setFormDescription('');
    setEditingMethod(null);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormType(method.type);
    setFormName(method.name);
    setFormCardNumber(method.card_number ? formatCardNumber(method.card_number) : '');
    setFormCardHolder(method.card_holder_name || '');
    setFormBankName(method.bank_name || '');
    setFormGatewayProvider(method.gateway_provider || '');
    setFormMerchantId(method.merchant_id || '');
    setFormMinBalance(String(method.min_balance || 0));
    setFormDescription(method.description || '');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      toast.error('نام روش پرداخت الزامی است');
      return;
    }

    if (formType === 'card_transfer') {
      const digits = formCardNumber.replace(/\D/g, '');
      if (digits.length !== 16) {
        toast.error('شماره کارت باید ۱۶ رقم باشد');
        return;
      }
      if (!formCardHolder.trim()) {
        toast.error('نام صاحب کارت الزامی است');
        return;
      }
    }

    if (formType === 'gateway' && !formGatewayProvider) {
      toast.error('ارائه‌دهنده درگاه الزامی است');
      return;
    }

    try {
      setSaving(true);
      const payload: Record<string, unknown> = {
        type: formType,
        name: formName.trim(),
        description: formDescription.trim() || null,
        card_number: formType === 'card_transfer' ? formCardNumber.replace(/\D/g, '') : null,
        card_holder_name: formType === 'card_transfer' ? formCardHolder.trim() : null,
        bank_name: formType === 'card_transfer' ? formBankName : null,
        gateway_provider: formType === 'gateway' ? formGatewayProvider : null,
        merchant_id: formType === 'gateway' ? formMerchantId.trim() : null,
        min_balance: formType === 'wallet' ? Number(formMinBalance) || 0 : null,
      };

      if (editingMethod) {
        const { error } = await supabase
          .from('payment_methods')
          .update(payload as any)
          .eq('id', editingMethod.id);
        if (error) throw error;
        toast.success('روش پرداخت با موفقیت ویرایش شد');
      } else {
        const { error } = await supabase
          .from('payment_methods')
          .insert([payload as any]);
        if (error) throw error;
        toast.success('روش پرداخت با موفقیت اضافه شد');
      }

      setDialogOpen(false);
      resetForm();
      fetchMethods();
    } catch (error) {
      console.error(error);
      toast.error('خطا در ذخیره روش پرداخت');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (method: PaymentMethod) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_active: !method.is_active })
        .eq('id', method.id);
      if (error) throw error;
      toast.success(method.is_active ? 'غیرفعال شد' : 'فعال شد');
      fetchMethods();
    } catch (error) {
      console.error(error);
      toast.error('خطا در تغییر وضعیت');
    }
  };

  const deleteMethod = async (method: PaymentMethod) => {
    if (!confirm(`آیا از حذف "${method.name}" مطمئن هستید؟`)) return;
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', method.id);
      if (error) throw error;
      toast.success('روش پرداخت حذف شد');
      fetchMethods();
    } catch (error) {
      console.error(error);
      toast.error('خطا در حذف روش پرداخت');
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'card_transfer':
        return <Badge variant="outline" className="gap-1"><span className="material-symbols-outlined text-sm">swap_horiz</span>کارت به کارت</Badge>;
      case 'gateway':
        return <Badge variant="outline" className="gap-1"><span className="material-symbols-outlined text-sm">credit_card</span>درگاه بانکی</Badge>;
      case 'wallet':
        return <Badge variant="outline" className="gap-1"><span className="material-symbols-outlined text-sm">account_balance_wallet</span>کیف پول</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getMethodDetails = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card_transfer':
        return (
          <div className="text-sm text-muted-foreground space-y-1">
            <p>کارت: {method.card_number ? formatCardNumber(method.card_number) : '—'}</p>
            <p>صاحب کارت: {method.card_holder_name || '—'}</p>
            {method.bank_name && <p>بانک: {method.bank_name}</p>}
          </div>
        );
      case 'gateway':
        return (
          <div className="text-sm text-muted-foreground space-y-1">
            <p>ارائه‌دهنده: {GATEWAY_PROVIDERS.find(g => g.value === method.gateway_provider)?.label || method.gateway_provider || '—'}</p>
            {method.merchant_id && <p>شناسه پذیرنده: {method.merchant_id}</p>}
          </div>
        );
      case 'wallet':
        return (
          <div className="text-sm text-muted-foreground">
            <p>حداقل موجودی: {formatPrice(method.min_balance || 0)} تومان</p>
          </div>
        );
      default:
        return null;
    }
  };

  const cardTransfers = methods.filter(m => m.type === 'card_transfer');
  const gateways = methods.filter(m => m.type === 'gateway');
  const wallets = methods.filter(m => m.type === 'wallet');

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">مدیریت روش‌های پرداخت</h2>
          <p className="text-sm text-muted-foreground">اضافه، ویرایش و مدیریت روش‌های پرداخت پلتفرم</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <span className="material-symbols-outlined text-lg">add</span>
          افزودن روش پرداخت
        </Button>
      </div>

      {/* Card Transfer Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="material-symbols-outlined">swap_horiz</span>
            کارت به کارت
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">در حال بارگذاری...</div>
          ) : cardTransfers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <span className="material-symbols-outlined text-4xl mb-2 block">credit_card_off</span>
              هیچ کارتی تعریف نشده است
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نام</TableHead>
                  <TableHead className="text-right">شماره کارت</TableHead>
                  <TableHead className="text-right">صاحب کارت</TableHead>
                  <TableHead className="text-right">بانک</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cardTransfers.map(method => (
                  <TableRow key={method.id}>
                    <TableCell className="font-medium">{method.name}</TableCell>
                    <TableCell className="font-mono" dir="ltr">{method.card_number ? formatCardNumber(method.card_number) : '—'}</TableCell>
                    <TableCell>{method.card_holder_name || '—'}</TableCell>
                    <TableCell>{method.bank_name || '—'}</TableCell>
                    <TableCell>
                      <Switch checked={method.is_active} onCheckedChange={() => toggleActive(method)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(method)}>
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMethod(method)} className="text-destructive">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Gateway Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="material-symbols-outlined">credit_card</span>
            درگاه‌های بانکی
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">در حال بارگذاری...</div>
          ) : gateways.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <span className="material-symbols-outlined text-4xl mb-2 block">money_off</span>
              هیچ درگاهی تعریف نشده است
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نام</TableHead>
                  <TableHead className="text-right">ارائه‌دهنده</TableHead>
                  <TableHead className="text-right">شناسه پذیرنده</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gateways.map(method => (
                  <TableRow key={method.id}>
                    <TableCell className="font-medium">{method.name}</TableCell>
                    <TableCell>{GATEWAY_PROVIDERS.find(g => g.value === method.gateway_provider)?.label || method.gateway_provider || '—'}</TableCell>
                    <TableCell className="font-mono" dir="ltr">{method.merchant_id || '—'}</TableCell>
                    <TableCell>
                      <Switch checked={method.is_active} onCheckedChange={() => toggleActive(method)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(method)}>
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMethod(method)} className="text-destructive">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Wallet Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            کیف پول
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">در حال بارگذاری...</div>
          ) : wallets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">تنظیمات کیف پول یافت نشد</div>
          ) : (
            <div className="space-y-4">
              {wallets.map(method => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-muted-foreground">حداقل موجودی: {formatPrice(method.min_balance || 0)} تومان</p>
                    {method.description && <p className="text-sm text-muted-foreground">{method.description}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{method.is_active ? 'فعال' : 'غیرفعال'}</Label>
                      <Switch checked={method.is_active} onCheckedChange={() => toggleActive(method)} />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(method)}>
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingMethod ? 'ویرایش روش پرداخت' : 'افزودن روش پرداخت جدید'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!editingMethod && (
              <div className="space-y-2">
                <Label>نوع روش پرداخت</Label>
                <Select value={formType} onValueChange={(v) => setFormType(v as typeof formType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card_transfer">کارت به کارت</SelectItem>
                    <SelectItem value="gateway">درگاه بانکی</SelectItem>
                    <SelectItem value="wallet">کیف پول</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>نام</Label>
              <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="مثلاً: کارت ملت - اصلی" />
            </div>

            {formType === 'card_transfer' && (
              <>
                <div className="space-y-2">
                  <Label>شماره کارت</Label>
                  <Input
                    dir="ltr"
                    className="text-center font-mono tracking-wider"
                    value={formCardNumber}
                    onChange={e => setFormCardNumber(formatCardNumber(e.target.value))}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    maxLength={19}
                  />
                </div>
                <div className="space-y-2">
                  <Label>نام صاحب کارت</Label>
                  <Input value={formCardHolder} onChange={e => setFormCardHolder(e.target.value)} placeholder="نام و نام خانوادگی" />
                </div>
                <div className="space-y-2">
                  <Label>بانک</Label>
                  <Select value={formBankName} onValueChange={setFormBankName}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب بانک" />
                    </SelectTrigger>
                    <SelectContent>
                      {BANK_NAMES.map(bank => (
                        <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {formType === 'gateway' && (
              <>
                <div className="space-y-2">
                  <Label>ارائه‌دهنده درگاه</Label>
                  <Select value={formGatewayProvider} onValueChange={setFormGatewayProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب ارائه‌دهنده" />
                    </SelectTrigger>
                    <SelectContent>
                      {GATEWAY_PROVIDERS.map(gw => (
                        <SelectItem key={gw.value} value={gw.value}>{gw.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>شناسه پذیرنده (Merchant ID)</Label>
                  <Input dir="ltr" value={formMerchantId} onChange={e => setFormMerchantId(e.target.value)} placeholder="merchant-id" />
                </div>
              </>
            )}

            {formType === 'wallet' && (
              <div className="space-y-2">
                <Label>حداقل موجودی برای پرداخت (تومان)</Label>
                <Input
                  type="number"
                  dir="ltr"
                  value={formMinBalance}
                  onChange={e => setFormMinBalance(e.target.value)}
                  placeholder="0"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>توضیحات (اختیاری)</Label>
              <Input value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="توضیحات اضافی..." />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>انصراف</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'در حال ذخیره...' : editingMethod ? 'ذخیره تغییرات' : 'افزودن'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentMethodsManagement;
