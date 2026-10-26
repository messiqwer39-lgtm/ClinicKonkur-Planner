import React, { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  Clock,
  Printer,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Sparkles,
  Flame,
  Download,
  Info,
  WifiOff,
  BookMarked,
  HelpCircle,
  Smartphone,
} from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';

export type AppTab = 'schedule' | 'overview' | 'report' | 'pomodoro' | 'articles' | 'majors' | 'sources';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onPrint: () => void;
  onReset: () => void;
  onLoadSample: () => void;
  onOpenScreenshots: () => void;
  onOpenWelcome: () => void;
  onOpenGuide: () => void;
  onOpenDownloadApk?: () => void;
  weekTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onPrint,
  onReset,
  onLoadSample,
  onOpenScreenshots,
  onOpenWelcome,
  onOpenGuide,
  onOpenDownloadApk,
  weekTitle,
}) => {
  const { isInstallable, install, isIOS } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showIOSModal, setShowIOSModal] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 shadow-md transition-all no-print">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-3">
        {/* Zone 1: Clinic Konkur Logo & Title */}
        <div className="flex items-center justify-between w-full xl:w-auto shrink-0 gap-3">
          <div
            onClick={onOpenWelcome}
            className="flex items-center gap-3 cursor-pointer group select-none"
            title="کلیک برای مشاهده معرفی و راه‌های ارتباطی کلینیک کنکور"
          >
            <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-blue-500 to-amber-400 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="لوگو کلینیک کنکور"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-amber-300 tracking-tight">
                  کلینیک پلن
                </span>
                {!isOnline && (
                  <span className="flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    <WifiOff className="w-2.5 h-2.5" />
                    <span>آفلاین</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 truncate max-w-[220px] block">
                {weekTitle || 'برنامه‌ریزی و مشاوره تخصصی کنکور'}
              </span>
            </div>
          </div>

          {/* Quick Action Mobile Icons */}
          <div className="flex items-center gap-1 xl:hidden">
            {onOpenDownloadApk && (
              <button
                onClick={onOpenDownloadApk}
                className="p-2 text-emerald-300 hover:text-white rounded-lg bg-emerald-950/70 border border-emerald-700/60"
                title="دانلود فایل نصبی APK اندروید"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
              </button>
            )}
            <button
              onClick={onOpenGuide}
              className="p-2 text-cyan-300 hover:text-white rounded-lg bg-slate-800 border border-slate-700"
              title="راهنمای کار با اپلیکیشن"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={onOpenWelcome}
              className="p-2 text-cyan-400 hover:text-white rounded-lg bg-slate-800 border border-slate-700"
              title="معرفی و رزرو مشاوره"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={onPrint}
              aria-label="چاپ و دانلود عکس برنامه"
              className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800 border border-slate-700"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Segmented Tabs */}
        <nav className="flex items-center gap-1 p-1 bg-slate-800/90 rounded-2xl w-full xl:w-auto overflow-x-auto shrink-0 border border-slate-700/60">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'schedule'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>جدول برنامه‌ریزی هفتگی</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>نگاه کلی دروس</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'report'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>مدیریت گزارش کار</span>
          </button>

          <button
            onClick={() => setActiveTab('pomodoro')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'pomodoro'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>پومودورو کنکور</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'articles'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>نکات مشاوره‌ای (۱۸ مقاله)</span>
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'sources'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-emerald-400" />
            <span>منابع تستی پیشنهادی</span>
          </button>

          <button
            onClick={() => setActiveTab('majors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'majors'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>معرفی رشته‌ها و شغل‌ها</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Android PWA Install */}
        <div className="hidden xl:flex items-center gap-2 shrink-0">
          {/* App User Guide button */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-xl shadow-xs transition-all hover:scale-105 whitespace-nowrap"
            title="راهنمای جامع کار با امکانات و ویژگی‌های برنامه"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>راهنمای کار با اپ</span>
          </button>

          {/* PWA Install Button for Android / Desktop */}
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-amber-400 hover:from-cyan-300 hover:to-amber-300 rounded-xl shadow-xs transition-transform hover:scale-105 whitespace-nowrap"
              title="نصب وب‌اپلیکیشن روی دستگاه"
            >
              <Download className="w-3.5 h-3.5" />
              <span>نصب PWA</span>
            </button>
          )}

          {isIOS && (
            <button
              onClick={() => setShowIOSModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 rounded-xl whitespace-nowrap"
            >
              <span>نصب در iOS</span>
            </button>
          )}

          {onOpenDownloadApk && (
            <button
              onClick={onOpenDownloadApk}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-xl transition-colors whitespace-nowrap shadow-xs"
              title="دانلود فایل نصبی APK اندروید v1.4.0"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>دانلود APK</span>
            </button>
          )}

          <button
            onClick={onOpenWelcome}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-colors whitespace-nowrap"
            title="مشاهده اطلاعات رزرو مشاوره کلینیک کنکور"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>کلینیک کنکور</span>
          </button>

          <button
            onClick={onOpenScreenshots}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl transition-colors whitespace-nowrap"
            title="دانلود عکس‌ها و فایل ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span>دانلود ZIP</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl shadow-xs transition-all whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>چاپ A4</span>
          </button>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xs w-full text-right text-xs text-slate-200 space-y-3">
            <h3 className="font-bold text-sm text-cyan-400">نصب در آیفون و آیپد:</h3>
            <p className="leading-relaxed text-slate-300">
              ۱. روی دکمه <strong>Share</strong> (اشتراک‌گذاری در نوار پایین مرورگر سافاری) بزنید.<br />
              ۲. به پایین اسکرول کرده و گزینه <strong>Add to Home Screen</strong> را انتخاب کنید.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-white"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
