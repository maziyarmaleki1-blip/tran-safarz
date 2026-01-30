import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const cities: Record<string, string> = {
  tehran: 'تهران', mashhad: 'مشهد', isfahan: 'اصفهان', shiraz: 'شیراز',
  tabriz: 'تبریز', yazd: 'یزد', ahvaz: 'اهواز', bandarabbas: 'بندرعباس',
};

const Booking = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const passengers = parseInt(searchParams.get('passengers') || '1');
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  const [passengerData, setPassengerData] = useState(
    Array(passengers).fill({ firstName: '', lastName: '', nationalId: '', mobile: '', seat: '' })
  );

  const updatePassenger = (index: number, field: string, value: string) => {
    const newData = [...passengerData];
    newData[index] = { ...newData[index], [field]: value };
    setPassengerData(newData);
  };

  const handleSubmit = () => {
    const trainId = searchParams.get('train') || '1';
    navigate(`/payment?train=${trainId}&from=${from}&to=${to}&passengers=${passengers}`);
  };

  return (
    <MainLayout>
      <div className="bg-primary/5 py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1">
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
              {t('back')}
            </Button>
            <h1 className="text-xl font-bold">{t('passengerInfo')}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Route Summary */}
        <Card className="p-4 mb-6 flex items-center gap-4">
          <div className="size-10 rounded-lg gradient-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-foreground">train</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span>{cities[from]}</span>
            <span className="material-symbols-outlined text-muted-foreground">arrow_back</span>
            <span>{cities[to]}</span>
          </div>
        </Card>

        {/* Passenger Forms */}
        <div className="space-y-6">
          {passengerData.map((_, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                مسافر {index + 1}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('firstName')}</Label>
                  <Input
                    placeholder="نام"
                    value={passengerData[index].firstName}
                    onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('lastName')}</Label>
                  <Input
                    placeholder="نام خانوادگی"
                    value={passengerData[index].lastName}
                    onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('nationalId')}</Label>
                  <Input
                    placeholder="کد ملی ۱۰ رقمی"
                    value={passengerData[index].nationalId}
                    onChange={(e) => updatePassenger(index, 'nationalId', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('mobile')}</Label>
                  <Input
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    value={passengerData[index].mobile}
                    onChange={(e) => updatePassenger(index, 'mobile', e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>{t('selectSeat')}</Label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((seat) => (
                      <Button
                        key={seat}
                        variant={passengerData[index].seat === seat.toString() ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updatePassenger(index, 'seat', seat.toString())}
                        className="size-10"
                      >
                        {seat}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button onClick={handleSubmit} className="w-full mt-6 h-12 gradient-primary text-lg gap-2">
          {t('continue')}
          <span className="material-symbols-outlined">arrow_back</span>
        </Button>
      </div>
    </MainLayout>
  );
};

export default Booking;