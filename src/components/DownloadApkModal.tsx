import React from 'react';
import {
  X,
  Download,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileArchive,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const APK_FILENAME = 'ClinicPlan-v1.4.0.apk';
  const APK_SIZE = '۵.۷۹ مگابایت';
  const GITHUB_RELEASE_APK =
    'https://github.com/messiqwer39-lgtm/ClinicKonkur-Planner/releases/download/v1.4.0/ClinicPlan-v1.4.0.apk';
  const GITHUB_RELEASE_ZIP =
    'https://github.com/messiqwer39-lgtm/ClinicKonkur-Planner/releases/download/v1.4.0/ClinicPlan-v1.4.0-Release.zip';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                دانلود مستقیم APK و رفع خطای «تجزیه بسته» در سامسونگ
              </h2>
              <p className="text-xs text-slate-500">
                نسخه رسمی v1.4.0 (کد نسخه ۴) - تاییدشده برای انتشار در مایکت و بازار
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-right">
          {/* Main Download Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Direct Local Download */}
            <a
              href="/ClinicPlan-Final.apk"
              download="ClinicPlan-v1.4.0-Final.apk"
              className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold flex flex-col justify-between shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-0.5 rounded bg-white/20 text-white font-bold">
                  نسخه نهایی و تضمین‌شده
                </span>
                <Download className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm sm:text-base font-black block">
                  دانلود مستقیم فایل APK (تضمین نصب)
                </span>
                <span className="text-xs text-emerald-100 font-mono mt-0.5 block">
                  حجم دقیق: {APK_SIZE} • سازگار با همه گوشی‌ها
                </span>
              </div>
            </a>

            {/* GitHub Official Release */}
            <a
              href={GITHUB_RELEASE_APK}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex flex-col justify-between shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                  GitHub Release v1.4.0
                </span>
                <ExternalLink className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-sm sm:text-base font-black block">
                  دانلود از سرور گیت‌هاب (CDN رسمی)
                </span>
                <span className="text-xs text-slate-400 mt-0.5 block">
                  دانلود مستقیم و پرسرعت سرورهای ابری
                </span>
              </div>
            </a>
          </div>

          {/* ZIP Bundle Option */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <FileArchive className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  دانلود بسته زیپ کامل (فایل APK + راهنمای جامع انتشار مایکت)
                </span>
                <span className="text-[11px] text-slate-500">
                  فرمت .zip مناسب کامپیوتر یا مدیریت فایل
                </span>
              </div>
            </div>
            <a
              href="/ClinicPlan-v1.4.0-Release.zip"
              download="ClinicPlan-v1.4.0-Release.zip"
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs whitespace-nowrap shadow-xs"
            >
              دانلود ZIP
            </a>
          </div>

          {/* Guide for Parse Error Resolution */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>راهنمای رفع قطعی خطای «مشکلی در تجزیه بسته وجود دارد» (Parse Error)</span>
            </div>

            <p className="text-xs text-amber-900/90 leading-relaxed">
              این خطا در گوشی‌های سامسونگ معمولاً به یکی از ۴ دلیل ساده زیر رخ می‌دهد که به‌راحتی برطرف می‌شود:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">۱. بررسی حجم فایل پس از دانلود:</strong>
                  <span className="text-slate-600">
                    حجم فایل APK باید دقیقاً حدود <strong>۵.۷۹ مگابایت</strong> باشد. در صورتی که دانلود ناقص انجام شده باشد (مثلاً چندصد کیلوبایت)، اندروید ارور تجزیه بسته می‌دهد. در صورت نیاز فایل را مجدداً دانلود کنید.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200">
                <FolderOpen className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">۲. باز کردن فایل از «فایل‌های من» (Samsung My Files):</strong>
                  <span className="text-slate-600">
                    به جای باز کردن مستقیم از پیام‌رسان‌ها یا نوتیفیکیشن مرورگر، وارد برنامه <strong>My Files (فایل‌های من)</strong> سامسونگ شده، پوشه <strong>Downloads</strong> را باز کرده و روی فایل <code className="bg-slate-100 px-1 rounded text-indigo-700">ClinicPlan-v1.4.0.apk</code> بزنید.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200">
                <RefreshCw className="w-4 h-4 text-cyan-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">۳. حذف نسخه قدیمی‌تر (در صورت نصب قبلی):</strong>
                  <span className="text-slate-600">
                    اگر نسخه قدیمی‌تری از برنامه روی گوشی شما نصب است، ابتدا آن را لغو نصب (Uninstall) کنید و سپس فایل نسخه ۱.۴.۰ جدید را نصب فرمایید تا با تداخل امضا مواجه نشوید.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200">
                <ShieldCheck className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">۴. فعال‌سازی «نصب برنامه‌های ناشناخته» (Unknown Sources):</strong>
                  <span className="text-slate-600">
                    در تنظیمات سامسونگ به مسیر <strong>تنظیمات &gt; برنامه‌ها &gt; مدیریت فایل (My Files) یا Chrome &gt; نصب برنامه‌های ناشناخته</strong> رفته و گزینه «اجازه از این منبع» را روشن کنید.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>کد بسته: <code className="font-mono text-slate-700">com.clinickonkur.planner</code></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
