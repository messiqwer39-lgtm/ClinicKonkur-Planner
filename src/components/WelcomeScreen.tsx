import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  ArrowLeft,
  Calendar,
  Layers,
  Award,
  Flame,
  ShieldCheck,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface WelcomeScreenProps {
  onEnter: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const AUTO_ENTER_SECONDS = 7;

/** تبلیغات چرخشی کلینیک کنکور (کوتاه - فقط یک بنر در هر لحظه) */
const PROMO_BANNERS = [
  {
    id: 1,
    tag: 'طرح ویژه رتبه‌سازی',
    title: 'مشاوره VIP و خصوصی کلینیک کنکور',
    desc: 'برنامه‌ریزی شخصی روزانه + پیگیری شبانه توسط رتبه‌های برتر کشوری',
    gradient: 'from-cyan-500/20 via-blue-600/15 to-indigo-500/10',
    border: 'border-cyan-400/60',
    icon: TrendingUp,
  },
  {
    id: 2,
    tag: 'ارتقای تراز آزمون',
    title: 'آنالیز حرفه‌ای کارنامه آزمایشی',
    desc: 'شناسایی دام‌های تستی و راه‌حل علمی عبور از سد ترازی قلم‌چی، سنجش و ماز',
    gradient: 'from-emerald-500/20 via-teal-600/15 to-cyan-500/10',
    border: 'border-emerald-400/60',
    icon: Award,
  },
  {
    id: 3,
    tag: 'مهارت‌های طلایی',
    title: 'کارگاه مدیریت زمان و تندخوانی',
    desc: 'تکنیک ضربدر-منها، استراتژی زمان نقصانی و تعادل امتحان نهایی با تست',
    gradient: 'from-amber-500/20 via-orange-600/15 to-yellow-500/10',
    border: 'border-amber-400/60',
    icon: Flame,
  },
];

/**
 * صفحه خوش‌آمدگویی کوتاه: سلام + یک تبلیغ کلینیک کنکور + ورود خودکار به پنل
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter, isOpen, onClose }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [countdown, setCountdown] = useState(AUTO_ENTER_SECONDS);
  const { isInstallable, install } = usePWAInstall();
  const enteredRef = useRef(false);

  // چرخش آرام بنر تبلیغاتی
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isOpen]);

  // ریست شمارش هنگام باز شدن
  useEffect(() => {
    if (isOpen) setCountdown(AUTO_ENTER_SECONDS);
  }, [isOpen]);

  // تیک شمارش معکوس ورود خودکار (هر ثانیه)
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // ورود خودکار به پنل پس از رسیدن شمارش به صفر
  useEffect(() => {
    if (isOpen && countdown === 0 && !enteredRef.current) {
      enteredRef.current = true;
      onEnter();
      onClose();
    }
    // onEnter/onClose عمداً خارج از وابستگی‌ها هستند تا تایمر با تغییر identity ریست نشود
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, isOpen]);

  if (!isOpen) return null;

  const handleEnterNow = () => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    onEnter();
    onClose();
  };

  const banner = PROMO_BANNERS[currentBanner];
  const BannerIcon = banner.icon;
  const ringRadius = 17;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringProgress = countdown / AUTO_ENTER_SECONDS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto no-print">
      <div className="welcome-pop bg-slate-900 border-2 border-cyan-400/50 rounded-3xl max-w-lg w-full text-slate-100 shadow-2xl shadow-cyan-500/20 overflow-hidden relative ring-4 ring-cyan-500/20 my-auto">
        {/* هاله‌های نوری متحرک */}
        <div className="absolute -top-16 -right-10 w-56 h-56 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-float-slow-reverse" />

        {/* سلام و خوش‌آمدگویی */}
        <div className="pt-7 pb-4 px-6 text-center relative z-10">
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-amber-400 shadow-xl shadow-cyan-500/30 flex items-center justify-center animate-glow-pulse">
              <img
                src="/logo.png"
                alt="لوگو کلینیک کنکور"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-lg">
              Clinic Konkur
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-amber-300 animate-slide-up-fade">
            دانش‌آموز عزیز، خوش آمدی!
          </h1>
          <p className="text-xs sm:text-sm text-cyan-200/90 font-medium mt-2 animate-slide-up-fade animation-delay-150">
            به پلنر تخصصی کلینیک کنکور خوش اومدی — برنامه‌ریز ۸ پارته، گزارش‌کار و مشاوره همه در یکجا
          </p>
        </div>

        {/* بنر تبلیغاتی کلینیک کنکور (چرخشی) */}
        <div className="px-5 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>خدمات ویژه کلینیک کنکور:</span>
            </div>
            <div className="flex items-center gap-1">
              {PROMO_BANNERS.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentBanner === idx ? 'w-5 bg-cyan-400' : 'w-1.5 bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div
            key={banner.id}
            className={`banner-slide rounded-2xl p-4 border ${banner.border} bg-gradient-to-r ${banner.gradient} relative overflow-hidden shadow-lg`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <BannerIcon className="w-4 h-4 text-cyan-300" />
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-cyan-500/25 text-cyan-200 border border-cyan-400/30">
                {banner.tag}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">{banner.title}</h3>
            <p className="text-[11px] text-slate-200/90 leading-relaxed">{banner.desc}</p>
            <a
              href="https://t.me/Poshtibani_CliniCk_konkur2026"
              target="_blank"
              rel="noreferrer"
              className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 px-3.5 py-1.5 rounded-lg transition-all hover:scale-105 shadow-md shadow-cyan-500/30"
            >
              <Send className="w-3 h-3" />
              <span>رزرو مشاوره در تلگرام: Poshtibani_CliniCk_konkur2026@</span>
            </a>
          </div>
        </div>

        {/* ورود خودکار به پنل + کانال */}
        <div className="p-5 mt-4 relative z-10">
          <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ورود خودکار به پنل تا {countdown} ثانیه دیگر...</span>
              </div>
              <a
                href="https://t.me/CliniC_Konkur2026"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 truncate"
              >
                <Send className="w-2.5 h-2.5" />
                کانال تلگرام: t.me/CliniC_Konkur2026
              </a>
              {isInstallable && (
                <button
                  onClick={install}
                  className="mt-1.5 block text-[10px] font-bold text-amber-300 hover:text-amber-200 transition-colors"
                >
                  نصب برنامه روی دستگاه (PWA)
                </button>
              )}
            </div>

            {/* حلقه شمارش معکوس ورود خودکار */}
            <div className="relative shrink-0">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r={ringRadius} fill="none" stroke="#1e293b" strokeWidth="4" />
                <circle
                  cx="22"
                  cy="22"
                  r={ringRadius}
                  fill="none"
                  stroke="url(#autoEnterGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringCircumference * (1 - ringProgress)}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
                <defs>
                  <linearGradient id="autoEnterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">
                {countdown}
              </span>
            </div>
          </div>

          {/* دکمه ورود فوری */}
          <button
            onClick={handleEnterNow}
            className="mt-3 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/30 transition-all hover:scale-[1.03] active:scale-[0.98] animate-glow-pulse"
          >
            <span>ورود به پنل برنامه‌ریزی</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="mt-2.5 flex items-center justify-center gap-3 text-[9px] text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" /> ۸ پارت ۹۰ دقیقه‌ای
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-2.5 h-2.5" /> گزارش‌کار تحلیلی
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> پومودورو کنکور
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
