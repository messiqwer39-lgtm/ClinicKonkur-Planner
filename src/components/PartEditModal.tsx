import React, { useState } from 'react';
import {
  PartSlot,
  SubjectKey,
  SUBJECT_CONFIGS,
  PartStatus,
} from '../types/planner';
import { toPersianDigits, playChime } from '../utils/helpers';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  Clock,
  BookOpen,
  Target,
  FileText,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';

interface PartEditModalProps {
  dayName: string;
  slot: PartSlot;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSlot: PartSlot) => void;
  onStartTimer?: (slot: PartSlot) => void;
}

export const PartEditModal: React.FC<PartEditModalProps> = ({
  dayName,
  slot,
  isOpen,
  onClose,
  onSave,
  onStartTimer,
}) => {
  if (!isOpen) return null;

  const [subject, setSubject] = useState<SubjectKey | ''>(slot.subject);
  const [topic, setTopic] = useState(slot.topic);
  const [targetTests, setTargetTests] = useState(slot.targetTests || 0);
  const [completedTests, setCompletedTests] = useState(slot.completedTests || 0);
  const [targetPages, setTargetPages] = useState(slot.targetPages || '');
  const [timeRange, setTimeRange] = useState(slot.timeRange);
  const [status, setStatus] = useState<PartStatus>(slot.status);
  const [notes, setNotes] = useState(slot.notes || '');

  const handleStatusChange = (newStatus: PartStatus) => {
    setStatus(newStatus);
    if (newStatus === 'completed') {
      setCompletedTests(targetTests);
      playChime('success');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handleSave = () => {
    onSave({
      ...slot,
      subject,
      topic,
      targetTests: Number(targetTests) || 0,
      completedTests: Number(completedTests) || 0,
      targetPages,
      timeRange,
      status,
      notes,
    });
    onClose();
  };

  const handleQuickTopic = (suggested: string) => {
    setTopic(suggested);
  };

  const currentConfig = subject ? SUBJECT_CONFIGS[subject] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                پارت {toPersianDigits(slot.partNumber)} ({dayName})
              </span>
              <span className="text-xs text-slate-500 font-medium">۱.۵ ساعت</span>
            </div>
            <h3 className="text-sm font-bold text-slate-800 mt-1">
              تنظیم و ثبت جزئیات مطالعه
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Time range for this part */}
          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              ساعت برگزاری پارت (۱.۵ ساعته):
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="مثلاً: ۰۷:۰۰ - ۰۸:۳۰"
              />
            </div>
          </div>

          {/* Subject selector */}
          <div>
            <label className="text-slate-600 font-semibold block mb-2">انتخاب درس:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(SUBJECT_CONFIGS) as SubjectKey[]).map((key) => {
                const conf = SUBJECT_CONFIGS[key];
                const isSelected = subject === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSubject(key);
                      if (!topic && conf.sampleTopics.length > 0) {
                        setTopic(conf.sampleTopics[0]);
                      }
                    }}
                    className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? `${conf.badgeBg} ring-2 ring-indigo-500/30 font-bold shadow-2xs`
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: conf.accentColor }}
                    />
                    <span className="truncate">{conf.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Suggested topics if subject selected */}
          {currentConfig && currentConfig.sampleTopics.length > 0 && (
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <span className="text-[11px] text-slate-500 block mb-1.5">
                مباحث پیشنهادی کنکوری {currentConfig.title}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentConfig.sampleTopics.map((sTopic, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleQuickTopic(sTopic)}
                    className="text-[11px] bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-700 px-2 py-0.5 rounded-md transition-colors"
                  >
                    {sTopic}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Topic / مبحث مطالعه */}
          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              مبحث، فصل یا کار این پارت:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="مثلاً: زیست دهم: گوارش و جذب مواد ص ۱۸ تا ۲۵"
            />
          </div>

          {/* Tests Target & Source Pages */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                تعداد تست هدف‌گذاری شده:
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={targetTests}
                  onChange={(e) => setTargetTests(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setTargetTests((prev) => Math.max(0, prev + 10))}
                  className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold"
                >
                  +۱۰
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-600 font-semibold block mb-1">
                صفحات یا منبع مطالعه:
              </label>
              <input
                type="text"
                value={targetPages}
                onChange={(e) => setTargetPages(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="خیلی‌سبز ص ۳۰ تا ۴۵"
              />
            </div>
          </div>

          {/* Execution Status */}
          <div>
            <label className="text-slate-600 font-semibold block mb-2">وضعیت اجرای پارت:</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => handleStatusChange('planned')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  status === 'planned'
                    ? 'bg-slate-100 border-slate-400 font-bold text-slate-800 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                برنامه‌ریزی
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('in_progress')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  status === 'in_progress'
                    ? 'bg-blue-50 border-blue-400 font-bold text-blue-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                در حال خواندن
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('completed')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  status === 'completed'
                    ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                ✅ کامل شد
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('partial')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  status === 'partial'
                    ? 'bg-amber-50 border-amber-400 font-bold text-amber-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                ⚠️ ناقص
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('missed')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  status === 'missed'
                    ? 'bg-rose-50 border-rose-400 font-bold text-rose-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                ❌ خوانده نشد
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-slate-600 font-semibold block mb-1">
              یادداشت یا اشکال‌های این پارت:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
              placeholder="نکته مهم، تست‌های نشان‌دار، یا سوالاتی که باید از معلم بپرسم..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div>
            {onStartTimer && (
              <button
                type="button"
                onClick={() => {
                  onStartTimer({ ...slot, subject, topic, timeRange });
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>شروع تایمر این پارت</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200/50 transition-colors"
            >
              انصراف
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs hover:shadow transition-all"
            >
              ذخیره تغییرات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
