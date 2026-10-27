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
  Wrench,
  ShieldAlert,
} from 'lucide-react';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
                دانلود نسخه نهایی و رفع خطای «برنامه نصب نشد»
              </h2>
              <p className="text-xs text-slate-500">
                نسخه بازسازی‌شده ۲.۰.۰ با کد نسخه ۲۰۰ • سازگار با اندروید ۷ تا ۱۵ (سامسونگ، شیائومی، هوآوی)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-right">
          {/* Main Download Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Direct Local Download - Guaranteed Fresh Install */}
            <a
              href="/ClinicPlan-DirectInstall.apk"
              download="ClinicPlan-DirectInstall.apk"
              className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold flex flex-col justify-between shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-0.5 rounded bg-white/20 text-white font-bold">
                  پیشنهاد اصلی • نصب ۱۰۰٪ بدون تداخل
                </span>
                <Download className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm sm:text-base font-black block">
                  دانلود نسخه مستقیم (Direct Install)
                </span>
                <span className="text-xs text-emerald-100 font-mono mt-0.5 block">
                  بسته ir.clinickonkur.app • بدون ارور نصب
                </span>
              </div>
            </a>

            {/* Official Myket / Bazaar Package */}
            <a
              href="/ClinicPlan-v2.0.0.apk"
              download="ClinicPlan-v2.0.0.apk"
              className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex flex-col justify-between shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                  نسخه رسمی مایکت (v2.0.0)
                </span>
                <ExternalLink className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-sm sm:text-base font-black block">
                  دانلود نسخه استاندارد مایکت
                </span>
                <span className="text-xs text-slate-400 mt-0.5 block">
                  بسته com.clinickonkur.planner (کد ۲۰۰)
                </span>
              </div>
            </a>
          </div>

          {/* Third Option: Debug Signed APK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="/ClinicPlan-Debug.apk"
              download="ClinicPlan-Debug.apk"
              className="p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-950 font-bold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold block text-indigo-900">
                    نسخه ویژه با امضای Debug
                  </span>
                  <span className="text-[11px] text-indigo-700 block">
                    مخصوص گوشی‌هایی با محدودیت Knox یا امنیتی سختگیرانه
                  </span>
                </div>
              </div>
              <Download className="w-4 h-4 text-indigo-600 shrink-0" />
            </a>

            <a
              href="/ClinicPlan-v2.0.0-Release.zip"
              download="ClinicPlan-v2.0.0-Release.zip"
              className="p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-950 font-bold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileArchive className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold block text-purple-900">
                    دانلود بسته زیپ کامل (ZIP)
                  </span>
                  <span className="text-[11px] text-purple-700 block">
                    شامل هر ۳ نسخه APK بومی
                  </span>
                </div>
              </div>
              <Download className="w-4 h-4 text-purple-600 shrink-0" />
            </a>
          </div>

          {/* Step-by-Step Instructions to solve "App not installed" */}
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>چرا ارور «برنامه نصب نشد» (App not installed) رخ می‌دهد و راه حل چیست؟</span>
            </div>

            <p className="text-xs text-amber-900/90 leading-relaxed">
              اگر هنگام زدن دکمه نصب با پیام «برنامه نصب نشد» مواجه می‌شوید، دلیل آن یکی از ۴ مورد زیر است که در کمتر از ۲۰ ثانیه برطرف می‌شود:
            </p>

            <div className="space-y-2.5 text-xs">
              {/* Step 1 */}
              <div className="flex items-start gap-2 bg-white/90 p-3 rounded-xl border border-amber-200">
                <RefreshCw className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">۱. حذف نسخه قبلی (مهم‌ترین و شایع‌ترین دلیل):</strong>
                  <span className="text-slate-600 leading-relaxed">
                    اگر قبلاً نسخه‌ای از کلینیک پلن را روی گوشی خود نصب کرده‌اید (یا نصب آن در دفعه قبل نصفه‌نیمه مانده است)، اندروید به دلیل تداخل امضا مانع نصب نسخه جدید می‌شود. <strong>ابتدا برنامه قبلی را کامل حذف (Uninstall) کنید</strong> و سپس فایل جدید را نصب نمایید. همچنین پیشنهاد می‌کنیم «نسخه مستقیم (Direct Install)» را نصب کنید که شناسه بسته‌ای کاملاً جدید دارد و هرگز تداخل نمی‌کند.
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-2 bg-white/90 p-3 rounded-xl border border-amber-200">
                <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">۲. سپر ایمنی گوگل‌پلی (Play Protect) در سامسونگ و شیائومی:</strong>
                  <span className="text-slate-600 leading-relaxed">
                    هنگام نصب فایل، اگر کادری با عنوان «سپر ایمنی Google Play این برنامه را مسدود کرد» باز شد، روی گزینه <strong>«جزئیات بیشتر» (More details)</strong> بزنید و سپس <strong>«به هر حال نصب شود» (Install anyway)</strong> را انتخاب کنید. در صورتی که دکمه را نزنید، گوشی پیام «برنامه نصب نشد» می‌دهد.
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-2 bg-white/90 p-3 rounded-xl border border-amber-200">
                <FolderOpen className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">۳. باز کردن فایل از طریق «فایل‌های من» (Samsung My Files):</strong>
                  <span className="text-slate-600 leading-relaxed">
                    فایل APK را مستقیماً از داخل مرورگر یا تلگرام باز نکنید. وارد برنامه <strong>My Files (فایل‌های من)</strong> گوشی خود شده، وارد پوشه <strong>Downloads</strong> شوید و فایل APK دانلود شده را لمس کنید تا نصب آغاز شود.
                  </span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-2 bg-white/90 p-3 rounded-xl border border-amber-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">۴. دسترسی نصب برنامه‌های ناشناخته (Install Unknown Apps):</strong>
                  <span className="text-slate-600 leading-relaxed">
                    در گوشی خود به مسیر <strong>تنظیمات &gt; برنامه‌ها &gt; مدیریت فایل (یا My Files) &gt; نصب برنامه‌های ناشناخته</strong> رفته و گزینه «اجازه از این منبع» را روشن کنید.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            امضای رسمی v1 + v2 + v3 تایید شد
          </span>
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
