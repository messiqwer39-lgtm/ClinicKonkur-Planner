import React, { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { toPersianDigits } from '../utils/helpers';

/** تاریخ کنکور سراسری: ۱۰ تیر ۱۴۰۶ (ساعت ۸ صبح به وقت تهران) = 2027-07-01 */
export const KONKUR_TARGET = new Date('2027-07-01T08:00:00+03:30').getTime();

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcRemaining(): TimeParts {
  const diff = Math.max(0, KONKUR_TARGET - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

const TimeCard: React.FC<{ value: number; label: string; highlight?: boolean }> = ({
  value,
  label,
  highlight,
}) => (
  <div
    className={`relative flex-1 rounded-xl px-1 py-2.5 text-center border overflow-hidden ${
      highlight
        ? 'bg-gradient-to-b from-amber-500/20 to-amber-600/5 border-amber-400/40'
        : 'bg-slate-950/70 border-slate-700/80'
    }`}
  >
    {/* عدد با انیمیشن تغییر (هر بار که مقدار عوض شود دوباره انیمیت می‌شود) */}
    <span
      key={value}
      className={`block text-lg sm:text-2xl font-black tabular-nums count-flip ${
        highlight ? 'text-amber-300' : 'text-white'
      }`}
    >
      {toPersianDigits(value)}
    </span>
    <span className="block text-[9px] sm:text-[10px] text-slate-400 font-semibold mt-0.5">{label}</span>
  </div>
);

/**
 * روزشمار انیمیشنی کنکور ۱۴۰۶ (۱۰ تیر ۱۴۰۶)
 */
export const KonkurCountdown: React.FC = () => {
  const [time, setTime] = useState<TimeParts>(() => calcRemaining());

  useEffect(() => {
    const timer = setInterval(() => setTime(calcRemaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isOver = time.days + time.hours + time.minutes + time.seconds === 0;

  return (
    <div className="widget-rise bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg shadow-amber-500/5 relative overflow-hidden h-full flex flex-col">
      <div className="absolute -top-14 -right-14 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-float-slow-reverse" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent shine-sweep" />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30">
            <GraduationCap className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-black text-white leading-tight">شمارش معکوس کنکور</h3>
            <span className="text-[11px] text-amber-300 font-semibold">کنکور سراسری ۱۰ تیر ۱۴۰۶</span>
          </div>
        </div>
        <span className="text-[9px] font-bold text-rose-300 bg-rose-500/10 border border-rose-500/25 px-2 py-0.5 rounded-full animate-pulse-soft">
          زمان طلاییه!
        </span>
      </div>

      {isOver ? (
        <div className="flex-1 flex items-center justify-center py-4 relative z-10">
          <p className="text-center text-sm font-black text-amber-300">
            امروز روز کنکوره! موفق و پیروز باشی 🌟
          </p>
        </div>
      ) : (
        <div className="flex gap-1.5 sm:gap-2 relative z-10 mt-auto">
          <TimeCard value={time.days} label="روز" highlight />
          <TimeCard value={time.hours} label="ساعت" />
          <TimeCard value={time.minutes} label="دقیقه" />
          <TimeCard value={time.seconds} label="ثانیه" />
        </div>
      )}

      <div className="mt-3 h-1.5 rounded-full bg-slate-950/80 overflow-hidden relative z-10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 countdown-bar-shine"
          style={{ width: `${Math.max(2, Math.min(100, (time.days / 365) * 100))}%` }}
        />
      </div>
    </div>
  );
};
