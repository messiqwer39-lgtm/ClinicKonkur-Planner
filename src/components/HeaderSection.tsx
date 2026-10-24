import React, { useState } from 'react';
import { Calendar, Sparkles, RefreshCw, Edit3, Target, Clock, CheckCircle2, BookOpen } from 'lucide-react';
import { WeeklyHeaderInfo, MOTIVATIONAL_QUOTES } from '../types/planner';
import { toPersianDigits } from '../utils/helpers';

interface HeaderSectionProps {
  headerInfo: WeeklyHeaderInfo;
  onChangeHeader: (newInfo: WeeklyHeaderInfo) => void;
  totalPlannedHours: number;
  completedHours: number;
  totalPlannedTests: number;
  completedPartsCount: number;
  totalPartsCount: number;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  headerInfo,
  onChangeHeader,
  totalPlannedHours,
  completedHours,
  totalPlannedTests,
  completedPartsCount,
  totalPartsCount,
}) => {
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [tempStart, setTempStart] = useState(headerInfo.startDate);
  const [tempEnd, setTempEnd] = useState(headerInfo.endDate);
  const [tempTitle, setTempTitle] = useState(headerInfo.weekNumber);
  const [tempQuote, setTempQuote] = useState(headerInfo.motivationalQuote);

  const handleSaveDates = () => {
    onChangeHeader({
      ...headerInfo,
      startDate: tempStart,
      endDate: tempEnd,
      weekNumber: tempTitle,
    });
    setIsEditingDates(false);
  };

  const handleSaveQuote = () => {
    onChangeHeader({
      ...headerInfo,
      motivationalQuote: tempQuote,
    });
    setIsEditingQuote(false);
  };

  const handleRandomQuote = () => {
    const remaining = MOTIVATIONAL_QUOTES.filter((q) => q !== headerInfo.motivationalQuote);
    const random = remaining[Math.floor(Math.random() * remaining.length)];
    onChangeHeader({
      ...headerInfo,
      motivationalQuote: random,
    });
    setTempQuote(random);
  };

  const completionPercentage = totalPartsCount > 0 
    ? Math.round((completedPartsCount / totalPartsCount) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-xs mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Right side: Start & End of schedule (بخش شروع و پایان برنامه) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-xl p-4 border border-slate-200/70 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>بازه زمانی و مشخصات برنامه</span>
            </div>
            {!isEditingDates ? (
              <button
                onClick={() => {
                  setTempStart(headerInfo.startDate);
                  setTempEnd(headerInfo.endDate);
                  setTempTitle(headerInfo.weekNumber);
                  setIsEditingDates(true);
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>ویرایش تاریخ</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDates}
                  className="text-xs px-2.5 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                >
                  ذخیره
                </button>
                <button
                  onClick={() => setIsEditingDates(false)}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  انصراف
                </button>
              </div>
            )}
          </div>

          {!isEditingDates ? (
            <div>
              <h2 className="text-base font-bold text-slate-800 mb-2">{headerInfo.weekNumber}</h2>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/80 rounded-lg p-2.5 border border-slate-200/60">
                  <span className="text-slate-500 block mb-1">تاریخ شروع برنامه:</span>
                  <span className="font-bold text-slate-800 text-sm">{toPersianDigits(headerInfo.startDate)}</span>
                </div>
                <div className="bg-white/80 rounded-lg p-2.5 border border-slate-200/60">
                  <span className="text-slate-500 block mb-1">تاریخ پایان برنامه:</span>
                  <span className="font-bold text-slate-800 text-sm">{toPersianDigits(headerInfo.endDate)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">عنوان برنامه / هفته:</label>
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="مثلاً: هفته هشتم پاییز - مباحث پایه"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 block mb-1">شروع برنامه:</label>
                  <input
                    type="text"
                    value={tempStart}
                    onChange={(e) => setTempStart(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="۱۴۰۳/۰۸/۰۵"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">پایان برنامه:</label>
                  <input
                    type="text"
                    value={tempEnd}
                    onChange={(e) => setTempEnd(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="۱۴۰۳/۰۸/۱۱"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Left side: Motivational Quote (بخش جمله انگیزشی هفته) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-amber-50/60 to-orange-50/40 rounded-xl p-4 border border-amber-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>جمله انگیزشی هفته</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRandomQuote}
                title="نمایش سخن انگیزشی جدید"
                className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 font-medium bg-amber-100/60 hover:bg-amber-100 px-2 py-1 rounded-md transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>جمله جدید</span>
              </button>
              {!isEditingQuote ? (
                <button
                  onClick={() => {
                    setTempQuote(headerInfo.motivationalQuote);
                    setIsEditingQuote(true);
                  }}
                  className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 font-medium transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تایپ دلخواه</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSaveQuote}
                    className="text-xs px-2.5 py-1 bg-amber-600 text-white rounded-md hover:bg-amber-700 font-medium"
                  >
                    ذخیره
                  </button>
                  <button
                    onClick={() => setIsEditingQuote(false)}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    انصراف
                  </button>
                </div>
              )}
            </div>
          </div>

          {!isEditingQuote ? (
            <div className="relative py-2 px-1">
              <span className="text-3xl text-amber-300 font-serif absolute -top-2 right-0 select-none">“</span>
              <p className="text-sm font-medium text-amber-950 leading-relaxed pr-4 pl-2 text-balance">
                {headerInfo.motivationalQuote}
              </p>
              <div className="mt-2 text-left text-[11px] text-amber-700 font-semibold">
                هدف: رتبه برتر کنکور سراسری ✨
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <textarea
                rows={2}
                value={tempQuote}
                onChange={(e) => setTempQuote(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                placeholder="جمله انگیزشی یا هدف شخصی خود برای این هفته را بنویسید..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Quick Summary KPI strip */}
      <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50">
          <div className="w-7 h-7 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">ساعت برنامه‌ریزی:</span>
            <span className="font-bold text-slate-800 text-sm">
              {toPersianDigits(totalPlannedHours)} ساعت
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50">
          <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">پارت‌های اجرا شده:</span>
            <span className="font-bold text-slate-800 text-sm">
              {toPersianDigits(completedPartsCount)} از {toPersianDigits(totalPartsCount)} پارت
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50">
          <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Target className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">هدف تست هفتگی:</span>
            <span className="font-bold text-slate-800 text-sm">
              {toPersianDigits(totalPlannedTests)} تست
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50">
          <div className="w-7 h-7 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">پیشرفت کل:</span>
              <span className="font-bold text-indigo-600 text-xs">%{toPersianDigits(completionPercentage)}</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, completionPercentage)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
