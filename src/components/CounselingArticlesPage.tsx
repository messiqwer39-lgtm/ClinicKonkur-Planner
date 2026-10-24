import React, { useState } from 'react';
import { COUNSELING_ARTICLES, CounselingArticle } from '../data/counselingArticles';
import { BookOpen, Search, Sparkles, CheckCircle2, Clock, Send, Bookmark, ChevronDown, ChevronUp } from 'lucide-react';

export const CounselingArticlesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(COUNSELING_ARTICLES[0].id);

  const categories = ['همه', 'روش مطالعه', 'مدیریت زمان', 'تحلیل آزمون', 'مشاوره و روانشناسی', 'سلامت و تغذیه'];

  const filteredArticles = COUNSELING_ARTICLES.filter((article) => {
    const matchesCategory = selectedCategory === 'همه' || article.category === selectedCategory;
    const matchesSearch =
      article.title.includes(searchQuery) ||
      article.summary.includes(searchQuery) ||
      article.keyTips.some((tip) => tip.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 border border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>کلینیک مشاوره تخصصی کنکور</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
            بانک مقالات و تکنیک‌های طلایی موفقیت در کنکور
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            مجموعه ۱۰ راهکار علمی و کاربردی برای افزایش بازدهی مطالعه، مدیریت زمان پارت‌ها، کنترل استرس آزمون و ارتقای تراز
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 rounded-xl shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
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
            placeholder="جستجو در مقالات و نکات..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="space-y-4">
        {filteredArticles.map((article) => {
          const isExpanded = expandedArticleId === article.id;

          return (
            <div
              key={article.id}
              className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs overflow-hidden ${
                isExpanded ? 'border-indigo-300 ring-2 ring-indigo-500/10' : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div
                onClick={() => setExpandedArticleId(isExpanded ? null : article.id)}
                className="p-5 cursor-pointer flex items-center justify-between gap-4 select-none"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime} مطالعه</span>
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {article.summary}
                  </p>
                </div>

                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs leading-relaxed text-slate-700">
                  <div className="space-y-2.5">
                    {article.content.map((p, idx) => (
                      <p key={idx} className="text-slate-800">
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Key Takeaways Box */}
                  <div className="bg-gradient-to-r from-indigo-50/70 to-cyan-50/50 rounded-xl p-4 border border-indigo-100/80">
                    <h4 className="font-bold text-indigo-900 text-xs mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>نکات کلیدی برای اجرای فوری در برنامه مطالعه:</span>
                    </h4>
                    <div className="space-y-1.5">
                      {article.keyTips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredArticles.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">مقاله‌ای با این مشخصات یافت نشد</p>
            <p className="text-xs text-slate-400 mt-1">کلمه جستجو را تغییر دهید یا فیلتر دسته‌بندی را روی «همه» بگذارید.</p>
          </div>
        )}
      </div>

      {/* Counselor Support CTA Footer */}
      <div className="bg-gradient-to-r from-cyan-900 to-slate-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-cyan-300 mb-1">
            نیاز به برنامه اختصاصی و مشاوره فردی داری؟
          </h3>
          <p className="text-xs text-slate-300">
            مشاوران رتبه برتر کلینیک کنکور آماده همراهی و پاسخگویی به ابهامات درسی شما هستند.
          </p>
        </div>
        <a
          href="https://t.me/Poshtibani_CliniCk_konkur2026"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>رزرو وقت مشاوره (@Poshtibani_CliniCk_konkur2026)</span>
        </a>
      </div>
    </div>
  );
};
