import React, { useState, useMemo } from 'react';
import {
  DaySchedule,
  DAYS_INFO,
  DayOfWeek,
  PartSlot,
  SUBJECT_CONFIGS,
} from '../types/planner';
import { toPersianDigits } from '../utils/helpers';
import {
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
  Calendar,
  Flame,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { motion } from 'motion/react';

interface DailyProgressWidgetProps {
  schedule: DaySchedule[];
  onOpenPartModal?: (dayName: string, slot: PartSlot) => void;
}

// Map JavaScript Date getDay() (0: Sunday, 1: Monday, ... 6: Saturday) to Persian dayId
function getCurrentPersianDayId(): DayOfWeek {
  const day = new Date().getDay();
  switch (day) {
    case 6:
      return 'saturday';
    case 0:
      return 'sunday';
    case 1:
      return 'monday';
    case 2:
      return 'tuesday';
    case 3:
      return 'wednesday';
    case 4:
      return 'thursday';
    case 5:
      return 'friday';
    default:
      return 'saturday';
  }
}

// Reusable Circular Progress Ring Component
interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  gradientId: string;
  fromColor: string;
  toColor: string;
  bgColor?: string;
  valueText: string;
  subText: string;
  icon?: React.ReactNode;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  gradientId,
  fromColor,
  toColor,
  bgColor = '#1e293b',
  valueText,
  subText,
  icon,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={fromColor} />
              <stop offset="100%" stopColor={toColor} />
            </linearGradient>
          </defs>
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={bgColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            className="opacity-40"
          />
          {/* Progress Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          {icon && <div className="mb-0.5">{icon}</div>}
          <span className="text-base sm:text-lg font-black text-white font-mono tracking-tight leading-none">
            {valueText}
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-1 leading-tight">
            {subText}
          </span>
        </div>
      </div>
    </div>
  );
};

export const DailyProgressWidget: React.FC<DailyProgressWidgetProps> = ({ schedule, onOpenPartModal }) => {
  const defaultDay = useMemo(() => getCurrentPersianDayId(), []);
  const [selectedDayId, setSelectedDayId] = useState<DayOfWeek>(defaultDay);

  const selectedDay = useMemo(() => {
    return schedule.find((d) => d.dayId === selectedDayId) || schedule[0];
  }, [schedule, selectedDayId]);

  // Aggregate stats for selected day
  const dayStats = useMemo(() => {
    if (!selectedDay) {
      return {
        totalParts: 8,
        filledParts: 0,
        completedParts: 0,
        inProgressParts: 0,
        targetTests: 0,
        completedTests: 0,
        studyHours: 0,
        targetHours: 0,
        partsPercentage: 0,
        testsPercentage: 0,
        hoursPercentage: 0,
      };
    }

    let filledParts = 0;
    let completedParts = 0;
    let inProgressParts = 0;
    let targetTests = 0;
    let completedTests = 0;

    selectedDay.parts.forEach((part) => {
      if (part.subject) {
        filledParts++;
        targetTests += part.targetTests || 0;
        completedTests += part.completedTests || (part.status === 'completed' ? part.targetTests || 0 : 0);

        if (part.status === 'completed') {
          completedParts++;
        } else if (part.status === 'in_progress') {
          inProgressParts++;
        }
      }
    });

    const targetHours = filledParts * 1.5;
    const studyHours = completedParts * 1.5;
    const partsPercentage = filledParts > 0 ? Math.round((completedParts / filledParts) * 100) : 0;
    const testsPercentage = targetTests > 0 ? Math.round((completedTests / targetTests) * 100) : (completedParts > 0 ? 100 : 0);
    const hoursPercentage = targetHours > 0 ? Math.round((studyHours / targetHours) * 100) : 0;

    return {
      totalParts: selectedDay.parts.length,
      filledParts,
      completedParts,
      inProgressParts,
      targetTests,
      completedTests,
      studyHours,
      targetHours,
      partsPercentage,
      testsPercentage,
      hoursPercentage,
    };
  }, [selectedDay]);

  const isToday = selectedDayId === defaultDay;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 rounded-3xl border border-cyan-500/30 p-5 sm:p-6 shadow-xl shadow-cyan-950/20 mb-6 text-slate-100 relative overflow-hidden ring-1 ring-cyan-500/20"
    >
      {/* Background glow ambiance */}
      <div className="absolute top-0 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Title, Today Badge & Day Selector Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/30 shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                خلاصه وضعیت و پیشرفت روز جاری
              </h2>
              {isToday && (
                <span className="flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 animate-pulse">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>امروز</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              وضعیت تکمیل پارت‌های درسی، ساعت مطالعه و آمار تست‌های زده‌شده در یک نگاه
            </p>
          </div>
        </div>

        {/* Days of week selector pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 rounded-2xl border border-slate-800 overflow-x-auto max-w-full">
          {DAYS_INFO.map((d) => {
            const isSelected = selectedDayId === d.id;
            const isCurrentToday = defaultDay === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDayId(d.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md font-black'
                    : isCurrentToday
                    ? 'text-cyan-300 bg-cyan-950/50 hover:bg-slate-800'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span>{d.name}</span>
                {isCurrentToday && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: 3 Radial Progress Indicators + Day Overview Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 items-center relative z-10">
        {/* 3 Progress Rings (Col 8) */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Ring 1: تکمیل پارت‌ها */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 flex flex-col items-center hover:border-cyan-500/40 transition-colors group shadow-inner">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>تکمیل پارت‌ها</span>
            </div>
            <CircularProgress
              percentage={dayStats.partsPercentage}
              gradientId="grad-parts"
              fromColor="#06b6d4"
              toColor="#3b82f6"
              valueText={`${toPersianDigits(dayStats.partsPercentage)}٪`}
              subText={`${toPersianDigits(dayStats.completedParts)} از ${toPersianDigits(dayStats.filledParts)} پارت`}
            />
            <div className="mt-3 w-full pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>پارت باقیمانده:</span>
              <span className="font-mono font-bold text-slate-200">
                {toPersianDigits(Math.max(0, dayStats.filledParts - dayStats.completedParts))} پارت
              </span>
            </div>
          </div>

          {/* Ring 2: تست‌های زده شده */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 flex flex-col items-center hover:border-emerald-500/40 transition-colors group shadow-inner">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-2">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>تست‌های زده شده</span>
            </div>
            <CircularProgress
              percentage={dayStats.testsPercentage}
              gradientId="grad-tests"
              fromColor="#10b981"
              toColor="#059669"
              valueText={`${toPersianDigits(dayStats.testsPercentage)}٪`}
              subText={`${toPersianDigits(dayStats.completedTests)} از ${toPersianDigits(dayStats.targetTests)}`}
            />
            <div className="mt-3 w-full pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>تست باقیمانده:</span>
              <span className="font-mono font-bold text-slate-200">
                {toPersianDigits(Math.max(0, dayStats.targetTests - dayStats.completedTests))} تست
              </span>
            </div>
          </div>

          {/* Ring 3: ساعت مطالعه مفید */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 flex flex-col items-center hover:border-amber-500/40 transition-colors group shadow-inner">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>ساعات مطالعه</span>
            </div>
            <CircularProgress
              percentage={dayStats.hoursPercentage}
              gradientId="grad-hours"
              fromColor="#f59e0b"
              toColor="#ea580c"
              valueText={`${toPersianDigits(dayStats.studyHours)}h`}
              subText={`از ${toPersianDigits(dayStats.targetHours)} ساعت`}
            />
            <div className="mt-3 w-full pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>هدف روزانه:</span>
              <span className="font-mono font-bold text-slate-200">
                {toPersianDigits(dayStats.targetHours)} ساعت
              </span>
            </div>
          </div>
        </div>

        {/* Right Info Box: Daily Highlights & Fast Subject Badges (Col 4) */}
        <div className="md:col-span-4 bg-slate-950/70 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col justify-between h-full shadow-inner space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">
                پارت‌های برنامه‌ریزی‌شده {selectedDay?.dayName}:
              </span>
              <span className="text-[11px] text-cyan-300 font-mono">
                {toPersianDigits(dayStats.filledParts)} درس
              </span>
            </div>

            {/* List of active subjects today */}
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {selectedDay?.parts
                .filter((p) => p.subject)
                .map((p) => {
                  const cfg = SUBJECT_CONFIGS[p.subject as keyof typeof SUBJECT_CONFIGS];
                  return (
                    <span
                      key={p.id}
                      onClick={() => onOpenPartModal && onOpenPartModal(selectedDay.dayName, p)}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border font-semibold cursor-pointer transition-transform hover:scale-105 ${
                        p.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {cfg?.shortTitle || p.subject}: {p.topic ? p.topic.slice(0, 16) + '...' : `پارت ${p.partNumber}`}
                    </span>
                  );
                })}
              {dayStats.filledParts === 0 && (
                <p className="text-xs text-slate-500 italic py-2">
                  هنوز برای {selectedDay?.dayName} درسی در جدول ثبت نشده است.
                </p>
              )}
            </div>
          </div>

          {/* Quick status message */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-medium text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {dayStats.partsPercentage >= 80
                  ? 'عالی! عملکرد امروز شما فوق‌العاده بوده است.'
                  : dayStats.partsPercentage >= 50
                  ? 'خوب است؛ با قدرت پارت‌های باقیمانده را کامل کنید.'
                  : 'شروع کن! هر دقیقه مطالعه سرمایه آینده توست.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
