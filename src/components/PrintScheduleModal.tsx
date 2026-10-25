import React, { useState } from 'react';
import {
  DaySchedule,
  WeeklyHeaderInfo,
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
  Image,
  CheckCircle2,
  Share2,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface PrintScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: DaySchedule[];
  headerInfo: WeeklyHeaderInfo;
  partTimes: string[];
}

export const PrintScheduleModal: React.FC<PrintScheduleModalProps> = ({
  isOpen,
  onClose,
  schedule,
  headerInfo,
  partTimes,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Pure Client-Side Offline Canvas Image Generator
  const handleDownloadOfflineImage = async () => {
    setIsExporting(true);

    try {
      const canvas = document.createElement('canvas');
      const width = 1400;
      const height = 960;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        window.print();
        setIsExporting(false);
        return;
      }

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Header Banner
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, 105);

      // Accent gradient line
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(0, 101, width, 4);

      // Header Text (RTL simulation)
      ctx.direction = 'rtl';
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px Vazirmatn, Tahoma, sans-serif';
      ctx.fillText('پلنر تخصصی و جدول برنامه‌ریزی هفتگی کلینیک کنکور', width - 40, 55);

      ctx.font = '14px Vazirmatn, Tahoma, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(
        `عنوان: ${headerInfo.weekNumber || 'برنامه هفتگی'}  |  بازه زمانی: ${toPersianDigits(headerInfo.startDate || '---')} تا ${toPersianDigits(headerInfo.endDate || '---')}`,
        width - 40,
        84
      );

      ctx.direction = 'ltr';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('@Poshtibani_CliniCk_konkur2026', 40, 60);

      // Table Geometry
      const startX = 40;
      const startY = 130;
      const tableWidth = width - 80;
      const dayColWidth = 140;
      const partColWidth = (tableWidth - dayColWidth) / 8;
      const headerRowHeight = 55;
      const dayRowHeight = 85;

      // Table Header Row
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(startX, startY, tableWidth, headerRowHeight);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, startY, tableWidth, headerRowHeight);

      ctx.direction = 'rtl';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px Vazirmatn, Tahoma, sans-serif';
      ctx.fillText('روز هفته', startX + tableWidth - dayColWidth / 2, startY + 34);

      // 8 Part column headers
      for (let i = 0; i < 8; i++) {
        const x = startX + tableWidth - dayColWidth - (i + 1) * partColWidth;
        ctx.strokeStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(x + partColWidth, startY);
        ctx.lineTo(x + partColWidth, startY + headerRowHeight);
        ctx.stroke();

        ctx.fillStyle = '#1e1b4b';
        ctx.font = 'bold 14px Vazirmatn, Tahoma, sans-serif';
        ctx.fillText(`پارت ${toPersianDigits(i + 1)}`, x + partColWidth / 2, startY + 24);

        ctx.fillStyle = '#64748b';
        ctx.font = '11px Vazirmatn, Tahoma, sans-serif';
        ctx.fillText(toPersianDigits(partTimes[i] || `پارت ${i + 1}`), x + partColWidth / 2, startY + 44);
      }

      // Draw 7 Days
      schedule.forEach((day, dayIndex) => {
        const currentY = startY + headerRowHeight + dayIndex * dayRowHeight;

        // Alternate row background
        ctx.fillStyle = dayIndex % 2 === 0 ? '#ffffff' : '#f8fafc';
        ctx.fillRect(startX, currentY, tableWidth, dayRowHeight);
        ctx.strokeRect(startX, currentY, tableWidth, dayRowHeight);

        // Day label
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 16px Vazirmatn, Tahoma, sans-serif';
        ctx.fillText(day.dayName, startX + tableWidth - dayColWidth / 2, currentY + 38);

        ctx.fillStyle = '#64748b';
        ctx.font = '12px Vazirmatn, Tahoma, sans-serif';
        ctx.fillText(toPersianDigits(day.dateStr || ''), startX + tableWidth - dayColWidth / 2, currentY + 58);

        // Draw parts
        day.parts.forEach((part, partIndex) => {
          const partX = startX + tableWidth - dayColWidth - (partIndex + 1) * partColWidth;

          ctx.strokeStyle = '#e2e8f0';
          ctx.beginPath();
          ctx.moveTo(partX + partColWidth, currentY);
          ctx.lineTo(partX + partColWidth, currentY + dayRowHeight);
          ctx.stroke();

          if (part.subject) {
            const cfg = SUBJECT_CONFIGS[part.subject as keyof typeof SUBJECT_CONFIGS];
            ctx.fillStyle = cfg?.accentColor || '#0284c7';
            ctx.font = 'bold 13px Vazirmatn, Tahoma, sans-serif';
            ctx.fillText(cfg?.shortTitle || part.subject, partX + partColWidth / 2, currentY + 24);

            ctx.fillStyle = '#334155';
            ctx.font = '11px Vazirmatn, Tahoma, sans-serif';
            const topicText = part.topic ? (part.topic.length > 18 ? part.topic.slice(0, 16) + '..' : part.topic) : '';
            ctx.fillText(topicText, partX + partColWidth / 2, currentY + 44);

            ctx.fillStyle = part.status === 'completed' ? '#059669' : '#64748b';
            ctx.font = 'bold 11px Vazirmatn, Tahoma, sans-serif';
            const statusLabel = part.status === 'completed' ? '✓ انجام شد' : `${toPersianDigits(part.targetTests || 0)} تست`;
            ctx.fillText(statusLabel, partX + partColWidth / 2, currentY + 66);
          } else {
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '14px sans-serif';
            ctx.fillText('---', partX + partColWidth / 2, currentY + 48);
          }
        });
      });

      // Footer Summary Box
      const footerY = startY + headerRowHeight + 7 * dayRowHeight + 15;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(startX, footerY, tableWidth, 90);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(startX, footerY, tableWidth, 90);

      ctx.direction = 'rtl';
      ctx.textAlign = 'right';
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px Vazirmatn, Tahoma, sans-serif';
      ctx.fillText(
        `جمله انگیزشی هفته: "${headerInfo.motivationalQuote}"`,
        startX + tableWidth - 20,
        footerY + 35
      );

      ctx.font = '12px Vazirmatn, Tahoma, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(
        `کلینیک کنکور | کانال تلگرام: CliniC_Konkur2026@ | رزرو مشاوره VIP و پشتیبانی: Poshtibani_CliniCk_konkur2026@`,
        startX + tableWidth - 20,
        footerY + 65
      );

      // Convert to DataURL and Blob
      const dataUrl = canvas.toDataURL('image/png');
      setPreviewImage(dataUrl);

      // Binary Blob creation for Android
      const byteCharacters = atob(dataUrl.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      const blobUrl = URL.createObjectURL(blob);

      // Try Copying to Clipboard if supported (useful for mobile & desktop)
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
        } catch {
          // ignore if clipboard permission denied
        }
      }

      // Try Web Share API (Android native share to Gallery / Files / WhatsApp)
      let shared = false;
      if (typeof navigator !== 'undefined' && navigator.canShare && typeof File !== 'undefined') {
        try {
          const fileName = `ClinicKonkur_Plan_${headerInfo.startDate || 'week'}.png`;
          const file = new File([blob], fileName, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'برنامه هفتگی کلینیک کنکور',
              text: 'جدول کامل برنامه‌ریزی ۸ پارت ۹۰ دقیقه‌ای',
            });
            shared = true;
          }
        } catch {
          // user cancelled or share failed, fallback to anchor click
        }
      }

      if (!shared) {
        // Direct anchor download
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = `ClinicKonkur_Weekly_Plan_${headerInfo.startDate || 'week'}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        setTimeout(() => {
          try {
            document.body.removeChild(downloadLink);
          } catch {
            // ignore
          }
        }, 1000);
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 8000);
    } catch (err) {
      console.error('Offline download failed, falling back to print', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  // Text summary export for offline backup
  const handleCopyScheduleText = () => {
    let text = `📋 برنامه مطالعاتی کلینیک کنکور\n`;
    text += `عنوان: ${headerInfo.weekNumber || 'برنامه هفتگی'}\n`;
    text += `بازه زمانی: ${headerInfo.startDate || '---'} تا ${headerInfo.endDate || '---'}\n`;
    text += `جمله انگیزشی: ${headerInfo.motivationalQuote}\n\n`;

    schedule.forEach((day) => {
      text += `📅 ${day.dayName} (${day.dateStr || ''}):\n`;
      day.parts.forEach((p) => {
        if (p.subject) {
          const cfg = SUBJECT_CONFIGS[p.subject as keyof typeof SUBJECT_CONFIGS];
          text += `  • پارت ${p.partNumber} (${p.timeRange}): ${cfg?.title || p.subject} - ${p.topic || 'مطالعه'} | هدف: ${p.targetTests || 0} تست [${p.status === 'completed' ? 'انجام شد ✓' : 'برنامه‌ریزی'}]\n`;
        }
      });
      text += `\n`;
    });

    text += `پشتیبانی تلگرام: Poshtibani_CliniCk_konkur2026@`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    }
  };

  // Calculations for summary
  let totalParts = 0;
  let totalTests = 0;
  let completedParts = 0;

  schedule.forEach((day) => {
    day.parts.forEach((p) => {
      if (p.subject) {
        totalParts++;
        totalTests += p.targetTests || 0;
        if (p.status === 'completed') completedParts++;
      }
    });
  });

  const totalHours = totalParts * 1.5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white text-slate-900 rounded-3xl max-w-6xl w-full p-4 sm:p-7 shadow-2xl relative my-auto overflow-hidden print:p-0 print:m-0 print:max-w-none print:shadow-none print:rounded-none">
        {/* Action Bar (Hidden on actual print) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3 no-print">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                چاپ و ذخیره آفلاین برنامه هفتگی در گالری
              </h3>
              <p className="text-xs text-slate-500">
                بدون نیاز به اینترنت، برنامه را در گالری گوشی ذخیره کنید یا به صورت PDF چاپ نمایید.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            {/* OFFLINE SAVE TO GALLERY BUTTON */}
            <button
              onClick={handleDownloadOfflineImage}
              disabled={isExporting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition-all hover:scale-105 cursor-pointer"
              title="تولید و ذخیره تصویر کامل برنامه در گالری گوشی"
            >
              <Image className="w-4 h-4" />
              <span>{isExporting ? 'در حال ایجاد عکس...' : 'ذخیره عکس در گالری (PNG آفلاین)'}</span>
            </button>

            {/* PRINT / SAVE AS PDF BUTTON */}
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ مستقیم یا PDF</span>
            </button>

            {/* COPY TEXT BACKUP BUTTON */}
            <button
              onClick={handleCopyScheduleText}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition-colors"
              title="کپی متن کامل برنامه برای یادداشت یا ارسال در پیام‌رسان‌ها بدون نیاز به اینترنت"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>کپی متن برنامه</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Offline Download Success Notification */}
        {downloadSuccess && (
          <div className="mb-4 bg-emerald-50 border border-emerald-300 text-emerald-800 p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold no-print animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>تصویر برنامه با موفقیت تولید شد و عملیات ذخیره در گالری/دانلودها انجام گرفت!</span>
            </div>
            {previewImage && (
              <span className="text-[11px] text-emerald-700">پیش‌نمایش تصویر در پایین قابل مشاهده است.</span>
            )}
          </div>
        )}

        {/* Generated Image Preview Card (Allows manual long-press / save on Android WebView) */}
        {previewImage && (
          <div className="mb-5 p-4 bg-slate-900 text-white rounded-2xl border-2 border-cyan-400 no-print space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs sm:text-sm">
                <Image className="w-4 h-4 text-cyan-400" />
                <span>تصویر آماده ذخیره برنامه هفتگی شما (با کیفیت بالا):</span>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                بستن پیش‌نمایش
              </button>
            </div>

            <div className="bg-white rounded-xl p-2 max-h-72 overflow-y-auto flex justify-center">
              <img
                src={previewImage}
                alt="برنامه هفتگی کلینیک کنکور"
                className="w-full h-auto object-contain rounded-lg shadow-md"
              />
            </div>

            <div className="bg-cyan-950/60 border border-cyan-500/30 p-2.5 rounded-xl text-[11px] text-cyan-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>راهنمای ذخیره در گوشی:</strong> علاوه بر دانلود خودکار، می‌توانید <strong>انگشت خود را روی عکس بالا چند ثانیه نگه دارید</strong> و از منوی باز شده گزینه <strong>«بارگیری تصویر (Download Image)»</strong> یا <strong>«ذخیره تصویر»</strong> را لمس کنید تا مستقیماً به آلبوم عکس‌ها و گالری اضافه شود.
              </p>
            </div>
          </div>
        )}

        {/* Printable Sheet View */}
        <div className="printable-sheet bg-white text-slate-900 text-right font-sans p-2 sm:p-4 border border-slate-200 rounded-2xl print:border-none print:p-0">
          {/* Printable Header */}
          <div className="flex items-center justify-between border-b-2 border-indigo-600 pb-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl border border-indigo-200 p-0.5 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="کلینیک کنکور" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div>
                <h1 className="text-lg font-black text-indigo-950 tracking-tight">
                  پلنر تخصصی و برنامه مطالعاتی کلینیک کنکور
                </h1>
                <p className="text-[11px] text-slate-600">
                  سامانه اختصاصی برنامه‌ریزی ۸ پارت ۹۰ دقیقه‌ای روزانه · پشتیبانی تلگرام: Poshtibani_CliniCk_konkur2026@
                </p>
              </div>
            </div>

            <div className="text-left text-xs space-y-1">
              <div>
                <span className="text-slate-500 ml-1">عنوان برنامه:</span>
                <span className="font-bold text-slate-900">{headerInfo.weekNumber || 'برنامه هفتگی'}</span>
              </div>
              <div>
                <span className="text-slate-500 ml-1">بازه زمانی:</span>
                <span className="font-bold text-slate-900">
                  {toPersianDigits(headerInfo.startDate || '---')} تا {toPersianDigits(headerInfo.endDate || '---')}
                </span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full border-collapse text-center text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-800">
                  <th className="p-2 border-l border-slate-300 w-28 font-black">روز هفته</th>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num, idx) => (
                    <th key={num} className="p-1.5 border-l border-slate-300 last:border-l-0 w-[11.5%] font-bold">
                      <div className="text-[11px] text-indigo-950 font-black">پارت {toPersianDigits(num)}</div>
                      <div className="text-[9px] text-slate-500 font-mono">
                        {toPersianDigits(partTimes[idx] || `پارت ${num}`)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map((day) => (
                  <tr key={day.dayId} className="border-b border-slate-200 min-h-[46px]">
                    <td className="p-2 border-l border-slate-300 bg-slate-50 font-bold text-slate-900 text-xs text-right align-middle">
                      <div>{day.dayName}</div>
                      {day.dateStr && (
                        <div className="text-[10px] text-slate-500 font-mono">{toPersianDigits(day.dateStr)}</div>
                      )}
                    </td>

                    {day.parts.map((p) => {
                      const cfg = p.subject ? SUBJECT_CONFIGS[p.subject as keyof typeof SUBJECT_CONFIGS] : null;
                      return (
                        <td
                          key={p.id}
                          className="p-1 border-l border-slate-200 last:border-l-0 text-right align-top text-[10px] h-12"
                        >
                          {cfg ? (
                            <div className="flex flex-col justify-between h-full space-y-0.5">
                              <div className="font-bold text-indigo-900 truncate">
                                {cfg.shortTitle}
                              </div>
                              <div className="text-slate-700 truncate leading-tight">
                                {p.topic || '---'}
                              </div>
                              <div className="flex items-center justify-between text-[9px] text-slate-500 pt-0.5 border-t border-slate-100">
                                <span>{toPersianDigits(p.targetTests || 0)} تست</span>
                                <span className={p.status === 'completed' ? 'text-emerald-700 font-bold' : ''}>
                                  {p.status === 'completed' ? '✓ کامل' : ''}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-slate-300 text-center py-2">---</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Printable Footer / Study Summary */}
          <div className="mt-3 pt-3 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-0.5">ساعات کل مطالعه برنامه‌ریزی‌شده:</span>
              <span className="font-black text-indigo-950 text-sm">
                {toPersianDigits(totalHours)} ساعت ({toPersianDigits(totalParts)} پارت ۹۰ دقیقه‌ای)
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-0.5">کل تست‌های هدف هفته:</span>
              <span className="font-black text-emerald-950 text-sm">
                {toPersianDigits(totalTests)} تست
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-0.5">جمله انگیزشی هفته:</span>
              <span className="text-[11px] text-slate-700 italic block leading-tight">
                {headerInfo.motivationalQuote}
              </span>
            </div>
          </div>

          {/* Signature / Notes bar for student & mentor */}
          <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
            <div>کلینیک کنکور | کانال رسمی تلگرام: CliniC_Konkur2026@</div>
            <div className="flex items-center gap-6">
              <span>امضای داوطلب: ............................</span>
              <span>امضای مشاور: ............................</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
