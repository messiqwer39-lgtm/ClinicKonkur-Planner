import React, { useState } from 'react';
import { CURRICULUM_DATA, MajorCurriculum } from '../data/curriculumData';
import { toPersianDigits } from '../utils/helpers';
import {
  BookOpen,
  X,
  Search,
  CheckCircle2,
  Award,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
} from 'lucide-react';

interface CurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic?: (subjectName: string, topicName: string) => void;
}

export const CurriculumModal: React.FC<CurriculumModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
}) => {
  const [selectedMajor, setSelectedMajor] = useState<'experimental' | 'math' | 'humanities'>('experimental');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSubjectIndex, setExpandedSubjectIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  const currentCurriculum = CURRICULUM_DATA[selectedMajor];

  const filteredSubjects = currentCurriculum.subjects.map((sub) => {
    if (!searchQuery.trim()) return sub;
    const query = searchQuery.trim().toLowerCase();
    const matchesSubject = sub.name.toLowerCase().includes(query) || sub.grade.toLowerCase().includes(query);
    const matchedChapters = sub.chapters.filter((ch) =>
      ch.chapterTitle.toLowerCase().includes(query) ||
      ch.topics.some((t) => t.toLowerCase().includes(query))
    );
    if (matchesSubject || matchedChapters.length > 0) {
      return {
        ...sub,
        chapters: matchedChapters.length > 0 ? matchedChapters : sub.chapters,
      };
    }
    return null;
  }).filter(Boolean) as typeof currentCurriculum.subjects;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div
        className="bg-slate-900 border border-slate-750 text-slate-100 rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col my-auto max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20 font-black">
              <BookOpen className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                بانک جامع سرفصل‌ها و بودجه‌بندی کنکور
              </h2>
              <p className="text-xs text-slate-400">
                تفکیک کامل مباحث و تعداد تست‌های رشته‌های علوم تجربی، ریاضی و علوم انسانی
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Major Selector & Search */}
        <div className="p-4 bg-slate-850 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Major Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-750 w-full sm:w-auto">
            <button
              onClick={() => { setSelectedMajor('experimental'); setExpandedSubjectIndex(0); }}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedMajor === 'experimental'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              علوم تجربی
            </button>
            <button
              onClick={() => { setSelectedMajor('math'); setExpandedSubjectIndex(0); }}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedMajor === 'math'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ریاضی و فیزیک
            </button>
            <button
              onClick={() => { setSelectedMajor('humanities'); setExpandedSubjectIndex(0); }}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedMajor === 'humanities'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              علوم انسانی
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی درس، فصل یا مبحث..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Subjects & Chapters List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {filteredSubjects.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              مبحثی با این عنوان یافت نشد. لطفاً عبارت دیگری را جستجو کنید.
            </div>
          ) : (
            filteredSubjects.map((sub, sIdx) => {
              const isExpanded = expandedSubjectIndex === sIdx || Boolean(searchQuery.trim());
              return (
                <div
                  key={sIdx}
                  className="border border-slate-800 rounded-2xl bg-slate-850/60 overflow-hidden shadow-sm"
                >
                  {/* Subject Header */}
                  <div
                    onClick={() => setExpandedSubjectIndex(isExpanded ? null : sIdx)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-xs">
                        {toPersianDigits(sIdx + 1)}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white">{sub.name}</h3>
                        <span className="text-[11px] text-slate-400">{sub.grade} · {toPersianDigits(sub.chapters.length)} فصل</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Chapters Details */}
                  {isExpanded && (
                    <div className="p-4 pt-0 space-y-3 border-t border-slate-800/80 mt-2">
                      {sub.chapters.map((ch, chIdx) => (
                        <div
                          key={chIdx}
                          className="p-3 rounded-xl bg-slate-900/90 border border-slate-750/70 hover:border-slate-650 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-cyan-300">
                                فصل {toPersianDigits(ch.chapterNumber)}: {ch.chapterTitle}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  ch.importance === 'خیلی مهم'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : ch.importance === 'مهم'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {ch.importance}
                              </span>
                              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                                {toPersianDigits(ch.testedQuestionsApprox)}
                              </span>
                            </div>
                          </div>

                          {/* Topic Pills */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {ch.topics.map((top, tIdx) => (
                              <button
                                key={tIdx}
                                onClick={() => {
                                  if (onSelectTopic) {
                                    onSelectTopic(sub.name, top);
                                    onClose();
                                  }
                                }}
                                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all text-right ${
                                  onSelectTopic
                                    ? 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 border-slate-700 text-slate-300 cursor-pointer active:scale-95'
                                    : 'bg-slate-800/60 border-slate-750 text-slate-300'
                                }`}
                              >
                                {top}
                                {onSelectTopic && <span className="mr-1 text-[9px] opacity-75">+ انتخاب</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
