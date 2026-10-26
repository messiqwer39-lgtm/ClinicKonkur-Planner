import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Sparkles, CheckCircle2, X, Share2, Heart, Award } from 'lucide-react';
import { toPersianDigits } from '../utils/helpers';
import { audioService } from '../utils/audioService';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayName: string;
  completedParts: number;
  totalPlannedTests: number;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  dayName,
  completedParts,
  totalPlannedTests,
}) => {
  useEffect(() => {
    if (isOpen) {
      audioService.playVictoryFanfare();
      audioService.vibrate([200, 100, 200, 100, 400, 200, 600]);

      // Massive Multi-shot Fireworks Confetti
      const duration = 3.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: 0.2, y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: 0.8, y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-amber-500/40 rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-8 text-white text-center relative overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Badge */}
        <div className="relative inline-block mx-auto mb-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/40 animate-bounce duration-1000">
            <Trophy className="w-13 h-13 text-slate-950" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Congratulations Text */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-3">
          <Star className="w-3.5 h-3.5 fill-amber-300" />
          <span>افتخار و دستاورد روزانه</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
          تبریک قهرمان! برنامه {dayName} ۱۰۰٪ کامل شد! 🎉
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          «پیروزی واقعی و رتبه درخشان کنکور، از همین استمرار و تلاش‌های روزهای به ظاهر معمولی ساخته می‌شود. به خودت افتخار کن!»
        </p>

        {/* Daily Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-right">
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">پارت‌های مطالعه:</span>
              <span className="text-base font-black text-emerald-400">
                {toPersianDigits(completedParts)} پارت کامل
              </span>
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">تست‌های برنامه‌ریزی:</span>
              <span className="text-base font-black text-amber-300">
                {toPersianDigits(totalPlannedTests)} تست هدف
              </span>
            </div>
          </div>
        </div>

        {/* Motivational Clinic Quote */}
        <div className="bg-indigo-950/80 border border-indigo-500/30 rounded-2xl p-3 text-xs text-indigo-200 mb-6 flex items-center gap-2 justify-center">
          <Heart className="w-4 h-4 text-rose-400 shrink-0 fill-rose-400" />
          <span>امشب با خیال راحت استراحت کن؛ فردا با قدرت ادامه می‌دیم!</span>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 transition-transform active:scale-98"
        >
          ادامه مسیر قهرمانی 🚀
        </button>
      </div>
    </div>
  );
};
