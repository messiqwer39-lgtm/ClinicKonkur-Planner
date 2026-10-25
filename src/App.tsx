import React, { useState, useEffect } from 'react';
import { Navbar, AppTab } from './components/Navbar';
import { HeaderSection } from './components/HeaderSection';
import { WeeklyScheduleTable } from './components/WeeklyScheduleTable';
import { SubjectsOverviewSection } from './components/SubjectsOverviewSection';
import { ReportCardPage } from './components/ReportCardPage';
import { PartEditModal } from './components/PartEditModal';
import { PartTimeEditModal } from './components/PartTimeEditModal';
import { StudyTimerModal } from './components/StudyTimerModal';
import { ScreenshotsModal } from './components/ScreenshotsModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CounselingArticlesPage } from './components/CounselingArticlesPage';
import { MajorsPage } from './components/MajorsPage';
import { PomodoroSection } from './components/PomodoroSection';
import { TestSourcesPage } from './components/TestSourcesPage';
import { DailyProgressWidget } from './components/DailyProgressWidget';
import { KonkurCountdown } from './components/KonkurCountdown';
import { ClinicBanner } from './components/ClinicBanner';
import { PrintScheduleModal } from './components/PrintScheduleModal';
import { RotateScreenPrompt } from './components/RotateScreenPrompt';
import { AppUserGuideModal } from './components/AppUserGuideModal';

import {
  DaySchedule,
  PartSlot,
  SubjectOverviewItem,
  WeeklyHeaderInfo,
  DailyReportRow,
  DAYS_INFO,
  PartStatus,
} from './types/planner';
import {
  loadWeeklyHeader,
  saveWeeklyHeader,
  loadSchedule,
  saveSchedule,
  loadOverview,
  saveOverview,
  loadReports,
  saveReports,
  loadPartTimes,
  savePartTimes,
  generateInitialSchedule,
  INITIAL_HEADER,
  INITIAL_OVERVIEW,
  INITIAL_REPORTS,
} from './utils/storage';
import { playChime } from './utils/helpers';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Navigation tabs: 'schedule' | 'overview' | 'report' | 'pomodoro' | 'articles' | 'majors' | 'sources'
  const [activeTab, setActiveTab] = useState<AppTab>('schedule');

  // Core Data States
  const [headerInfo, setHeaderInfo] = useState<WeeklyHeaderInfo>(loadWeeklyHeader);
  const [schedule, setSchedule] = useState<DaySchedule[]>(loadSchedule);
  const [overviewList, setOverviewList] = useState<SubjectOverviewItem[]>(loadOverview);
  const [reports, setReports] = useState<DailyReportRow[]>(loadReports);
  const [partTimes, setPartTimes] = useState<string[]>(loadPartTimes);

  // Modals state
  const [selectedSlotData, setSelectedSlotData] = useState<{
    dayName: string;
    slot: PartSlot;
  } | null>(null);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [timerActiveSlot, setTimerActiveSlot] = useState<PartSlot | null>(null);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isScreenshotsModalOpen, setIsScreenshotsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Welcome Screen state: show on startup unless dismissed by user
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hide_welcome_screen_v1') !== 'true';
    } catch {
      return true;
    }
  });

  // Auto-save to LocalStorage
  useEffect(() => {
    saveWeeklyHeader(headerInfo);
  }, [headerInfo]);

  useEffect(() => {
    saveSchedule(schedule);
  }, [schedule]);

  useEffect(() => {
    saveOverview(overviewList);
  }, [overviewList]);

  useEffect(() => {
    saveReports(reports);
  }, [reports]);

  useEffect(() => {
    savePartTimes(partTimes);
  }, [partTimes]);

  // Aggregate Metrics for Header
  let totalPartsCount = 0;
  let completedPartsCount = 0;
  let filledPartsCount = 0;
  let totalPlannedTests = 0;

  schedule.forEach((day) => {
    day.parts.forEach((part) => {
      totalPartsCount++;
      if (part.subject) {
        filledPartsCount++;
        totalPlannedTests += part.targetTests || 0;
      }
      if (part.status === 'completed') {
        completedPartsCount++;
      }
    });
  });

  const totalPlannedHours = filledPartsCount * 1.5;
  const completedHours = completedPartsCount * 1.5;

  // Handlers
  const handleOpenPartModal = (dayName: string, slot: PartSlot) => {
    setSelectedSlotData({ dayName, slot });
  };

  const handleSavePartSlot = (updatedSlot: PartSlot) => {
    const updatedSchedule = schedule.map((day) => {
      const nextParts = day.parts.map((p) => (p.id === updatedSlot.id ? updatedSlot : p));
      return { ...day, parts: nextParts };
    });
    setSchedule(updatedSchedule);
  };

  const handleQuickToggleStatus = (dayId: string, partId: string) => {
    const updated = schedule.map((day) => {
      if (day.dayId === dayId) {
        const nextParts = day.parts.map((p) => {
          if (p.id === partId) {
            const nextStatus: PartStatus = p.status === 'completed' ? 'planned' : 'completed';
            if (nextStatus === 'completed') {
              playChime('success');
              confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
            }
            return {
              ...p,
              status: nextStatus,
              completedTests: nextStatus === 'completed' ? p.targetTests : 0,
            };
          }
          return p;
        });
        return { ...day, parts: nextParts };
      }
      return day;
    });
    setSchedule(updated);
  };

  const handleSavePartTimes = (newTimes: string[]) => {
    setPartTimes(newTimes);
    const updated = schedule.map((day) => {
      const nextParts = day.parts.map((p, idx) => ({
        ...p,
        timeRange: newTimes[idx] || p.timeRange,
      }));
      return { ...day, parts: nextParts };
    });
    setSchedule(updated);
  };

  const handleResetData = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید داده‌های برنامه ریزی را به حالت پیش‌فرض بازگردانید؟')) {
      setHeaderInfo(INITIAL_HEADER);
      setSchedule(generateInitialSchedule(partTimes));
      setOverviewList(INITIAL_OVERVIEW);
      setReports(INITIAL_REPORTS);
      playChime('alert');
    }
  };

  const handleLoadSample = () => {
    setSchedule(generateInitialSchedule(partTimes));
    setOverviewList(INITIAL_OVERVIEW);
    setReports(INITIAL_REPORTS);
    playChime('success');
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  };

  const handleStartTimer = (slot: PartSlot) => {
    setTimerActiveSlot(slot);
    setIsTimerModalOpen(true);
  };

  const handleMarkSlotCompletedFromTimer = (slotId: string) => {
    const updated = schedule.map((day) => {
      const nextParts = day.parts.map((p) => {
        if (p.id === slotId) {
          return {
            ...p,
            status: 'completed' as PartStatus,
            completedTests: p.targetTests || p.completedTests || 0,
          };
        }
        return p;
      });
      return { ...day, parts: nextParts };
    });
    setSchedule(updated);
    playChime('success');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  const handleAddPomodoroTimeToReport = (minutes: number) => {
    const hours = Number((minutes / 60).toFixed(1));
    const todayId = DAYS_INFO[new Date().getDay() === 6 ? 0 : (new Date().getDay() + 1) % 7].id;
    const updatedReports = reports.map((r) => {
      if (r.dayId === todayId) {
        const nextTotal = Number((r.totalHours + hours).toFixed(1));
        const nextTesting = Number((r.testingHours + hours).toFixed(1));
        return {
          ...r,
          totalHours: nextTotal,
          testingHours: nextTesting,
        };
      }
      return r;
    });
    setReports(updatedReports);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Promotional Announcement Bar */}
      <ClinicBanner variant="top-strip" onOpenWelcome={() => setIsWelcomeOpen(true)} />

      {/* Main Sticky Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPrint={() => setIsPrintModalOpen(true)}
        onReset={handleResetData}
        onLoadSample={handleLoadSample}
        onOpenScreenshots={() => setIsScreenshotsModalOpen(true)}
        onOpenWelcome={() => setIsWelcomeOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        weekTitle={headerInfo.weekNumber}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-8 py-5">
        <AnimatePresence mode="wait">
          {/* TAB 1: Weekly Schedule (جدول برنامه‌ریزی هفتگی) */}
          {activeTab === 'schedule' && (
            <motion.div
              key="tab-schedule"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {/* Gentle prompt suggesting landscape orientation on mobile */}
              <RotateScreenPrompt />

              {/* Animated Konkur Countdown Timer to 10 Tir 1406 */}
              <KonkurCountdown />

              {/* NEW WIDGET: Daily Progress Summary (دایره‌های پیشرفت پارت‌ها، تست‌ها و ساعت مطالعه) */}
              <DailyProgressWidget
                schedule={schedule}
                onOpenPartModal={handleOpenPartModal}
              />

              {/* Top Header Section: Date editing and quote */}
              <HeaderSection
                headerInfo={headerInfo}
                onChangeHeader={setHeaderInfo}
                totalPlannedHours={totalPlannedHours}
                completedHours={completedHours}
                totalPlannedTests={totalPlannedTests}
                completedPartsCount={completedPartsCount}
                totalPartsCount={totalPartsCount}
              />

              {/* The 7-day x 8-part Weekly Schedule Table with Part Times on Top */}
              <WeeklyScheduleTable
                schedule={schedule}
                partTimes={partTimes}
                onOpenPartModal={handleOpenPartModal}
                onOpenTimeModal={() => setIsTimeModalOpen(true)}
                onQuickToggleStatus={handleQuickToggleStatus}
                onStartTimer={handleStartTimer}
                onOpenPrintModal={() => setIsPrintModalOpen(true)}
              />

              {/* Featured Clinic Konkur Promotional Card Banner */}
              <ClinicBanner variant="card" onOpenWelcome={() => setIsWelcomeOpen(true)} />

              {/* Section alongside the table: Weekly Overview Boxes */}
              <div className="mt-8">
                <SubjectsOverviewSection
                  overviewList={overviewList}
                  onChangeOverview={setOverviewList}
                  schedule={schedule}
                />
              </div>

              {/* Footer Banner */}
              <ClinicBanner variant="footer" onOpenWelcome={() => setIsWelcomeOpen(true)} />
            </motion.div>
          )}

          {/* TAB 2: Dedicated Overview (نگاه کلی دروس اختصاصی و عمومی) */}
          {activeTab === 'overview' && (
            <motion.div
              key="tab-overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <KonkurCountdown />
              <HeaderSection
                headerInfo={headerInfo}
                onChangeHeader={setHeaderInfo}
                totalPlannedHours={totalPlannedHours}
                completedHours={completedHours}
                totalPlannedTests={totalPlannedTests}
                completedPartsCount={completedPartsCount}
                totalPartsCount={totalPartsCount}
              />
              <SubjectsOverviewSection
                overviewList={overviewList}
                onChangeOverview={setOverviewList}
                schedule={schedule}
              />
              <ClinicBanner variant="footer" onOpenWelcome={() => setIsWelcomeOpen(true)} />
            </motion.div>
          )}

          {/* TAB 3: Study Report Table (صفحه مدیریت گزارش کار) */}
          {activeTab === 'report' && (
            <motion.div
              key="tab-report"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <ReportCardPage
                reports={reports}
                onUpdateReport={setReports}
                onPrint={() => setIsPrintModalOpen(true)}
              />
              <ClinicBanner variant="footer" onOpenWelcome={() => setIsWelcomeOpen(true)} />
            </motion.div>
          )}

          {/* TAB 4: Pomodoro Focus Study Technique (تکنیک مطالعه پومودورو) */}
          {activeTab === 'pomodoro' && (
            <motion.div
              key="tab-pomodoro"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <PomodoroSection
                onAddStudyTimeToReport={handleAddPomodoroTimeToReport}
              />
              <ClinicBanner variant="compact" onOpenWelcome={() => setIsWelcomeOpen(true)} />
            </motion.div>
          )}

          {/* TAB 5: Counseling Articles & Study Quality Tips (۱۸ مقاله مشاوره‌ای) */}
          {activeTab === 'articles' && (
            <motion.div
              key="tab-articles"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <CounselingArticlesPage />
              <ClinicBanner variant="footer" onOpenWelcome={() => setIsWelcomeOpen(true)} />
            </motion.div>
          )}

          {/* TAB 6: Test Sources Guide (بانک منابع تستی کنکور) */}
          {activeTab === 'sources' && (
            <motion.div
              key="tab-sources"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <TestSourcesPage />
              <ClinicBanner variant="footer" onOpenWelcome={() => setIsWelcomeOpen(true)} />
            </motion.div>
          )}

          {/* TAB 7: Majors & Top Careers Guide (معرفی رشته‌ها و شغل‌ها) */}
          {activeTab === 'majors' && (
            <motion.div
              key="tab-majors"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <MajorsPage />
              <ClinicBanner variant="footer" onOpenWelcome={() => setIsWelcomeOpen(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-400 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="لوگو" className="w-5 h-5 rounded-full" />
            <span className="font-bold text-slate-200">
              پلنر کلینیک کنکور · سامانه برنامه‌ریزی تخصصی و مشاوره کنکور
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-cyan-400 flex-wrap justify-center">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-cyan-300 hover:underline font-bold"
            >
              📖 راهنمای کار با برنامه
            </button>
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="text-indigo-300 hover:underline font-bold"
            >
              🖨️ چاپ و ذخیره تصویر برنامه (A4)
            </button>
            <a
              href="/Google-Play-Protect-Appeal-Kit.zip"
              download="Google-Play-Protect-Appeal-Kit.zip"
              className="text-emerald-400 hover:underline font-bold"
              title="دانلود بسته ZIP مدارک بازبینی سپر گوگل و انتشار در بازار و مایکت"
            >
              📦 بسته ZIP فرم بازبینی گوگل
            </a>
            <a
              href="https://t.me/CliniC_Konkur2026"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              کانال تلگرام: CliniC_Konkur2026@
            </a>
            <a
              href="https://t.me/Poshtibani_CliniCk_konkur2026"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              رزرو مشاوره: Poshtibani_CliniCk_konkur2026@
            </a>
          </div>
        </div>
      </footer>

      {/* Part Edit Modal */}
      {selectedSlotData && (
        <PartEditModal
          isOpen={!!selectedSlotData}
          dayName={selectedSlotData.dayName}
          slot={selectedSlotData.slot}
          onClose={() => setSelectedSlotData(null)}
          onSave={handleSavePartSlot}
          onStartTimer={handleStartTimer}
        />
      )}

      {/* Part Times Config Modal */}
      <PartTimeEditModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        currentPartTimes={partTimes}
        onSave={handleSavePartTimes}
      />

      {/* Study 90-minute Timer Modal */}
      <StudyTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        activeSlot={timerActiveSlot}
        onMarkSlotCompleted={handleMarkSlotCompletedFromTimer}
      />

      {/* Print & Offline Schedule Image Modal */}
      <PrintScheduleModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        schedule={schedule}
        headerInfo={headerInfo}
        partTimes={partTimes}
      />

      {/* App User Guide Modal */}
      <AppUserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Screenshots and ZIP Download Gallery Modal */}
      <ScreenshotsModal
        isOpen={isScreenshotsModalOpen}
        onClose={() => setIsScreenshotsModalOpen(false)}
      />

      {/* Welcome Screen & Clinic Konkur Promo Modal */}
      <WelcomeScreen
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        onEnter={() => setIsWelcomeOpen(false)}
      />
    </div>
  );
}
