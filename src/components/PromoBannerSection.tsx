import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Check,
  Copy,
  Flame,
  Award,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface PromoBannerItem {
  id: number;
  tag: string;
  title: string;
  desc: string;
  badge: string;
  features: string[];
  gradient: string;
  borderColor: string;
  badgeColor: string;
}

const PROMO_ITEMS: PromoBannerItem[] = [
  {
    id: 1,
    tag: 'طرح ویژه رتبه‌سازی ۱۴۰۵ - ۱۴۰۶',
    title: 'مشاوره و برنامه‌ریزی VIP کلینیک کنکور',
    desc: 'برنامه‌ریزی دقیق روزانه ۸ پارت ۹۰ دقیقه‌ای متناسب با تراز، آزمون‌های آزمایشی و توانمندی فردی شما با پیگیری شبانه رتبه‌های برتر کشوری.',
    badge: 'ظرفیت محدود VIP',
    features: ['پیگیری شبانه گزارش‌کار', 'آنالیز اختصاصی تراز آزمون‌ها', 'برنامه مبحثی امتحانات نهایی'],
    gradient: 'from-blue-900/60 via-indigo-900/40 to-slate-900/70',
    borderColor: 'border-cyan-400/50',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  },
  {
    id: 2,
    tag: 'جهش تضمینی تراز',
    title: 'آنالیز حرفه‌ای کارنامه و رفع اشکال تستی',
    desc: 'کالبدشکافی دلایل تست‌های غلط و نزده در آزمون‌های قلم‌چی، ماز و سنجش با ارائه استراتژی‌های فردی برای پرش تراز بالای ۶۵۰۰ و ۷۰۰۰.',
    badge: 'رشد میانگین ۱۲۰۰ تراز',
    features: ['تحلیل دام‌های تست‌زنی', 'برنامه جبرانی نقاط ضعف', 'مشاوره اختصاصی روحیه و انگیزه'],
    gradient: 'from-emerald-900/60 via-teal-900/40 to-slate-900/70',
    borderColor: 'border-emerald-400/50',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 3,
    tag: 'مهارت‌های تندخوانی و مدیریت دفترچه',
    title: 'کارگاه‌های ضربدر-منها و استراتژی زمان‌های نقصانی',
    desc: 'غلبه بر کمبود وقت در دفترچه دوم و سوم، حذف خطاهای محاسباتی و تکنیک‌های افزایش سرعت تست‌زنی تا ۴۰ درصد بدون افت دقت.',
    badge: 'متدولوژی برتر کلینیک',
    features: ['تکنیک زمان‌های نقصانی', 'مهار استرس سر جلسه', 'روش‌های تست‌زنی بدون ماشین‌حساب'],
    gradient: 'from-amber-900/60 via-rose-900/40 to-slate-900/70',
    borderColor: 'border-amber-400/50',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
];

export const PromoBannerSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Auto rotate banners every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMO_ITEMS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const handleCopyTelegram = () => {
    navigator.clipboard.writeText('@Poshtibani_CliniCk_konkur2026');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const item = PROMO_ITEMS[currentIndex];

  return (
    <div className="mb-6 relative group">
      <div
        className={`rounded-3xl border-2 ${item.borderColor} bg-gradient-to-r ${item.gradient} p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md transition-all duration-700`}
      >
        {/* Glow circles */}
        <div className="absolute top-0 right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          {/* Main Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${item.badgeColor} flex items-center gap-1`}>
                <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                {item.tag}
              </span>
              <span className="text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                {item.badge}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              {item.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {item.desc}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {item.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-cyan-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Callouts */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 w-full lg:w-auto shrink-0">
            <button
              onClick={handleCopyTelegram}
              className="py-2 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-transform active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950 stroke-[3]" />
                  <span>آیدی تلگرام کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 stroke-[2.5]" />
                  <span>رزرو مشاوره کلینیک کنکور</span>
                </>
              )}
            </button>

            <a
              href="https://t.me/CliniC_Konkur2026"
              target="_blank"
              rel="noreferrer"
              className="py-2 px-4 rounded-xl font-bold text-xs bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5 rotate-[-45deg]" />
              <span>کانال تلگرام: CliniC_Konkur2026@</span>
            </a>
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-750/70">
          <div className="flex items-center gap-1.5">
            {PROMO_ITEMS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + PROMO_ITEMS.length) % PROMO_ITEMS.length)}
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % PROMO_ITEMS.length)}
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
