import React, { useState } from 'react';
import { MAJOR_CAREERS, MajorBranch, CareerItem } from '../data/majorCareers';
import {
  GraduationCap,
  Briefcase,
  TrendingUp,
  Award,
  DollarSign,
  Clock,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const MajorsPage: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<MajorBranch>('experimental');

  const branches: { id: MajorBranch; name: string; icon: string; count: string }[] = [
    { id: 'experimental', name: 'رشته علوم تجربی', icon: '🌿', count: '۴ شغل برتر' },
    { id: 'mathematics', name: 'رشته ریاضی و فنی', icon: '📐', count: '۴ شغل برتر' },
    { id: 'humanities', name: 'رشته علوم انسانی', icon: '⚖️', count: '۴ شغل برتر' },
  ];

  const currentCareers = MAJOR_CAREERS.filter((c) => c.branch === selectedBranch);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 border border-blue-500/30 text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>راهنمای جامع انتخاب رشته و آینده شغلی کلینیک کنکور</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
            معرفی کامل ۱۲ شغل و رشته برتر کنکور سراسری
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            بررسی تخصصی بازار کار، حدود رتبه قبولی مناطق، طول دوره تحصیلی، مهارت‌های مورد نیاز و پتانسیل درآمدی به تفکیک ۳ شاخه تجربی، ریاضی و انسانی
          </p>
        </div>
      </div>

      {/* Branch Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {branches.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelectedBranch(b.id)}
            className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between ${
              selectedBranch === b.id
                ? 'bg-white border-indigo-400 ring-2 ring-indigo-500/20 shadow-sm'
                : 'bg-white/80 border-slate-200/90 text-slate-700 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{b.icon}</span>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{b.name}</h3>
                <span className="text-xs text-slate-500">{b.count}</span>
              </div>
            </div>
            {selectedBranch === b.id && (
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            )}
          </button>
        ))}
      </div>

      {/* Careers Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {currentCareers.map((career) => (
          <div
            key={career.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-0.5">
                    {career.name}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 block">
                    {career.englishName}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  بازار کار: {career.marketDemand}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {career.overview}
              </p>

              {/* Key Specs Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">طول دوره:</span>
                    <span className="font-bold text-slate-800 text-[11px]">{career.duration}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">حدود رتبه قبولی:</span>
                    <span className="font-bold text-slate-800 text-[11px]">{career.rankScope}</span>
                  </div>
                </div>
              </div>

              {/* Income Potential Box */}
              <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 mb-4 text-xs text-amber-950 flex items-start gap-2">
                <DollarSign className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold block mb-0.5">پتانسیل درآمدی و رشد مالی:</span>
                  <span>{career.incomePotential}</span>
                </div>
              </div>

              {/* Duties & Skills */}
              <div className="space-y-3 text-xs mb-4">
                <div>
                  <span className="font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                    <span>مهم‌ترین وظایف و حوزه‌های کاری:</span>
                  </span>
                  <div className="space-y-1">
                    {career.keyResponsibilities.map((resp, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 mt-0.5 shrink-0" />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>مهارت‌های کلیدی برای موفقیت:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {career.requiredSkills.map((sk, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Career Opportunities Footer */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">مراکز جذب و اشتغال: </span>
              <span>{career.careerProspects.join(' · ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
