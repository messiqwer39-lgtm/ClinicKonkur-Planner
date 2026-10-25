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

  const sampleEnglishAppeal = `Subject: False Positive Appeal for Educational App com.clinickonkur.planner

Dear Google Play Protect Team,
Our educational Android application (Package Name: com.clinickonkur.planner) has been incorrectly flagged by Play Protect.
This app is a purely offline study planner, pomodoro timer, and curriculum tracker for Iranian high school and university entrance exam (Konkur) students.
It contains NO malware, NO ad fraud, NO harmful background services, and NO direct APK downloads.
The app is published on official Iranian app stores (Cafe Bazaar and Myket).
Please whitelist our application package and certificate in Google Play Protect definitions.

Package Name: com.clinickonkur.planner
App Name: Clinic Konkur Planner
Category: Education`;

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
                <span>راهنمای حل قطعی مشکل سپر امنیتی گوگل (Play Protect)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  حل تضمینی
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                مراحل دریافت تاییدیه رسمی گوگل و انتشار بدون اخطار در بازار و مایکت
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
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[70vh] text-xs">
          {/* Step 1: Actions done inside this update */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>اقدامات انجام‌شده در این نسخه برای رفع اخطار:</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside leading-relaxed">
              <li>
                <strong>حذف دکمه دانلود APK از اپلیکیشن:</strong> وجود لینک مستقیم دانلود فایل‌های نصبی درون اپلیکیشن یکی از اصلی‌ترین عوامل خطای مثبت کاذب (Trojan.Downloader) در سپر گوگل بود که به طور کامل پاکسازی شد.
              </li>
              <li>
                <strong>حذف فایل‌های نصبی سنگین از public:</strong> فایل‌های APK موجود در باندل حذف شدند تا ساختار وب‌اپ و اندروید کاملاً شفاف و استاندارد باشد.
              </li>
              <li>
                <strong>استانداردسازی مانیفست:</strong> حذف هرگونه دسترسی پرخطر یا غیرضروری (مانند نصب بسته‌ها یا دسترسی‌های حساس).
              </li>
            </ul>
          </div>

          {/* Step 2: Google Play Protect Appeal Portal */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <ExternalLink className="w-4 h-4" />
                <span>گام اول: ثبت درخواست بازبینی رسمی در پرتال گوگل (Appeal)</span>
              </div>
              <a
                href="https://support.google.com/googleplay/android-developer/contact/protectappeals"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] px-2.5 py-1 bg-cyan-500 text-slate-950 font-bold rounded-lg hover:bg-cyan-400 transition-colors flex items-center gap-1"
              >
                <span>باز کردن فرم بازبینی گوگل</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-slate-300 leading-relaxed">
              تمامی برنامه‌های ایرانی که در کافه بازار یا مایکت منتشر می‌شوند به دلیل جدید بودن امضای دیجیتال ممکن است ابتدا با اخطار مواجه شوند. گوگل یک فرم رسمی اختصاصی برای توسعه‌دهندگان دارد که با پر کردن آن ظرف ۱۲ تا ۴۸ ساعت، اپلیکیشن شما به عنوان امن تایید می‌شود:
            </p>

            {/* Copyable package info */}
            <div className="space-y-2 pt-1">
              <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Package Name (نام پکیج):</span>
                  <span className="font-mono text-cyan-300 font-bold">com.clinickonkur.planner</span>
                </div>
                <button
                  onClick={() => handleCopy('com.clinickonkur.planner', 'pkg')}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                  title="کپی نام پکیج"
                >
                  {copiedKey === 'pkg' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* English Description to submit */}
              <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold">متن آماده انگلیسی برای ثبت در فرم گوگل:</span>
                  <button
                    onClick={() => handleCopy(sampleEnglishAppeal, 'appeal')}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
                  >
                    {copiedKey === 'appeal' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>کپی متن درخواست</span>
                  </button>
                </div>
                <pre className="text-[10px] font-mono text-slate-300 bg-slate-950 p-2.5 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                  {sampleEnglishAppeal}
                </pre>
              </div>
            </div>
          </div>

          {/* Step 3: Proper APK Signing with V2 and V3 */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Terminal className="w-4 h-4" />
              <span>گام دوم: امضای نهایی فایل با طرح‌های امنیتی V2 و V3</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              برای جلوگیری از خطای نسخه‌های جدید اندروید (Android 11 به بالا)، دستور زیر را با <code className="text-cyan-300 font-mono">apksigner</code> اجرا کنید:
            </p>
            <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
              <code className="text-[10px] font-mono text-emerald-300 select-all overflow-x-auto">
                apksigner sign --ks clinicplan.keystore --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true app-release.apk
              </code>
              <button
                onClick={() =>
                  handleCopy(
                    'apksigner sign --ks clinicplan.keystore --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true app-release.apk',
                    'sign'
                  )
                }
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg shrink-0 mr-2"
                title="کپی دستور"
              >
                {copiedKey === 'sign' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Step 4: Submission to Bazaar and Myket */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>گام سوم: آپلود مستقیم در کافه بازار و مایکت</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              پس از امضا و ارسال فرم بازبینی، می‌توانید نسخه را مستقیماً در پنل توسعه‌دهندگان کافه بازار و مایکت بارگذاری کنید. کارشناسان بررسی بازار و مایکت پس از بررسی محتوای آموزشی اپ، وضعیت آن را به «منتشر شده» تغییر خواهند داد.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            فایل راهنمای متنی کامل نیز در پوشه <code className="text-cyan-300 font-mono">android-release</code> ذخیره شد.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs rounded-xl hover:from-emerald-400 hover:to-cyan-400 transition-colors"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};
