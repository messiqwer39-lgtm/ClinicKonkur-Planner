import React, { useState } from 'react';
import { TEST_SOURCES_DATA, SubjectTestSources } from '../data/testSources';
import { BookMarked, Sparkles, CheckCircle2, Award, Search, BookOpen, Layers } from 'lucide-react';

export const TestSourcesPage: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSources = TEST_SOURCES_DATA.filter((s) => {
    const matchesSub = selectedSubject === 'all' || s.subjectKey === selectedSubject;
    const matchesSearch =
      s.subjectTitle.includes(searchQuery) ||
      s.books.some(
        (b) =>
          b.title.includes(searchQuery) ||
          b.publisher.includes(searchQuery) ||
          b.features.some((f) => f.includes(searchQuery))
      );
    return matchesSub && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 border border-purple-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-2">
            <BookMarked className="w-4 h-4 text-purple-400" />
            <span>راهنمای جامع منابع تستی کنکور - دپارتمان تخصصی کلینیک کنکور</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
            بانک معرفی و سطح‌بندی بهترین کتاب‌های تست کنکور سراسری
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            بررسی نقاط قوت، سطح دشواری و ترتیب بهینه مطالعه کتاب‌های خیلی سبز، گاج (میکرو و آی‌کیو)، مبتکران، نشر الگو و مهروماه
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 rounded-xl shrink-0">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSubject === 'all'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            همه دروس
          </button>
          {TEST_SOURCES_DATA.map((sub) => (
            <button
              key={sub.subjectKey}
              onClick={() => setSelectedSubject(sub.subjectKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSubject === sub.subjectKey
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sub.subjectTitle}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی کتاب یا انتشارات..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Content Groups */}
      <div className="space-y-8">
        {filteredSources.map((group) => (
          <div key={group.subjectKey} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-purple-600" />
                <h2 className="text-base font-bold text-slate-900">{group.subjectTitle}</h2>
              </div>
              <span className="text-xs text-slate-500 italic bg-slate-100 px-3 py-1 rounded-lg">
                💡 {group.advice}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.books.map((book, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        {book.level}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {book.publisher}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                      {book.title}
                    </h3>

                    <p className="text-[11px] text-slate-500 mb-3 bg-slate-50 p-2 rounded-lg">
                      🎯 <strong className="text-slate-700">مخاطب هدف:</strong> {book.targetAudience}
                    </p>

                    {/* Features */}
                    <div className="space-y-1.5 mb-3 text-xs">
                      <span className="text-[11px] font-bold text-slate-700 block">ویژگی‌های بارز:</span>
                      {book.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation footer */}
                  <div className="pt-3 border-t border-slate-100 text-[11px] text-purple-900 bg-purple-50/50 p-2.5 rounded-xl">
                    <span className="font-bold block mb-0.5">📌 توصیه مشاور کلینیک:</span>
                    <span className="leading-relaxed">{book.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
