import React, { useState, useEffect } from 'react';
import { toPersianDigits } from '../utils/helpers';
import { Clock, Calendar, Sparkles, Flame, Trophy, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

// Target: 10 Tir 1406 at 08:00 AM IRST (July 1, 2027, 08:00:00 GMT+03:30)
const KONKUR_TARGET_DATE = new Date('2027-07-01T08:00:00+03:30').getTime();

export const KonkurCountdown: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft());

  function calculateTimeLeft(): TimeLeft {
    const now = Date.now();
    const difference = Math.max(0, KONKUR_TARGET_DATE - now);

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return { days, hours, minutes, seconds, totalSeconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-2xl border border-amber-500/30 p-4 sm:p-5 shadow-lg shadow-amber-950/20 mb-6 text-slate-100 relative overflow-hidden ring-1 ring-amber-500/20">
      {/* Dynamic ambient glow */}
      <div className="absolute top-0 right-1/4 w-72 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-72 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar of Countdown */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/30">
            <Trophy className="w-4 h-4 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-200 to-yellow-100">
                روز شمار ماراتن بزرگ کنکور سراسری ۱۴۰۶
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ۱۰ تیر ۱۴۰۶
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              ثانیه‌ها طلا هستند؛ مسیر قهرمانی از نظم امروز تو آغاز می‌شود!
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          title={isExpanded ? 'جمع کردن' : 'نمایش کامل'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Animated Timer Grid */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-4 relative z-10"
          >
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto text-center">
              {/* Days */}
              <div className="bg-slate-900/90 rounded-2xl p-2.5 sm:p-3.5 border border-amber-500/30 shadow-inner group hover:border-amber-400 transition-colors">
                <span className="block text-2xl sm:text-4xl font-black text-amber-300 font-mono tracking-tight group-hover:scale-105 transition-transform">
                  {toPersianDigits(timeLeft.days)}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-bold block mt-1">
                  روز
                </span>
              </div>

              {/* Hours */}
              <div className="bg-slate-900/90 rounded-2xl p-2.5 sm:p-3.5 border border-cyan-500/30 shadow-inner group hover:border-cyan-400 transition-colors">
                <span className="block text-2xl sm:text-4xl font-black text-cyan-300 font-mono tracking-tight group-hover:scale-105 transition-transform">
                  {toPersianDigits(String(timeLeft.hours).padStart(2, '0'))}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-bold block mt-1">
                  ساعت
                </span>
              </div>

              {/* Minutes */}
              <div className="bg-slate-900/90 rounded-2xl p-2.5 sm:p-3.5 border border-blue-500/30 shadow-inner group hover:border-blue-400 transition-colors">
                <span className="block text-2xl sm:text-4xl font-black text-blue-300 font-mono tracking-tight group-hover:scale-105 transition-transform">
                  {toPersianDigits(String(timeLeft.minutes).padStart(2, '0'))}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-bold block mt-1">
                  دقیقه
                </span>
              </div>

              {/* Seconds */}
              <div className="bg-slate-900/90 rounded-2xl p-2.5 sm:p-3.5 border border-emerald-500/30 shadow-inner group hover:border-emerald-400 transition-colors">
                <span className="block text-2xl sm:text-4xl font-black text-emerald-300 font-mono tracking-tight animate-pulse">
                  {toPersianDigits(String(timeLeft.seconds).padStart(2, '0'))}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-bold block mt-1">
                  ثانیه
                </span>
              </div>
            </div>

            {/* Motivational ticker below */}
            <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
              <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>هدف‌گذاری نهایی: کسب رتبه برتر در کنکور سراسری تیرماه ۱۴۰۶</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-300">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>فرصت باقی‌مانده را غنیمت بشمارید</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
