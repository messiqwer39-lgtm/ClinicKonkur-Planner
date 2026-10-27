import React, { useState, useRef, useEffect } from 'react';
import {
  DaySchedule,
  WeeklyHeaderInfo,
  DailyReportRow,
  SUBJECT_CONFIGS,
  DAYS_INFO,
} from '../types/planner';
import { toPersianDigits } from '../utils/helpers';
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
}

export const PrintScheduleModal: React.FC<PrintScheduleModalProps> = ({
  isOpen,
  onClose,
  schedule,
  headerInfo,
  partTimes,
  reports = [],
}) => {
  const [activePage, setActivePage] = useState<'page1' | 'page2'>('page1');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
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

  // Generate Page 1: Weekly Schedule Table Canvas
  const generatePage1Canvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const width = 1400;
    const height = 960;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Header Banner
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, 105);

    // Accent line
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(0, 101, width, 4);

    // Header Text
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Vazirmatn, Tahoma, sans-serif';
    ctx.fillText('صفحه ۱: جدول برنامه‌ریزی هفتگی ۸ پارت ۹۰ دقیقه‌ای کلینیک کنکور', width - 40, 52);

    ctx.font = '13px Vazirmatn, Tahoma, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(
      `عنوان: ${headerInfo.weekNumber || 'برنامه هفتگی'}  |  بازه زمانی: ${toPersianDigits(headerInfo.startDate || '---')} تا ${toPersianDigits(headerInfo.endDate || '---')}`,
      width - 40,
      82
    );

    ctx.direction = 'ltr';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('@Poshtibani_CliniCk_konkur2026', 40, 58);

    // Table Geometry
    const startX = 40;
    const startY = 125;
    const tableWidth = width - 80;
    const dayColWidth = 140;
    const partColWidth = (tableWidth - dayColWidth) / 8;
    const headerRowHeight = 44;
    const dayRowHeight = 90;

    // Header Row Background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(startX, startY, tableWidth, headerRowHeight);

    // Day Column Header
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Vazirmatn, Tahoma, sans-serif';
    ctx.fillText('روز / پارت', startX + tableWidth - dayColWidth / 2, startY + 28);

    // 8 Parts Headers with Exact Times
    for (let p = 0; p < 8; p++) {
      const partX = startX + tableWidth - dayColWidth - (p + 1) * partColWidth;
      const timeStr = partTimes[p] || `پارت ${p + 1}`;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Vazirmatn, Tahoma, sans-serif';
      ctx.fillText(`پارت ${toPersianDigits(p + 1)}`, partX + partColWidth / 2, startY + 20);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Tahoma, sans-serif';
      ctx.fillText(toPersianDigits(timeStr), partX + partColWidth / 2, startY + 36);

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(partX, startY);
      ctx.lineTo(partX, startY + headerRowHeight);
      ctx.stroke();
    }

    // Days Rows
    schedule.forEach((day, dayIdx) => {
      const currentY = startY + headerRowHeight + dayIdx * dayRowHeight;

      // Row Zebra
      ctx.fillStyle = dayIdx % 2 === 0 ? '#f8fafc' : '#ffffff';
      ctx.fillRect(startX, currentY, tableWidth, dayRowHeight);

      // Row Border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, currentY, tableWidth, dayRowHeight);

      // Day Column Cell
      const dayCellX = startX + tableWidth - dayColWidth;
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(dayCellX, currentY, dayColWidth, dayRowHeight);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(dayCellX, currentY, dayColWidth, dayRowHeight);

      ctx.direction = 'rtl';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 15px Vazirmatn, Tahoma, sans-serif';
      ctx.fillText(day.dayName, dayCellX + dayColWidth / 2, currentY + 36);

      ctx.font = '11px Vazirmatn, Tahoma, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(toPersianDigits(day.dateStr || '---'), dayCellX + dayColWidth / 2, currentY + 56);

      const completedCount = day.parts.filter((pt) => pt.status === 'completed').length;
      ctx.fillStyle = completedCount > 0 ? '#059669' : '#94a3b8';
      ctx.font = 'bold 10px Vazirmatn, Tahoma, sans-serif';
      ctx.fillText(`${toPersianDigits(completedCount)}/۸ تکمیل`, dayCellX + dayColWidth / 2, currentY + 74);

      // 8 Part Slots
      day.parts.forEach((part, partIdx) => {
        const partX = startX + tableWidth - dayColWidth - (partIdx + 1) * partColWidth;

        ctx.strokeStyle = '#e2e8f0';
        ctx.strokeRect(partX, currentY, partColWidth, dayRowHeight);

        if (part.subject) {
          const cfg = SUBJECT_CONFIGS[part.subject as keyof typeof SUBJECT_CONFIGS];
          const color = cfg?.badgeBg.includes('emerald')
            ? '#059669'
            : cfg?.badgeBg.includes('sky')
            ? '#0284c7'
            : cfg?.badgeBg.includes('purple')
            ? '#7c3aed'
            : cfg?.badgeBg.includes('amber')
            ? '#d97706'
            : '#0d9488';

          // Colored Subject Pill
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.roundRect(partX + 8, currentY + 8, partColWidth - 16, 20, 4);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px Vazirmatn, Tahoma, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(cfg?.title || part.subject, partX + partColWidth / 2, currentY + 22);

          // Topic Text
          ctx.fillStyle = '#1e293b';
          ctx.font = '10px Vazirmatn, Tahoma, sans-serif';
          const topic = part.topic || 'مطالعه و تست';
          const truncatedTopic = topic.length > 16 ? topic.substring(0, 15) + '…' : topic;
          ctx.fillText(truncatedTopic, partX + partColWidth / 2, currentY + 46);

          // Status & Target Tests
          ctx.fillStyle = part.status === 'completed' ? '#059669' : '#64748b';
          ctx.font = 'bold 10px Vazirmatn, Tahoma, sans-serif';
          const statusLabel =
            part.status === 'completed' ? '✓ انجام شد' : `${toPersianDigits(part.targetTests || 0)} تست`;
          ctx.fillText(statusLabel, partX + partColWidth / 2, currentY + 68);
        } else {
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('—', partX + partColWidth / 2, currentY + 50);
        }
      });
    });

    // Footer Box
    const footerY = startY + headerRowHeight + 7 * dayRowHeight + 16;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(startX, footerY, tableWidth, 95);
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(startX, footerY, tableWidth, 95);

    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px Vazirmatn, Tahoma, sans-serif';
    ctx.fillText(
      `جمله انگیزشی هفته: "${headerInfo.motivationalQuote || 'پیروزی واقعی با استمرار روزانه ساخته می‌شود.'}"`,
      startX + tableWidth - 20,
      footerY + 36
    );

    ctx.font = '11px Vazirmatn, Tahoma, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(
      `کلینیک کنکور | پشتیبانی و رزرو مشاوره VIP: Poshtibani_CliniCk_konkur2026@ | کانال تلگرام: CliniC_Konkur2026@`,
      startX + tableWidth - 20,
      footerY + 68
    );

    return canvas;
  };

  // Generate Page 2: Weekly Work Report & Performance Analytics Canvas
  const generatePage2Canvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const width = 1400;
    const height = 960;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Header Banner
    ctx.fillStyle = '#1e1b4b'; // Deep Indigo
    ctx.fillRect(0, 0, width, 105);

    // Accent line
    ctx.fillStyle = '#818cf8';
    ctx.fillRect(0, 101, width, 4);

    // Header Text
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Vazirmatn, Tahoma, sans-serif';
    ctx.fillText('صفحه ۲: دفترچه گزارش کار و کارنامه عملکرد تحلیلی هفتگی کلینیک کنکور', width - 40, 52);

    ctx.font = '13px Vazirmatn, Tahoma, sans-serif';
    ctx.fillStyle = '#c7d2fe';
    ctx.fillText(
      `تحلیل ساعات تشریحی و تستی، آمار تست‌ها با کسر نمره منفی کنکور و ارزیابی مشاور`,
      width - 40,
      82
    );

    ctx.direction = 'ltr';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#a5b4fc';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('@Poshtibani_CliniCk_konkur2026', 40, 58);

    // Report Table Geometry
    const startX = 40;
    const startY = 125;
    const tableWidth = width - 80;
    const headerRowHeight = 44;
    const reportRowHeight = 65;

    // Table Column Definitions
    const cols = [
      { id: 'day', title: 'روز هفته', width: 140 },
      { id: 'date', title: 'تاریخ', width: 110 },
      { id: 'descHours', title: 'ساعت تشریحی', width: 115 },
      { id: 'testHours', title: 'ساعت تستی', width: 115 },
      { id: 'totalHours', title: 'جمع کل ساعت', width: 120 },
      { id: 'correct', title: 'تست درست', width: 100 },
      { id: 'wrong', title: 'تست غلط', width: 100 },
      { id: 'unanswered', title: 'تست نزده', width: 100 },
      { id: 'totalTests', title: 'کل تست‌ها', width: 110 },
      { id: 'percent', title: 'درصد کنکور', width: 110 },
      { id: 'quality', title: 'کیفیت و ارزیابی', width: 200 },
    ];

    // Header Row Background
    ctx.fillStyle = '#312e81';
    ctx.fillRect(startX, startY, tableWidth, headerRowHeight);

    // Header Titles
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Vazirmatn, Tahoma, sans-serif';

    let currX = startX + tableWidth;
    cols.forEach((col) => {
      currX -= col.width;
      ctx.fillText(col.title, currX + col.width / 2, startY + 28);
      ctx.strokeStyle = '#4338ca';
      ctx.lineWidth = 1;
      ctx.strokeRect(currX, startY, col.width, headerRowHeight);
    });

    // Totals accumulators
    let totalDescHours = 0;
    let totalTestHours = 0;
    let totalHoursAll = 0;
    let totalCorrectTests = 0;
    let totalWrongTests = 0;
    let totalUnansweredTests = 0;
    let totalTestsAll = 0;

    // Report Rows (7 Days)
    DAYS_INFO.forEach((dInfo, rIdx) => {
      const rowY = startY + headerRowHeight + rIdx * reportRowHeight;
      const report = reports.find((r) => r.dayId === dInfo.id);

      const descH = report?.descriptiveHours || 0;
      const testH = report?.testingHours || 0;
      const totH = report?.totalHours || (descH + testH);
      const corr = report?.testsCorrect || 0;
      const wrg = report?.testsWrong || 0;
      const unans = report?.testsUnanswered || 0;
      const totT = report?.totalTests || (corr + wrg + unans);

      // Real Konkur percent: (3 * Correct - Wrong) / (3 * Total) * 100
      let percent = report?.accuracyPercentage || 0;
      if (totT > 0 && !percent) {
        percent = Math.max(0, Math.round(((corr * 3 - wrg) / (totT * 3)) * 100));
      }

      totalDescHours += descH;
      totalTestHours += testH;
      totalHoursAll += totH;
      totalCorrectTests += corr;
      totalWrongTests += wrg;
      totalUnansweredTests += unans;
      totalTestsAll += totT;

      // Row Zebra
      ctx.fillStyle = rIdx % 2 === 0 ? '#f8fafc' : '#ffffff';
      ctx.fillRect(startX, rowY, tableWidth, reportRowHeight);

      // Row Border
      ctx.strokeStyle = '#e2e8f0';
      ctx.strokeRect(startX, rowY, tableWidth, reportRowHeight);

      let colX = startX + tableWidth;
      cols.forEach((col) => {
        colX -= col.width;
        ctx.strokeStyle = '#e2e8f0';
        ctx.strokeRect(colX, rowY, col.width, reportRowHeight);

        ctx.fillStyle = '#0f172a';
        ctx.font = '12px Vazirmatn, Tahoma, sans-serif';
        ctx.textAlign = 'center';

        if (col.id === 'day') {
          ctx.font = 'bold 13px Vazirmatn, Tahoma, sans-serif';
          ctx.fillText(dInfo.name, colX + col.width / 2, rowY + 38);
        } else if (col.id === 'date') {
          ctx.fillStyle = '#64748b';
          ctx.fillText(toPersianDigits(report?.dateStr || '---'), colX + col.width / 2, rowY + 38);
        } else if (col.id === 'descHours') {
          ctx.fillText(toPersianDigits(descH > 0 ? `${descH} س` : '—'), colX + col.width / 2, rowY + 38);
        } else if (col.id === 'testHours') {
          ctx.fillText(toPersianDigits(testH > 0 ? `${testH} س` : '—'), colX + col.width / 2, rowY + 38);
        } else if (col.id === 'totalHours') {
          ctx.font = 'bold 12px Vazirmatn, Tahoma, sans-serif';
          ctx.fillStyle = totH > 0 ? '#4338ca' : '#94a3b8';
          ctx.fillText(toPersianDigits(totH > 0 ? `${totH} ساعت` : '—'), colX + col.width / 2, rowY + 38);
        } else if (col.id === 'correct') {
          ctx.fillStyle = '#059669';
          ctx.font = 'bold 12px Vazirmatn, Tahoma, sans-serif';
          ctx.fillText(toPersianDigits(corr > 0 ? corr : '۰'), colX + col.width / 2, rowY + 38);
        } else if (col.id === 'wrong') {
          ctx.fillStyle = '#dc2626';
          ctx.fillText(toPersianDigits(wrg > 0 ? wrg : '۰'), colX + col.width / 2, rowY + 38);
        } else if (col.id === 'unanswered') {
          ctx.fillStyle = '#64748b';
          ctx.fillText(toPersianDigits(unans > 0 ? unans : '۰'), colX + col.width / 2, rowY + 38);
        } else if (col.id === 'totalTests') {
          ctx.font = 'bold 12px Vazirmatn, Tahoma, sans-serif';
          ctx.fillText(toPersianDigits(totT > 0 ? totT : '۰'), colX + col.width / 2, rowY + 38);
        } else if (col.id === 'percent') {
          ctx.font = 'bold 13px Vazirmatn, Tahoma, sans-serif';
          ctx.fillStyle = percent >= 60 ? '#059669' : percent > 0 ? '#d97706' : '#94a3b8';
          ctx.fillText(totT > 0 ? `${toPersianDigits(percent)}٪` : '—', colX + col.width / 2, rowY + 38);
        } else if (col.id === 'quality') {
          ctx.font = '11px Vazirmatn, Tahoma, sans-serif';
          ctx.fillStyle = '#334155';
          const rating = report?.qualityRating || 3;
          const qualityStr = rating >= 4
            ? '⭐ عالی و پرانرژی'
            : rating === 3
            ? '✓ خوب و هدفمند'
            : 'متوسط (نیاز به تمرکز)';
          ctx.fillText(qualityStr, colX + col.width / 2, rowY + 38);
        }
      });
    });

    // Summary Totals Row
    const summaryRowY = startY + headerRowHeight + 7 * reportRowHeight;
    ctx.fillStyle = '#e0e7ff';
    ctx.fillRect(startX, summaryRowY, tableWidth, 48);
    ctx.strokeStyle = '#818cf8';
    ctx.strokeRect(startX, summaryRowY, tableWidth, 48);

    ctx.font = 'bold 12px Vazirmatn, Tahoma, sans-serif';
    ctx.fillStyle = '#1e1b4b';

    let totalPercentAvg = 0;
    if (totalTestsAll > 0) {
      totalPercentAvg = Math.max(0, Math.round(((totalCorrectTests * 3 - totalWrongTests) / (totalTestsAll * 3)) * 100));
    }

    let colSumX = startX + tableWidth;
    cols.forEach((col) => {
      colSumX -= col.width;
      ctx.textAlign = 'center';
      if (col.id === 'day') {
        ctx.fillText('مجموع هفته', colSumX + col.width / 2, summaryRowY + 30);
      } else if (col.id === 'descHours') {
        ctx.fillText(`${toPersianDigits(totalDescHours)} س`, colSumX + col.width / 2, summaryRowY + 30);
      } else if (col.id === 'testHours') {
        ctx.fillText(`${toPersianDigits(totalTestHours)} س`, colSumX + col.width / 2, summaryRowY + 30);
      } else if (col.id === 'totalHours') {
        ctx.fillText(`${toPersianDigits(totalHoursAll)} ساعت`, colSumX + col.width / 2, summaryRowY + 30);
      } else if (col.id === 'correct') {
        ctx.fillStyle = '#059669';
        ctx.fillText(toPersianDigits(totalCorrectTests), colSumX + col.width / 2, summaryRowY + 30);
        ctx.fillStyle = '#1e1b4b';
      } else if (col.id === 'wrong') {
        ctx.fillStyle = '#dc2626';
        ctx.fillText(toPersianDigits(totalWrongTests), colSumX + col.width / 2, summaryRowY + 30);
        ctx.fillStyle = '#1e1b4b';
      } else if (col.id === 'unanswered') {
        ctx.fillText(toPersianDigits(totalUnansweredTests), colSumX + col.width / 2, summaryRowY + 30);
      } else if (col.id === 'totalTests') {
        ctx.fillText(toPersianDigits(totalTestsAll), colSumX + col.width / 2, summaryRowY + 30);
      } else if (col.id === 'percent') {
        ctx.fillStyle = totalPercentAvg >= 60 ? '#059669' : '#4338ca';
        ctx.fillText(totalTestsAll > 0 ? `${toPersianDigits(totalPercentAvg)}٪` : '—', colSumX + col.width / 2, summaryRowY + 30);
        ctx.fillStyle = '#1e1b4b';
      } else if (col.id === 'quality') {
        ctx.fillText('کارنامه رسمی کلینیک کنکور', colSumX + col.width / 2, summaryRowY + 30);
      }
    });

    // Counselor Analytics Box
    const reportFooterY = summaryRowY + 48 + 16;
    ctx.fillStyle = '#faf5ff';
    ctx.fillRect(startX, reportFooterY, tableWidth, 90);
    ctx.strokeStyle = '#c084fc';
    ctx.strokeRect(startX, reportFooterY, tableWidth, 90);

    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#581c87';
    ctx.font = 'bold 13px Vazirmatn, Tahoma, sans-serif';
    ctx.fillText(
      `تحلیل و ارزیابی مشاور کلینیک: «مجموع ${toPersianDigits(totalHoursAll)} ساعت مطالعه و حل ${toPersianDigits(totalTestsAll)} تست هفتگی با میانگین تراز ${toPersianDigits(totalPercentAvg)}٪ ثبت گردید.»`,
      startX + tableWidth - 20,
      reportFooterY + 34
    );

    ctx.font = '11px Vazirmatn, Tahoma, sans-serif';
    ctx.fillStyle = '#6b21a8';
    ctx.fillText(
      `جهت دریافت برنامه شخصی‌سازی شده، بررسی روند تراز و تحلیل کارنامه آزمون‌های آزمایشی: @Poshtibani_CliniCk_konkur2026`,
      startX + tableWidth - 20,
      reportFooterY + 65
    );

    return canvas;
  };

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
                ذخیره آفلاین با بالاترین کیفیت در گالری گوشی و نسخه آماده چاپ و PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
