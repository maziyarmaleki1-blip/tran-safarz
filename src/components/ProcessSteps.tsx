import { useLanguage } from '@/contexts/LanguageContext';

interface ProcessStepsProps {
  /** 1-based index of the current active step (1-5) */
  activeStep?: number;
  /** Optional className for the outer container */
  className?: string;
}

export function ProcessSteps({ activeStep = 1, className = '' }: ProcessStepsProps) {
  const { t } = useLanguage();

  const steps = [
    { icon: 'edit_note', title: t('step1Title'), desc: t('step1Desc') },
    { icon: 'badge', title: t('step2Title'), desc: t('step2Desc') },
    { icon: 'payments', title: t('step3Title'), desc: t('step3Desc') },
    { icon: 'manage_search', title: t('step4Title'), desc: t('step4Desc') },
    { icon: 'confirmation_number', title: t('step5Title'), desc: t('step5Desc') },
  ];

  return (
    <div className={`bg-muted/40 border border-border/50 rounded-xl p-4 ${className}`}>
      <p className="text-xs font-semibold text-muted-foreground mb-3 text-center">{t('howItWorks')}</p>
      <div className="grid grid-cols-5 gap-1 sm:gap-2 relative">
        {steps.map((step, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < activeStep;
          const isActive = stepNum === activeStep;

          return (
            <div key={i} className="flex flex-col items-center text-center gap-1.5 relative">
              {/* Connector line */}
              {i < 4 && (
                <div className={`hidden sm:block absolute top-5 start-[calc(50%+16px)] w-[calc(100%-32px)] h-0.5 z-0 ${
                  isDone ? 'bg-primary/50' : 'bg-border/60'
                }`} />
              )}
              <div className={`relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                isDone
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted border border-border text-muted-foreground'
              }`}>
                {isDone ? (
                  <span className="material-symbols-outlined text-lg sm:text-xl">check</span>
                ) : (
                  <span className="material-symbols-outlined text-lg sm:text-xl">{step.icon}</span>
                )}
              </div>
              <span className={`text-[10px] sm:text-xs font-bold leading-tight ${
                isActive ? 'text-primary' : isDone ? 'text-primary/70' : 'text-foreground'
              }`}>
                {step.title}
              </span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight hidden sm:block">
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
