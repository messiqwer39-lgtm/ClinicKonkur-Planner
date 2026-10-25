import React, { useEffect, useState } from 'react';
import { Send, Sparkles, Award, Flame, TrendingUp, Users } from 'lucide-react';

const BOOKING_URL = 'https://t.me/Poshtibani_CliniCk_konkur2026';
const CHANNEL_URL = 'https://t.me/CliniC_Konkur2026';

/** بنرهای تبلیغاتی چرخشی کلینیک کنکور (در فضای خود اپ) */
const APP_ADS = [
  {
    id: 1,
    tag: 'طرح VIP رتبه‌سازی',
    title: 'مشاوره خصوصی کلینیک کنکور با پیگیری شبانه رتبه‌های برتر',
    desc: 'برنامه‌ریزی کاملاً شخصی بر اساس تراز و نقاط ضعف تو — ظرفیت محدود ۱۴۰۴-۱۴۰۵',
    icon: TrendingUp,
    gradient: 'from-cyan-500/25 via-blue-600/15 to-indigo-500/10',
    border: 'border-cyan-400/40',
    chip: 'bg-cyan-500/25 text-cyan-200 border-cyan-400/30',
  },
  {
    id: 2,
    tag: 'آنالیز کارنامه',
    title: 'آنالیز حرفه‌ای آزمون‌های آزمایشی و جهش تراز',
    desc: 'شناسایی دام‌های تستی و ارائه راه‌حل علمی — رشد میانگین ۱۲۰۰ تراز',
    icon: Award,
    gradient: 'from-emerald-500/25 via-teal-600/15 to-cyan-500/10',
    border: 'border-emerald-400/40',
    chip: 'bg-emerald-500/25 text-emerald-200 border-emerald-400/30',
  },
  {
    id: 3,
    tag: 'کارگاه مهارت',
    title: 'کارگاه مدیریت زمان، تندخوانی و تکنیک ضربدر-منها',
    desc: 'صرفه‌جویی ۳۰ دقیقه‌ای در دفترچه کنکور با متدولوژی اختصاصی کلینیک',
    icon: Flame,
    gradient: 'from-amber-500/25 via-orange-600/15 to-yellow-500/10',
    border: 'border-amber-400/40',
    chip: 'bg-amber-500/25 text-amber-200 border-amber-400/30',
  },
  {
    id: 4,
    tag: 'کانال رسمی',
    title: 'عضویت در کانال تلگرام کلینیک کنکور',
    desc: 'منابع رایگان، پکیج‌های آموزشی و اطلاع‌رسانی طرح‌های ویژه — CliniC_Konkur2026@',
    icon: Users,
    gradient: 'from-blue-500/25 via-indigo-600/15 to-purple-500/10',
    border: 'border-blue-400/40',
    chip: 'bg-blue-500/25 text-blue-200 border-blue-400/30',
  },
];

/** نوار بنر تبلیغاتی بزرگ و چرخشی (بالای تمام تب‌ها) */
export const PromoBannerStrip: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % APP_ADS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const ad = APP_ADS[current];
  const AdIcon = ad.icon;

  return (
    <div className="mb-6 no-print">
      <div
        key={ad.id}
        className={`banner-slide relative overflow-hidden rounded-2xl border ${ad.border} bg-gradient-to-l ${ad.gradient} backdrop-blur-xs shadow-lg`}
      >
        <div className="flex items-center gap-3 p-3.5 sm:p-4">
          <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950/50 border border-white/10 flex items-center justify-center shrink-0">
            <AdIcon className="w-5 h-5 text-cyan-300" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${ad.chip}`}>{ad.tag}</span>
              <span className="text-[8px] text-slate-500 font-semibold">معرفی خدمات کلینیک کنکور</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white mt-1 leading-snug truncate">{ad.title}</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-300/90 mt-0.5 leading-relaxed line-clamp-1">
              {ad.desc}
            </p>
          </div>

          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all hover:scale-105 shadow-md shadow-cyan-500/30 shrink-0"
          >
            <Send className="w-3 h-3" />
            <span>رزرو مشاوره</span>
          </a>
        </div>

        {/* نشانگرهای چرخش */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1">
          {APP_ADS.map((_, idx) => (
            <span
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                current === idx ? 'w-4 bg-white/80' : 'w-1 bg-white/25'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/** تیکر تبلیغاتی متحرک و باریک (بالای فوتر) */
export const PromoTicker: React.FC = () => {
  const items = [
    'طرح مشاوره VIP کلینیک کنکور — ظرفیت محدود',
    'آنالیز کارنامه آزمون آزمایشی با رتبه‌های برتر',
    'کارگاه مدیریت زمان و تندخوانی کنکور',
    'کانال رسمی: CliniC_Konkur2026@',
    'رزرو مشاوره: Poshtibani_CliniCk_konkur2026@',
  ];
  const loop = [...items, ...items];

  return (
    <div className="no-print bg-slate-950 border-t border-cyan-500/20 py-2 overflow-hidden relative">
      <div className="ticker-track flex items-center gap-10 whitespace-nowrap w-max">
        {loop.map((item, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-2 text-[10px] font-semibold text-cyan-300/90"
          >
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
