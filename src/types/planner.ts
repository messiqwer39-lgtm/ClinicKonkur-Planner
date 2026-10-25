export type DayOfWeek =
  | 'saturday'
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday';

export type MajorType = 'experimental' | 'mathematics' | 'humanities' | 'all';

export type SubjectKey =
  // تجربی
  | 'biology'
  | 'geology'
  | 'math' // ریاضی تجربی
  // ریاضی و فیزیک
  | 'calculus'
  | 'geometry'
  | 'discrete_math'
  // مشترک
  | 'physics'
  | 'chemistry'
  // انسانی
  | 'literature_humanities'
  | 'arabic_humanities'
  | 'philosophy_logic'
  | 'economics'
  | 'psychology'
  | 'sociology'
  | 'math_humanities'
  | 'history_geography'
  // عمومی و نهایی
  | 'general_farsi'
  | 'general_arabic'
  | 'general_religion'
  | 'general_english'
  | 'general'
  // سیستم
  | 'review'
  | 'exam'
  | 'free';

export type PartStatus = 'planned' | 'in_progress' | 'completed' | 'partial' | 'missed';

export interface SubjectConfig {
  key: SubjectKey;
  major: MajorType;
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
  studentName?: string;
  selectedMajor?: MajorType;
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
    major: 'experimental',
    title: 'زیست‌شناسی تجربی',
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
  geology: {
    key: 'geology',
    major: 'experimental',
    title: 'زمین‌شناسی تجربی',
    shortTitle: 'زمین',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    badgeText: 'text-amber-800',
    borderColor: 'border-amber-300',
    dotColor: 'bg-amber-600',
    accentColor: '#d97706',
    sampleTopics: [
      'آفرینش کیهان و منابع معدنی',
      'منابع آب، خاک و پویایی زمین',
      'زمین‌شناسی و سلامت و زلزله',
      'زمین‌شناسی ایران',
    ],
  },
  physics: {
    key: 'physics',
    major: 'all',
    title: 'فیزیک',
    shortTitle: 'فیزیک',
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    badgeText: 'text-sky-700',
    borderColor: 'border-sky-300',
    dotColor: 'bg-sky-500',
    accentColor: '#0284c7',
    sampleTopics: [
      'فیزیک و اندازه‌گیری و چگالی (دهم)',
      'ویژگی‌های فیزیکی مواد و فشار (دهم)',
      'کار، انرژی و توان و گرما (دهم)',
      'الکتریسیته ساکن و جاری (یازدهم)',
      'مغناطیس و القای الکترومغناطیسی (یازدهم)',
      'حرکت بر خط راست و دینامیک (دوازدهم)',
      'نوسان و موج‌های صوتی و بازتاب (دوازدهم)',
      'فیزیک اتمی و هسته‌ای (دوازدهم)',
    ],
  },
  chemistry: {
    key: 'chemistry',
    major: 'all',
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
    major: 'experimental',
    title: 'ریاضیات جامع تجربی',
    shortTitle: 'ریاضی تجربی',
    badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    badgeText: 'text-indigo-700',
    borderColor: 'border-indigo-300',
    dotColor: 'bg-indigo-500',
    accentColor: '#6366f1',
    sampleTopics: [
      'مجموعه، الگو و دنباله (دهم)',
      'معادله، نامعادله و تعیین علامت',
      'تابع و اعمال روی توابع (یازدهم)',
      'مثلثات جامع (دهم تا دوازدهم)',
      'حد، پیوستگی و مجانب‌ها (دوازدهم)',
      'مشتق و کاربردهای هندسی و فیزیکی',
    ],
  },
  calculus: {
    key: 'calculus',
    major: 'mathematics',
    title: 'حسابان و ریاضی پایه',
    shortTitle: 'حسابان',
    badgeBg: 'bg-blue-50 text-blue-900 border-blue-200',
    badgeText: 'text-blue-800',
    borderColor: 'border-blue-300',
    dotColor: 'bg-blue-600',
    accentColor: '#2563eb',
    sampleTopics: [
      'جبر و معادله و توابع درجه دو (دهم)',
      'توابع نمایی، لگاریتمی و مثلثات (یازدهم)',
      'حد و پیوستگی توابع (یازدهم)',
      'حد بی‌نهایت و مجانب‌ها (دوازدهم)',
      'مشتق و کاربرد مشتق و رسم نمودار (دوازدهم)',
    ],
  },
  geometry: {
    key: 'geometry',
    major: 'mathematics',
    title: 'هندسه تخصصی (۱، ۲، ۳)',
    shortTitle: 'هندسه',
    badgeBg: 'bg-cyan-50 text-cyan-900 border-cyan-200',
    badgeText: 'text-cyan-800',
    borderColor: 'border-cyan-300',
    dotColor: 'bg-cyan-600',
    accentColor: '#0891b2',
    sampleTopics: [
      'تالس و تشابه و چندضلعی‌ها (دهم)',
      'دایره و تبدیل‌های هندسی (یازدهم)',
      'ماتریس و دترمینان (دوازدهم)',
      'مقاطع مخروطی (سهمی، بیضی، هذلولی)',
      'بردارها در فضای ۳ بعدی (دوازدهم)',
    ],
  },
  discrete_math: {
    key: 'discrete_math',
    major: 'mathematics',
    title: 'گسسته و آمار و احتمال',
    shortTitle: 'گسسته',
    badgeBg: 'bg-violet-50 text-violet-900 border-violet-200',
    badgeText: 'text-violet-800',
    borderColor: 'border-violet-300',
    dotColor: 'bg-violet-600',
    accentColor: '#7c3aed',
    sampleTopics: [
      'منطق و مجموعه‌ها و احتمال شرطی (یازدهم)',
      'نظریه اعداد، بخش‌پذیری و همنهشتی (دوازدهم)',
      'نظریه گراف و مدل‌سازی با گراف‌ها (دوازدهم)',
      'ترکیبیات، شمارش و لانه‌کبوتری (دوازدهم)',
    ],
  },
  literature_humanities: {
    key: 'literature_humanities',
    major: 'humanities',
    title: 'علوم و فنون ادبی تخصصی',
    shortTitle: 'فنون ادبی',
    badgeBg: 'bg-rose-50 text-rose-900 border-rose-200',
    badgeText: 'text-rose-800',
    borderColor: 'border-rose-300',
    dotColor: 'bg-rose-600',
    accentColor: '#e11d48',
    sampleTopics: [
      'تاریخ ادبیات و سبک‌شناسی خراسانی، عراقی و هندی',
      'موسیقی شعر، تقطیع هجایی و اوزان عروضی',
      'آرایه‌های لفظی: سجع، جناس، ترصیع',
      'آرایه‌های معنوی: ایهام، استعاره، مجاز و کنایه',
    ],
  },
  arabic_humanities: {
    key: 'arabic_humanities',
    major: 'humanities',
    title: 'عربی تخصصی انسانی',
    shortTitle: 'عربی تخصصی',
    badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    badgeText: 'text-emerald-800',
    borderColor: 'border-emerald-300',
    dotColor: 'bg-emerald-600',
    accentColor: '#059669',
    sampleTopics: [
      'فن ترجمه و ساعت‌ها و کلمات استفهام',
      'معرب و مبنی، نواسخ و افعال ناقصه',
      'مفعول مطلق، مفعول‌فیه و استثنا',
      'حال، تمییز، منادی و افعال مدح و ذم',
    ],
  },
  philosophy_logic: {
    key: 'philosophy_logic',
    major: 'humanities',
    title: 'فلسفه و منطق انسانی',
    shortTitle: 'فلسفه و منطق',
    badgeBg: 'bg-teal-50 text-teal-900 border-teal-200',
    badgeText: 'text-teal-800',
    borderColor: 'border-teal-300',
    dotColor: 'bg-teal-600',
    accentColor: '#0d9488',
    sampleTopics: [
      'منطق: تعریف، اقسام استدلال و قیاس و مغالطات',
      'فلسفه یازدهم: سقراط، افلاطون، ارسطو و فلاسفه مسلمان',
      'فلسفه دوازدهم: هستی و چیستی، علیت و معرفت‌شناسی',
      'حکمت متعالیه ملاصدرا و جریان‌های فکری معاصر',
    ],
  },
  economics: {
    key: 'economics',
    major: 'humanities',
    title: 'اقتصاد انسانی',
    shortTitle: 'اقتصاد',
    badgeBg: 'bg-green-50 text-green-900 border-green-200',
    badgeText: 'text-green-800',
    borderColor: 'border-green-300',
    dotColor: 'bg-green-600',
    accentColor: '#16a34a',
    sampleTopics: [
      'انتخاب، کمیابی، عرضه و تقاضا و بازار',
      'تولید، بنگاه‌ها و هزینه‌های اقتصادی',
      'پول، بانک، تورم و مالیات‌های دولت',
      'توزیع درآمد، ضریب جینی و تجارت بین‌الملل',
    ],
  },
  psychology: {
    key: 'psychology',
    major: 'humanities',
    title: 'روان‌شناسی انسانی',
    shortTitle: 'روان‌شناسی',
    badgeBg: 'bg-fuchsia-50 text-fuchsia-900 border-fuchsia-200',
    badgeText: 'text-fuchsia-800',
    borderColor: 'border-fuchsia-300',
    dotColor: 'bg-fuchsia-600',
    accentColor: '#c026d3',
    sampleTopics: [
      'تعریف، رشد، احساس و ادراک حسی',
      'توجه، تمرکز و حافظه و علل فراموشی',
      'تفکر، حل مسئله و تصمیم‌گیری',
      'انگیزش، هیجان و سلامت روان',
    ],
  },
  sociology: {
    key: 'sociology',
    major: 'humanities',
    title: 'جامعه‌شناسی انسانی (۱، ۲، ۳)',
    shortTitle: 'جامعه‌شناسی',
    badgeBg: 'bg-orange-50 text-orange-900 border-orange-200',
    badgeText: 'text-orange-800',
    borderColor: 'border-orange-300',
    dotColor: 'bg-orange-600',
    accentColor: '#ea580c',
    sampleTopics: [
      'جامعه‌شناسی ۱: کنش، جهان اجتماعی و فرهنگ',
      'جامعه‌شناسی ۲: نظام‌های اقتصادی و تمدن غرب و اسلام',
      'جامعه‌شناسی ۳: عقلانیت اجتماعی و نابرابری‌های جهانی',
    ],
  },
  math_humanities: {
    key: 'math_humanities',
    major: 'humanities',
    title: 'ریاضی و آمار انسانی',
    shortTitle: 'ریاضی انسانی',
    badgeBg: 'bg-yellow-50 text-yellow-950 border-yellow-200',
    badgeText: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    dotColor: 'bg-yellow-600',
    accentColor: '#ca8a04',
    sampleTopics: [
      'معادله درجه دو، تابع و معیارهای پراکندگی (دهم)',
      'منطق ریاضی، تابع نمایی و آمار تحلیلی (یازدهم)',
      'ترکیبیات و احتمال شرطی و رگرسیون (دوازدهم)',
    ],
  },
  history_geography: {
    key: 'history_geography',
    major: 'humanities',
    title: 'تاریخ و جغرافیای انسانی',
    shortTitle: 'تاریخ و جغرافیا',
    badgeBg: 'bg-stone-50 text-stone-900 border-stone-200',
    badgeText: 'text-stone-800',
    borderColor: 'border-stone-300',
    dotColor: 'bg-stone-600',
    accentColor: '#78716c',
    sampleTopics: [
      'تاریخ ۱ و ۲: ایران و جهان باستان تا صفویه',
      'تاریخ ۳: ایران معاصر، مشروطه و انقلاب اسلامی',
      'جغرافیا ۱ و ۲: طبیعی و انسانی ایران و آب و هوا',
      'جغرافیا ۳: جغرافیای کاربردی و ژئوپلیتیک',
    ],
  },
  general_farsi: {
    key: 'general_farsi',
    major: 'all',
    title: 'فارسی عمومی و نهایی',
    shortTitle: 'فارسی',
    badgeBg: 'bg-lime-50 text-lime-900 border-lime-200',
    badgeText: 'text-lime-800',
    borderColor: 'border-lime-300',
    dotColor: 'bg-lime-600',
    accentColor: '#65a30d',
    sampleTopics: [
      'دستور زبان و گروه‌های اسمی و ساختار فعل',
      'آرایه‌های ادبی نهایی: تشبیه، استعاره، ایهام و کنایه',
      'مفاهیم و قرابت معنایی و تاریخ ادبیات',
      'واژگان، املا و حل نمونه سوالات امتحان نهایی',
    ],
  },
  general_arabic: {
    key: 'general_arabic',
    major: 'all',
    title: 'عربی عمومی و زبان قرآن',
    shortTitle: 'عربی عمومی',
    badgeBg: 'bg-teal-50 text-teal-900 border-teal-200',
    badgeText: 'text-teal-800',
    borderColor: 'border-teal-300',
    dotColor: 'bg-teal-600',
    accentColor: '#14b8a6',
    sampleTopics: [
      'قواعد فعل‌های مجرد و مزید و مضارع',
      'ترجمه جملات اسمیه، فعلیه و ترکیب‌ها',
      'حروف مشبهه، لای نفی جنس و حال',
      'تحلیل خط‌به‌خط متون کتاب درسی برای نمره ۲۰ نهایی',
    ],
  },
  general_religion: {
    key: 'general_religion',
    major: 'all',
    title: 'دین و زندگی عمومی و نهایی',
    shortTitle: 'دینی',
    badgeBg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    badgeText: 'text-indigo-800',
    borderColor: 'border-indigo-300',
    dotColor: 'bg-indigo-600',
    accentColor: '#6366f1',
    sampleTopics: [
      'تدبر در آیات و احادیث دهم و یازدهم',
      'توحید، معاد و هدایت الهی (دوازدهم)',
      'سبک زندگی اسلامی و تمدن مهدوی',
      'تحلیل کلیدواژه‌های سوالات امتحان نهایی',
    ],
  },
  general_english: {
    key: 'general_english',
    major: 'all',
    title: 'زبان انگلیسی عمومی و نهایی',
    shortTitle: 'انگلیسی',
    badgeBg: 'bg-sky-50 text-sky-900 border-sky-200',
    badgeText: 'text-sky-800',
    borderColor: 'border-sky-300',
    dotColor: 'bg-sky-600',
    accentColor: '#0ea5e9',
    sampleTopics: [
      'واژگان (Vocabulary) جامع دهم تا دوازدهم',
      'گرامر زمان‌ها، جملات مجهول و شرطی',
      'تکنیک‌های درک مطلب (Reading) و کلوزتست',
      'رایتینگ و قواعد نگارش برای امتحان نهایی',
    ],
  },
  general: {
    key: 'general',
    major: 'all',
    title: 'دروس عمومی و مهارتی',
    shortTitle: 'عمومی',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    badgeText: 'text-amber-800',
    borderColor: 'border-amber-300',
    dotColor: 'bg-amber-600',
    accentColor: '#f59e0b',
    sampleTopics: [
      'ادبیات فارسی: قلمرو زبانی، ادبی و فکری',
      'عربی عمومی: قواعد و ترجمه مفهومی',
      'دین و زندگی: آیات، احادیث و مفاهیم',
      'زبان انگلیسی: گرامر و واژگان و درک مطلب',
      'فرهنگیان: مهارت معلمی و هوش و استعداد',
    ],
  },
  review: {
    key: 'review',
    major: 'all',
    title: 'مرور و تثبیت',
    shortTitle: 'مرور',
    badgeBg: 'bg-violet-50 text-violet-800 border-violet-200',
    badgeText: 'text-violet-700',
    borderColor: 'border-violet-300',
    dotColor: 'bg-violet-500',
    accentColor: '#8b5cf6',
    sampleTopics: [
      'خلاصه‌نویسی و جعبه لایتنر',
      'تحلیل تست‌های نشان‌دار هفته گذشته',
      'مرور فرمول‌های ریاضی و فیزیک',
      'مرور قیدهای طلایی زیست‌شناسی',
    ],
  },
  exam: {
    key: 'exam',
    major: 'all',
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
      'بررسی دام‌های آموزشی و محاسبه درصد',
    ],
  },
  free: {
    key: 'free',
    major: 'all',
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
