import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useServiceFee } from '@/hooks/useServiceFee';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-train.jpg';
import BookingReview from '@/components/payment/BookingReview';

const trains: Record<number, { name: string; number: string; departure: string; arrival: string; duration: string; price: number }> = {
  1: { name: 'فدک', number: '301', departure: '06:00', arrival: '16:30', duration: '10:30', price: 250000 },
  2: { name: 'غزال', number: '302', departure: '08:30', arrival: '18:45', duration: '10:15', price: 320000 },
  3: { name: 'پردیس', number: '303', departure: '14:00', arrival: '23:30', duration: '9:30', price: 450000 },
  4: { name: 'سبز', number: '304', departure: '20:00', arrival: '06:15', duration: '10:15', price: 280000 },
  5: { name: 'نور', number: '305', departure: '22:30', arrival: '08:45', duration: '10:15', price: 350000 },
};

const cities: Record<string, string> = {
  tehran: 'تهران', mashhad: 'مشهد', isfahan: 'اصفهان', shiraz: 'شیراز',
  tabriz: 'تبریز', yazd: 'یزد', ahvaz: 'اهواز', bandarabbas: 'بندرعباس',
};

const Payment = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const { serviceFee, calculateFee, loading: feeLoading } = useServiceFee();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const trainId = parseInt(searchParams.get('train') || '1');
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const passengers = parseInt(searchParams.get('passengers') || '1');
  const dateStr = searchParams.get('date') || '';

  const train = trains[trainId] || trains[1];
  const ticketPrice = train.price * passengers;
  const serviceFeeAmount = calculateFee(ticketPrice);
  const totalPrice = ticketPrice + serviceFeeAmount;

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  const handlePayment = async () => {
    if (!user) {
      toast({ title: 'لطفاً ابتدا وارد حساب کاربری شوید', variant: 'destructive' });
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    
    try {
      const trackingCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      const passengerData = sessionStorage.getItem('passengerData');
      const parsedPassengers = passengerData ? JSON.parse(passengerData) : null;
      const filtersData = sessionStorage.getItem('selectedFilters');
      const selectedFilters = filtersData ? JSON.parse(filtersData) : null;
      
      const { error: reservationError } = await supabase
        .from('reservations')
        .insert({
          user_id: user.id,
          reservation_code: trackingCode,
          origin: from,
          destination: to,
          departure_date: dateStr || new Date().toISOString().split('T')[0],
          departure_time: train.departure,
          train_name: train.name,
          wagon_type: 'عادی',
          passenger_count: passengers,
          total_price: totalPrice,
          status: 'confirmed',
          passengers: parsedPassengers,
          selected_wagon_types: selectedFilters?.compartmentTypes || [],
          selected_time_slots: selectedFilters?.departureTimeSlots || [],
          price_range_min: selectedFilters?.priceRangeMin || null,
          price_range_max: selectedFilters?.priceRangeMax || null,
          customer_notes: selectedFilters?.customerNotes || null,
          private_compartment: selectedFilters?.privateCompartment || false,
          foreign_national: selectedFilters?.foreignNational || false,
          passenger_type: selectedFilters?.passengerType || 'regular',
          adults_count: selectedFilters?.adultsCount || 1,
          children_count: selectedFilters?.childrenCount || 0,
        });

      if (reservationError) throw reservationError;

      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'purchase',
          amount: totalPrice,
          description: `خرید بلیط ${cities[from]} → ${cities[to]}`,
        });

      if (transactionError) throw transactionError;

      sessionStorage.removeItem('passengerData');
      sessionStorage.removeItem('userCredentials');

      navigate(`/confirmation?code=${trackingCode}&train=${trainId}&from=${from}&to=${to}&passengers=${passengers}`);
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({ title: 'خطا در ثبت رزرو', description: error.message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      {/* Fixed Full-Screen Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="bg-card/80 backdrop-blur-md py-6 border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1">
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                {t('back')}
              </Button>
              <h1 className="text-xl font-bold">بررسی نهایی و پرداخت</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Review Details */}
            <div className="lg:col-span-2">
              <BookingReview
                from={from}
                to={to}
                trainName={train.name}
                trainNumber={train.number}
                departure={train.departure}
                arrival={train.arrival}
                duration={train.duration}
                passengerCount={passengers}
                dateStr={dateStr}
              />

              {/* Payment Methods */}
              <Card className="p-5 mt-5 bg-card/95 backdrop-blur-md border-border/50 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-primary rounded-r-lg" />
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2 pr-3">
                  <span className="material-symbols-outlined text-primary">payments</span>
                  {t('paymentMethod')}
                </h2>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <span className="material-symbols-outlined text-primary">credit_card</span>
                      <div>
                        <p className="font-medium">{t('cardPayment')}</p>
                        <p className="text-sm text-muted-foreground">{t('cardPaymentDesc')}</p>
                      </div>
                    </Label>
                  </div>

                  <div>
                    <div className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors cursor-pointer ${paymentMethod === 'wallet' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex items-center gap-3 cursor-pointer flex-1">
                        <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                        <div>
                          <p className="font-medium">{t('walletPayment')}</p>
                          <p className="text-sm text-muted-foreground">{t('walletPaymentDesc')}</p>
                        </div>
                      </Label>
                    </div>
                    <div className="bg-green-50 text-green-800 border border-green-200 p-3 rounded-lg mt-2 text-sm text-right">
                      🛡️ تضمین بازگشت وجه: در صورت عدم موفقیت ربات در شکار بلیط، کل مبلغ (به همراه کارمزد) فوراً به کیف پول شما باز می‌گردد یا طبق سیکل پایا به حساب بانکی واریز می‌شود.
                    </div>
                  </div>
                </RadioGroup>
              </Card>
            </div>

            {/* Price Summary - Sticky Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4 bg-card/95 backdrop-blur-md border-border/50">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">receipt</span>
                  {t('priceSummary')}
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">قیمت بلیط (پرداخت جداگانه)</span>
                    <span className="text-muted-foreground">{formatPrice(ticketPrice)} {t('toman')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('passengerCount')}</span>
                    <span>× {passengers}</span>
                  </div>
                  <div className="border-t border-border my-4" />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">کارمزد خدمات جستجو</span>
                    {feeLoading ? (
                      <span className="size-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    ) : (
                      <span className="font-medium">{formatPrice(serviceFeeAmount)} {t('toman')}</span>
                    )}
                  </div>
                  <div className="border-t border-border my-4" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold">مبلغ قابل پرداخت</span>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-primary">{formatPrice(serviceFeeAmount)}</p>
                      <p className="text-xs text-muted-foreground">{t('toman')}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handlePayment} 
                  disabled={isProcessing}
                  className="w-full mt-6 h-12 gradient-primary text-lg gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      {t('processing')}
                    </>
                  ) : (
                    <>
                      {t('payNow')}
                      <span className="material-symbols-outlined">arrow_back</span>
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm text-success">verified_user</span>
                  {t('securePayment')}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Payment;
