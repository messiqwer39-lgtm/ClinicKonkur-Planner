import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  X,
  FileText,
  Key,
  Info,
  Terminal,
  Download,
  AlertTriangle,
} from 'lucide-react';

interface PlayProtectGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayProtectGuideModal: React.FC<PlayProtectGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const APK_SHA256 = 'b071acda8e8853c45d2f05dad8530c7ed8220125327ec05eb5b3f7b13ee6fae0';
  const PACKAGE_NAME = 'com.clinickonkur.planner';
  const DEVELOPER_NAME = 'ClinicKonkur';
  const GITHUB_APK_URL = 'https://github.com/messiqwer39-lgtm/ClinicKonkur-Planner/releases/download/v1.3.0/ClinicPlan-v1.3.0.apk';

  const appealText = `This is an educational study planner application for Iranian high school and university entrance exam (Konkur) students. It contains NO malware, NO ad fraud, NO deceptive background services, and NO harmful downloaders. It is an offline productivity tool published on Cafe Bazaar and Myket. Please verify and whitelist our application package and certificate in Google Play Protect. Thank you.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div
        className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl max-w-2xl w-full text-slate-100 shadow-2xl shadow-emerald-500/20 overflow-hidden flex flex-col my-auto relative ring-4 ring-emerald-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>اطلاعات دقیق فرم بازبینی سپر امنیتی گوگل</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  حل اخطار
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                مقادیر زیر را به ترتیب در فرم گوگل کپی و جای‌گذاری کنید
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[72vh] text-xs">
          {/* Warning resolution tip */}
          <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-3.5 flex items-start gap-2.5 text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>دلیل خطای Please enter a valid SHA256 Hash:</strong>
              <p className="text-slate-300 text-[11px] mt-0.5">
                در فیلد SHA256 نباید مسیر فایل را بنویسید؛ بلکه باید یک کد ۶۴ کاراکتری عددی-حروفی (هش فایل APK) وارد شود که در زیر دکمه کپی فوری آن قرار گرفته است.
              </p>
            </div>
          </div>

          {/* Form Fields Step-by-Step Box */}
          <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-cyan-500/30 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-sm text-cyan-300">
                مقادیر کادر به کادر فرم گوگل (Google Appeal Form):
              </span>
              <a
                href="https://support.google.com/googleplay/android-developer/contact/protectappeals"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] px-2.5 py-1 bg-cyan-500 text-slate-950 font-black rounded-lg hover:bg-cyan-400 transition-colors flex items-center gap-1"
              >
                <span>باز کردن فرم گوگل</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Field 1: Email */}
            <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">۱. Email address *:</span>
                <span className="font-mono text-slate-200 font-bold select-all">maedeh.abdollahi85@gmail.com</span>
              </div>
              <button
                onClick={() => handleCopy('maedeh.abdollahi85@gmail.com', 'email')}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1"
              >
                {copiedKey === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>کپی</span>
              </button>
            </div>

            {/* Field 2: Developer Name */}
            <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">۲. Developer name (نام توسعه‌دهنده):</span>
                <span className="font-mono text-slate-200 font-bold select-all">{DEVELOPER_NAME}</span>
              </div>
              <button
                onClick={() => handleCopy(DEVELOPER_NAME, 'devName')}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1"
              >
                {copiedKey === 'devName' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>کپی</span>
              </button>
            </div>

            {/* Field 3: Package Name */}
            <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">۳. Application package name *:</span>
                <span className="font-mono text-cyan-300 font-bold select-all">{PACKAGE_NAME}</span>
              </div>
              <button
                onClick={() => handleCopy(PACKAGE_NAME, 'pkg')}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1"
              >
                {copiedKey === 'pkg' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>کپی</span>
              </button>
            </div>

            {/* Field 4: SHA256 Hash of APK (CRITICAL!) */}
            <div className="bg-emerald-950/40 rounded-xl p-3.5 border-2 border-emerald-500/60 shadow-inner space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-emerald-300 font-black flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-emerald-400" />
                  <span>۴. SHA256 Hash of the apk of the uploaded file on Virus Total * (کلیدی):</span>
                </span>
                <button
                  onClick={() => handleCopy(APK_SHA256, 'sha256')}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1 shadow-sm"
                >
                  {copiedKey === 'sha256' ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                  <span>کپی هش ۶۴ کاراکتری</span>
                </button>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300 break-all select-all">
                {APK_SHA256}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                این هش دقیقاً برابر با اثر انگشت فایل APK نسخه ۱.۳.۰ است که در گیت‌هاب قرار گرفته است.
              </p>
            </div>

            {/* Field 5: Additional Info (English Description) */}
            <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 block mb-0.5">۵. Additional information to support your appeal *:</span>
                <button
                  onClick={() => handleCopy(appealText, 'appeal')}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1"
                >
                  {copiedKey === 'appeal' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>کپی متن انگلیسی</span>
                </button>
              </div>
              <pre className="text-[10px] font-mono text-slate-300 bg-slate-950 p-2.5 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                {appealText}
              </pre>
            </div>
          </div>

          {/* GitHub APK Download Release Box */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">
                فایل نصبی APK نسخه جدید روی گیت‌هاب قرار گرفت:
              </span>
              <span className="text-[11px] text-slate-400">
                می‌توانید مستقیم این فایل را دانلود کرده و در کافه بازار، مایکت یا VirusTotal آپلود کنید.
              </span>
            </div>
            <a
              href={GITHUB_APK_URL}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>دانلود ClinicPlan-v1.3.0.apk</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            پس از ارسال فرم، ظرف ۱۲ تا ۴۸ ساعت اخطار گوگل پلی پروتکت برداشته می‌شود.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs rounded-xl hover:from-emerald-400 hover:to-cyan-400 transition-colors"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};
