import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Target, CheckCircle2, BarChart3 } from 'lucide-react';
import { DaySchedule } from '../types/planner';
import { toPersianDigits } from '../utils/helpers';

interface TodayProgressWidgetProps {
  todaySchedule?: DaySchedule;
  weekSchedule: DaySchedule[];
}

interface CircleMetric {
  id: string;
  label: string;
  sublabel: string;
  centerText: string;
  centerSub: string;
  percentage: number;
  color: string;
  trackColor: string;
  icon: React.ReactNode;
}

/** یک حلقه پیشرفت SVG با انیمیشن نرم پر شدن */
const ProgressRing: React.FC<{
  size?: number;
  strokeWidth?: number;
  percentage: number;
  color: string;
  trackColor: string;
  children: React.ReactNode;
  delay?: number;
}> = ({ size = 108, strokeWidth = 9, percentage, color, trackColor, children, delay = 0 }) => {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(percentage), 250 + delay);
    return () => clearTimeout(t);
  }, [percentage, delay]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, animated)) / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
        {children}
      </div>
    </div>
  );
};

/**
 * ویجت خلاصه وضعیت روز جاری: دایره‌های پیشرفت
 * (درصد تکمیل پارت‌های امروز، تست‌های زده شده امروز، پیشرفت کل هفته)
 */
export const TodayProgressWidget: React.FC<TodayProgressWidgetProps> = ({
  todaySchedule,
  weekSchedule,
}) => {
  // تاریخ شمسی امروز
  const todayFa = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' }).format(
        new Date()
      );
    } catch {
      return 'امروز';
    }
  }, []);

  const metrics = useMemo<CircleMetric[]>(() => {
    // آمار امروز
    const parts = todaySchedule?.parts ?? [];
    const totalTodayParts = parts.length || 8;
    const filledParts = parts.filter((p) => p.subject).length;
    const completedParts = parts.filter((p) => p.status === 'completed').length;
    const partPercent = filledParts > 0 ? Math.round((completedParts / filledParts) * 100) : 0;

    const targetTests = parts.reduce((sum, p) => sum + (p.targetTests || 0), 0);
    const doneTests = parts.reduce((sum, p) => sum + (p.completedTests || 0), 0);
    const testPercent = targetTests > 0 ? Math.min(100, Math.round((doneTests / targetTests) * 100)) : 0;

    // آمار کل هفته
    let weekTotal = 0;
    let weekDone = 0;
    weekSchedule.forEach((d) =>
      d.parts.forEach((p) => {
        weekTotal++;
        if (p.status === 'completed') weekDone++;
      })
    );
    const weekPercent = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

    return [
      {
        id: 'parts',
        label: 'تکمیل پارت‌های امروز',
        sublabel: `${toPersianDigits(completedParts)} از ${toPersianDigits(filledParts || totalTodayParts)} پارت فعال`,
        centerText: `%${toPersianDigits(partPercent)}`,
        centerSub: 'انجام شد',
        percentage: partPercent,
        color: '#22d3ee',
        trackColor: 'rgba(34, 211, 238, 0.12)',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      },
      {
        id: 'tests',
        label: 'تست‌های زده شده امروز',
        sublabel: `${toPersianDigits(doneTests)} از ${toPersianDigits(targetTests)} تست هدف`,
        centerText: toPersianDigits(doneTests),
        centerSub: targetTests > 0 ? `از ${toPersianDigits(targetTests)}` : 'تست هدف',
        percentage: testPercent,
        color: '#fbbf24',
        trackColor: 'rgba(251, 191, 36, 0.12)',
        icon: <Target className="w-3.5 h-3.5" />,
      },
      {
        id: 'week',
        label: 'پیشرفت کل برنامه هفته',
        sublabel: `${toPersianDigits(weekDone)} از ${toPersianDigits(weekTotal)} پارت کل هفته`,
        centerText: `%${toPersianDigits(weekPercent)}`,
        centerSub: 'هفتگی',
        percentage: weekPercent,
        color: '#34d399',
        trackColor: 'rgba(52, 211, 153, 0.12)',
        icon: <BarChart3 className="w-3.5 h-3.5" />,
      },
    ];
  }, [todaySchedule, weekSchedule]);

  const hasContent = (todaySchedule?.parts ?? []).some((p) => p.subject);

  return (
    <div className="widget-rise bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg shadow-cyan-500/5 relative overflow-hidden h-full">
      <div className="absolute -top-14 -left-14 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-float-slow" />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center shadow-md shadow-cyan-500/30">
            <CalendarDays className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-black text-white leading-tight">خلاصه وضعیت روز جاری</h3>
            <span className="text-[11px] text-cyan-300 font-semibold">{todayFa}</span>
          </div>
        </div>
        <span className="text-[9px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full animate-pulse-soft">
          در یک نگاه
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 relative z-10">
        {metrics.map((m, idx) => (
          <div
            key={m.id}
            className="flex flex-col items-center bg-slate-950/60 rounded-xl p-2.5 sm:p-3 border border-slate-800 hover:border-slate-600 transition-colors"
          >
            <ProgressRing
              percentage={m.percentage}
              color={m.color}
              trackColor={m.trackColor}
              delay={idx * 180}
              size={window.innerWidth < 480 ? 76 : 92}
              strokeWidth={8}
            >
              <span className="text-sm sm:text-base font-black text-white">{m.centerText}</span>
              <span className="text-[8px] sm:text-[9px] text-slate-400 font-medium">{m.centerSub}</span>
            </ProgressRing>
            <div className="mt-2 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-200">
                <span style={{ color: m.color }}>{m.icon}</span>
                <span className="leading-tight">{m.label}</span>
              </div>
              <span className="block text-[9px] sm:text-[10px] text-slate-500 mt-0.5">{m.sublabel}</span>
            </div>
          </div>
        ))}
      </div>

      {!hasContent && (
        <p className="mt-3 text-[10px] text-slate-500 text-center relative z-10">
          هنوز پارتی برای امروز ثبت نکردی — از جدول برنامه‌ریزی هفتگی شروع کن!
        </p>
      )}
    </div>
  );
};
