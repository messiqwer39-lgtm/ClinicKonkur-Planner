/**
 * Shared canvas page renderers for print / PDF / Word export.
 * Pages render at 1400x960 which is exactly the A4 landscape aspect ratio.
 * Extracted verbatim from PrintScheduleModal — single source of truth.
 */
import {
  DaySchedule,
  WeeklyHeaderInfo,
  DailyReportRow,
  SUBJECT_CONFIGS,
  DAYS_INFO,
} from '../types/planner';
import { toPersianDigits } from './helpers';

  // Generate Page 1: Weekly Schedule Table Canvas
  export const renderSchedulePageCanvas = ({
  schedule,
  headerInfo,
  partTimes,
}: {
  schedule: DaySchedule[];
  headerInfo: WeeklyHeaderInfo;
  partTimes: string[];
}): HTMLCanvasElement => {
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
  export const renderReportPageCanvas = ({
  reports,
  headerInfo,
}: {
  reports: DailyReportRow[];
  headerInfo: WeeklyHeaderInfo;
}): HTMLCanvasElement => {
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

