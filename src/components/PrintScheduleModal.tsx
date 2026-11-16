import React, { useState, useRef, useEffect } from 'react';
import {
  DaySchedule,
  WeeklyHeaderInfo,
  DailyReportRow,
  SubjectOverviewItem,
  SUBJECT_CONFIGS,
  DAYS_INFO,
} from '../types/planner';
import { toPersianDigits } from '../utils/helpers';
import { renderSchedulePageCanvas, renderReportPageCanvas } from '../utils/canvasPages';
import {
  Printer,
  X,
  Calendar,
  CheckSquare,
  Sparkles,
  BookOpen,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  Share2,
  FileText,
  AlertCircle,
  Eye,
  Layers,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface PrintScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: DaySchedule[];
  headerInfo: WeeklyHeaderInfo;
  partTimes: string[];
  reports?: DailyReportRow[];
  subjects?: SubjectOverviewItem[];
}

export const PrintScheduleModal: React.FC<PrintScheduleModalProps> = ({
  isOpen,
  onClose,
  schedule,
  headerInfo,
  partTimes,
  reports = [],
  subjects = [],
}) => {
  const [activePage, setActivePage] = useState<'page1' | 'page2'>('page1');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const [exportErr, setExportErr] = useState<string | null>(null);
  const [page1DataUrl, setPage1DataUrl] = useState<string | null>(null);
  const [page2DataUrl, setPage2DataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Auto generate canvas previews when opened
      generateBothPages();
    }
  }, [isOpen, schedule, headerInfo, reports, partTimes]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    setExportErr(null);
    try {
      const { exportWeeklyPlanPdf } = await import('../utils/exportPdf');
      await exportWeeklyPlanPdf({ schedule, headerInfo, partTimes, reports });
      setExportMsg('فایل PDF دو صفحه‌ای برنامه با موفقیت ساخته و دانلود شد ✅');
      setTimeout(() => setExportMsg(null), 6000);
    } catch (e) {
      console.warn('PDF export error:', e);
      setExportErr('ساخت PDF ناموفق بود — لطفاً دوباره تلاش کنید.');
      setTimeout(() => setExportErr(null), 6000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWord = async () => {
    setIsExporting(true);
    setExportErr(null);
    try {
      const { exportWeeklyPlanDocx } = await import('../utils/exportDocx');
      await exportWeeklyPlanDocx({ schedule, headerInfo, partTimes, reports, subjects });
      setExportMsg('فایل Word قابل ویرایش برنامه با موفقیت ساخته و دانلود شد ✅');
      setTimeout(() => setExportMsg(null), 6000);
    } catch (e) {
      console.warn('Word export error:', e);
      setExportErr('ساخت فایل Word ناموفق بود — لطفاً دوباره تلاش کنید.');
      setTimeout(() => setExportErr(null), 6000);
    } finally {
      setIsExporting(false);
    }
  };

  // Canvas rendering moved to utils/canvasPages.ts (shared with PDF/Word export)
  const generatePage1Canvas = (): HTMLCanvasElement =>
    renderSchedulePageCanvas({ schedule, headerInfo, partTimes });

  const generatePage2Canvas = (): HTMLCanvasElement =>
    renderReportPageCanvas({ reports, headerInfo });

  const generateBothPages = () => {
    try {
      const c1 = generatePage1Canvas();
      const u1 = c1.toDataURL('image/png');
      setPage1DataUrl(u1);

      const c2 = generatePage2Canvas();
      const u2 = c2.toDataURL('image/png');
      setPage2DataUrl(u2);
    } catch (e) {
      console.warn('Canvas generation error:', e);
    }
  };

  // Browser fallback: direct anchor trigger (works in regular browsers)
  const triggerBrowserDownload = (dataUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        document.body.removeChild(link);
      } catch {
        // ignore
      }
    }, 1000);
  };

  // Direct Mobile-friendly Download
  // Inside the Android APK, <a download> silently does nothing — the WebView
  // exposes window.AndroidBridge.saveImage() which writes the PNG into the
  // phone gallery (Pictures/ClinicKonkur) via MediaStore.
  const handleDownloadImage = (page: 'page1' | 'page2') => {
    setIsExporting(true);
    try {
      const canvas = page === 'page1' ? generatePage1Canvas() : generatePage2Canvas();
      const fileName =
        page === 'page1'
          ? `ClinicKonkur_Weekly_Plan_${headerInfo.startDate || 'week'}.png`
          : `ClinicKonkur_Weekly_Report_${headerInfo.startDate || 'week'}.png`;

      const dataUrl = canvas.toDataURL('image/png');

      const bridge = (window as any).AndroidBridge;
      if (bridge && typeof bridge.saveImage === 'function') {
        const reqId = `${Date.now()}`;
        (window as any).__ckImageSaved = (id: string, ok: boolean) => {
          if (id !== reqId) return;
          if (ok) {
            setSaveFailed(false);
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 6000);
          } else {
            // Native save failed — best-effort fallback for browsers
            triggerBrowserDownload(dataUrl, fileName);
            setSaveFailed(true);
            setTimeout(() => setSaveFailed(false), 8000);
          }
        };
        bridge.saveImage(dataUrl, fileName, reqId);
        return;
      }

      triggerBrowserDownload(dataUrl, fileName);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch {
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-5xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                خروجی تخصصی دو صفحه‌ای (صفحه ۱: برنامه هفتگی | صفحه ۲: گزارش کار)
              </h2>
              <p className="text-xs text-slate-500">
                ذخیره آفلاین در گالری گوشی، چاپ و خروجی PDF و Word (قابل ویرایش)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-xs transition-colors disabled:opacity-60"
              title="خروجی PDF دو صفحه‌ای با ابعاد دقیق A4"
            >
              <Download className="w-4 h-4" />
              <span>خروجی PDF</span>
            </button>
            <button
              onClick={handleExportWord}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-xs transition-colors disabled:opacity-60"
              title="خروجی Word قابل ویرایش با جدول‌های راست‌به‌چپ"
            >
              <FileText className="w-4 h-4" />
              <span>خروجی Word</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
              title="چاپ یا ذخیره مستقیم به صورت PDF دو صفحه‌ای"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ / ذخیره PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action & Notification Banner */}
        {downloadSuccess && (
          <div className="bg-emerald-500 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>تصویر برنامه در حافظه گوشی ذخیره شد! همچنین می‌توانید انگشت خود را روی عکس نگه دارید.</span>
            </div>
            <button onClick={() => setDownloadSuccess(false)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {saveFailed && (
          <div className="bg-amber-500 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>ذخیره در گالری ممکن نشد — اجازه دسترسی به حافظه را بررسی کنید یا تصویر را با نگه داشتن انگشت روی عکس ذخیره کنید.</span>
            </div>
            <button onClick={() => setSaveFailed(false)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {exportMsg && (
          <div className="bg-emerald-500 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{exportMsg}</span>
            </div>
            <button onClick={() => setExportMsg(null)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {exportErr && (
          <div className="bg-rose-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{exportErr}</span>
            </div>
            <button onClick={() => setExportErr(null)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page Switcher Tabs */}
        <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage('page1')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activePage === 'page1'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>صفحه ۱: جدول برنامه‌ریزی هفتگی</span>
            </button>

            <button
              onClick={() => setActivePage('page2')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activePage === 'page2'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>صفحه ۲: دفترچه گزارش کار و کارنامه</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadImage('page1')}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-cyan-900 bg-cyan-100 hover:bg-cyan-200 rounded-xl transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود عکس صفحه ۱ (PNG)</span>
            </button>
            <button
              onClick={() => handleDownloadImage('page2')}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-900 bg-indigo-100 hover:bg-indigo-200 rounded-xl transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود عکس صفحه ۲ (PNG)</span>
            </button>
          </div>
        </div>

        {/* Instructions Callout for Mobile Users */}
        <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>آموزش ذخیره آفلاین در گالری گوشی:</strong> چنانچه دکمه دانلود در مرورگر گوشی شما کار نکرد، کافیست انگشت خود را روی تصویر زیر ۲ ثانیه نگه دارید و گزینه «بارگیری تصویر / ذخیره در گالری» (Download / Save image) را انتخاب کنید.
          </span>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/50 flex flex-col items-center justify-center">
          {activePage === 'page1' ? (
            page1DataUrl ? (
              <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300">
                <img
                  src={page1DataUrl}
                  alt="صفحه ۱ - جدول برنامه‌ریزی هفتگی کلینیک کنکور"
                  className="w-full h-auto block select-all cursor-pointer"
                  title="برای ذخیره در گالری، انگشت خود را روی عکس نگه دارید"
                />
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">در حال تولید پیش‌نمایش صفحه ۱...</div>
            )
          ) : page2DataUrl ? (
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300">
              <img
                src={page2DataUrl}
                alt="صفحه ۲ - گزارش کار و کارنامه تحلیلی کلینیک کنکور"
                className="w-full h-auto block select-all cursor-pointer"
                title="برای ذخیره در گالری، انگشت خود را روی عکس نگه دارید"
              />
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">در حال تولید پیش‌نمایش صفحه ۲...</div>
          )}
        </div>
      </div>
    </div>
  );
};
