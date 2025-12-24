import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';

const Rules = () => {
  const rules = [
    { title: 'شرایط خرید بلیط', content: 'بلیط قطار قابل خرید برای تمام افراد بالای ۲ سال می‌باشد. کودکان زیر ۲ سال نیاز به بلیط ندارند.' },
    { title: 'استرداد بلیط', content: 'امکان استرداد بلیط تا ۲۴ ساعت قبل از حرکت با کسر ۱۰٪ جریمه امکان‌پذیر است. پس از آن ۳۰٪ کسر می‌گردد.' },
    { title: 'مدارک لازم', content: 'همراه داشتن کارت ملی یا شناسنامه عکسدار برای تمام مسافران الزامی است.' },
    { title: 'بار مجاز', content: 'هر مسافر مجاز به حمل ۳۰ کیلوگرم بار و یک ساک دستی می‌باشد. بار اضافه مشمول هزینه است.' },
    { title: 'حضور در ایستگاه', content: 'مسافران باید حداقل ۳۰ دقیقه قبل از حرکت در ایستگاه حضور داشته باشند.' },
  ];

  return (
    <MainLayout>
      <div className="bg-primary/5 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-2">قوانین و مقررات</h1>
          <p className="text-muted-foreground text-center">قوانین استفاده از خدمات سفیر ریل</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span className="size-6 rounded-full gradient-primary text-primary-foreground text-sm flex items-center justify-center">
                  {index + 1}
                </span>
                {rule.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{rule.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Rules;