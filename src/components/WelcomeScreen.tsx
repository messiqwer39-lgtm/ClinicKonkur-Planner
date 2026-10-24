import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Heart,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  ChevronLeft,
  Flame,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface WelcomeScreenProps {
  onEnter: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const PROMO_BANNERS = [
  {
    id: 1,
    tag: 'طرح ویژه رتبه‌سازی',
    title: 'طرح مشاوره VIP و خصوصی کلینیک کنکور',
    desc: 'برنامه‌ریزی کاملاً شخصی‌سازی شده روزانه مطابق با نقاط قوت، ضعف و تراز شما با پیگیری شبانه توسط رتبه‌های برتر کشوری.',
    badge: 'ظرفیت محدود ۱۴۰۴ - ۱۴۰۵',
    gradient: 'from-blue-600/40 via-indigo-600/30 to-cyan-500/20',
    border: 'border-cyan-400',
    highlight: 'افزایش قطعی تراز و آرامش ذهنی',
  },
  {
    id: 2,
    tag: 'ارتقای تراز آزمون',
    title: 'آنالیز حرفه‌ای کارنامه آزمون‌های آزمایشی',
    desc: 'شناسایی دقیق دام‌های تستی، دلایل غلط زدن و ارائه راه‌حل‌های علمی برای عبور از سدهای ترازی در آزمون‌های قلم‌چی، سنجش و ماز.',
    badge: 'رشد میانگین ۱۲۰۰ تراز',
    gradient: 'from-emerald-600/40 via-teal-600/30 to-cyan-500/20',
    border: 'border-emerald-400',
    highlight: 'تحلیل خط به خط تست‌های اشتباه',
  },
  {
    id: 3,
    tag: 'مهارت‌های طلایی کنکور',
    title: 'کارگاه‌های تخصصی مدیریت زمان و تندخوانی',
    desc: 'آموزش تکنیک‌های ضربدر-منها، استراتژی زمان‌های نقصانی، غلبه بر خستگی ذهنی و ایجاد تعادل طلایی بین امتحانات نهایی و تست کنکور.',
    badge: 'متدولوژی اختصاصی کلینیک',
    gradient: 'from-amber-600/40 via-orange-600/30 to-yellow-500/20',
    border: 'border-amber-400',
    highlight: 'صرفه‌جویی ۳۰ دقیقه‌ای در دفترچه',
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter, isOpen, onClose }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [copiedBooking, setCopiedBooking] = useState(false);
  const { isInstallable, install } = usePWAInstall();

  // Auto rotate banners smoothly every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const handleCopyBooking = () => {
    navigator.clipboard.writeText('@Poshtibani_CliniCk_konkur2026');
    setCopiedBooking(true);
    setTimeout(() => setCopiedBooking(false), 2500);
  };

  const handleEnterApp = () => {
    onEnter();
    onClose();
  };

  const banner = PROMO_BANNERS[currentBanner];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div
        className="bg-slate-900 border-2 border-cyan-400/50 rounded-3xl max-w-3xl w-full text-slate-100 shadow-2xl shadow-cyan-500/20 overflow-hidden flex flex-col my-auto relative ring-4 ring-cyan-500/20 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dynamic Glow Ambient Circles */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Top Header Branding with Logo */}
        <div className="p-6 pb-4 sm:p-8 sm:pb-4 text-center relative z-10 border-b border-slate-800">
          <div className="flex flex-col items-center justify-center">
            {/* Logo with dynamic spinning border glow */}
            <div className="relative mb-3 group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1.5 bg-gradient-to-tr from-cyan-400 via-blue-500 to-amber-400 shadow-2xl shadow-cyan-500/30 flex items-center justify-center transition-transform hover:scale-105 duration-300">
                <img
                  src="/logo.png"
                  alt="لوگو کلینیک کنکور"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="absolute -bottom-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
                Clinic Konkur
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-amber-300 tracking-tight mb-1">
              پلنر تخصصی کلینیک کنکور
            </h1>
            <p className="text-xs sm:text-sm text-cyan-200/90 font-medium max-w-md mx-auto">
              مشاوره تخصصی کنکور سراسری · برنامه‌ریزی ۸ پارت ۹۰ دقیقه‌ای · گزارش‌کار و پومودورو
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 relative z-10 overflow-y-auto max-h-[60vh]">
          {/* Animated Promotional Banners with dynamic indicator */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>خدمات و طرح‌های VIP کلینیک کنکور:</span>
              </div>
              <div className="flex items-center gap-1.5">
                {PROMO_BANNERS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBanner(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentBanner === idx ? 'w-6 bg-cyan-400 shadow-sm shadow-cyan-400/50' : 'w-2 bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div
              className={`rounded-2xl p-5 border-2 ${banner.border} bg-gradient-to-r ${banner.gradient} backdrop-blur-xs relative overflow-hidden transition-all duration-500 shadow-lg`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-cyan-500/30 text-cyan-200 border border-cyan-400/40">
                  {banner.tag}
                </span>
                <span className="text-[11px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                  {banner.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">{banner.title}</h3>
              <p className="text-xs text-slate-200 leading-relaxed mb-3">{banner.desc}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ویژگی کلیدی: {banner.highlight}</span>
              </div>
            </div>
          </div>

          {/* Social Links & Telegram Booking Section */}
          <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30 animate-pulse" />
              <span>پل‌های ارتباطی مستقیم و ثبت‌نام در کلینیک کنکور:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Telegram Booking */}
              <div className="bg-slate-900 rounded-xl p-3.5 border border-cyan-500/40 flex flex-col justify-between gap-2 shadow-inner">
                <div>
                  <span className="text-[11px] text-cyan-400 font-bold block mb-1">
                    💟 جهت رزرو مشاوره مستقیم در تلگرام:
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-100 select-all block bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-center">
                    @Poshtibani_CliniCk_konkur2026
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <a
                    href="https://t.me/Poshtibani_CliniCk_konkur2026"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-lg font-black text-[11px] transition-all shadow-sm shadow-cyan-500/30"
                  >
                    پیام فوری در تلگرام
                  </a>
                  <button
                    onClick={handleCopyBooking}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                    title="کپی آیدی پشتیبانی"
                  >
                    {copiedBooking ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Telegram Channel */}
              <div className="bg-slate-900 rounded-xl p-3.5 border border-blue-500/40 flex flex-col justify-between gap-2 shadow-inner">
                <div>
                  <span className="text-[11px] text-blue-400 font-bold block mb-1">
                    📢 عضویت در کانال رسمی تلگرام کلینیک:
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-100 select-all block bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-center">
                    t.me/CliniC_Konkur2026
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <a
                    href="https://t.me/CliniC_Konkur2026"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-bold text-[11px] transition-all shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>عضویت در کانال کلینیک کنکور</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions: Always Accessible, Never Hidden Permanently */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          {/* Direct APK Download Button on the Welcome Screen! */}
          <a
            href="/ClinicKonkur-Planner-v1.0.0.apk"
            download="ClinicKonkur-Planner-v1.0.0.apk"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-400/50 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-bold transition-all hover:scale-105"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>دانلود مستقیم فایل APK اندروید (۸ مگابایت)</span>
          </a>

          <button
            onClick={handleEnterApp}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/30 transition-all hover:scale-105"
          >
            <span>ورود به برنامه‌ریز و شروع مطالعه</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
