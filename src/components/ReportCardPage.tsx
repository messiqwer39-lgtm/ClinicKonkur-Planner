import React, { useState } from 'react';
import { DailyReportRow, DayOfWeek } from '../types/planner';
import {
  toPersianDigits,
  calculateKonkurPercentage,
  formatStudyHours,
} from '../utils/helpers';
import {
  CheckSquare,
  TrendingUp,
  Clock,
  Target,
  Moon,
  Sparkles,
  Award,
  AlertCircle,
  Edit2,
  Check,
  Star,
  Printer,
  BarChart3,
  Lightbulb,
  Download,
  Plus,
  Trash2,
  Filter,
  Calendar,
  Layers,
} from 'lucide-react';

import { ReportChartsSection } from './ReportChartsSection';

interface ReportCardPageProps {
  reports: DailyReportRow[];
  onUpdateReport: (updated: DailyReportRow[]) => void;
  onPrint: () => void;
}

export const ReportCardPage: React.FC<ReportCardPageProps> = ({
  reports,
  onUpdateReport,
  onPrint,
}) => {
  const [editingDayId, setEditingDayId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<DailyReportRow | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'high_study' | 'high_accuracy'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<Partial<DailyReportRow>>({
    dayName: 'شنبه',
    dateStr: '۰۸/۱۲',
    descriptiveHours: 4.5,
    testingHours: 4.5,
    testsCorrect: 100,
    testsWrong: 15,
    testsUnanswered: 10,
    sleepHours: 7,
    qualityRating: 5,
    dailyHighlights: 'مطالعه هدفمند و پرانرژی',
  });

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (filterType === 'high_study') return r.totalHours >= 9;
    if (filterType === 'high_accuracy') return r.accuracyPercentage >= 75;
    return true;
  });

  // Weekly aggregate calculations
  const totalDescriptive = reports.reduce((acc, r) => acc + (Number(r.descriptiveHours) || 0), 0);
  const totalTesting = reports.reduce((acc, r) => acc + (Number(r.testingHours) || 0), 0);
  const totalStudyHours = totalDescriptive + totalTesting;
  
  const totalCorrect = reports.reduce((acc, r) => acc + (Number(r.testsCorrect) || 0), 0);
  const totalWrong = reports.reduce((acc, r) => acc + (Number(r.testsWrong) || 0), 0);
  const totalUnanswered = reports.reduce((acc, r) => acc + (Number(r.testsUnanswered) || 0), 0);
  const totalTests = totalCorrect + totalWrong + totalUnanswered;

  const averageAccuracy = totalTests > 0 
    ? calculateKonkurPercentage(totalCorrect, totalWrong, totalUnanswered) 
    : 0;

  const totalSleep = reports.reduce((acc, r) => acc + (Number(r.sleepHours) || 0), 0);
  const avgSleep = reports.length > 0 ? (totalSleep / reports.length).toFixed(1) : 0;

  const testingRatio = totalStudyHours > 0 
    ? Math.round((totalTesting / totalStudyHours) * 100) 
    : 0;

  const handleStartEdit = (row: DailyReportRow) => {
    setEditingDayId(row.dayId);
    setEditFormData({ ...row });
  };

  const handleSaveEdit = () => {
    if (!editFormData) return;
    
    const desc = Number(editFormData.descriptiveHours) || 0;
    const test = Number(editFormData.testingHours) || 0;
    const cor = Number(editFormData.testsCorrect) || 0;
    const wrg = Number(editFormData.testsWrong) || 0;
    const unans = Number(editFormData.testsUnanswered) || 0;
    const allTests = cor + wrg + unans;
    const acc = calculateKonkurPercentage(cor, wrg, unans);

    const updatedRow: DailyReportRow = {
      ...editFormData,
      totalHours: desc + test,
      totalTests: allTests,
      accuracyPercentage: acc,
    };

    const nextReports = reports.map((r) =>
      r.dayId === editFormData.dayId ? updatedRow : r
    );

    onUpdateReport(nextReports);
    setEditingDayId(null);
    setEditFormData(null);
  };

  const handleExportCSV = () => {
    const headers = [
      'روز',
      'تاریخ',
      'ساعت تشریحی',
      'ساعت تستی',
      'ساعت کل',
      'تست درست',
      'تست غلط',
      'تست نزده',
      'کل تست',
      'درصد کنکور',
      'ساعت خواب',
      'کیفیت',
      'نکات روزانه'
    ];
    
    const rows = reports.map((r) => [
      r.dayName,
      r.dateStr,
      r.descriptiveHours,
      r.testingHours,
      r.totalHours,
      r.testsCorrect,
      r.testsWrong,
      r.testsUnanswered,
      r.totalTests,
      r.accuracyPercentage,
      r.sleepHours,
      r.qualityRating,
      `"${(r.dailyHighlights || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `گزارش_کار_کلینیک_کنکور_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAddNewRow = () => {
    const desc = Number(newRowData.descriptiveHours) || 0;
    const test = Number(newRowData.testingHours) || 0;
    const cor = Number(newRowData.testsCorrect) || 0;
    const wrg = Number(newRowData.testsWrong) || 0;
    const unans = Number(newRowData.testsUnanswered) || 0;
    const allTests = cor + wrg + unans;
    const acc = calculateKonkurPercentage(cor, wrg, unans);

    const newRow: DailyReportRow = {
      dayId: (`day-${Date.now()}`) as DayOfWeek,
      dayName: newRowData.dayName || 'روز جدید',
      dateStr: newRowData.dateStr || '',
      descriptiveHours: desc,
      testingHours: test,
      totalHours: desc + test,
      testsCorrect: cor,
      testsWrong: wrg,
      testsUnanswered: unans,
      totalTests: allTests,
      accuracyPercentage: acc,
      sleepHours: Number(newRowData.sleepHours) || 7,
      qualityRating: Number(newRowData.qualityRating) || 5,
      dailyHighlights: newRowData.dailyHighlights || '',
      dailyWeaknesses: '',
      notes: '',
    };

    onUpdateReport([...reports, newRow]);
    setIsAddModalOpen(false);
  };

  const handleDeleteRow = (dayId: string) => {
    if (window.confirm('آیا از حذف این سطر گزارش کار اطمینان دارید؟')) {
      onUpdateReport(reports.filter((r) => r.dayId !== dayId));
    }
  };

  const getAdvisorRecommendations = () => {
    const tips = [];
    if (testingRatio < 50) {
      tips.push({
        type: 'warning',
        text: 'سهم تست‌زنی شما زیر ۵۰٪ است. برای موفقیت در کنکور، پیشنهاد می‌شود حداقل ۵۵ الی ۶۵ درصد از زمان مطالعه به حل تست آموزشی و سنجشی اختصاص یابد.',
      });
    } else {
      tips.push({
        type: 'success',
        text: `تعادل تستی عالی: ${toPersianDigits(testingRatio)}٪ از زمان مطالعه شما صرف حل تست شده است که استانداردی بسیار حرفه‌ای برای رتبه‌های برتر است.`,
      });
    }

    if (averageAccuracy >= 75) {
      tips.push({
        type: 'success',
        text: `درصد درستی میانگین (${toPersianDigits(averageAccuracy)}٪) بسیار رضایت‌بخش است. اکنون زمان ورود به تست‌های سرعتی و زمان‌دار سنگین‌تر است.`,
      });
    } else if (averageAccuracy > 0 && averageAccuracy < 60) {
      tips.push({
        type: 'warning',
        text: 'درصد پاسخگویی آزمون‌ها زیر ۶۰٪ است؛ حتماً تست‌های غلط و نزده را در دفتر خودآموز تحلیل کنید تا دام‌های آموزشی تکرار نشوند.',
      });
    }

    if (Number(avgSleep) < 6.5) {
      tips.push({
        type: 'alert',
        text: 'میانگین خواب شبانه کمتر از ۶.۵ ساعت است؛ کم‌خوابی تمرکز و انتقال اطلاعات به حافظه بلندمدت را به شدت تضعیف می‌کند.',
      });
    } else {
      tips.push({
        type: 'info',
        text: 'ساعت خواب منظم و بین ۶.۵ تا ۷.۵ ساعت به بازیابی کامل مغز کمک شایانی کرده است.',
      });
    }

    return tips;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              مدیریت دفترچه گزارش کار و کارنامه عملکرد هفتگی
            </h1>
            <p className="text-xs text-slate-500">
              ثبت پیشرفته ساعات تشریحی/تستی، درصد با کسر نمره منفی، خروجی اکسل و فیلترهای تحلیلی
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت روز جدید</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="دانلود جدول گزارش کار به فرمت اکسل و CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>خروجی اکسل (CSV)</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>چاپ کارنامه</span>
          </button>
        </div>
      </div>

      {/* KPI Performance Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">مجموع مطالعه واقعی:</span>
            <span className="text-lg font-bold text-slate-900">
              {toPersianDigits(totalStudyHours.toFixed(1))} ساعت
            </span>
            <span className="text-[11px] text-slate-500 block">
              {toPersianDigits(totalTesting.toFixed(1))} س تستی · {toPersianDigits(totalDescriptive.toFixed(1))} س تشریحی
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">مجموع تست‌های حل شده:</span>
            <span className="text-lg font-bold text-slate-900">
              {toPersianDigits(totalTests)} تست
            </span>
            <span className="text-[11px] text-emerald-600 font-medium block">
              {toPersianDigits(totalCorrect)} درست · {toPersianDigits(totalWrong)} نادرست
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">درصد دقت میانگین:</span>
            <span className="text-lg font-bold text-amber-900">
              %{toPersianDigits(averageAccuracy)}
            </span>
            <span className="text-[11px] text-slate-500 block">
              فرمول نمره منفی کنکور
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">میانگین خواب شبانه:</span>
            <span className="text-lg font-bold text-slate-900">
              {toPersianDigits(avgSleep)} ساعت
            </span>
            <span className="text-[11px] text-slate-500 block">
              تنظیم ریتم شبانه‌روزی
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Analytics: Weekly Study Hours & Tests Progress */}
      <ReportChartsSection reports={reports} />

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/80 px-4 py-2.5 flex items-center justify-between text-xs no-print">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">فیلتر نمایش روزها:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterType === 'all' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              همه ({toPersianDigits(reports.length)})
            </button>
            <button
              onClick={() => setFilterType('high_study')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterType === 'high_study' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              مطالعه سنگین (بالای ۹ ساعت)
            </button>
            <button
              onClick={() => setFilterType('high_accuracy')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterType === 'high_accuracy' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              دقت تستی بالا (بالای ۷۵٪)
            </button>
          </div>
        </div>

        <span className="text-slate-400 text-[11px]">
          تعداد سطرها: {toPersianDigits(filteredReports.length)} روز
        </span>
      </div>

      {/* Main Daily Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden print-card">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <h2 className="text-sm font-bold text-slate-800">
            جدول عملکرد تفکیکی روزهای مطالعه
          </h2>
          <span className="text-xs text-slate-500">
            برای ویرایش یا تکمیل آمار روزانه، روی دکمه ویرایش همان سطر کلیک کنید
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[950px] text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold">
                <th className="p-3">روز / تاریخ</th>
                <th className="p-3 text-center">مطالعه تشریحی</th>
                <th className="p-3 text-center">مطالعه تستی</th>
                <th className="p-3 text-center">ساعت کل روز</th>
                <th className="p-3 text-center">تست درست</th>
                <th className="p-3 text-center">تست غلط</th>
                <th className="p-3 text-center">نزده</th>
                <th className="p-3 text-center">کل تست</th>
                <th className="p-3 text-center">درصد کنکوری</th>
                <th className="p-3 text-center">ساعت خواب</th>
                <th className="p-3 text-center">کیفیت</th>
                <th className="p-3">نکات و ارزیابی روز</th>
                <th className="p-3 text-center no-print">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70">
              {filteredReports.map((row) => {
                const isEditing = editingDayId === row.dayId;

                if (isEditing && editFormData) {
                  return (
                    <tr key={row.dayId} className="bg-indigo-50/40 font-medium">
                      <td className="p-3 font-bold text-slate-900">
                        {row.dayName}
                        <span className="text-[10px] text-slate-400 block font-normal">
                          {toPersianDigits(row.dateStr)}
                        </span>
                      </td>

                      <td className="p-2 text-center">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={editFormData.descriptiveHours}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              descriptiveHours: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-16 bg-white border border-slate-300 rounded px-1.5 py-1 text-center font-bold"
                        />
                      </td>

                      <td className="p-2 text-center">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={editFormData.testingHours}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              testingHours: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-16 bg-white border border-slate-300 rounded px-1.5 py-1 text-center font-bold"
                        />
                      </td>

                      <td className="p-3 text-center font-bold text-indigo-700 font-mono">
                        {toPersianDigits(
                          (
                            (Number(editFormData.descriptiveHours) || 0) +
                            (Number(editFormData.testingHours) || 0)
                          ).toFixed(1)
                        )}{' '}
                        س
                      </td>

                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          value={editFormData.testsCorrect}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              testsCorrect: parseInt(e.target.value, 10) || 0,
                            })
                          }
                          className="w-14 bg-white border border-slate-300 rounded px-1.5 py-1 text-center font-bold text-emerald-700"
                        />
                      </td>

                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          value={editFormData.testsWrong}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              testsWrong: parseInt(e.target.value, 10) || 0,
                            })
                          }
                          className="w-14 bg-white border border-slate-300 rounded px-1.5 py-1 text-center font-bold text-rose-700"
                        />
                      </td>

                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          value={editFormData.testsUnanswered}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              testsUnanswered: parseInt(e.target.value, 10) || 0,
                            })
                          }
                          className="w-14 bg-white border border-slate-300 rounded px-1.5 py-1 text-center font-bold text-slate-500"
                        />
                      </td>

                      <td className="p-3 text-center font-bold text-slate-800 font-mono">
                        {toPersianDigits(
                          (Number(editFormData.testsCorrect) || 0) +
                            (Number(editFormData.testsWrong) || 0) +
                            (Number(editFormData.testsUnanswered) || 0)
                        )}
                      </td>

                      <td className="p-3 text-center font-bold text-amber-700 font-mono">
                        %{toPersianDigits(
                          calculateKonkurPercentage(
                            Number(editFormData.testsCorrect) || 0,
                            Number(editFormData.testsWrong) || 0,
                            Number(editFormData.testsUnanswered) || 0
                          )
                        )}
                      </td>

                      <td className="p-2 text-center">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="14"
                          value={editFormData.sleepHours}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              sleepHours: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-14 bg-white border border-slate-300 rounded px-1 py-1 text-center"
                        />
                      </td>

                      <td className="p-2 text-center">
                        <select
                          value={editFormData.qualityRating}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              qualityRating: parseInt(e.target.value, 10) || 5,
                            })
                          }
                          className="bg-white border border-slate-300 rounded px-1 py-1 text-xs"
                        >
                          <option value="5">۵ ستاره (عالی)</option>
                          <option value="4">۴ ستاره (خوب)</option>
                          <option value="3">۳ ستاره (متوسط)</option>
                          <option value="2">۲ ستاره (ضعیف)</option>
                          <option value="1">۱ ستاره (بسیار ضعیف)</option>
                        </select>
                      </td>

                      <td className="p-2">
                        <input
                          type="text"
                          value={editFormData.dailyHighlights}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              dailyHighlights: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                          placeholder="نکات مثبت روز یا چالش‌ها..."
                        />
                      </td>

                      <td className="p-2 text-center no-print">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={handleSaveEdit}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
                            title="ذخیره"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingDayId(null)}
                            className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md"
                            title="انصراف"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={row.dayId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-800">
                      {row.dayName}
                      <span className="text-[10px] text-slate-400 block font-normal font-mono">
                        {toPersianDigits(row.dateStr)}
                      </span>
                    </td>

                    <td className="p-3 text-center font-mono tabular-nums text-slate-700">
                      {toPersianDigits(row.descriptiveHours)} س
                    </td>

                    <td className="p-3 text-center font-mono tabular-nums text-indigo-700 font-semibold">
                      {toPersianDigits(row.testingHours)} س
                    </td>

                    <td className="p-3 text-center font-mono tabular-nums font-bold text-slate-900 bg-slate-50/50">
                      {toPersianDigits(row.totalHours)} ساعت
                    </td>

                    <td className="p-3 text-center font-mono tabular-nums font-semibold text-emerald-600">
                      {toPersianDigits(row.testsCorrect)}
                    </td>

                    <td className="p-3 text-center font-mono tabular-nums font-semibold text-rose-600">
                      {toPersianDigits(row.testsWrong)}
                    </td>

                    <td className="p-3 text-center font-mono tabular-nums text-slate-400">
                      {toPersianDigits(row.testsUnanswered)}
                    </td>

                    <td className="p-3 text-center font-mono tabular-nums font-bold text-slate-800">
                      {toPersianDigits(row.totalTests)}
                    </td>

                    <td className="p-3 text-center font-mono tabular-nums font-bold text-amber-800">
                      %{toPersianDigits(row.accuracyPercentage)}
                    </td>

                    <td className="p-3 text-center font-mono tabular-nums text-slate-700">
                      {toPersianDigits(row.sleepHours)} س
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-0.5 text-amber-400">
                        {Array.from({ length: row.qualityRating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </td>

                    <td className="p-3 max-w-[200px]">
                      <span className="text-slate-700 line-clamp-1 text-[11px]">
                        {row.dailyHighlights || row.notes || '—'}
                      </span>
                    </td>

                    <td className="p-3 text-center no-print">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleStartEdit(row)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="ویرایش سطر"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRow(row.dayId)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="حذف این سطر"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Total Footer Row */}
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900">
                <td className="p-3">مجموع هفته:</td>
                <td className="p-3 text-center font-mono">
                  {toPersianDigits(totalDescriptive.toFixed(1))} س
                </td>
                <td className="p-3 text-center font-mono text-indigo-700">
                  {toPersianDigits(totalTesting.toFixed(1))} س
                </td>
                <td className="p-3 text-center font-mono text-slate-900">
                  {toPersianDigits(totalStudyHours.toFixed(1))} ساعت
                </td>
                <td className="p-3 text-center font-mono text-emerald-700">
                  {toPersianDigits(totalCorrect)}
                </td>
                <td className="p-3 text-center font-mono text-rose-700">
                  {toPersianDigits(totalWrong)}
                </td>
                <td className="p-3 text-center font-mono text-slate-500">
                  {toPersianDigits(totalUnanswered)}
                </td>
                <td className="p-3 text-center font-mono text-slate-900">
                  {toPersianDigits(totalTests)} تست
                </td>
                <td className="p-3 text-center font-mono text-amber-800">
                  %{toPersianDigits(averageAccuracy)}
                </td>
                <td className="p-3 text-center font-mono">
                  میانگین: {toPersianDigits(avgSleep)} س
                </td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Visual Analytics & Smart Advisor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Study Distribution Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                نمودار مقایسه‌ای ساعات مطالعه روزهای هفته
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span>
                <span>تستی</span>
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-300"></span>
                <span>تشریحی</span>
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {reports.map((r) => {
              const maxScale = 14;
              const testWidth = ((r.testingHours || 0) / maxScale) * 100;
              const descWidth = ((r.descriptiveHours || 0) / maxScale) * 100;

              return (
                <div key={r.dayId} className="flex items-center gap-3 text-xs">
                  <span className="w-16 font-semibold text-slate-700 shrink-0">
                    {r.dayName}
                  </span>

                  <div className="flex-1 bg-slate-100 h-5 rounded-md overflow-hidden flex items-center">
                    <div
                      className="bg-indigo-600 h-full transition-all duration-300"
                      style={{ width: `${testWidth}%` }}
                      title={`تستی: ${r.testingHours} ساعت`}
                    />
                    <div
                      className="bg-slate-400 h-full transition-all duration-300"
                      style={{ width: `${descWidth}%` }}
                      title={`تشریحی: ${r.descriptiveHours} ساعت`}
                    />
                  </div>

                  <span className="w-14 text-left font-mono font-bold text-slate-800 text-[11px] shrink-0">
                    {toPersianDigits(r.totalHours)} س
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Smart Konkur Counselor Feedback */}
        <div className="lg:col-span-6 bg-gradient-to-br from-indigo-50/50 to-white rounded-2xl border border-indigo-100 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-indigo-100/60">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-indigo-950 text-sm">
                تحلیل و ارزیابی مشاور کلینیک کنکور برای این هفته
              </h3>
            </div>

            <div className="space-y-3">
              {getAdvisorRecommendations().map((rec, i) => (
                <div
                  key={i}
                  className="bg-white p-3 rounded-xl border border-indigo-100/80 shadow-2xs flex items-start gap-2.5 text-xs leading-relaxed text-slate-700"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <p>{rec.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-100 text-[11px] text-indigo-900/70 flex items-center justify-between">
            <span>تحلیل هوشمند کلینیک: تعادل و پیوستگی رمز رتبه برتر شدن است</span>
            <span className="font-semibold text-indigo-600">پشتیبانی: @Poshtibani_CliniCk_konkur2026</span>
          </div>
        </div>
      </div>

      {/* Add New Day Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              ثبت سطر جدید در دفترچه گزارش کار
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 block mb-1">نام روز:</label>
                <input
                  type="text"
                  value={newRowData.dayName}
                  onChange={(e) => setNewRowData({ ...newRowData, dayName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-1">تاریخ:</label>
                <input
                  type="text"
                  value={newRowData.dateStr}
                  onChange={(e) => setNewRowData({ ...newRowData, dateStr: e.target.value })}
                  placeholder="۰۸/۱۲"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 block mb-1">ساعت تشریحی:</label>
                <input
                  type="number"
                  step="0.5"
                  value={newRowData.descriptiveHours}
                  onChange={(e) => setNewRowData({ ...newRowData, descriptiveHours: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-1">ساعت تستی:</label>
                <input
                  type="number"
                  step="0.5"
                  value={newRowData.testingHours}
                  onChange={(e) => setNewRowData({ ...newRowData, testingHours: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-slate-600 block mb-1 text-[11px]">تست درست:</label>
                <input
                  type="number"
                  value={newRowData.testsCorrect}
                  onChange={(e) => setNewRowData({ ...newRowData, testsCorrect: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-center"
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-1 text-[11px]">تست غلط:</label>
                <input
                  type="number"
                  value={newRowData.testsWrong}
                  onChange={(e) => setNewRowData({ ...newRowData, testsWrong: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-center"
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-1 text-[11px]">تست نزده:</label>
                <input
                  type="number"
                  value={newRowData.testsUnanswered}
                  onChange={(e) => setNewRowData({ ...newRowData, testsUnanswered: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-center"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 block mb-1">نکات و نقاط مثبت روز:</label>
              <input
                type="text"
                value={newRowData.dailyHighlights}
                onChange={(e) => setNewRowData({ ...newRowData, dailyHighlights: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                placeholder="تکمیل کامل پارت‌ها، دقت در تست‌های ریاضی..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-700"
              >
                انصراف
              </button>
              <button
                onClick={handleAddNewRow}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xs"
              >
                افزودن به جدول
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
