import React, { useState } from 'react';
import { X, Download, Image as ImageIcon, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';

interface ScreenshotsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SCREENSHOT_ITEMS = [
  {
    id: 'schedule',
    title: '۱. جدول برنامه‌ریزی هفتگی (۸ پارت ۱.۵ ساعته)',
    desc: 'نمایش جدول ۷ روز هفته، ساعت بالای هر پارت، سربرگ تاریخ شروع و پایان و باکس جمله انگیزشی',
    imageSrc: '/screenshots/01_schedule.jpg',
    features: [
      'تقسیم‌بندی روزهای شنبه تا جمعه به ۸ پارت ۹۰ دقیقه‌ای',
      'بخش تنظیم ساعت در بالای هر ستون پارت (مثلاً ۰۷:۰۰ - ۰۸:۳۰)',
      'سربرگ تاریخ شروع و پایان برنامه همراه با جمله انگیزشی قابل ویرایش',
      'کدگذاری رنگی دروس کنکور (زیست، فیزیک، شیمی، ریاضی، عمومی و آزمون)',
    ],
  },
  {
    id: 'overview',
    title: '۲. بخش نگاه کلی دروس اختصاصی و عمومی',
    desc: '۵ باکس تفکیکی برای زیست، فیزیک، شیمی، ریاضی و دروس عمومی همراه بودجه‌بندی هفتگی',
    imageSrc: '/screenshots/02_overview.jpg',
    features: [
      'باکس‌های اختصاصی با هویت بصری مستقل برای هر درس',
      'تعریف فصول و مباحث هدف‌گذاری شده هر هفته',
      'هدف‌گذاری ساعات مطالعه و تعداد تست هفتگی',
      'شمارشگر خودکار تعداد پارت‌های تخصیص‌یافته به هر درس در جدول',
    ],
  },
  {
    id: 'report',
    title: '۳. دفترچه گزارش کار و کارنامه عملکرد روزانه',
    desc: 'جدول کامل ثبت ساعات تشریحی/تستی، درصد با کسر نمره منفی کنکور و تحلیل مشاور',
    imageSrc: '/screenshots/03_report.jpg',
    features: [
      'تفکیک ساعات مطالعه تشریحی و تستی برای هر روز',
      'ثبت تست‌های صحیح، غلط، نزده و محاسبه درصد نهایی کنکور',
      'پیگیری ساعت خواب شبانه و امتیاز کیفیت مطالعه',
      'نمودار مقایسه‌ای ستونی و پنل بازخورد هوشمند مشاور کنکور',
    ],
  },
  {
    id: 'timer',
    title: '۴. تایمر تمرکز ۹۰ دقیقه‌ای (۱.۵ ساعته)',
    desc: 'زمان‌سنج مطالعه با دایل دایره‌ای، هشدار صوتی و ثبت خودکار در جدول',
    imageSrc: '/screenshots/04_timer.jpg',
    features: [
      'زمان‌سنج معکوس استاندارد ۹۰ دقیقه برای هر پارت مطالعه',
      'دایل گرافیکی پیشرفت دایره‌ای با رنگ‌بندی آرامش‌بخش',
      'آلارم صوتی پایان زمان پارت',
      'امکان تیک زدن و ثبت خودکار پارت به عنوان «انجام شد» در جدول',
    ],
  },
];

export const ScreenshotsModal: React.FC<ScreenshotsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeIdx, setActiveIdx] = useState(0);
  const current = SCREENSHOT_ITEMS[activeIdx];

  const handleDownloadZip = () => {
    const link = document.createElement('a');
    link.href = '/konkur_planner_screenshots.zip';
    link.download = 'konkur_planner_screenshots.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                گالری تصاویر و فایل فشرده (ZIP) برنامه ریز کنکوری
              </h2>
              <p className="text-xs text-slate-500">
                مشاهده و دانلود عکس‌های تمام قابلیت‌ها و بخش‌های مختلف سامانه
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>دانلود فایل ZIP (۲.۱ مگابایت)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200/70 flex gap-2 overflow-x-auto text-xs">
          {SCREENSHOT_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIdx(idx)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0 ${
                activeIdx === idx
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-right">
          {/* Main Image View */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md aspect-video">
            <img
              src={current.imageSrc}
              alt={current.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Details & Features List */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70">
            <h3 className="font-bold text-slate-900 text-sm mb-1">{current.title}</h3>
            <p className="text-xs text-slate-600 mb-3">{current.desc}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {current.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-700 bg-white p-2 rounded-lg border border-slate-200/60">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            فایل ZIP شامل ۴ تصویر با وضوح بالا + فایل متنی راهنمای جامع قابلیت‌ها می‌باشد.
          </span>
          <button
            onClick={handleDownloadZip}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>دانلود فوری فایل زیپ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
