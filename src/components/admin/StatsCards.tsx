import { Card, CardContent } from '@/components/ui/card';

interface StatsCardsProps {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
}

export const StatsCards = ({ total, confirmed, pending, cancelled }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <span className="material-symbols-outlined text-primary text-2xl">description</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{total}</p>
            <p className="text-sm text-muted-foreground">کل رزروها</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-success/10">
            <span className="material-symbols-outlined text-success text-2xl">check_circle</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{confirmed}</p>
            <p className="text-sm text-muted-foreground">تأیید شده</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gold/10">
            <span className="material-symbols-outlined text-gold text-2xl">schedule</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{pending}</p>
            <p className="text-sm text-muted-foreground">در انتظار</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-destructive/10">
            <span className="material-symbols-outlined text-destructive text-2xl">cancel</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{cancelled}</p>
            <p className="text-sm text-muted-foreground">لغو شده</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
