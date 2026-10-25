import React, { useState, useMemo } from 'react';
import {
  DaySchedule,
  PartSlot,
  DAYS_INFO,
  DayOfWeek,
  SUBJECT_CONFIGS,
} from '../types/planner';
import { toPersianDigits } from '../utils/helpers';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Target,
  Flame,
  Play,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface TodayStatusWidgetProps {
  schedule: DaySchedule[];
  onOpenPartModal: (dayName: string, slot: PartSlot) => void;
  onQuickToggleStatus: (dayId: string, partId: string) => void;
  onStartTimer: (slot: PartSlot) => void;
}

// Convert JS getDay() (0: Sunday, 1: Monday, ..., 6: Saturday) to Persian DayOfWeek
function getSystemPersianDay(): DayOfWeek {
  const day = new Date().getDay();
  switch (day) {
    case 6: return 'saturday';
    case 0: return 'sunday';
    case 1: return 'monday';
    case 2: return 'tuesday';
    case 3: return 'wednesday';
    case 4: return 'thursday';
    case 5: return 'friday';
    default: return 'saturday';
  }
}

interface CircularProgressProps {
  percentage: number;
  label: string;
  sublabel: string;
  valueText: string;
  gradientId: string;
  startColor: string;
  endColor: string;
  icon: React.ReactNode;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  label,
  sublabel,
  valueText,
  gradientId,
  startColor,
  endColor,
  icon,
}) => {
  const radius = 42;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-850/80 border border-slate-750/70 hover:border-slate-600 transition-all shadow-md group">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>
          {/* Background circle track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800"
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-slate-400 group-hover:scale-110 transition-transform mb-0.5">
            {icon}
          </div>
          <span className="text-lg font-black text-white tracking-tight">
            %{toPersianDigits(Math.round(percentage))}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {valueText}
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <div className="text-xs font-bold text-slate-200">{label}</div>
        <div className="text-[11px] text-slate-400">{sublabel}</div>
      </div>
    </div>
  );
};

export const TodayStatusWidget: React.FC<TodayStatusWidgetProps> = ({
  schedule,
  onOpenPartModal,
  onQuickToggleStatus,
  onStartTimer,
}) => {
  const [selectedDayId, setSelectedDayId] = useState<DayOfWeek>(getSystemPersianDay());

  const currentDayData = useMemo(() => {
    return schedule.find((d) => d.dayId === selectedDayId) || schedule[0];
  }, [schedule, selectedDayId]);

  // Compute metrics for the active day
  const metrics = useMemo(() => {
    if (!currentDayData) {
      return {
        totalParts: 8,
        filledParts: 0,
        completedParts: 0,
        partsPercent: 0,
        totalPlannedTests: 0,
        totalCompletedTests: 0,
        testsPercent: 0,
        plannedHours: 0,
        completedHours: 0,
        hoursPercent: 0,
        nextPart: null as PartSlot | null,
      };
    }

    const parts = currentDayData.parts;
    const totalParts = parts.length;
    let filledParts = 0;
    let completedParts = 0;
    let totalPlannedTests = 0;
    let totalCompletedTests = 0;
    let nextPart: PartSlot | null = null;

    parts.forEach((p) => {
      if (p.subject) {
        filledParts++;
        totalPlannedTests += p.targetTests || 0;
        totalCompletedTests += p.completedTests || 0;
      }
      if (p.status === 'completed') {
        completedParts++;
      } else if (!nextPart && p.subject) {
        nextPart = p;
      }
    });

    const partsPercent = filledParts > 0 ? (completedParts / filledParts) * 100 : 0;
    const testsPercent = totalPlannedTests > 0 ? (totalCompletedTests / totalPlannedTests) * 100 : 0;
    const plannedHours = filledParts * 1.5;
    const completedHours = completedParts * 1.5;
    const hoursPercent = plannedHours > 0 ? (completedHours / plannedHours) * 100 : 0;

    return {
      totalParts,
      filledParts,
      completedParts,
      partsPercent,
      totalPlannedTests,
      totalCompletedTests,
      testsPercent,
      plannedHours,
      completedHours,
      hoursPercent,
      nextPart,
    };
  }, [currentDayData]);

  const isTodayActive = selectedDayId === getSystemPersianDay();

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-cyan-500/30 rounded-3xl p-5 mb-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Background soft glow decoration */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar with Day Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-black">
            <TrendingUp className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">
                خلاصه وضعیت لحظه‌ای روز: {currentDayData.dayName}
              </h2>
              {isTodayActive && (
                <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  امروز (روز جاری)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              مشاهده درصد تکمیل برنامه‌های امروز، پیشرفت تست‌زنی و هدایت هوشمند پارت‌ها
            </p>
          </div>
        </div>

        {/* Day switch pills */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 bg-slate-950/60 p-1 rounded-2xl border border-slate-800">
          {DAYS_INFO.map((d) => {
            const isSelected = d.id === selectedDayId;
            const isSysToday = d.id === getSystemPersianDay();
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDayId(d.id)}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{d.name}</span>
                {isSysToday && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: 3 Circular Progress Rings + Next Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5 items-center">
        {/* Progress Rings Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Ring 1: Part completion */}
          <CircularProgress
            percentage={metrics.partsPercent}
            label="تکمیل پارت‌ها"
            sublabel={`${toPersianDigits(metrics.completedParts)} از ${toPersianDigits(metrics.filledParts)} پارت هدف`}
            valueText={`${toPersianDigits(metrics.completedParts)}/${toPersianDigits(metrics.filledParts)}`}
            gradientId="grad-parts"
            startColor="#06b6d4"
            endColor="#3b82f6"
            icon={<CheckCircle2 className="w-4 h-4 text-cyan-400" />}
          />

          {/* Ring 2: Test count progress */}
          <CircularProgress
            percentage={metrics.testsPercent}
            label="تست‌های زده شده"
            sublabel={`${toPersianDigits(metrics.totalCompletedTests)} از ${toPersianDigits(metrics.totalPlannedTests)} تست`}
            valueText={`${toPersianDigits(metrics.totalCompletedTests)} تست`}
            gradientId="grad-tests"
            startColor="#10b981"
            endColor="#14b8a6"
            icon={<Target className="w-4 h-4 text-emerald-400" />}
          />

          {/* Ring 3: Study hours progress */}
          <CircularProgress
            percentage={metrics.hoursPercent}
            label="ساعت مطالعه"
            sublabel={`${toPersianDigits(metrics.completedHours)} از ${toPersianDigits(metrics.plannedHours)} ساعت`}
            valueText={`${toPersianDigits(metrics.completedHours)} س`}
            gradientId="grad-hours"
            startColor="#f59e0b"
            endColor="#ef4444"
            icon={<Clock className="w-4 h-4 text-amber-400" />}
          />
        </div>

        {/* Upcoming Slot & Quick Advice Box */}
        <div className="lg:col-span-4 bg-slate-800/70 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between h-full min-h-[160px]">
          {metrics.nextPart ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  پارت آماده مطالعه بعدی:
                </span>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md">
                  {toPersianDigits(metrics.nextPart.timeRange)}
                </span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-750 mb-3">
                <div className="flex items-center justify-between">
                  <div className="font-black text-sm text-white">
                    پارت {toPersianDigits(metrics.nextPart.partNumber)}: {metrics.nextPart.subject ? SUBJECT_CONFIGS[metrics.nextPart.subject]?.title : 'بدون درس'}
                  </div>
                  <span className="text-xs text-cyan-300 font-bold">
                    {toPersianDigits(metrics.nextPart.targetTests || 0)} تست
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 truncate">
                  {metrics.nextPart.topic || 'مبحث مشخص نشده'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStartTimer(metrics.nextPart!)}
                  className="flex-1 py-1.5 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>شروع تایمر پارت</span>
                </button>
                <button
                  onClick={() => onQuickToggleStatus(currentDayData.dayId, metrics.nextPart!.id)}
                  className="py-1.5 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all active:scale-95"
                  title="ثبت سریع به عنوان انجام شده"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ثبت انجام</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 animate-bounce">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-white">
                {metrics.filledParts > 0 && metrics.completedParts === metrics.filledParts
                  ? 'آفرین! تمام پارت‌های این روز کامل شد 🎉'
                  : 'تمام پارت‌های این روز آزاد یا تکمیل هستند'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                تلاش امروز شما برای رتبه برتر شدن ستودنی است. همین روال را ادامه دهید.
              </p>
            </div>
          )}

          {/* Sleep / Wake summary */}
          <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>ساعت بیداری: {toPersianDigits(currentDayData.wakeTime || '۰۶:۳۰')}</span>
            <span>ساعت خواب: {toPersianDigits(currentDayData.sleepTime || '۲۳:۰۰')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
