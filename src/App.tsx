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

export default function App() {
  // Navigation tabs: 'schedule' | 'overview' | 'report' | 'pomodoro' | 'articles' | 'majors'
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
            status: 'completed' as const,
            completedTests: p.targetTests,
          };
        }
        return p;
      });
      return { ...day, parts: nextParts };
    });
    setSchedule(updated);
  };

  const handleResetSchedule = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید تمام پارت‌های جدول را برای شروع برنامه جدید پاک کنید؟')) {
      const emptySchedule: DaySchedule[] = DAYS_INFO.map((d) => ({
        dayId: d.id,
        dayName: d.name,
        dateStr: '',
        dayNotes: '',
        wakeTime: '۰۶:۳۰',
        sleepTime: '۲۳:۰۰',
        parts: Array.from({ length: 8 }, (_, i) => ({
          id: `slot-${d.id}-${i + 1}-${Math.random().toString(36).substring(2, 7)}`,
          partNumber: i + 1,
          timeRange: partTimes[i] || `پارت ${i + 1}`,
          subject: '',
          topic: '',
          targetTests: 0,
          completedTests: 0,
          targetPages: '',
          status: 'planned' as const,
          notes: '',
        })),
      }));
      setSchedule(emptySchedule);
    }
  };

  const handleLoadSample = () => {
    if (window.confirm('آیا می‌خواهید جدول و گزارش کار با نمونه کامل کنکوری پر شود؟')) {
      setHeaderInfo(INITIAL_HEADER);
      setSchedule(generateInitialSchedule(partTimes));
      setOverviewList(INITIAL_OVERVIEW);
      setReports(INITIAL_REPORTS);
    }
  };

  const handleAddPomodoroTimeToReport = (minutes: number, isTesting: boolean) => {
    const hours = Math.round((minutes / 60) * 10) / 10;
    // Add to the first active day or today
    if (reports.length > 0) {
      const updated = [...reports];
      const today = { ...updated[0] };
      if (isTesting) {
        today.testingHours += hours;
      } else {
        today.descriptiveHours += hours;
      }
      today.totalHours = today.descriptiveHours + today.testingHours;
      updated[0] = today;
      setReports(updated);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPrint={handlePrint}
        onReset={handleResetSchedule}
        onLoadSample={handleLoadSample}
        onOpenScreenshots={() => setIsScreenshotsModalOpen(true)}
        onOpenWelcome={() => setIsWelcomeOpen(true)}
        weekTitle={headerInfo.weekNumber}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* TAB 1: Weekly Schedule (جدول برنامه‌ریزی هفتگی) */}
        {activeTab === 'schedule' && (
          <div>
            {/* Top Header: Start & End of Program + Motivational Quote */}
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
            />

            {/* Section in front / alongside the table: Weekly Overview Boxes for Bio, Physics, Chem, Math, General */}
            <div className="mt-8">
              <SubjectsOverviewSection
                overviewList={overviewList}
                onChangeOverview={setOverviewList}
                schedule={schedule}
              />
            </div>
          </div>
        )}

        {/* TAB 2: Dedicated Overview (نگاه کلی دروس اختصاصی و عمومی) */}
        {activeTab === 'overview' && (
          <div>
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
          </div>
        )}

        {/* TAB 3: Study Report Table (صفحه مدیریت گزارش کار) */}
        {activeTab === 'report' && (
          <ReportCardPage
            reports={reports}
            onUpdateReport={setReports}
            onPrint={handlePrint}
          />
        )}

        {/* TAB 4: Pomodoro Focus Study Technique (تکنیک مطالعه پومودورو) */}
        {activeTab === 'pomodoro' && (
          <PomodoroSection
            onAddStudyTimeToReport={handleAddPomodoroTimeToReport}
          />
        )}

        {/* TAB 5: Counseling Articles & Study Quality Tips (۱۰ مقاله مشاوره‌ای) */}
        {activeTab === 'articles' && (
          <CounselingArticlesPage />
        )}

        {/* TAB 6: Majors & Top Careers Guide (معرفی رشته‌ها و شغل‌ها) */}
        {activeTab === 'majors' && (
          <MajorsPage />
        )}
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
          <div className="flex items-center gap-4 text-[11px] text-cyan-400">
            <span>کانال تلگرام: CliniC_Konkur2026@</span>
            <span>رزرو مشاوره: Poshtibani_CliniCk_konkur2026@</span>
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
