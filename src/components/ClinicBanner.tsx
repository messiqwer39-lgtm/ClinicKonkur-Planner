import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Heart,
  ChevronLeft,
  Award,
  Flame,
  CheckCircle2,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ClinicBannerProps {
  variant?: 'top-strip' | 'card' | 'compact' | 'footer';
  onOpenWelcome?: () => void;
}

export const ClinicBanner: React.FC<ClinicBannerProps> = ({
  variant = 'card',
  onOpenWelcome,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySupport = () => {
    navigator.clipboard.writeText('@Poshtibani_CliniCk_konkur2026');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === 'top-strip') {
    return (
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-slate-950 px-3 py-1.5 text-xs font-black flex items-center justify-between shadow-xs select-none">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-1.5 text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="truncate">
              🎁 طرح ویژه مشاوره VIP و برنامه‌ریزی اختصاصی رتبه‌سازی کلینیک کنکور ۱۴۰۵ و ۱۴۰۶
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://t.me/Poshtibani_CliniCk_konkur2026"
              target="_blank"
              rel="noreferrer"
              className="bg-amber-300 hover:bg-amber-200 text-slate-950 px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-xs transition-transform hover:scale-105 flex items-center gap-1"
            >
              <span>رزرو مشاوره</span>
              <ChevronLeft className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/80 border border-cyan-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 to-amber-400 shrink-0">
            <img src="/logo.png" alt="کلینیک کنکور" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <span>کلینیک تخصصی مشاوره و برنامه‌ریزی کنکور</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                VIP
              </span>
            </h4>
            <p className="text-[11px] text-slate-300">
              پیگیری شبانه گزارش‌کار، آزمون‌های اختصاصی و مصاحبه با رتبه‌های برتر کشوری
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://t.me/Poshtibani_CliniCk_konkur2026"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-transform hover:scale-105 flex items-center gap-1"
          >
            <Send className="w-3 h-3" />
            <span>رزرو مشاوره</span>
          </a>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="mt-12 mb-8 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/90 rounded-3xl border border-cyan-500/30 p-6 sm:p-8 text-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-amber-400 shadow-xl shadow-cyan-500/30 shrink-0">
              <img src="/logo.png" alt="کلینیک کنکور" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">کلینیک تخصصی مشاوره و برنامه‌ریزی کنکور</h3>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30 font-bold">
                  تضمین رشد تراز
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                ارائه برنامه‌های روزانه متناسب با وضعیت تحصیلی داوطلب، حل چالش‌های کندخوانی و تراز کنکور، آنالیز آزمون‌های قلم‌چی، ماز و سنجش با هدایت رتبه‌های تک‌رقمی کشوری.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href="https://t.me/Poshtibani_CliniCk_konkur2026"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>ارتباط فوری با پشتیبانی تلگرام</span>
            </a>
            <a
              href="https://t.me/CliniC_Konkur2026"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>عضویت در کانال رسمی</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Default: Prominent Feature Card Banner
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-xl shadow-cyan-950/30 mb-8 relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center relative z-10">
        {/* Left: Branding and Features */}
        <div className="lg:col-span-8 flex items-start gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-amber-400 shadow-xl shrink-0">
            <img src="/logo.png" alt="کلینیک کنکور" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                طرح VIP رتبه‌سازی کلینیک کنکور
              </span>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>ظرفیت محدود ۱۴۰۵ - ۱۴۰۶</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              برنامه‌ریزی تخصصی فردی + پیگیری شبانه رتبه‌های تک‌رقمی
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              اگر می‌خواهی از سردرگمی بودجه‌بندی نجات پیدا کنی و با متد علمی کلینیک کنکور ترازت را ارتقا بدهی، همین حالا با پشتیبانی ما ارتباط بگیر.
            </p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full justify-center">
          <a
            href="https://t.me/Poshtibani_CliniCk_konkur2026"
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2 text-center"
          >
            <Send className="w-3.5 h-3.5" />
            <span>رزرو مشاوره مستقیم در تلگرام</span>
          </a>

          <div className="flex items-center gap-2">
            <a
              href="https://t.me/CliniC_Konkur2026"
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>کانال تلگرام کلینیک</span>
            </a>
            <button
              onClick={handleCopySupport}
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors"
              title="کپی آیدی پشتیبانی"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
