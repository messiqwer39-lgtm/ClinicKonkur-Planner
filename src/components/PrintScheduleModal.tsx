import React from 'react';
import {
  DaySchedule,
  WeeklyHeaderInfo,
  SUBJECT_CONFIGS,
  DAYS_INFO,
} from '../types/planner';
import { toPersianDigits } from '../utils/helpers';
import { Printer, X, Calendar, CheckSquare, Sparkles, BookOpen } from 'lucide-react';

interface PrintScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: DaySchedule[];
  headerInfo: WeeklyHeaderInfo;
  partTimes: string[];
}

export const PrintScheduleModal: React.FC<PrintScheduleModalProps> = ({
  isOpen,
  onClose,
  schedule,
  headerInfo,
  partTimes,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Calculations for summary
  let totalParts = 0;
  let totalTests = 0;
  let completedParts = 0;

  schedule.forEach((day) => {
    day.parts.forEach((p) => {
      if (p.subject) {
        totalParts++;
        totalTests += p.targetTests || 0;
        if (p.status === 'completed') completedParts++;
      }
    });
  });

  const totalHours = totalParts * 1.5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white text-slate-900 rounded-3xl max-w-6xl w-full p-4 sm:p-8 shadow-2xl relative my-auto overflow-hidden print:p-0 print:m-0 print:max-w-none print:shadow-none print:rounded-none">
        {/* Print Action Bar (Hidden on actual print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                پیش‌نمایش چاپ برنامه هفتگی (نسخه استاندارد A4)
              </h3>
              <p className="text-xs text-slate-500">
                با کلیک روی دکمه چاپ می‌توانید خروجی کاغذی یا فایل PDF استاندارد با کیفیت بالا دریافت کنید.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ مستقیم یا ذخیره PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet View */}
        <div className="printable-sheet bg-white text-slate-900 text-right font-sans p-2 sm:p-4 border border-slate-200 rounded-2xl print:border-none print:p-0">
          {/* Printable Header */}
          <div className="flex items-center justify-between border-b-2 border-indigo-600 pb-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl border border-indigo-200 p-0.5 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="کلینیک کنکور" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div>
                <h1 className="text-lg font-black text-indigo-950 tracking-tight">
                  پلنر تخصصی و برنامه مطالعاتی کلینیک کنکور
                </h1>
                <p className="text-[11px] text-slate-600">
                  سامانه اختصاصی برنامه‌ریزی ۸ پارت ۹۰ دقیقه‌ای روزانه · پشتیبانی تلگرام: Poshtibani_CliniCk_konkur2026@
                </p>
              </div>
            </div>

            <div className="text-left text-xs space-y-1">
              <div>
                <span className="text-slate-500 ml-1">عنوان برنامه:</span>
                <span className="font-bold text-slate-900">{headerInfo.weekNumber || 'برنامه هفتگی'}</span>
              </div>
              <div>
                <span className="text-slate-500 ml-1">بازه زمانی:</span>
                <span className="font-bold text-slate-900">
                  {toPersianDigits(headerInfo.startDate || '---')} تا {toPersianDigits(headerInfo.endDate || '---')}
                </span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full border-collapse text-center text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-800">
                  <th className="p-2 border-l border-slate-300 w-28 font-black">روز هفته</th>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num, idx) => (
                    <th key={num} className="p-1.5 border-l border-slate-300 last:border-l-0 w-[11.5%] font-bold">
                      <div className="text-[11px] text-indigo-950 font-black">پارت {toPersianDigits(num)}</div>
                      <div className="text-[9px] text-slate-500 font-mono">
                        {toPersianDigits(partTimes[idx] || `پارت ${num}`)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map((day) => (
                  <tr key={day.dayId} className="border-b border-slate-200 min-h-[46px]">
                    <td className="p-2 border-l border-slate-300 bg-slate-50 font-bold text-slate-900 text-xs text-right align-middle">
                      <div>{day.dayName}</div>
                      {day.dateStr && (
                        <div className="text-[10px] text-slate-500 font-mono">{toPersianDigits(day.dateStr)}</div>
                      )}
                    </td>

                    {day.parts.map((p) => {
                      const cfg = p.subject ? SUBJECT_CONFIGS[p.subject as keyof typeof SUBJECT_CONFIGS] : null;
                      return (
                        <td
                          key={p.id}
                          className="p-1 border-l border-slate-200 last:border-l-0 text-right align-top text-[10px] h-12"
                        >
                          {cfg ? (
                            <div className="flex flex-col justify-between h-full space-y-0.5">
                              <div className="font-bold text-indigo-900 truncate">
                                {cfg.shortTitle}
                              </div>
                              <div className="text-slate-700 truncate leading-tight">
                                {p.topic || '---'}
                              </div>
                              <div className="flex items-center justify-between text-[9px] text-slate-500 pt-0.5 border-t border-slate-100">
                                <span>{toPersianDigits(p.targetTests || 0)} تست</span>
                                <span className={p.status === 'completed' ? 'text-emerald-700 font-bold' : ''}>
                                  {p.status === 'completed' ? '✓ کامل' : ''}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-slate-300 text-center py-2">---</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Printable Footer / Study Summary */}
          <div className="mt-3 pt-3 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-0.5">ساعات کل مطالعه برنامه‌ریزی‌شده:</span>
              <span className="font-black text-indigo-950 text-sm">
                {toPersianDigits(totalHours)} ساعت ({toPersianDigits(totalParts)} پارت ۹۰ دقیقه‌ای)
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-0.5">کل تست‌های هدف هفته:</span>
              <span className="font-black text-emerald-950 text-sm">
                {toPersianDigits(totalTests)} تست
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-0.5">جمله انگیزشی هفته:</span>
              <span className="text-[11px] text-slate-700 italic block leading-tight">
                {headerInfo.motivationalQuote}
              </span>
            </div>
          </div>

          {/* Signature / Notes bar for student & mentor */}
          <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
            <div>کلینیک کنکور | کانال رسمی تلگرام: CliniC_Konkur2026@</div>
            <div className="flex items-center gap-6">
              <span>امضای داوطلب: ............................</span>
              <span>امضای مشاور: ............................</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
