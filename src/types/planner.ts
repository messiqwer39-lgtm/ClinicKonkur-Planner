export type DayOfWeek =
  | 'saturday'
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday';

export type SubjectKey =
  | 'biology'
  | 'physics'
  | 'chemistry'
  | 'math'
  | 'general'
  | 'review'
  | 'exam'
  | 'free';

export type PartStatus = 'planned' | 'in_progress' | 'completed' | 'partial' | 'missed';

export interface SubjectConfig {
  key: SubjectKey;
  title: string;
  shortTitle: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  dotColor: string;
  accentColor: string;
  sampleTopics: string[];
}

export interface PartSlot {
  id: string;
  partNumber: number; // 1 to 8
  timeRange: string;  // e.g. "۰۷:۰۰ - ۰۸:۳۰"
  subject: SubjectKey | '';
  topic: string;
  targetTests: number;
  completedTests: number;
  targetPages: string;
  status: PartStatus;
  notes: string;
}

export interface DaySchedule {
  dayId: DayOfWeek;
  dayName: string;
  dateStr: string;
  parts: PartSlot[];
  dayNotes: string;
  wakeTime: string;
  sleepTime: string;
}

export interface SubjectOverviewItem {
  key: SubjectKey;
  title: string;
  weeklyTargetHours: number;
  weeklyTargetTests: number;
  focusChapters: string[];
  sources: string[];
  notes: string;
}

export interface WeeklyHeaderInfo {
  startDate: string;
  endDate: string;
  weekNumber: string;
  motivationalQuote: string;
}

export interface DailyReportRow {
  dayId: DayOfWeek;
  dayName: string;
  dateStr: string;
  descriptiveHours: number; // ساعت تشریحی
  testingHours: number;     // ساعت تستی
  totalHours: number;       // ساعت کل
  testsCorrect: number;     // درست
  testsWrong: number;       // غلط
  testsUnanswered: number;  // نزده
  totalTests: number;       // کل تست
  accuracyPercentage: number; // درصد پاسخگویی
  sleepHours: number;       // میزان خواب
  qualityRating: number;    // 1-5
  dailyHighlights: string;  // نقاط مثبت روز
  dailyWeaknesses: string;  // موانع یا کوتاهی‌ها
  notes: string;
}

export const DAYS_INFO: { id: DayOfWeek; name: string; short: string }[] = [
  { id: 'saturday', name: 'شنبه', short: 'شن' },
  { id: 'sunday', name: 'یکشنبه', short: 'یک' },
  { id: 'monday', name: 'دوشنبه', short: 'دو' },
  { id: 'tuesday', name: 'سه‌شنبه', short: 'سه' },
  { id: 'wednesday', name: 'چهارشنبه', short: 'چهار' },
  { id: 'thursday', name: 'پنج‌شنبه', short: 'پنج' },
  { id: 'friday', name: 'جمعه', short: 'جم' },
];

export const DEFAULT_PART_TIMES: string[] = [
  '۰۷:۰۰ - ۰۸:۳۰', // پارت ۱
  '۰۸:۴۵ - ۱۰:۱۵', // پارت ۲
  '۱۰:۳۰ - ۱۲:۰۰', // پارت ۳
  '۱۲:۱۵ - ۱۳:۴۵', // پارت ۴
  '۱۵:۰۰ - ۱۶:۳۰', // پارت ۵
  '۱۶:۴۵ - ۱۸:۱۵', // پارت ۶
  '۱۸:۳۰ - ۲۰:۰۰', // پارت ۷
  '۲۰:۳۰ - ۲۲:۰۰', // پارت ۸
];

export const SUBJECT_CONFIGS: Record<SubjectKey, SubjectConfig> = {
  biology: {
    key: 'biology',
    title: 'زیست‌شناسی',
    shortTitle: 'زیست',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    badgeText: 'text-emerald-700',
    borderColor: 'border-emerald-300',
    dotColor: 'bg-emerald-500',
    accentColor: '#10b981',
    sampleTopics: [
      'گوارش و جذب مواد (دهم)',
      'گردش مواد در بدن (دهم)',
      'تنظیم عصبی و حواس (یازدهم)',
      'ایمنی و دستگاه ایمنی (یازدهم)',
      'ژنتیک و مولکول‌های اطلاعاتی (دوازدهم)',
      'فتوسنتز و تنفس سلولی (دوازدهم)',
    ],
  },
  physics: {
    key: 'physics',
    title: 'فیزیک',
    shortTitle: 'فیزیک',
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    badgeText: 'text-sky-700',
    borderColor: 'border-sky-300',
    dotColor: 'bg-sky-500',
    accentColor: '#0284c7',
    sampleTopics: [
      'فیزیک و اندازه‌گیری (دهم)',
      'کار، انرژی و توان (دهم)',
      'الکتریسیته ساکن و جاری (یازدهم)',
      'مغناطیس و القای الکترومغناطیسی (یازدهم)',
      'حرکت بر خط راست و دینامیک (دوازدهم)',
      'نوسان و موج‌های صوتی (دوازدهم)',
    ],
  },
  chemistry: {
    key: 'chemistry',
    title: 'شیمی',
    shortTitle: 'شیمی',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    badgeText: 'text-purple-700',
    borderColor: 'border-purple-300',
    dotColor: 'bg-purple-500',
    accentColor: '#8b5cf6',
    sampleTopics: [
      'ساختار اتم و جدول دوره‌ای (دهم)',
      'استوکیومتری و واکنش‌های شیمیایی (دهم)',
      'شیمی آلی و ترکیبات کربن (یازدهم)',
      'محلول‌ها و ترمودینامیک (یازدهم)',
      'سینتیک و تعادل‌های شیمیایی (دوازدهم)',
      'اسیدها و بازها و الکتروشیمی (دوازدهم)',
    ],
  },
  math: {
    key: 'math',
    title: 'ریاضیات',
    shortTitle: 'ریاضی',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    badgeText: 'text-amber-700',
    borderColor: 'border-amber-300',
    dotColor: 'bg-amber-500',
    accentColor: '#f59e0b',
    sampleTopics: [
      'مجموعه، الگو و دنباله (دهم)',
      'معادله، نامعادله و تعیین علامت',
      'تابع و اعمال روی توابع (یازدهم)',
      'مثلثات جامع (دهم تا دوازدهم)',
      'حد، پیوستگی و مجانب‌ها (دوازدهم)',
      'مشتق و کاربردهای هندسی و فیزیکی مشتق',
    ],
  },
  general: {
    key: 'general',
    title: 'دروس عمومی و مهارتی',
    shortTitle: 'عمومی',
    badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
    badgeText: 'text-teal-700',
    borderColor: 'border-teal-300',
    dotColor: 'bg-teal-500',
    accentColor: '#14b8a6',
    sampleTopics: [
      'ادبیات فارسی ۳: آرایه‌ها، قرابت و لغت/املا',
      'عربی نهایی و جامع: قواعد و ترجمه مفهومی',
      'دین و زندگی: آیات و روایات و نکات ترکیبی',
      'زبان انگلیسی: گرامر، کلوز تست و ریدینگ',
      'فرهنگیان: مهارت معلمی و هوش و استعداد',
    ],
  },
  review: {
    key: 'review',
    title: 'مرور و تثبیت',
    shortTitle: 'مرور',
    badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    badgeText: 'text-indigo-700',
    borderColor: 'border-indigo-300',
    dotColor: 'bg-indigo-500',
    accentColor: '#6366f1',
    sampleTopics: [
      'خلاصه‌نویسی و جعبه لایتنر',
      'تحلیل تست‌های نشان‌دار هفته گذشته',
      'مرور فرمول‌های ریاضی و فیزیک',
      'مرور قیدهای طلایی زیست‌شناسی',
    ],
  },
  exam: {
    key: 'exam',
    title: 'آزمون و سنجش',
    shortTitle: 'آزمون',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    badgeText: 'text-rose-700',
    borderColor: 'border-rose-300',
    dotColor: 'bg-rose-500',
    accentColor: '#f43f5e',
    sampleTopics: [
      'آزمون آزمایشی جمعه (سنجش / قلم‌چی / ماز)',
      'شبیه‌ساز دفترچه تخصصی کنکور',
      'تحلیل دقیق تک‌تک سوالات آزمون',
      'بررسی دام‌های آموزشی',
    ],
  },
  free: {
    key: 'free',
    title: 'استراحت و جبرانی',
    shortTitle: 'استراحت',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
    badgeText: 'text-slate-600',
    borderColor: 'border-slate-300',
    dotColor: 'bg-slate-400',
    accentColor: '#94a3b8',
    sampleTopics: [
      'استراحت فعال، ورزش و خواب منظم',
      'تفریح سبک خانوادگی و شارژ روحی',
      'پارت جبرانی برای مباحث عقب‌مانده',
    ],
  },
};

export const MOTIVATIONAL_QUOTES = [
  'رویاهای بزرگ با قدم‌های کوچک و پیوسته هر روزه محقق می‌شوند. امروز روز درخشیدن توست!',
  'هر تستی که امروز می‌زنی، یک قدم تو را به رشته و دانشگاه رویایی‌ات نزدیک‌تر می‌کند.',
  'موفقیت یعنی تکرار لجوجانه کارهای ساده، وقتی دیگران خسته شده و کنار می‌کشند.',
  'به پایان فکر نکن، عاشق مسیر شو؛ رتبه یک شدن نتیجه لذت بردن از لحظه‌های یادگیری است.',
  'هیچ تلاشی بی‌نتیجه نمی‌ماند؛ حتی اگر امروز نتیجه‌اش را نبینی، بذرهایی که می‌کاری فردا جوانه می‌زنند.',
  'انضباط شخصی یعنی انتخاب بین آنچه الان می‌خواهی و آنچه بیشتر از همه در زندگی می‌خواهی.',
  'برای رسیدن به هدفی که تا به حال نرسیده‌ای، باید کسی شوی که تا به حال نبوده‌ای.',
  'سکوت کن و بگذار موفقیت چشمگیرت، صدای بلند پاسخ به همه باشد.',
];
