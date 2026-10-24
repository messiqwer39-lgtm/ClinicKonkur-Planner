import React, { useState } from 'react';
import {
  SubjectOverviewItem,
  SUBJECT_CONFIGS,
  DaySchedule,
  SubjectKey,
} from '../types/planner';
import { toPersianDigits } from '../utils/helpers';
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Target,
  Clock,
  Sparkles,
  Bookmark,
  Layers,
  Edit2,
} from 'lucide-react';

interface SubjectsOverviewSectionProps {
  overviewList: SubjectOverviewItem[];
  onChangeOverview: (newList: SubjectOverviewItem[]) => void;
  schedule: DaySchedule[];
}

export const SubjectsOverviewSection: React.FC<SubjectsOverviewSectionProps> = ({
  overviewList,
  onChangeOverview,
  schedule,
}) => {
  const [editingKey, setEditingKey] = useState<SubjectKey | null>(null);
  const [newTopicInput, setNewTopicInput] = useState<{ [key in SubjectKey]?: string }>({});

  // Calculate allocated parts & hours from the schedule for each subject
  const getSubjectStats = (key: SubjectKey) => {
    let slotsCount = 0;
    let testsCount = 0;
    let completedSlots = 0;

    schedule.forEach((day) => {
      day.parts.forEach((part) => {
        if (part.subject === key) {
          slotsCount++;
          testsCount += part.targetTests || 0;
          if (part.status === 'completed') {
            completedSlots++;
          }
        }
      });
    });

    const hours = slotsCount * 1.5;
    return { slotsCount, hours, testsCount, completedSlots };
  };

  const handleAddTopic = (key: SubjectKey) => {
    const topicText = (newTopicInput[key] || '').trim();
    if (!topicText) return;

    const updated = overviewList.map((item) => {
      if (item.key === key) {
        return {
          ...item,
          focusChapters: [...item.focusChapters, topicText],
        };
      }
      return item;
    });

    onChangeOverview(updated);
    setNewTopicInput((prev) => ({ ...prev, [key]: '' }));
  };

  const handleRemoveTopic = (key: SubjectKey, index: number) => {
    const updated = overviewList.map((item) => {
      if (item.key === key) {
        const nextChapters = [...item.focusChapters];
        nextChapters.splice(index, 1);
        return { ...item, focusChapters: nextChapters };
      }
      return item;
    });
    onChangeOverview(updated);
  };

  const handleUpdateItem = (key: SubjectKey, patch: Partial<SubjectOverviewItem>) => {
    const updated = overviewList.map((item) => {
      if (item.key === key) {
        return { ...item, ...patch };
      }
      return item;
    });
    onChangeOverview(updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-xs mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              بخش نگاه کلی: اهداف و برنامه‌های تفکیکی دروس
            </h2>
            <p className="text-xs text-slate-500">
              باکس‌های اختصاصی زیست، فیزیک، شیمی، ریاضی و دروس عمومی برای بودجه‌بندی هفتگی
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>همگام با پارت‌های جدول هفتگی (هر پارت = ۱.۵ ساعت)</span>
        </div>
      </div>

      {/* 5 Subject Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {overviewList.map((item) => {
          const cfg = SUBJECT_CONFIGS[item.key] || SUBJECT_CONFIGS.general;
          const stats = getSubjectStats(item.key);
          const isEditing = editingKey === item.key;

          return (
            <div
              key={item.key}
              className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 p-4 relative"
            >
              {/* Header of box */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-md shrink-0 shadow-2xs"
                      style={{ backgroundColor: cfg.accentColor }}
                    />
                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                  </div>

                  <button
                    onClick={() => setEditingKey(isEditing ? null : item.key)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/60 transition-colors"
                    title="ویرایش اهداف و منابع"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Allocated Stats Bar */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-[11px] bg-white rounded-lg p-2 border border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>
                      ساعت جدول:{' '}
                      <strong className="text-slate-800">{toPersianDigits(stats.hours)} س</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Target className="w-3 h-3 text-slate-400" />
                    <span>
                      تست هدف:{' '}
                      <strong className="text-slate-800">{toPersianDigits(item.weeklyTargetTests)}</strong>
                    </span>
                  </div>
                </div>

                {/* Edit Form if active */}
                {isEditing ? (
                  <div className="space-y-2 mb-3 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-0.5">ساعت هدف هفته:</label>
                      <input
                        type="number"
                        step="0.5"
                        value={item.weeklyTargetHours}
                        onChange={(e) =>
                          handleUpdateItem(item.key, { weeklyTargetHours: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-0.5">تعداد تست هدف:</label>
                      <input
                        type="number"
                        value={item.weeklyTargetTests}
                        onChange={(e) =>
                          handleUpdateItem(item.key, { weeklyTargetTests: parseInt(e.target.value, 10) || 0 })
                        }
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-0.5">منابع مورد مطالعه:</label>
                      <input
                        type="text"
                        value={item.sources.join('، ')}
                        onChange={(e) =>
                          handleUpdateItem(item.key, {
                            sources: e.target.value.split('،').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                        placeholder="با کاما جدا کنید"
                      />
                    </div>
                    <button
                      onClick={() => setEditingKey(null)}
                      className="w-full mt-1 bg-indigo-600 text-white text-xs py-1 rounded hover:bg-indigo-700 font-medium"
                    >
                      ثبت تغییرات
                    </button>
                  </div>
                ) : null}

                {/* Focus Chapters List */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span className="flex items-center gap-1">
                      <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
                      <span>مباحث و فصول این هفته:</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {toPersianDigits(item.focusChapters.length)} مبحث
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-xs">
                    {item.focusChapters.map((chap, idx) => (
                      <li
                        key={idx}
                        className="group flex items-start justify-between gap-1.5 bg-white p-2 rounded-lg border border-slate-200/70 text-slate-700 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-start gap-1.5 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0 group-hover:text-emerald-500 transition-colors" />
                          <span className="text-slate-800 text-[11px]">{chap}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveTopic(item.key, idx)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-0.5 transition-opacity"
                          title="حذف این مبحث"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Add new topic input */}
                  <div className="mt-2 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newTopicInput[item.key] || ''}
                      onChange={(e) =>
                        setNewTopicInput((prev) => ({ ...prev, [item.key]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTopic(item.key);
                        }
                      }}
                      placeholder="+ افزودن مبحث..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleAddTopic(item.key)}
                      disabled={!(newTopicInput[item.key] || '').trim()}
                      className="p-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-slate-100 disabled:hover:text-slate-600 shrink-0"
                      title="افزودن"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sources & Notes */}
                {item.sources.length > 0 && (
                  <div className="mb-2 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-600 block mb-1">منابع تستی:</span>
                    <div className="flex flex-wrap gap-1">
                      {item.sources.map((src, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom footer: live part count indicator */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>پارت در جدول:</span>
                <span className="font-bold text-slate-700">
                  {toPersianDigits(stats.slotsCount)} پارت ({toPersianDigits(stats.hours)} ساعت)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
