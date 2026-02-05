import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useServiceFee } from '@/hooks/useServiceFee';
import { toast } from 'sonner';
import { Settings, Save } from 'lucide-react';

const ServiceFeeSettings = () => {
  const { serviceFee, loading, updateServiceFee, fetchServiceFee } = useServiceFee();
  const [amount, setAmount] = useState<string>('');
  const [feeType, setFeeType] = useState<'fixed' | 'percentage'>('fixed');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (serviceFee) {
      setAmount(serviceFee.amount.toString());
      setFeeType(serviceFee.fee_type);
    }
  }, [serviceFee]);

  const handleSave = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      toast.error('مبلغ نامعتبر است');
      return;
    }

    setSaving(true);
    const { error } = await updateServiceFee(numAmount, feeType);
    setSaving(false);

    if (error) {
      toast.error('خطا در ذخیره تنظیمات');
    } else {
      toast.success('کارمزد با موفقیت به‌روزرسانی شد');
    }
  };

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="size-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Settings className="size-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold">تنظیمات کارمزد خدمات</h2>
          <p className="text-sm text-muted-foreground">
            این مبلغ به قیمت بلیط اضافه می‌شود
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Fee Type */}
        <div className="space-y-3">
          <Label>نوع کارمزد</Label>
          <RadioGroup
            value={feeType}
            onValueChange={(val) => setFeeType(val as 'fixed' | 'percentage')}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="fixed" id="fixed" />
              <Label htmlFor="fixed" className="cursor-pointer">مبلغ ثابت (تومان)</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="percentage" id="percentage" />
              <Label htmlFor="percentage" className="cursor-pointer">درصدی</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">
            {feeType === 'fixed' ? 'مبلغ کارمزد (تومان)' : 'درصد کارمزد'}
          </Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={feeType === 'fixed' ? '15000' : '5'}
            className="text-lg"
            min={0}
          />
          {feeType === 'fixed' && amount && (
            <p className="text-sm text-muted-foreground">
              معادل: {formatPrice(parseFloat(amount) || 0)} تومان
            </p>
          )}
        </div>

        {/* Example Calculation */}
        {serviceFee && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <p className="text-sm font-medium">نمونه محاسبه:</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>قیمت بلیط: {formatPrice(250000)} تومان</p>
              <p>
                کارمزد: {feeType === 'fixed' 
                  ? formatPrice(parseFloat(amount) || 0) 
                  : formatPrice(Math.round(250000 * (parseFloat(amount) || 0) / 100))
                } تومان
              </p>
              <p className="font-medium text-foreground">
                قیمت نهایی: {formatPrice(
                  250000 + (feeType === 'fixed' 
                    ? (parseFloat(amount) || 0) 
                    : Math.round(250000 * (parseFloat(amount) || 0) / 100))
                )} تومان
              </p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full gap-2"
        >
          {saving ? (
            <>
              <span className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              در حال ذخیره...
            </>
          ) : (
            <>
              <Save className="size-4" />
              ذخیره تغییرات
            </>
          )}
        </Button>

        {/* Last Update Info */}
        {serviceFee?.updated_at && (
          <p className="text-xs text-center text-muted-foreground">
            آخرین به‌روزرسانی: {new Date(serviceFee.updated_at).toLocaleDateString('fa-IR')}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ServiceFeeSettings;
