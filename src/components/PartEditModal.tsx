import React, { useState } from 'react';
import {
  PartSlot,
  SubjectKey,
  SUBJECT_CONFIGS,
  PartStatus,
  MajorType,
} from '../types/planner';
import { ALL_MAJOR_SUBJECTS, MAJOR_NAMES } from '../data/majorSubjects';
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
  Sparkles,
  Filter,
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
  const [selectedMajorFilter, setSelectedMajorFilter] = useState<MajorType>('all');

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

  // Filter subjects based on major filter
  const filteredSubjectKeys = (Object.keys(SUBJECT_CONFIGS) as SubjectKey[]).filter((k) => {
    if (selectedMajorFilter === 'all') return true;
    const cfg = SUBJECT_CONFIGS[k];
    return cfg.major === selectedMajorFilter || cfg.major === 'all';
  });

  // Find rich topics from ALL_MAJOR_SUBJECTS if available
  const richSubjectDetail = ALL_MAJOR_SUBJECTS.find((s) => s.id === subject);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-800">
                پارت {toPersianDigits(slot.partNumber)} ({dayName})
              </span>
              <span className="text-xs text-slate-500 font-medium">۱.۵ ساعت مطالعه</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-1">
              تنظیم و ثبت جزئیات مطالعه پارت
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Time range */}
          <div>
            <label className="text-slate-700 font-bold block mb-1">
              ساعت برگزاری پارت (۱.۵ ساعته):
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                placeholder="مثلاً: ۰۷:۰۰ - ۰۸:۳۰"
              />
            </div>
          </div>

          {/* Major Filter Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-700 font-bold block">فیلتر رشته تحصیلی و دروس:</label>
              <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-medium">
                <Filter className="w-3 h-3" />
                <span>رشته خود را انتخاب کنید</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl">
              {(['all', 'experimental', 'mathematics', 'humanities'] as MajorType[]).map((mKey) => (
                <button
                  key={mKey}
                  type="button"
                  onClick={() => setSelectedMajorFilter(mKey)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all truncate text-center ${
                    selectedMajorFilter === mKey
                      ? 'bg-white text-indigo-900 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {MAJOR_NAMES[mKey].name.split(' ')[0]} {MAJOR_NAMES[mKey].icon}
                </button>
              ))}
            </div>
          </div>

          {/* Subject selector */}
          <div>
            <label className="text-slate-700 font-bold block mb-2">انتخاب درس:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/50">
              {filteredSubjectKeys.map((key) => {
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
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all text-right ${
                      isSelected
                        ? `${conf.badgeBg} ring-2 ring-indigo-500/30 font-bold shadow-xs`
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
          {richSubjectDetail ? (
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-[11px] text-slate-600 font-bold block">
                مباحث پرتکرار کنکوری {richSubjectDetail.title}:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                {[
                  ...richSubjectDetail.grade10Topics,
                  ...richSubjectDetail.grade11Topics,
                  ...richSubjectDetail.grade12Topics,
                ].map((sTopic, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleQuickTopic(sTopic)}
                    className="text-[11px] bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-700 px-2 py-1 rounded-lg transition-colors text-right"
                  >
                    {sTopic}
                  </button>
                ))}
              </div>
            </div>
          ) : currentConfig && currentConfig.sampleTopics.length > 0 ? (
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <span className="text-[11px] text-slate-500 block mb-1.5">
                مباحث پیشنهادی {currentConfig.title}:
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
          ) : null}

          {/* Topic / مبحث مطالعه */}
          <div>
            <label className="text-slate-700 font-bold block mb-1">
              مبحث، فصل یا کار این پارت:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="مثلاً: زیست دهم: گوارش و جذب مواد ص ۱۸ تا ۲۵"
            />
          </div>

          {/* Tests Target & Source Pages */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-bold block mb-1">
                تعداد تست هدف‌گذاری شده:
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={targetTests}
                  onChange={(e) => setTargetTests(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setTargetTests((prev) => Math.max(0, prev + 10))}
                  className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-bold"
                >
                  +۱۰
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">
                صفحات یا منبع مطالعه:
              </label>
              <input
                type="text"
                value={targetPages}
                onChange={(e) => setTargetPages(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="خیلی‌سبز ص ۳۰ تا ۴۵"
              />
            </div>
          </div>

          {/* Execution Status */}
          <div>
            <label className="text-slate-700 font-bold block mb-1.5">
              وضعیت اجرای پارت:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleStatusChange('planned')}
                className={`p-2 rounded-xl border text-center font-bold text-xs transition-colors ${
                  status === 'planned'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                برنامه‌ریزی
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('in_progress')}
                className={`p-2 rounded-xl border text-center font-bold text-xs transition-colors ${
                  status === 'in_progress'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                }`}
              >
                در حال مطالعه
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('completed')}
                className={`p-2 rounded-xl border text-center font-bold text-xs transition-colors ${
                  status === 'completed'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                انجام شد ✓
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('partial')}
                className={`p-2 rounded-xl border text-center font-bold text-xs transition-colors ${
                  status === 'partial'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                }`}
              >
                ناقص / نیمه‌کاره
              </button>
            </div>
          </div>

          {/* Completed Tests Count if completed or partial */}
          {(status === 'completed' || status === 'partial') && (
            <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/80">
              <label className="text-emerald-900 font-bold block mb-1">
                تعداد تست‌های حل‌شده واقعی:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={completedTests}
                  onChange={(e) => setCompletedTests(Number(e.target.value))}
                  className="w-32 bg-white border border-emerald-300 rounded-xl px-2.5 py-1.5 text-xs text-emerald-950 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <span className="text-emerald-700 text-xs">تست حل شد (از {targetTests} تست هدف)</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-slate-700 font-bold block mb-1">
              یادداشت مشاور یا داوطلب برای این پارت:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="نکات، دام‌های تستی یا یادآوری مرور..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          {onStartTimer && (
            <button
              type="button"
              onClick={() => {
                onStartTimer({
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
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-indigo-600" />
              <span>شروع پومودورو</span>
            </button>
          )}

          <div className="flex items-center gap-2 mr-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-medium rounded-xl hover:bg-slate-200/50"
            >
              انصراف
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-md transition-all hover:scale-105"
            >
              ذخیره تغییرات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
