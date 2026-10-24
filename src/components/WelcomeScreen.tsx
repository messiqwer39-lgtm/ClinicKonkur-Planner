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
    gradient: 'from-blue-600/30 via-indigo-600/20 to-cyan-500/10',
    border: 'border-cyan-500/40',
  },
  {
    id: 2,
    tag: 'ارتقای تراز آزمون',
    title: 'آنالیز حرفه‌ای کارنامه آزمون‌های آزمایشی',
    desc: 'شناسایی دقیق دام‌های تستی، دلایل غلط زدن و ارائه راه‌حل‌های علمی برای عبور از سدهای ترازی در آزمون‌های قلم‌چی، سنجش و ماز.',
    badge: 'افزایش تراز تضمینی',
    gradient: 'from-emerald-600/30 via-teal-600/20 to-cyan-500/10',
    border: 'border-emerald-500/40',
  },
  {
    id: 3,
    tag: 'مهارت‌های طلایی کنکور',
    title: 'کارگاه‌های تخصصی مدیریت زمان و تندخوانی',
    desc: 'آموزش تکنیک‌های ضربدر-منها، استراتژی زمان‌های نقصانی، غلبه بر خستگی ذهنی و ایجاد تعادل طلایی بین امتحانات نهایی و تست کنکور.',
    badge: 'متدولوژی اختصاصی',
    gradient: 'from-amber-600/30 via-orange-600/20 to-yellow-500/10',
    border: 'border-amber-500/40',
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter, isOpen, onClose }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [copiedBooking, setCopiedBooking] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const { isInstallable, install } = usePWAInstall();

  // Auto rotate banners every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const handleCopyBooking = () => {
    navigator.clipboard.writeText('@Poshtibani_CliniCk_konkur2026');
    setCopiedBooking(true);
    setTimeout(() => setCopiedBooking(false), 2500);
  };

  const handleEnterApp = () => {
    if (dontShowAgain) {
      localStorage.setItem('hide_welcome_screen_v1', 'true');
    }
    onEnter();
    onClose();
  };

  const banner = PROMO_BANNERS[currentBanner];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div
        className="bg-slate-900 border border-cyan-500/30 rounded-3xl max-w-3xl w-full text-slate-100 shadow-2xl overflow-hidden flex flex-col my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Branding */}
        <div className="p-6 pb-4 sm:p-8 sm:pb-4 text-center relative z-10 border-b border-slate-800/80">
          <div className="flex flex-col items-center justify-center">
            {/* Logo */}
            <div className="relative mb-3 group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-amber-400 shadow-xl shadow-cyan-500/20 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="لوگو کلینیک کنکور"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="absolute -bottom-1 bg-cyan-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                Clinic Konkur
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-amber-300 tracking-tight mb-1">
              پلنر تخصصی کلینیک کنکور
            </h1>
            <p className="text-xs sm:text-sm text-cyan-200/80 font-medium max-w-md mx-auto">
              سامانه هوشمند برنامه‌ریزی درسی، پارت‌بندی استاندارد، گزارش‌کار تحلیلی و پومودورو کنکور
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 relative z-10 overflow-y-auto max-h-[60vh]">
          {/* Animated Promotional Banners */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>خدمات ویژه گروه مشاوره کلینیک کنکور</span>
              </div>
              <div className="flex items-center gap-1">
                {PROMO_BANNERS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBanner(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentBanner === idx ? 'w-5 bg-cyan-400' : 'w-1.5 bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div
              className={`rounded-2xl p-5 border ${banner.border} bg-gradient-to-r ${banner.gradient} backdrop-blur-xs relative overflow-hidden transition-all duration-300`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {banner.tag}
                </span>
                <span className="text-[10px] text-amber-300 font-semibold">{banner.badge}</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">{banner.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{banner.desc}</p>
            </div>
          </div>

          {/* Social Links & Telegram Booking Section */}
          <div className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-700/80 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
              <span>پل‌های ارتباطی و رزرو مشاوره تخصصی:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Telegram Booking */}
              <div className="bg-slate-900/90 rounded-xl p-3 border border-cyan-500/30 flex flex-col justify-between gap-2">
                <div>
                  <span className="text-[11px] text-cyan-400 font-semibold block mb-1">
                    💟 جهت رزرو مشاوره مستقیم:
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-100 select-all block">
                    @Poshtibani_CliniCk_konkur2026
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <a
                    href="https://t.me/Poshtibani_CliniCk_konkur2026"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-[11px] transition-colors"
                  >
                    پیام در تلگرام
                  </a>
                  <button
                    onClick={handleCopyBooking}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                    title="کپی آیدی پشتیبانی"
                  >
                    {copiedBooking ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Telegram Channel */}
              <div className="bg-slate-900/90 rounded-xl p-3 border border-blue-500/30 flex flex-col justify-between gap-2">
                <div>
                  <span className="text-[11px] text-blue-400 font-semibold block mb-1">
                    📢 عضویت در کانال رسمی تلگرام:
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-100 select-all block">
                    t.me/CliniC_Konkur2026
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <a
                    href="https://t.me/CliniC_Konkur2026"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>عضویت در کانال کلینیک کنکور</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>عدم نمایش این صفحه در شروع‌های بعدی</span>
          </label>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isInstallable && (
              <button
                onClick={install}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 text-xs font-bold transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>نصب اپلیکیشن</span>
              </button>
            )}

            <button
              onClick={handleEnterApp}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              <span>ورود به برنامه‌ریز و شروع مطالعه</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
