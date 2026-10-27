import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  BookOpen,
  Clock,
  CheckCircle2,
  Image,
  Award,
  Sparkles,
  Download,
  Flame,
  Smartphone,
  ChevronLeft,
  FileArchive,
} from 'lucide-react';

interface AppUserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppUserGuideModal: React.FC<AppUserGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<number>(0);

  if (!isOpen) return null;

  const sections = [
    {
      title: '۱. جدول برنامه‌ریزی ۸ پارت ۹۰ دقیقه‌ای',
      icon: Clock,
      content: (
        <div className="space-y-2 text-slate-300 text-xs leading-relaxed">
          <p>
            برنامه بر اساس استاندارد زمان‌بندی دفترچه‌های کنکور سراسری به <strong>۸ پارت ۱.۵ ساعته (۹۰ دقیقه)</strong> تقسیم شده است.
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-200">
            <li><strong>ویرایش پارت:</strong> کافیست روی هر سلول از جدول کلیک کنید تا نام درس، مبحث، تعداد تست هدف و صفحات کتاب را وارد کنید.</li>
            <li><strong>تنظیم ساعت پارت‌ها:</strong> با کلیک روی ساعت بالای هر ستون (مثلاً ۰۷:۰۰ - ۰۸:۳۰) می‌توانید ساعت‌ها را به دلخواه خود تغییر دهید.</li>
            <li><strong>تغییر سریع وضعیت:</strong> با کلیک روی وضعیت پارت در جدول می‌توانید آن را بین «برنامه‌ریزی»، «در حال مطالعه» و «انجام شد» تغییر دهید.</li>
          </ul>
        </div>
      ),
    },
    {
      title: '۲. انتخاب رشته (تجربی، ریاضی و انسانی)',
      icon: BookOpen,
      content: (
        <div className="space-y-2 text-slate-300 text-xs leading-relaxed">
          <p>
            پلنر کلینیک کنکور شامل بانک کامل مباحث کتاب‌های درسی پایه‌های دهم، یازدهم و دوازدهم برای ۳ رشته اصلی است:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-200">
            <li><strong>رشته تجربی:</strong> زیست‌شناسی، شیمی، فیزیک، ریاضی تجربی، زمین‌شناسی.</li>
            <li><strong>رشته ریاضی:</strong> حسابان و ریاضی پایه، هندسه تخصصی، گسسته و آمار، فیزیک، شیمی.</li>
            <li><strong>رشته انسانی:</strong> علوم و فنون ادبی، ریاضی و آمار، عربی تخصصی، فلسفه و منطق، اقتصاد، روان‌شناسی، جامعه‌شناسی، تاریخ و جغرافیا.</li>
            <li><strong>دروس عمومی و نهایی:</strong> فارسی، عربی، دین و زندگی، انگلیسی.</li>
          </ul>
        </div>
      ),
    },
    {
      title: '۳. خروجی دو صفحه‌ای (برنامه و گزارش کار) و ذخیره در گالری',
      icon: Image,
      content: (
        <div className="space-y-2 text-slate-300 text-xs leading-relaxed">
          <p>
            بدون نیاز به اینترنت، می‌توانید هر دو صفحه را در قالب عکس‌های تفکیک‌شده باکیفیت مستقیم در <strong>گالری یا پوشه دانلودهای گوشی</strong> ذخیره کنید:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-200">
            <li><strong>صفحه ۱:</strong> جدول هفتگی ۸ پارت ۹۰ دقیقه‌ای با تمام ساعات، مباحث و منابع.</li>
            <li><strong>صفحه ۲:</strong> دفترچه گزارش کار و کارنامه تحلیلی با ساعات تستی/تشریحی، درصد با کسر نمره منفی و تحلیل مشاور.</li>
            <li><strong>روش ذخیره در گوشی:</strong> علاوه بر دکمه دانلود، کافیست انگشت خود را ۲ ثانیه روی عکس نگه دارید و گزینه «بارگیری تصویر» را انتخاب نمایید.</li>
          </ul>
        </div>
      ),
    },
    {
      title: '۴. تکنیک پومودورو کنکوری (۹۰ دقیقه تمرکز)',
      icon: Flame,
      content: (
        <div className="space-y-2 text-slate-300 text-xs leading-relaxed">
          <p>
            تکنیک پومودورو اختصاصی کلینیک کنکور متناسب با مدت زمان پاسخ‌گویی به دفترچه‌های کنکور طراحی شده است:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-200">
            <li>چرخه طلایی شامل <strong>۹۰ دقیقه مطالعه بی‌وقفه</strong> و ۱۵ دقیقه استراحت هدفمند است.</li>
            <li>مجهز به صدای ملایم باران و نویز سفید آفلاین برای حذف سروصدای مزاحم اطراف.</li>
            <li>در پایان تایمر، زمان مطالعه به صورت خودکار در گزارش کار روزانه شما ثبت می‌شود.</li>
          </ul>
        </div>
      ),
    },
    {
      title: '۵. بسته‌ مدارک بازبینی سپر گوگل (مخصوص انتشار)',
      icon: FileArchive,
      content: (
        <div className="space-y-2 text-slate-300 text-xs leading-relaxed">
          <p>
            برای توسعه‌دهنده و صاحب اپلیکیشن، بسته مدارک و راهنمای کامل فرم بازبینی سپر امنیتی گوگل (Google Play Protect) و انتشار در کافه بازار و مایکت در یک فایل ZIP آماده شده است:
          </p>
          <div className="pt-2">
            <a
              href="./Google-Play-Protect-Appeal-Kit.zip"
              download="Google-Play-Protect-Appeal-Kit.zip"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs rounded-xl shadow-md hover:scale-105 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>دانلود بسته ZIP مدارک بازبینی سپر گوگل (Google Kit)</span>
            </a>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div
        className="bg-slate-900 border-2 border-cyan-500/40 rounded-3xl max-w-2xl w-full text-slate-100 shadow-2xl shadow-cyan-500/20 overflow-hidden flex flex-col my-auto relative ring-4 ring-cyan-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                راهنمای جامع کار با پلنر کلینیک کنکور
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                نکات، ترفندها و آموزش استفاده از امکانات پیشرفته و آفلاین اپلیکیشن
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Navigation Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-slate-800">
            {sections.map((sec, idx) => {
              const IconComp = sec.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveSection(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeSection === idx
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{sec.title.split('.')[1] || sec.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Section Content */}
          <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{sections[activeSection].title}</span>
            </h4>
            {sections[activeSection].content}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            پشتیبانی و پاسخ به سوالات: Poshtibani_CliniCk_konkur2026@
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs rounded-xl hover:from-cyan-300 hover:to-blue-400 transition-colors"
          >
            بستن راهنما
          </button>
        </div>
      </div>
    </div>
  );
};
