import React, { useState } from 'react';
import {
  DaySchedule,
  WeeklyHeaderInfo,
  SubjectOverviewItem,
  SUBJECT_CONFIGS,
  DAYS_INFO,
} from '../types/planner';
import { toPersianDigits } from '../utils/helpers';
import {
  Printer,
  X,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
} from 'lucide-react';

interface SchedulePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  headerInfo: WeeklyHeaderInfo;
  schedule: DaySchedule[];
  partTimes: string[];
  overviewList?: SubjectOverviewItem[];
}

export const SchedulePrintModal: React.FC<SchedulePrintModalProps> = ({
  isOpen,
  onClose,
  headerInfo,
  schedule,
  partTimes,
  overviewList = [],
}) => {
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [includeOverview, setIncludeOverview] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleTriggerPrint = () => {
    window.print();
  };

  const filteredSchedule = selectedDayFilter === 'all'
    ? schedule
    : schedule.filter((d) => d.dayId === selectedDayFilter);

  // Totals
  let totalParts = 0;
  let totalTests = 0;
  let completedTests = 0;
  filteredSchedule.forEach((d) => {
    d.parts.forEach((p) => {
      if (p.subject) {
        totalParts++;
        totalTests += p.targetTests || 0;
        completedTests += p.completedTests || 0;
      }
    });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div
        className="bg-white text-slate-900 rounded-3xl max-w-5xl w-full shadow-2xl flex flex-col my-auto border border-slate-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Toolbar (hidden when printing) */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black">
                پیش‌نمایش و چاپ برنامه مطالعاتی کلینیک کنکور
              </h3>
              <p className="text-[11px] text-slate-400">
                قالب استاندارد A4 متناسب با پرینت سیاه‌سفید یا رنگی بدون اتلاف جوهر
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter */}
            <select
              value={selectedDayFilter}
              onChange={(e) => setSelectedDayFilter(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 border border-slate-700"
            >
              <option value="all">تمام روزهای هفته (شنبه تا جمعه)</option>
              {DAYS_INFO.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <button
              onClick={handleTriggerPrint}
              className="py-1.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ مستقیم (PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[80vh] bg-white text-slate-950 print:p-0 print:m-0 print:max-h-none print:overflow-visible">
          {/* Print Sheet Header */}
          <div className="border-b-2 border-slate-850 pb-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-slate-800 p-0.5 flex items-center justify-center">
                  <img src="/logo.png" alt="لوگو کلینیک کنکور" className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900">
                    دفترچه برنامه‌ریزی هفتگی کلینیک کنکور
                  </h1>
                  <span className="text-xs text-slate-600 font-semibold">
                    مشاوره تخصصی و برنامه‌ریزی کنکور سراسری · پشتیبانی: Poshtibani_CliniCk_konkur2026@
                  </span>
                </div>
              </div>

              <div className="text-left text-xs space-y-0.5 font-medium">
                <div><strong>عنوان هفته:</strong> {headerInfo.weekNumber || 'هفته جاری'}</div>
                <div><strong>بازه زمانی:</strong> {headerInfo.startDate || '---'} تا {headerInfo.endDate || '---'}</div>
                <div><strong>تاریخ چاپ:</strong> {new Date().toLocaleDateString('fa-IR')}</div>
              </div>
            </div>

            {headerInfo.motivationalQuote && (
              <div className="mt-3 p-2 bg-slate-100 rounded-lg text-xs italic text-slate-800 border-r-4 border-cyan-600">
                <strong>پیام انگیزشی هفته:</strong> {headerInfo.motivationalQuote}
              </div>
            )}

            {/* Summary stat strip */}
            <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs border border-slate-300 rounded-lg p-2 bg-slate-50 font-bold">
              <div>پارت‌های فعال: {toPersianDigits(totalParts)}</div>
              <div>ساعت مطالعه کل: {toPersianDigits(totalParts * 1.5)} ساعت</div>
              <div>تست هدف: {toPersianDigits(totalTests)}</div>
              <div>تست انجام شده: {toPersianDigits(completedTests)}</div>
            </div>
          </div>

          {/* Days Schedule Content */}
          <div className="space-y-6">
            {filteredSchedule.map((day) => (
              <div key={day.dayId} className="border border-slate-300 rounded-xl overflow-hidden page-break-inside-avoid">
                {/* Day Header */}
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-300 flex items-center justify-between text-xs font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black">{day.dayName}</span>
                    {day.dateStr && <span className="text-slate-600">({day.dateStr})</span>}
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-slate-600">
                    <span>ساعت بیداری: {toPersianDigits(day.wakeTime || '۰۶:۳۰')}</span>
                    <span>ساعت خواب: {toPersianDigits(day.sleepTime || '۲۳:۰۰')}</span>
                  </div>
                </div>

                {/* Day Parts Table */}
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-[11px]">
                      <th className="p-2 border-l border-slate-200 w-12 text-center">پارت</th>
                      <th className="p-2 border-l border-slate-200 w-24 text-center">بازه زمانی</th>
                      <th className="p-2 border-l border-slate-200 w-32">درس</th>
                      <th className="p-2 border-l border-slate-200">مبحث و سرفصل تفصیلی</th>
                      <th className="p-2 border-l border-slate-200 w-24 text-center">صفحات هدف</th>
                      <th className="p-2 border-l border-slate-200 w-20 text-center">تست هدف</th>
                      <th className="p-2 border-l border-slate-200 w-20 text-center">تست زده</th>
                      <th className="p-2 w-16 text-center">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.parts.map((p, idx) => {
                      const subjectTitle = p.subject ? (SUBJECT_CONFIGS[p.subject]?.title || p.subject) : '---';
                      const isEven = idx % 2 === 0;
                      return (
                        <tr
                          key={p.id}
                          className={`border-b border-slate-200 ${isEven ? 'bg-white' : 'bg-slate-50/50'}`}
                        >
                          <td className="p-2 border-l border-slate-200 text-center font-bold">
                            {toPersianDigits(p.partNumber)}
                          </td>
                          <td className="p-2 border-l border-slate-200 text-center font-mono text-[11px]">
                            {toPersianDigits(p.timeRange)}
                          </td>
                          <td className="p-2 border-l border-slate-200 font-bold text-slate-900">
                            {subjectTitle}
                          </td>
                          <td className="p-2 border-l border-slate-200 text-slate-800">
                            {p.topic || (p.subject ? 'مطالعه و حل تست' : 'آزاد')}
                            {p.notes && <span className="block text-[10px] text-slate-500 mt-0.5">نکته: {p.notes}</span>}
                          </td>
                          <td className="p-2 border-l border-slate-200 text-center font-mono">
                            {p.targetPages ? toPersianDigits(p.targetPages) : '---'}
                          </td>
                          <td className="p-2 border-l border-slate-200 text-center font-bold font-mono">
                            {toPersianDigits(p.targetTests || 0)}
                          </td>
                          <td className="p-2 border-l border-slate-200 text-center font-bold font-mono">
                            {toPersianDigits(p.completedTests || 0)}
                          </td>
                          <td className="p-2 text-center text-[10px]">
                            {p.status === 'completed' ? (
                              <span className="font-bold text-emerald-700">تکمیل ✓</span>
                            ) : p.status === 'in_progress' ? (
                              <span className="font-bold text-amber-700">در حال مطالعه</span>
                            ) : (
                              <span className="text-slate-400">برنامه‌ریزی</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Day Notes */}
                {day.dayNotes && (
                  <div className="p-2 bg-slate-50 text-[11px] text-slate-700 border-t border-slate-200">
                    <strong>توضیحات و گزارش روز {day.dayName}:</strong> {day.dayNotes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Counselor Advice & Signature Section */}
          <div className="mt-6 pt-4 border-t-2 border-slate-850 flex items-center justify-between text-xs text-slate-700 page-break-inside-avoid">
            <div>
              <div className="font-bold text-slate-900">نکات مشاوره‌ای کلینیک کنکور:</div>
              <ul className="list-disc list-inside text-[11px] text-slate-600 mt-1 space-y-0.5">
                <li>پایبندی به زمان‌های استراحت ۱۵ دقیقه‌ای بین پارت‌ها الزامی است.</li>
                <li>تست‌های علامت‌دار را در پارت مرور پایان هفته مجدداً بررسی نمایید.</li>
                <li>ثبت تعداد تست‌های درست، غلط و نزده در پایان هر شب ضروری است.</li>
              </ul>
            </div>

            <div className="flex gap-8 text-center text-xs">
              <div className="w-32 border-t border-dashed border-slate-400 pt-8 text-slate-500">
                امضای داوطلب
              </div>
              <div className="w-32 border-t border-dashed border-slate-400 pt-8 text-slate-500">
                تأیید مشاور کلینیک
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
