import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-train.jpg';

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const trainId = parseInt(searchParams.get('train') || '1');
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const passengers = parseInt(searchParams.get('passengers') || '1');

  const train = trains[trainId] || trains[1];
  const totalPrice = train.price * passengers;

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  const handlePayment = async () => {
    if (!user) {
      toast({ title: 'لطفاً ابتدا وارد حساب کاربری شوید', variant: 'destructive' });
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Generate tracking code
      const trackingCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Get passenger data from session storage
      const passengerData = sessionStorage.getItem('passengerData');
      const parsedPassengers = passengerData ? JSON.parse(passengerData) : null;
      
      // Get selected filters from session storage
      const filtersData = sessionStorage.getItem('selectedFilters');
      const selectedFilters = filtersData ? JSON.parse(filtersData) : null;
      
      // Create reservation in database
      const { error: reservationError } = await supabase
        .from('reservations')
        .insert({
          user_id: user.id,
          reservation_code: trackingCode,
          origin: from,
          destination: to,
          departure_date: new Date().toISOString().split('T')[0],
          departure_time: train.departure,
          train_name: train.name,
          wagon_type: 'عادی',
          passenger_count: passengers,
          total_price: totalPrice,
          status: 'confirmed',
          passengers: parsedPassengers,
          // Save selected filters
          selected_wagon_types: selectedFilters?.compartmentTypes || [],
          selected_time_slots: selectedFilters?.departureTimeSlots || [],
          price_range_min: selectedFilters?.priceRangeMin || null,
          price_range_max: selectedFilters?.priceRangeMax || null,
        });

      if (reservationError) throw reservationError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'purchase',
          amount: totalPrice,
          description: `خرید بلیط ${cities[from]} → ${cities[to]}`,
        });

      if (transactionError) throw transactionError;

      // Clear session storage
      sessionStorage.removeItem('passengerData');
      sessionStorage.removeItem('userCredentials');

      // Navigate to confirmation
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
              <h1 className="text-xl font-bold">{t('payment')}</h1>
            </div>
          </div>
        </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-card/95 backdrop-blur-md border-border/50">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">confirmation_number</span>
                {t('ticketDetails')}
              </h2>
              
              <div className="space-y-4">
                {/* Route */}
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="size-12 rounded-xl gradient-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-foreground">train</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">قطار {train.name}</p>
                    <p className="text-sm text-muted-foreground">شماره {train.number}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-2 font-medium">
                      <span>{cities[from]}</span>
                      <span className="material-symbols-outlined text-muted-foreground text-sm">arrow_back</span>
                      <span>{cities[to]}</span>
                    </div>
                  </div>
                </div>

                {/* Time Info */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold">{train.departure}</p>
                    <p className="text-sm text-muted-foreground">{t('departure')}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold">{train.duration}</p>
                    <p className="text-sm text-muted-foreground">{t('duration')}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold">{train.arrival}</p>
                    <p className="text-sm text-muted-foreground">{t('arrival')}</p>
                  </div>
                </div>

                {/* Passengers */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">group</span>
                    <span>{t('passengers')}</span>
                  </div>
                  <span className="font-bold">{passengers} {t('passenger')}</span>
                </div>
              </div>
            </Card>

            {/* Payment Methods */}
            <Card className="p-6 bg-card/95 backdrop-blur-md border-border/50">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
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
              </RadioGroup>
            </Card>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4 bg-card/95 backdrop-blur-md border-border/50">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">receipt</span>
                {t('priceSummary')}
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('ticketPrice')}</span>
                  <span>{formatPrice(train.price)} {t('toman')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('passengerCount')}</span>
                  <span>× {passengers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('tax')}</span>
                  <span className="text-success">{t('free')}</span>
                </div>
                <div className="border-t border-border my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-bold">{t('totalPrice')}</span>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</p>
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
