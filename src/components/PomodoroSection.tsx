import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  Award,
  Layers,
  Coffee,
  BookOpen,
} from 'lucide-react';
import { toPersianDigits, playChime } from '../utils/helpers';
import confetti from 'canvas-confetti';

interface PomodoroSectionProps {
  onAddStudyTimeToReport?: (minutes: number, isTesting: boolean) => void;
}

type PomodoroMode = 'konkur90' | 'classic25' | 'deep50';
type PomodoroPhase = 'study' | 'break';

interface ModeConfig {
  id: PomodoroMode;
  name: string;
  studyMinutes: number;
  breakMinutes: number;
  description: string;
  badge: string;
}

const MODES: ModeConfig[] = [
  {
    id: 'konkur90',
    name: 'پومودوروی کنکوری ۹۰/۱۵ (توصیه کلینیک)',
    studyMinutes: 90,
    breakMinutes: 15,
    description: 'شبیه‌سازی دقیق زمان‌بندی دفترچه و پارت‌های کنکور سراسری',
    badge: 'استاندارد کنکور',
  },
  {
    id: 'deep50',
    name: 'تمرکز عمیق ۵۰/۱۰',
    studyMinutes: 50,
    breakMinutes: 10,
    description: 'مناسب برای تست‌زنی سرعتی و تمرین‌های محاسباتی',
    badge: 'تست‌زنی',
  },
  {
    id: 'classic25',
    name: 'پومودوروی کلاسیک ۲۵/۵',
    studyMinutes: 25,
    breakMinutes: 5,
    description: 'مناسب برای خلاصه‌نویسی، مرور لغات و حفظیات سبک',
    badge: 'مرور سبک',
  },
];

export const PomodoroSection: React.FC<PomodoroSectionProps> = ({ onAddStudyTimeToReport }) => {
  const [selectedMode, setSelectedMode] = useState<PomodoroMode>('konkur90');
  const [phase, setPhase] = useState<PomodoroPhase>('study');
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isAmbientSoundOn, setIsAmbientSoundOn] = useState(false);
  const [studySubject, setStudySubject] = useState('');

  const currentMode = MODES.find((m) => m.id === selectedMode) || MODES[0];
  const initialSeconds =
    phase === 'study' ? currentMode.studyMinutes * 60 : currentMode.breakMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  // Web Audio Rain / White Noise synthesizer for offline ambient sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  const startAmbientSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      // Pink noise filter algorithm for soothing rainfall
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(0);
      noiseNodeRef.current = whiteNoise;
    } catch {
      // audio disabled or blocked
    }
  };

  const stopAmbientSound = () => {
    try {
      if (noiseNodeRef.current) {
        (noiseNodeRef.current as AudioScheduledSourceNode).stop();
        noiseNodeRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch {
      // ignore
    }
  };

  const toggleAmbientSound = () => {
    if (isAmbientSoundOn) {
      stopAmbientSound();
      setIsAmbientSoundOn(false);
    } else {
      startAmbientSound();
      setIsAmbientSoundOn(true);
    }
  };

  // Timer interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playChime('success');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

      if (phase === 'study') {
        setCompletedSessions((prev) => prev + 1);
        if (onAddStudyTimeToReport) {
          onAddStudyTimeToReport(currentMode.studyMinutes, false);
        }
        setPhase('break');
        setTimeLeft(currentMode.breakMinutes * 60);
      } else {
        setPhase('study');
        setTimeLeft(currentMode.studyMinutes * 60);
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, phase, currentMode, onAddStudyTimeToReport]);

  const handleModeChange = (mode: PomodoroMode) => {
    setSelectedMode(mode);
    setIsRunning(false);
    setPhase('study');
    const m = MODES.find((item) => item.id === mode) || MODES[0];
    setTimeLeft(m.studyMinutes * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(phase === 'study' ? currentMode.studyMinutes * 60 : currentMode.breakMinutes * 60);
  };

  const handleSkipPhase = () => {
    setIsRunning(false);
    if (phase === 'study') {
      setPhase('break');
      setTimeLeft(currentMode.breakMinutes * 60);
    } else {
      setPhase('study');
      setTimeLeft(currentMode.studyMinutes * 60);
    }
  };

  const totalSeconds =
    phase === 'study' ? currentMode.studyMinutes * 60 : currentMode.breakMinutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 border border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>تکنیک علمی تمرکز عمیق و بازیابی انرژی</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
            میز مطالعه و تایمر پومودورو کنکوری
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            مطالعه بر اساس چرخه طلایی ۹۰ دقیقه تمرکز ناب و ۱۵ دقیقه استراحت هدفمند برای بازسازی سیناپس‌های حافظه
          </p>
        </div>
      </div>

      {/* Mode Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => handleModeChange(m.id)}
            className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 ${
              selectedMode === m.id
                ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                : 'bg-white/80 border-slate-200/90 text-slate-700 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">{m.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                {m.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">{m.description}</p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
              <span>مطالعه: {toPersianDigits(m.studyMinutes)} دقیقه</span>
              <span>استراحت: {toPersianDigits(m.breakMinutes)} دقیقه</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Focus Console */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Phase Pill */}
        <div className="flex items-center gap-2 mb-6">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-black shadow-xs flex items-center gap-1.5 ${
              phase === 'study'
                ? 'bg-indigo-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {phase === 'study' ? (
              <>
                <BookOpen className="w-3.5 h-3.5" />
                <span>فاز مطالعه و تمرکز عمیق ({toPersianDigits(currentMode.studyMinutes)} دقیقه)</span>
              </>
            ) : (
              <>
                <Coffee className="w-3.5 h-3.5" />
                <span>فاز استراحت و تنفس ({toPersianDigits(currentMode.breakMinutes)} دقیقه)</span>
              </>
            )}
          </span>
        </div>

        {/* Big Circular Dial */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-slate-100 flex items-center justify-center bg-radial from-white to-slate-50/60 shadow-inner mb-6">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              stroke="currentColor"
              strokeWidth="8"
              className={`transition-all duration-500 ${
                phase === 'study' ? 'text-indigo-600' : 'text-emerald-500'
              }`}
              fill="transparent"
              strokeDasharray={700}
              strokeDashoffset={700 - (700 * progress) / 100}
              strokeLinecap="round"
            />
          </svg>

          <div className="flex flex-col items-center z-10">
            <span className="text-5xl sm:text-6xl font-black font-mono tracking-wider text-slate-900 tabular-nums">
              {toPersianDigits(String(minutes).padStart(2, '0'))}:
              {toPersianDigits(String(seconds).padStart(2, '0'))}
            </span>
            <span className="text-xs text-slate-500 mt-2 font-medium">
              {isRunning
                ? phase === 'study'
                  ? 'گوشی را کنار بگذار و غرق در یادگیری شو'
                  : 'آب بنوش و چشم‌هایت را استراحت بده'
                : 'برای شروع پارت کلیک کنید'}
            </span>
          </div>
        </div>

        {/* Quick Subject Tag Input */}
        <div className="w-full max-w-xs mb-6">
          <input
            type="text"
            value={studySubject}
            onChange={(e) => setStudySubject(e.target.value)}
            placeholder="مبحث این پارت (مثلاً: زیست دهم فصل ۳)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-center text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Main Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm text-white shadow-lg transition-all hover:scale-105 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-indigo-600 hover:bg-indigo-700'
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
                <span>شروع پارت پومودورو</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-3.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
            title="شروع مجدد این فاز"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleSkipPhase}
            className="px-4 py-3.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
            title="رفتن به فاز بعدی (مطالعه/استراحت)"
          >
            پرش به فاز بعد
          </button>

          {/* Offline Ambient White Noise Generator */}
          <button
            type="button"
            onClick={toggleAmbientSound}
            className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-bold rounded-2xl transition-colors ${
              isAmbientSoundOn
                ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="صدای نویز سفید باران آرامش‌بخش برای تمرکز حواس"
          >
            {isAmbientSoundOn ? <Volume2 className="w-4 h-4 text-cyan-600" /> : <VolumeX className="w-4 h-4" />}
            <span>{isAmbientSoundOn ? 'صدای باران (روشن)' : 'صدای باران تمرکز'}</span>
          </button>
        </div>

        {/* Sessions Counter Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>پارت‌های تکمیل شده امروز:</span>
            <strong className="font-bold text-slate-800 text-sm">{toPersianDigits(completedSessions)} پارت</strong>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>زمان مفید:</span>
            <strong className="font-bold text-slate-800 text-sm">
              {toPersianDigits((completedSessions * currentMode.studyMinutes) / 60)} ساعت
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
