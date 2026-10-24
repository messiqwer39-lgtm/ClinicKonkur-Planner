import React, { useState } from 'react';
import { toPersianDigits } from '../utils/helpers';
import { X, Clock, Check, RotateCcw } from 'lucide-react';
import { DEFAULT_PART_TIMES } from '../types/planner';

interface PartTimeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPartTimes: string[];
  onSave: (newTimes: string[]) => void;
}

export const PartTimeEditModal: React.FC<PartTimeEditModalProps> = ({
  isOpen,
  onClose,
  currentPartTimes,
  onSave,
}) => {
  if (!isOpen) return null;

  const [times, setTimes] = useState<string[]>([...currentPartTimes]);

  const handleChange = (index: number, val: string) => {
    const updated = [...times];
    updated[index] = val;
    setTimes(updated);
  };

  const handleResetToDefault = () => {
    setTimes([...DEFAULT_PART_TIMES]);
  };

  const handleConfirm = () => {
    onSave(times);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                تنظیم ساعت پارت‌های ۸گانه (۱.۵ ساعته)
              </h3>
              <p className="text-[11px] text-slate-500">
                این ساعت‌ها بالای ستون‌های جدول برای تمام روزهای هفته نمایش داده می‌شوند
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inputs */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {times.map((t, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="w-20 text-xs font-bold text-slate-700 shrink-0">
                پارت {toPersianDigits(index + 1)}:
              </span>
              <input
                type="text"
                value={t}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder="مثلاً: ۰۷:۰۰ - ۰۸:۳۰"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>زمان‌بندی پیش‌فرض</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 rounded-lg"
            >
              انصراف
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>ذخیره ساعت‌ها</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
