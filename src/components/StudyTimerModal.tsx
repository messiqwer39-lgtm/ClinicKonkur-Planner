import React, { useState, useEffect } from 'react';
import { PartSlot, SUBJECT_CONFIGS } from '../types/planner';
import { toPersianDigits } from '../utils/helpers';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Bell,
  CloudRain,
} from 'lucide-react';
import { audioService } from '../utils/audioService';
import { notificationService } from '../utils/notificationService';

interface StudyTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlot?: PartSlot | null;
  onMarkSlotCompleted?: (slotId: string) => void;
}

export const StudyTimerModal: React.FC<StudyTimerModalProps> = ({
  isOpen,
  onClose,
  activeSlot,
  onMarkSlotCompleted,
}) => {
  if (!isOpen) return null;

  const DEFAULT_SECONDS = 90 * 60; // 90 minutes = 1.5 hours
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [isRainOn, setIsRainOn] = useState(false);
  const [rainVolume, setRainVolume] = useState(0.45);
  const [hasNotificationPerm, setHasNotificationPerm] = useState(notificationService.hasPermission());

  const subjectConfig = activeSlot?.subject
    ? SUBJECT_CONFIGS[activeSlot.subject]
    : null;
  const subjectTitle = subjectConfig?.title || 'پارت مطالعه';
  const topic = activeSlot?.topic || 'مطالعه و حل تست';

  // Toggle procedural rain sound
  const toggleRain = async () => {
    if (isRainOn) {
      audioService.stopRain();
      setIsRainOn(false);
    } else {
      const ok = await audioService.startRain(rainVolume);
      setIsRainOn(ok);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setRainVolume(val);
    audioService.setRainVolume(val);
  };

  // Request notifications
  const handleEnableNotifications = async () => {
    const granted = await notificationService.requestPermission();
    setHasNotificationPerm(granted);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          // Update notification every 60 seconds
          if (next % 60 === 0) {
            const remainingMins = Math.ceil(next / 60);
            notificationService.showActiveStudy(subjectTitle, topic, remainingMins);
          }
          return next;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (isRainOn) {
        audioService.stopRain();
        setIsRainOn(false);
      }

      // Fire completion notification, alarm chime & vibration
      notificationService.notifyStudyFinished(subjectTitle);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, subjectTitle, topic, isRainOn]);

  // Clean on unmount or close
  const handleClose = () => {
    if (isRainOn) {
      audioService.stopRain();
      setIsRainOn(false);
    }
    notificationService.clearActive();
    onClose();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((DEFAULT_SECONDS - timeLeft) / DEFAULT_SECONDS) * 100;

  const handleToggleRunning = async () => {
    if (!isRunning) {
      // Start
      if (!hasNotificationPerm && notificationService.isSupported()) {
        const ok = await notificationService.requestPermission();
        setHasNotificationPerm(ok);
      }
      setIsRunning(true);
      const remainingMins = Math.ceil(timeLeft / 60);
      notificationService.showActiveStudy(subjectTitle, topic, remainingMins);
    } else {
      setIsRunning(false);
      notificationService.clearActive();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(DEFAULT_SECONDS);
    notificationService.clearActive();
  };

  const handleAdjustTime = (deltaMinutes: number) => {
    setTimeLeft((prev) => Math.max(60, prev + deltaMinutes * 60));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-bold text-slate-900">
              تایمر تمرکز پارت ۹۰ دقیقه‌ای (۱.۵ ساعت)
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Part Info if present */}
        {activeSlot && (
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-right">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-indigo-900">
                پارت {toPersianDigits(activeSlot.partNumber)}: {activeSlot.timeRange}
              </span>
              {subjectConfig && (
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${subjectConfig.badgeBg}`}>
                  {subjectConfig.title}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 font-medium truncate">
              {activeSlot.topic || 'بدون مبحث ثبت شده'}
            </p>
          </div>
        )}

        {/* Ambient Sound & Android Notifications Controls Bar */}
        <div className="mt-3 p-2.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between gap-2">
          {/* Rain Sound Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleRain}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isRainOn
                  ? 'bg-cyan-600 text-white shadow-xs animate-pulse'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>{isRainOn ? 'صدای باران (روشن)' : 'صدای باران'}</span>
            </button>

            {isRainOn && (
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={rainVolume}
                onChange={handleVolumeChange}
                className="w-16 h-1.5 accent-cyan-600 bg-slate-200 rounded-lg cursor-pointer"
                title="بلندی صدای باران"
              />
            )}
          </div>

          {/* Notification Status */}
          <button
            type="button"
            onClick={handleEnableNotifications}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold ${
              hasNotificationPerm
                ? 'text-emerald-700 bg-emerald-100/70'
                : 'text-amber-800 bg-amber-100/70 hover:bg-amber-200'
            }`}
            title="اعلان وضعیت مطالعه در نوتیفیکیشن‌بار گوشی اندروید"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{hasNotificationPerm ? 'اعلان فعال' : 'فعال‌سازی اعلان'}</span>
          </button>
        </div>

        {/* Large Timer Dial */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative w-52 h-52 rounded-full border-8 border-slate-100 flex items-center justify-center bg-radial from-white to-slate-50 shadow-inner">
            {/* Circular progress bar SVG */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="104"
                cy="104"
                r="92"
                stroke="currentColor"
                strokeWidth="8"
                className="text-indigo-600 transition-all duration-500"
                fill="transparent"
                strokeDasharray={578}
                strokeDashoffset={578 - (578 * progress) / 100}
                strokeLinecap="round"
              />
            </svg>

            <div className="flex flex-col items-center z-10">
              <span className="text-4xl font-black font-mono tracking-wider text-slate-900 tabular-nums">
                {toPersianDigits(String(minutes).padStart(2, '0'))}:
                {toPersianDigits(String(seconds).padStart(2, '0'))}
              </span>
              <span className="text-xs text-slate-400 mt-1 font-medium">
                {isRunning ? 'در حال مطالعه و یادگیری...' : 'آماده برای شروع پارت'}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => handleAdjustTime(-5)}
            className="px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
            title="کاهش ۵ دقیقه"
          >
            -۵ د
          </button>

          <button
            type="button"
            onClick={handleToggleRunning}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-md transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>توقف موقت</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>شروع مطالعه</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
            title="تنظیم مجدد به ۹۰ دقیقه"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleAdjustTime(5)}
            className="px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
            title="افزایش ۵ دقیقه"
          >
            +۵ د
          </button>
        </div>

        {/* Mark Completed Button if attached to a slot */}
        {activeSlot && onMarkSlotCompleted && (
          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                onMarkSlotCompleted(activeSlot.id);
                handleClose();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>پارت را به عنوان «انجام شد» در جدول ثبت کن</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
