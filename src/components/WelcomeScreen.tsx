import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  ArrowLeft,
  Flame,
  CheckCircle2,
  Clock,
  Heart,
  X,
  Volume2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WelcomeScreenProps {
  onEnter: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter, isOpen, onClose }) => {
  const [countdown, setCountdown] = useState(4);
  const [isAutoEntering, setIsAutoEntering] = useState(true);

  // Auto-enter countdown timer: enters automatically after 4 seconds
  useEffect(() => {
    if (!isOpen || !isAutoEntering) return;

    if (countdown <= 0) {
      handleEnter();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, countdown, isAutoEntering]);

  if (!isOpen) return null;

  const handleEnter = () => {
    try {
      localStorage.setItem('hide_welcome_screen_v1', 'true');
    } catch {
      // ignore
    }
    onEnter();
    onClose();
  };

  const handlePauseAutoEnter = () => {
    setIsAutoEntering(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-400/50 rounded-3xl max-w-lg w-full text-slate-100 shadow-2xl shadow-cyan-500/20 overflow-hidden flex flex-col relative ring-4 ring-cyan-500/20 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button top-left */}
        <button
          onClick={handleEnter}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors z-20"
          title="بستن و ورود"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="p-6 sm:p-7 text-center relative z-10 border-b border-slate-800/80">
          <div className="flex flex-col items-center justify-center">
            {/* Logo */}
            <div className="relative mb-3.5 group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-amber-400 shadow-xl shadow-cyan-500/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/logo.png"
                  alt="لوگو کلینیک کنکور"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="absolute -bottom-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                Clinic Konkur
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-amber-300 tracking-tight mb-1.5">
              دانش‌آموز عزیز، خوش آمدید 🎓✨
            </h1>
            <p className="text-xs sm:text-sm text-cyan-200/90 font-medium max-w-sm mx-auto">
              سامانه هوشمند برنامه‌ریزی تخصصی، گزارش‌کار تحلیلی و پومودورو با متدولوژی کلینیک کنکور
            </p>
          </div>
        </div>

        {/* Promotional Banner Content */}
        <div className="p-5 sm:p-6 space-y-4 relative z-10">
          {/* Clinic Konkur VIP Promo Card */}
          <div className="rounded-2xl p-4 sm:p-5 border border-cyan-400/40 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-indigo-950/50 shadow-inner space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
                طرح ویژه مشاوره و برنامه‌ریزی VIP
              </span>
              <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>رتبه‌سازی تضمینی</span>
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
              برنامه‌ریزی روزانه شخصی‌سازی شده با پیگیری شبانه رتبه‌های برتر
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              جهت رزرو مشاوره VIP، آنالیز دقیق کارنامه آزمون‌های آزمایشی و دریافت طرح‌های مطالعاتی اختصاصی کلینیک کنکور با ما در ارتباط باشید:
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <a
                href="https://t.me/Poshtibani_CliniCk_konkur2026"
                target="_blank"
                rel="noreferrer"
                onClick={handlePauseAutoEnter}
                className="w-full sm:flex-1 py-2 px-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>رزرو مشاوره در تلگرام</span>
              </a>

              <a
                href="https://t.me/CliniC_Konkur2026"
                target="_blank"
                rel="noreferrer"
                onClick={handlePauseAutoEnter}
                className="w-full sm:flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>کانال تلگرام کلینیک</span>
              </a>
            </div>
          </div>

          {/* Auto-enter indicator */}
          {isAutoEntering ? (
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>ورود خودکار به پنل تا {countdown} ثانیه دیگر...</span>
              </div>
              <button
                onClick={handlePauseAutoEnter}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                توقف ثانیه‌شمار
              </button>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-400">
              ثانیه‌شمار متوقف شد. برای شروع روی دکمه زیر کلیک کنید.
            </div>
          )}
        </div>

        {/* Footer: Fast Enter Button */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 relative z-10">
          <button
            onClick={handleEnter}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>ورود مستقیم به پنل برنامه‌ریزی</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
