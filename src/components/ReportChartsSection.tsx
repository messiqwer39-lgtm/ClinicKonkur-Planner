import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { DailyReportRow } from '../types/planner';
import { toPersianDigits } from '../utils/helpers';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  Layers,
} from 'lucide-react';

interface ReportChartsSectionProps {
  reports: DailyReportRow[];
}

export const ReportChartsSection: React.FC<ReportChartsSectionProps> = ({ reports }) => {
  const [chartView, setChartView] = useState<'hours' | 'tests' | 'combined'>('hours');

  // Prepare chart dataset
  const chartData = reports.map((r) => ({
    name: r.dayName,
    date: r.dateStr,
    descriptiveHours: Number(r.descriptiveHours) || 0,
    testingHours: Number(r.testingHours) || 0,
    totalHours: Number(r.totalHours) || (Number(r.descriptiveHours) || 0) + (Number(r.testingHours) || 0),
    testsCorrect: Number(r.testsCorrect) || 0,
    testsWrong: Number(r.testsWrong) || 0,
    testsUnanswered: Number(r.testsUnanswered) || 0,
    totalTests: Number(r.totalTests) || (Number(r.testsCorrect) || 0) + (Number(r.testsWrong) || 0) + (Number(r.testsUnanswered) || 0),
    accuracyPercentage: Number(r.accuracyPercentage) || 0,
    sleepHours: Number(r.sleepHours) || 0,
  }));

  // Custom Tooltip for Recharts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs text-right space-y-1.5 min-w-[170px]">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5 font-bold text-white">
            <span className="text-cyan-400">{label}</span>
            {data.date && <span className="text-[10px] text-slate-400 font-mono">{toPersianDigits(data.date)}</span>}
          </div>
          
          {chartView === 'hours' && (
            <>
              <div className="flex items-center justify-between text-indigo-300">
                <span>ساعت تستی:</span>
                <span className="font-bold font-mono">{toPersianDigits(data.testingHours)} س</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>ساعت تشریحی:</span>
                <span className="font-bold font-mono">{toPersianDigits(data.descriptiveHours)} س</span>
              </div>
              <div className="flex items-center justify-between text-cyan-300 pt-1 border-t border-slate-800 font-bold">
                <span>مجموع مطالعه:</span>
                <span className="font-mono">{toPersianDigits(data.totalHours)} ساعت</span>
              </div>
            </>
          )}

          {chartView === 'tests' && (
            <>
              <div className="flex items-center justify-between text-emerald-400">
                <span>تست درست:</span>
                <span className="font-bold font-mono">{toPersianDigits(data.testsCorrect)}</span>
              </div>
              <div className="flex items-center justify-between text-rose-400">
                <span>تست نادرست:</span>
                <span className="font-bold font-mono">{toPersianDigits(data.testsWrong)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>تست نزده:</span>
                <span className="font-bold font-mono">{toPersianDigits(data.testsUnanswered)}</span>
              </div>
              <div className="flex items-center justify-between text-amber-300 pt-1 border-t border-slate-800 font-bold">
                <span>درصد کنکوری:</span>
                <span className="font-mono">%{toPersianDigits(data.accuracyPercentage)}</span>
              </div>
            </>
          )}

          {chartView === 'combined' && (
            <>
              <div className="flex items-center justify-between text-indigo-300">
                <span>ساعت مطالعه:</span>
                <span className="font-bold font-mono">{toPersianDigits(data.totalHours)} س</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span>کل تست‌ها:</span>
                <span className="font-bold font-mono">{toPersianDigits(data.totalTests)}</span>
              </div>
              <div className="flex items-center justify-between text-amber-300">
                <span>درصد دقت:</span>
                <span className="font-bold font-mono">%{toPersianDigits(data.accuracyPercentage)}</span>
              </div>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  // Metrics
  const totalHours = chartData.reduce((acc, curr) => acc + curr.totalHours, 0);
  const avgHours = chartData.length > 0 ? (totalHours / chartData.length).toFixed(1) : 0;
  const totalTests = chartData.reduce((acc, curr) => acc + curr.totalTests, 0);
  const avgAccuracy = chartData.length > 0 ? Math.round(chartData.reduce((acc, curr) => acc + curr.accuracyPercentage, 0) / chartData.length) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs print-card space-y-4">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>نمودار پیشرفت و روند هفتگی مطالعه و تست‌زنی</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold border border-indigo-100">
                تحلیل هوشمند با Recharts
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              بررسی پیوستگی ساعات مطالعه، حجم تست‌های زده‌شده و نوسان درصد کنکوری در طول هفته
            </p>
          </div>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs self-start sm:self-auto no-print">
          <button
            onClick={() => setChartView('hours')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              chartView === 'hours'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>ساعات مطالعه</span>
          </button>

          <button
            onClick={() => setChartView('tests')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              chartView === 'tests'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>تست‌ها و درصد دقت</span>
          </button>

          <button
            onClick={() => setChartView('combined')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              chartView === 'combined'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>نمای ترکیبی جامع</span>
          </button>
        </div>
      </div>

      {/* Quick KPI Badges inside Chart Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
          <span className="text-slate-500">مجموع مطالعه:</span>
          <span className="font-bold font-mono text-slate-900">{toPersianDigits(totalHours.toFixed(1))} ساعت</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
          <span className="text-slate-500">میانگین روزانه:</span>
          <span className="font-bold font-mono text-slate-900">{toPersianDigits(avgHours)} ساعت</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-slate-500">مجموع تست‌ها:</span>
          <span className="font-bold font-mono text-slate-900">{toPersianDigits(totalTests)} تست</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span className="text-slate-500">میانگین درصد دقت:</span>
          <span className="font-bold font-mono text-slate-900">%{toPersianDigits(avgAccuracy)}</span>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartView === 'hours' ? (
            <ComposedChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorTesting" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorDesc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 'dataMax + 2']} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => {
                  if (value === 'testingHours') return 'ساعات مطالعه تستی';
                  if (value === 'descriptiveHours') return 'ساعات مطالعه تشریحی';
                  if (value === 'totalHours') return 'کل ساعات روز';
                  return value;
                }}
                wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
              />
              <Bar dataKey="descriptiveHours" stackId="a" fill="url(#colorDesc)" name="descriptiveHours" radius={[0, 0, 0, 0]} />
              <Bar dataKey="testingHours" stackId="a" fill="url(#colorTesting)" name="testingHours" radius={[6, 6, 0, 0]} />
              <Line type="monotone" dataKey="totalHours" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4, fill: '#06b6d4' }} name="totalHours" />
            </ComposedChart>
          ) : chartView === 'tests' ? (
            <ComposedChart data={chartData} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#f59e0b" tick={{ fontSize: 11 }} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => {
                  if (value === 'testsCorrect') return 'تست‌های درست (سبز)';
                  if (value === 'testsWrong') return 'تست‌های نادرست (قرمز)';
                  if (value === 'testsUnanswered') return 'تست‌های نزده (خاکستری)';
                  if (value === 'accuracyPercentage') return 'درصد با نمره منفی (خط طلایی)';
                  return value;
                }}
                wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
              />
              <Bar yAxisId="left" dataKey="testsCorrect" stackId="tests" fill="#10b981" name="testsCorrect" />
              <Bar yAxisId="left" dataKey="testsWrong" stackId="tests" fill="#f43f5e" name="testsWrong" />
              <Bar yAxisId="left" dataKey="testsUnanswered" stackId="tests" fill="#94a3b8" name="testsUnanswered" radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="accuracyPercentage" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} name="accuracyPercentage" />
            </ComposedChart>
          ) : (
            <ComposedChart data={chartData} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#4f46e5" tick={{ fontSize: 11 }} unit=" س" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fontSize: 11 }} unit=" تست" />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => {
                  if (value === 'totalHours') return 'ساعات مطالعه کل';
                  if (value === 'totalTests') return 'تعداد تست‌های حل‌شده';
                  return value;
                }}
                wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
              />
              <Bar yAxisId="left" dataKey="totalHours" fill="#6366f1" name="totalHours" radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="totalTests" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} name="totalTests" />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Bottom Insights Note */}
      <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 flex items-center justify-between text-xs text-indigo-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            {Number(avgHours) >= 8 ? (
              <strong>عالی! پیوستگی و پایداری ساعات مطالعه شما در سطح رتبه‌های ۲ رقمی و ۳ رقمی کنکور است.</strong>
            ) : (
              <span>برای رسیدن به تعادل آرمانی، سعی کنید حداقل میانگین روزانه را به ۸ الی ۹ ساعت در روز افزایش دهید.</span>
            )}
          </span>
        </div>
        <span className="text-[11px] text-indigo-600 font-semibold hidden sm:inline">
          کلینیک پلن · ارزیابی گرافیکی هفتگی
        </span>
      </div>
    </div>
  );
};
