import { useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

const NotFound = () => {
  const location = useLocation();

  return (
    <MainLayout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center size-20 rounded-full bg-muted mb-6">
            <span className="material-symbols-outlined text-4xl text-muted-foreground">train</span>
          </div>
          <h1 className="mb-4 text-6xl font-bold text-primary">۴۰۴</h1>
          <p className="mb-6 text-xl text-muted-foreground">صفحه مورد نظر یافت نشد</p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined">home</span>
            بازگشت به خانه
          </a>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;