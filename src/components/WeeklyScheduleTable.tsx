import React, { useState } from 'react';
import {
  DaySchedule,
  PartSlot,
  SUBJECT_CONFIGS,
  PartStatus,
} from '../types/planner';
import { toPersianDigits, playChime } from '../utils/helpers';
import {
  Clock,
  Edit2,
  CheckCircle2,
  CircleDashed,
  AlertTriangle,
  XCircle,
  Plus,
  Play,
  Printer,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WeeklyScheduleTableProps {
  schedule: DaySchedule[];
  partTimes: string[];
  onOpenPartModal: (dayName: string, slot: PartSlot) => void;
  onOpenTimeModal: () => void;
  onQuickToggleStatus: (dayId: string, partId: string) => void;
  onStartTimer: (slot: PartSlot) => void;
  onOpenPrintModal?: () => void;
}

export const WeeklyScheduleTable: React.FC<WeeklyScheduleTableProps> = ({
  schedule,
  partTimes,
  onOpenPartModal,
  onOpenTimeModal,
  onQuickToggleStatus,
  onStartTimer,
  onOpenPrintModal,
}) => {
  const getStatusBadge = (status: PartStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>انجام شد</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded font-medium">
            <CircleDashed className="w-3 h-3 text-blue-600 animate-spin" />
            <span>در حال مطالعه</span>
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded font-medium">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>ناقص</span>
          </span>
        );
      case 'missed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 bg-rose-100/70 px-1.5 py-0.5 rounded font-medium">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>انجام نشد</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
            برنامه‌ریزی
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs mb-8 overflow-hidden print-card">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              جدول جامع برنامه‌ریزی هفتگی (۸ پارت ۱.۵ ساعته)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
              ۷ روز هفته
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            برای ویرایش هر پارت روی آن کلیک کنید. ساعت هر پارت در بالای ستون قابل تنظیم است.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenPrintModal && (
            <button
              onClick={onOpenPrintModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded-lg transition-colors shrink-0 no-print"
              title="چاپ برنامه استاندارد A4 یا ذخیره PDF"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>چاپ برنامه (A4 / PDF)</span>
            </button>
          )}

          <button
            onClick={onOpenTimeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 rounded-lg transition-colors shrink-0 no-print"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>تنظیم ساعت پارت‌ها</span>
          </button>
        </div>
      </div>

      {/* Responsive Horizontal Scroll Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse min-w-[1100px]">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 text-xs">
              {/* Day header column */}
              <th className="p-3 w-36 font-bold text-slate-800 border-l border-slate-200 sticky right-0 bg-slate-100/95 z-10">
                روز هفته / تاریخ
              </th>

              {/* 8 Part Columns with Time on Top */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((partNum, idx) => (
                <th
                  key={partNum}
                  className="p-2.5 font-bold text-slate-800 border-l border-slate-200 last:border-l-0 text-center w-[120px]"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-indigo-900 font-bold">
                      پارت {toPersianDigits(partNum)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">۱.۵ ساعت</span>

                    {/* Section above part to write/view time */}
                    <div
                      onClick={onOpenTimeModal}
                      title="کلیک برای ویرایش ساعت پارت"
                      className="mt-1 cursor-pointer bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px] text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center gap-1 font-mono tabular-nums shadow-2xs"
                    >
                      <Clock className="w-2.5 h-2.5 text-slate-400" />
                      <span>{toPersianDigits(partTimes[idx] || `پارت ${partNum}`)}</span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/70 text-xs">
            {schedule.map((day) => {
              // Calculate day stats
              const totalSlots = day.parts.length;
              const filledSlots = day.parts.filter((p) => p.subject).length;
              const completedSlots = day.parts.filter((p) => p.status === 'completed').length;
              const dayHours = filledSlots * 1.5;
              const dayTests = day.parts.reduce((acc, p) => acc + (p.targetTests || 0), 0);

              return (
                <tr
                  key={day.dayId}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Day Info Sticky Cell */}
                  <td className="p-3 border-l border-slate-200 align-top sticky right-0 bg-white group-hover:bg-slate-50/90 z-10 shadow-xs">
                    <div className="flex flex-col justify-between h-full space-y-1.5">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">
                            {day.dayName}
                          </span>
                          <span className="text-[10px] font-mono tabular-nums text-slate-400">
                            {toPersianDigits(day.dateStr)}
                          </span>
                        </div>
                        {day.dayNotes && (
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                            {day.dayNotes}
                          </p>
                        )}
                      </div>

                      {/* Day Stats Badge */}
                      <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-[10px] text-slate-500">
                        <div className="flex items-center justify-between">
                          <span>ساعت کل:</span>
                          <span className="font-bold text-slate-700">
                            {toPersianDigits(dayHours)} س
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>تست‌ها:</span>
                          <span className="font-bold text-slate-700">
                            {toPersianDigits(dayTests)} تست
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-0.5">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{
                              width: `${totalSlots > 0 ? (completedSlots / totalSlots) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 8 Study Parts for this day */}
                  {day.parts.map((part) => {
                    const cfg = part.subject ? SUBJECT_CONFIGS[part.subject] : null;

                    return (
                      <td
                        key={part.id}
                        className="p-1.5 border-l border-slate-200/70 last:border-l-0 align-top h-28 w-[120px]"
                      >
                        {part.subject ? (
                          <div
                            onClick={() => onOpenPartModal(day.dayName, part)}
                            className={`h-full rounded-xl border p-2 flex flex-col justify-between cursor-pointer transition-all duration-150 hover:shadow-sm hover:scale-[1.01] ${
                              cfg ? cfg.badgeBg : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {/* Card Top: Subject Name & Status */}
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="font-bold text-xs truncate max-w-[80px]">
                                  {cfg ? cfg.title : 'پارت'}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onQuickToggleStatus(day.dayId, part.id);
                                  }}
                                  title="تغییر سریع وضعیت پارت"
                                  className="text-slate-400 hover:text-slate-700"
                                >
                                  {part.status === 'completed' ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <div className="w-3 h-3 rounded-full border border-slate-400 hover:border-emerald-500" />
                                  )}
                                </button>
                              </div>

                              {/* Topic text */}
                              <p className="text-[11px] font-medium leading-tight text-slate-800 line-clamp-2">
                                {part.topic || 'بدون مبحث'}
                              </p>
                            </div>

                            {/* Card Bottom: Test count & Status */}
                            <div className="mt-1 pt-1 border-t border-black/5 flex items-center justify-between text-[10px]">
                              {part.targetTests > 0 ? (
                                <span className="font-semibold text-slate-700">
                                  {toPersianDigits(part.targetTests)} تست
                                </span>
                              ) : (
                                <span className="text-slate-400">تشریحی</span>
                              )}

                              <div>{getStatusBadge(part.status)}</div>
                            </div>
                          </div>
                        ) : (
                          /* Empty slot - Click to add */
                          <button
                            type="button"
                            onClick={() => onOpenPartModal(day.dayName, part)}
                            className="h-full w-full rounded-xl border border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 p-2 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 transition-all text-center group/empty"
                          >
                            <Plus className="w-4 h-4 mb-1 group-hover/empty:scale-110 transition-transform" />
                            <span className="text-[11px] font-medium">+ افزودن پارت</span>
                            <span className="text-[10px] text-slate-400">۱.۵ ساعت</span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Legend */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-slate-700">راهنمای رنگ دروس:</span>
          {Object.values(SUBJECT_CONFIGS).map((item) => (
            <div key={item.key} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.accentColor }}
              />
              <span className="text-[11px]">{item.title}</span>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          هر پارت استاندارد = ۱.۵ ساعت (۹۰ دقیقه) · کل ظرفیت هفته = ۸۴ ساعت
        </div>
      </div>
    </div>
  );
};
