import React from 'react';
import {
  WeeklyHeaderInfo,
  DaySchedule,
  SubjectOverviewItem,
  DailyReportRow,
  DAYS_INFO,
  SUBJECT_CONFIGS,
} from '../types/planner';
import { TRACK_SUBJECTS, COMMON_SUBJECTS, Track, TrackSubject } from '../data/trackSubjects';
import { toPersianDigits } from '../utils/helpers';
import { KONKUR_TARGET } from './KonkurCountdown';

interface PrintablePlanProps {
  headerInfo: WeeklyHeaderInfo;
  schedule: DaySchedule[];
  partTimes: string[];
  overviewList: SubjectOverviewItem[];
  reports: DailyReportRow[];
}

/** مربع چک‌باکس چاپی */
const PrintCheckbox: React.FC = () => (
  <span className="inline-block w-[9px] h-[9px] border-[1.2px] border-slate-500 rounded-[1px] shrink-0 align-middle" />
);

const SectionTitle: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => (
  <div className="flex items-baseline justify-between border-b-2 border-slate-700 pb-1 mb-2 print-avoid">
    <h2 className="text-[13px] font-black text-slate-900">{children}</h2>
    {sub && <span className="text-[8px] text-slate-500 font-semibold">{sub}</span>}
  </div>
);

/** فهرست چک‌لیست مباحث یک درس (چیدمان ستونی برای صرفه‌جویی در کاغذ) */
const SubjectChecklist: React.FC<{ subject: TrackSubject }> = ({ subject }) => (
  <div className="print-avoid mb-2.5">
    <div className="text-[10.5px] font-black text-white bg-slate-700 px-2 py-0.5 rounded-sm inline-block mb-1">
      {subject.name}
    </div>
    {subject.groups.map((g) => (
      <div key={g.grade} className="mb-1 flex gap-2">
        <span className="text-[8px] font-bold text-slate-600 bg-slate-100 border border-slate-300 rounded-sm px-1.5 h-fit whitespace-nowrap min-w-[64px] text-center">
          {g.grade}
        </span>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 flex-1">
          {g.items.map((item) => (
            <div key={item} className="flex items-center gap-1.5 text-[8.5px] text-slate-800 leading-snug">
              <PrintCheckbox />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const TrackSection: React.FC<{ track: Track }> = ({ track }) => (
  <div className="print-break">
    <SectionTitle sub={track.subtitle}>{`فهرست کامل مباحث کنکور — ${track.title}`}</SectionTitle>
    {track.subjects.map((s) => (
      <SubjectChecklist key={s.name} subject={s} />
    ))}
  </div>
);

/**
 * نسخه چاپی کامل برنامه (فقط در خروجی چاپ نمایش داده می‌شود):
 * سربرگ + جدول برنامه هفتگی + نگاه کلی دروس + گزارش کار + مباحث کامل ۳ شاخه
 */
export const PrintablePlan: React.FC<PrintablePlanProps> = ({
  headerInfo,
  schedule,
  partTimes,
  overviewList,
  reports,
}) => {
  const daysToKonkur = Math.max(0, Math.ceil((KONKUR_TARGET - Date.now()) / 86400000));

  // آمار کل برنامه
  let totalParts = 0;
  let completedParts = 0;
  let totalTests = 0;
  schedule.forEach((d) =>
    d.parts.forEach((p) => {
      totalParts++;
      if (p.status === 'completed') completedParts++;
      totalTests += p.targetTests || 0;
    })
  );

  const getSubjectShort = (key: string) => (key ? SUBJECT_CONFIGS[key as keyof typeof SUBJECT_CONFIGS]?.shortTitle ?? '' : '');

  return (
    <div className="printable-area" dir="rtl">
      {/* ═══ صفحه ۱: سربرگ + جدول برنامه هفتگی ═══ */}
      <div className="text-center mb-2 print-avoid">
        <h1 className="text-[16px] font-black text-slate-900">پلنر کلینیک کنکور — برنامه‌ریزی تخصصی هفتگی</h1>
        <p className="text-[9px] text-slate-600 font-semibold mt-0.5">
          {headerInfo.weekNumber} · از {toPersianDigits(headerInfo.startDate)} تا {toPersianDigits(headerInfo.endDate)}
        </p>
        <p className="text-[9px] text-slate-700 mt-1 italic">«{headerInfo.motivationalQuote}»</p>
        <div className="flex items-center justify-center gap-4 mt-1.5 text-[8.5px] font-bold">
          <span className="bg-amber-100 border border-amber-300 px-2 py-0.5 rounded text-amber-900">
            کنکور ۱۰ تیر ۱۴۰۶ — {toPersianDigits(daysToKonkur)} روز باقی‌مانده
          </span>
          <span className="text-slate-600">
            پارت‌های اجرا شده: {toPersianDigits(completedParts)} از {toPersianDigits(totalParts)}
          </span>
          <span className="text-slate-600">هدف تست هفتگی: {toPersianDigits(totalTests)} تست</span>
        </div>
        <div className="flex items-center justify-center gap-3 mt-1 text-[8px] text-slate-500">
          <span>کانال تلگرام: CliniC_Konkur2026@</span>
          <span>رزرو مشاوره: Poshtibani_CliniCk_konkur2026@</span>
        </div>
      </div>

      {/* جدول برنامه هفتگی: سطرها = پارت‌ها، ستون‌ها = روزها */}
      <SectionTitle sub="۸ پارت ۹۰ دقیقه‌ای در روز · شنبه تا جمعه">جدول برنامه‌ریزی هفتگی</SectionTitle>
      <table className="w-full border-collapse text-[7.5px] print-avoid">
        <thead>
          <tr>
            <th className="border border-slate-400 bg-slate-200 px-1 py-0.5 w-[54px]">پارت / ساعت</th>
            {DAYS_INFO.map((d) => (
              <th key={d.id} className="border border-slate-400 bg-slate-200 px-1 py-0.5">
                {d.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }, (_, partIdx) => (
            <tr key={partIdx}>
              <td className="border border-slate-400 bg-slate-50 px-1 py-0.5 text-center font-bold text-slate-700">
                <div>پارت {toPersianDigits(partIdx + 1)}</div>
                <div className="text-[6.5px] text-slate-500">{partTimes[partIdx] ?? ''}</div>
              </td>
              {DAYS_INFO.map((day) => {
                const slot = schedule.find((s) => s.dayId === day.id)?.parts[partIdx];
                return (
                  <td key={day.id} className="border border-slate-400 px-1 py-0.5 align-top leading-tight">
                    {slot?.subject ? (
                      <>
                        <div className="font-black text-slate-800">
                          {getSubjectShort(slot.subject)} · {slot.topic || '—'}
                        </div>
                        <div className="text-[6.5px] text-slate-500">
                          تست: {toPersianDigits(slot.completedTests || 0)}/{toPersianDigits(slot.targetTests || 0)}
                          {slot.status === 'completed' ? ' · انجام شد ✓' : ''}
                        </div>
                      </>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ═══ نگاه کلی دروس ═══ */}
      <div className="mt-3">
        <SectionTitle sub="بودجه‌بندی هفتگی، فصل‌های هدف، منابع و نکات">نگاه کلی دروس اختصاصی و عمومی</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          {overviewList.map((o) => (
            <div key={o.key} className="border border-slate-300 rounded p-1.5 print-avoid">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[9.5px] font-black text-slate-800">{o.title}</span>
                <span className="text-[7px] font-bold text-slate-600">
                  {toPersianDigits(o.weeklyTargetHours)} ساعت · {toPersianDigits(o.weeklyTargetTests)} تست در هفته
                </span>
              </div>
              <p className="text-[7.5px] text-slate-700 leading-snug">
                <b>فصل‌ها:</b> {o.focusChapters.join(' · ') || '—'}
              </p>
              <p className="text-[7.5px] text-slate-700 leading-snug">
                <b>منابع:</b> {o.sources.join(' · ') || '—'}
              </p>
              <p className="text-[7.5px] text-slate-700 leading-snug">
                <b>نکات:</b> {o.notes || '—'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ گزارش کار هفتگی ═══ */}
      <div className="mt-3">
        <SectionTitle sub="ساعات مطالعه، تست‌ها، درصد با کسر نمره منفی، خواب و کیفیت">دفترچه گزارش کار هفتگی</SectionTitle>
        <table className="w-full border-collapse text-[7px] print-avoid">
          <thead>
            <tr className="bg-slate-200">
              <th className="border border-slate-400 px-1 py-0.5">روز</th>
              <th className="border border-slate-400 px-1 py-0.5">تاریخ</th>
              <th className="border border-slate-400 px-1 py-0.5">تشریحی</th>
              <th className="border border-slate-400 px-1 py-0.5">تستی</th>
              <th className="border border-slate-400 px-1 py-0.5">کل ساعت</th>
              <th className="border border-slate-400 px-1 py-0.5">درست</th>
              <th className="border border-slate-400 px-1 py-0.5">غلط</th>
              <th className="border border-slate-400 px-1 py-0.5">نزده</th>
              <th className="border border-slate-400 px-1 py-0.5">کل تست</th>
              <th className="border border-slate-400 px-1 py-0.5">درصد</th>
              <th className="border border-slate-400 px-1 py-0.5">خواب</th>
              <th className="border border-slate-400 px-1 py-0.5">کیفیت</th>
              <th className="border border-slate-400 px-1 py-0.5">نکات روز</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.dayId}>
                <td className="border border-slate-400 px-1 py-0.5 font-bold">{r.dayName}</td>
                <td className="border border-slate-400 px-1 py-0.5 text-center">{toPersianDigits(r.dateStr || '—')}</td>
                <td className="border border-slate-400 px-1 py-0.5 text-center">{toPersianDigits(r.descriptiveHours)}</td>
                <td className="border border-slate-400 px-1 py-0.5 text-center">{toPersianDigits(r.testingHours)}</td>
                <td className="border border-slate-400 px-1 py-0.5 text-center font-bold">{toPersianDigits(r.totalHours)}</td>
                <td className="border border-slate-400 px-1 py-0.5 text-center">{toPersianDigits(r.testsCorrect)}</td>
                <td className="border border-slate-400 px-1 py-0.5 text-center">{toPersianDigits(r.testsWrong)}</td>
                <td className="border border-slate-400 px-1 py-0.5 text-center">{toPersianDigits(r.testsUnanswered)}</td>
                <td className="border border-slate-400 px-1 py-0.5 text-center">{toPersianDigits(r.totalTests)}</td>
                <td className="border border-slate-400 px-1 py-0.5 text-center font-bold">%{toPersianDigits(r.accuracyPercentage)}</td>
                <td className="border border-slate-400 px-1 py-0.5 text-center">{toPersianDigits(r.sleepHours)}</td>
                <td className="border border-slate-400 px-1 py-0.5 text-center">{toPersianDigits(r.qualityRating)}/۵</td>
                <td className="border border-slate-400 px-1 py-0.5">{r.dailyHighlights || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ═══ صفحات مباحث: تجربی ═══ */}
      <TrackSection track={TRACK_SUBJECTS[0]} />

      {/* ═══ صفحات مباحث: ریاضی ═══ */}
      <TrackSection track={TRACK_SUBJECTS[1]} />

      {/* ═══ صفحات مباحث: انسانی ═══ */}
      <TrackSection track={TRACK_SUBJECTS[2]} />

      {/* ═══ دروس عمومی مشترک ═══ */}
      <div className="print-break">
        <SectionTitle sub="مشترک بین هر سه شاخه تجربی، ریاضی و انسانی">دروس عمومی</SectionTitle>
        {COMMON_SUBJECTS.map((s) => (
          <SubjectChecklist key={s.name} subject={s} />
        ))}
        <div className="mt-3 flex items-center justify-between text-[8px] text-slate-500 border-t border-slate-300 pt-1.5">
          <span>تهیه‌شده با پلنر کلینیک کنکور · مشاوره تخصصی و برنامه‌ریزی کنکور سراسری</span>
          <span>امضای مشاور: ....................</span>
        </div>
      </div>
    </div>
  );
};
