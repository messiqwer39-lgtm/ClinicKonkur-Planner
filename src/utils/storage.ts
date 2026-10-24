import {
  DaySchedule,
  DAYS_INFO,
  DEFAULT_PART_TIMES,
  SubjectOverviewItem,
  WeeklyHeaderInfo,
  DailyReportRow,
  PartSlot,
  SubjectKey,
} from '../types/planner';

const STORAGE_KEY_HEADER = 'konkur_planner_header_v1';
const STORAGE_KEY_SCHEDULE = 'konkur_planner_schedule_v1';
const STORAGE_KEY_OVERVIEW = 'konkur_planner_overview_v1';
const STORAGE_KEY_REPORT = 'konkur_planner_report_v1';
const STORAGE_KEY_PART_TIMES = 'konkur_planner_part_times_v1';

export const INITIAL_HEADER: WeeklyHeaderInfo = {
  startDate: '۱۴۰۳/۰۸/۰۵',
  endDate: '۱۴۰۳/۰۸/۱۱',
  weekNumber: 'هفته هشتم پاییز - برنامه هدفمند گام دوم',
  motivationalQuote:
    'رویاهای بزرگ با قدم‌های کوچک و پیوسته هر روزه محقق می‌شوند. امروز روز درخشیدن توست!',
};

export const INITIAL_OVERVIEW: SubjectOverviewItem[] = [
  {
    key: 'biology',
    title: 'زیست‌شناسی',
    weeklyTargetHours: 18,
    weeklyTargetTests: 220,
    focusChapters: [
      'گوارش و جذب مواد (فصل ۲ زیست دهم)',
      'گردش مواد و قلب (فصل ۴ زیست دهم)',
      'ژنتیک و مولکول‌های اطلاعاتی (فصل ۱ زیست دوازدهم)',
    ],
    sources: ['کتاب درسی خط به خط', 'خیلی‌سبز جامع', 'تست‌های نشان‌دار آی‌کیو (IQ)'],
    notes: 'توجه ویژه به شکل‌های کتاب و قیدهای همواره/اغلب/به ندرت در گفتار ۲',
  },
  {
    key: 'physics',
    title: 'فیزیک',
    weeklyTargetHours: 13.5,
    weeklyTargetTests: 160,
    focusChapters: [
      'الکتریسیته ساکن و خازن‌ها (فصل ۱ یازدهم)',
      'کار، انرژی و قضیه کار-انرژی جنبشی (دهم)',
      'حرکت‌شناسی و نمودارهای سرعت-زمان (دوازدهم)',
    ],
    sources: ['میکروطبقه‌بندی گاج', 'نشر الگو فیزیک', 'دست‌نویس فرمول‌های کلیدی'],
    notes: 'حل تیپ‌تست‌های ترکیبی کار و انرژی با الکتریسیته ساکن و تست‌های زمان‌دار',
  },
  {
    key: 'chemistry',
    title: 'شیمی',
    weeklyTargetHours: 15,
    weeklyTargetTests: 180,
    focusChapters: [
      'مسائل استوکیومتری و واکنش‌های شیمیایی (فصل ۲ دهم)',
      'ساختار لوویس و پیوندهای کووالانسی (فصل ۲ دهم)',
      'مفاهیم اسید و باز و pH (فصل ۱ دوازدهم)',
    ],
    sources: ['مبتکران واجب بهمن بازرگانی', 'تکمیلی خیلی سبز', 'جدول تناوبی جیبی'],
    notes: 'تمرین روزانه ۳ مسئله استوکیومتری کسر تبدیل و مرور واکنش‌های حفظی',
  },
  {
    key: 'math',
    title: 'ریاضیات',
    weeklyTargetHours: 15,
    weeklyTargetTests: 170,
    focusChapters: [
      'تابع (ترکیب توابع، وارون، یک‌به‌یک)',
      'مثلثات جامع (روابط، دایره مثلثاتی، معادلات)',
      'حد و پیوستگی توابع کسری و مثلثاتی',
    ],
    sources: ['حسابان و ریاضی جامع مهر و ماه', 'نشر الگو', 'دفتر تیپ‌بندی تست‌ها'],
    notes: 'رسم شکل و تحلیل نموداری توابع پیش از اقدام به محاسبات جبری',
  },
  {
    key: 'general',
    title: 'دروس عمومی و مهارتی',
    weeklyTargetHours: 9,
    weeklyTargetTests: 110,
    focusChapters: [
      'ادبیات: آرایه‌های استعاره، مجاز و حسن تعلیل + ۱۰ تست قرابت شبیه‌ساز',
      'دینی: درس ۱ و ۲ سال دوازدهم (هستی بخش و یگانگی خداوند)',
      'عربی: فن ترجمه و اعراب اسم‌ها',
      'فرهنگیان: مهارت معلمی و هوش کلامی',
    ],
    sources: ['کتابچه هفت‌خوان خیلی سبز', 'میکرو طلایی عمومی', 'کتاب زرد عمومی قلم‌چی'],
    notes: 'مطالعه شبی یک پارت آخر شب برای جلوگیری از خستگی ذهنی',
  },
];

// Helper to generate a default slot
function createSlot(
  partNum: number,
  timeRange: string,
  subject: SubjectKey | '',
  topic: string,
  tests: number,
  pages: string,
  status: 'planned' | 'in_progress' | 'completed' | 'partial' | 'missed' = 'planned'
): PartSlot {
  return {
    id: `part-${partNum}-${Math.random().toString(36).substring(2, 9)}`,
    partNumber: partNum,
    timeRange,
    subject,
    topic,
    targetTests: tests,
    completedTests: status === 'completed' ? tests : status === 'partial' ? Math.floor(tests / 2) : 0,
    targetPages: pages,
    status,
    notes: '',
  };
}

export function generateInitialSchedule(partTimes: string[] = DEFAULT_PART_TIMES): DaySchedule[] {
  return [
    {
      dayId: 'saturday',
      dayName: 'شنبه',
      dateStr: '۰۸/۰۵',
      dayNotes: 'شروع پرانرژی هفته با زیست‌شناسی و ریاضی',
      wakeTime: '۰۶:۱۵',
      sleepTime: '۲۳:۰۰',
      parts: [
        createSlot(1, partTimes[0], 'biology', 'زیست دهم: گوارش مکانیکی و شیمیایی معده', 30, 'ص ۱۸ تا ۲۵', 'completed'),
        createSlot(2, partTimes[1], 'math', 'ریاضی: ترکیب توابع و محاسبه ضابطه fog', 25, 'تست‌های ۱ تا ۴۰ کتاب مهر و ماه', 'completed'),
        createSlot(3, partTimes[2], 'physics', 'فیزیک یازدهم: قانون کولن و برآیند نیروهای الکتریکی', 25, 'درسنامه + ۲۰ تست زوج', 'completed'),
        createSlot(4, partTimes[3], 'chemistry', 'شیمی دهم: موازنه واکنش‌ها و کسرهای استوکیومتری', 20, 'ص ۳۲ تا ۳۹', 'completed'),
        createSlot(5, partTimes[4], 'biology', 'زیست دوازدهم: همانندسازی DNA و آنزیم هلیکاز', 30, 'تست‌های مفهومی خیلی‌سبز', 'in_progress'),
        createSlot(6, partTimes[5], 'math', 'ریاضی: وارون تابع و تعیین دامنه و برد', 25, 'تست‌های سراسری ۹۸ تا ۱۴۰۲', 'planned'),
        createSlot(7, partTimes[6], 'general', 'فارسی: آرایه‌های ادبی (ایهام و تناسب) + لغت', 20, 'کتابچه هفت‌خوان', 'planned'),
        createSlot(8, partTimes[7], 'review', 'مرور نکات روز و تحلیل تست‌های اشتباه', 0, 'دفترچه تحلیل', 'planned'),
      ],
    },
    {
      dayId: 'sunday',
      dayName: 'یکشنبه',
      dateStr: '۰۸/۰۶',
      dayNotes: 'تمرکز ویژه بر فیزیک و شیمی و مسائل استوکیومتری',
      wakeTime: '۰۶:۳۰',
      sleepTime: '۲۳:۱۵',
      parts: [
        createSlot(1, partTimes[0], 'chemistry', 'شیمی دوازدهم: مفاهیم اسید و باز آرنیوس و برونستد', 25, 'ص ۱ تا ۱۲ کتاب', 'planned'),
        createSlot(2, partTimes[1], 'biology', 'زیست یازدهم: گیرنده‌های حسی و ساختار چشم', 35, 'خیلی‌سبز تست ۱۲۰ تا ۱۶۰', 'planned'),
        createSlot(3, partTimes[2], 'physics', 'فیزیک دهم: کار نیروهای متغیر و قضیه کار-انرژی', 25, 'تست‌های آموزشی نشر الگو', 'planned'),
        createSlot(4, partTimes[3], 'math', 'ریاضی: دامنه و برد توابع گویا و رادیکالی', 20, 'جزوه تکمیلی استاد', 'planned'),
        createSlot(5, partTimes[4], 'chemistry', 'شیمی دهم: استوکیومتری جرم-جرم و گازها', 25, 'تست‌های ۱۰ تا ۳۵ مبتکران', 'planned'),
        createSlot(6, partTimes[5], 'physics', 'فیزیک یازدهم: میدان الکتریکی ذرات باردار', 25, 'تست‌های سراسری داخل و خارج', 'planned'),
        createSlot(7, partTimes[6], 'general', 'عربی: قواعد اعراب مضارع و شناخت منصوبات', 20, 'تست‌های جامع قلم‌چی', 'planned'),
        createSlot(8, partTimes[7], 'review', 'مرور شبانه فرمول‌های فیزیک و فلش کارت زیست', 0, 'یادداشت‌های جیبی', 'planned'),
      ],
    },
    {
      dayId: 'monday',
      dayName: 'دوشنبه',
      dateStr: '۰۸/۰۷',
      dayNotes: 'روز تثبیت و حل تست‌های سرعتی و زمان‌دار',
      wakeTime: '۰۶:۰۰',
      sleepTime: '۲۳:۰۰',
      parts: [
        createSlot(1, partTimes[0], 'biology', 'زیست دهم: تنفس سلولی و تبادلات گازی شش‌ها', 35, 'خط‌به‌خط کتاب درسی', 'planned'),
        createSlot(2, partTimes[1], 'math', 'ریاضی: مثلثات جامع (دایره مثلثاتی و کمان‌ها)', 30, 'تست‌های کنکور سال‌های اخیر', 'planned'),
        createSlot(3, partTimes[2], 'chemistry', 'شیمی یازدهم: شیمی آلی و آلکان‌ها و آلکن‌ها', 25, 'درسنامه و تست‌های مفهومی', 'planned'),
        createSlot(4, partTimes[3], 'physics', 'فیزیک دوازدهم: سرعت متوسط و شتاب لحظه‌ای', 25, 'تست‌های نشان‌دار', 'planned'),
        createSlot(5, partTimes[4], 'biology', 'زیست دوازدهم: رونویسی و انواع RNA', 30, 'تست‌های کتاب آی‌کیو', 'planned'),
        createSlot(6, partTimes[5], 'math', 'ریاضی: معادلات مثلثاتی و حل مسائل دامنه', 25, 'تست‌های سری دوم مهروماه', 'planned'),
        createSlot(7, partTimes[6], 'general', 'دینی دوازدهم: درس اول هستی‌بخش و علت فاعلی', 15, 'متن کتاب + ۲۰ تست سراسری', 'planned'),
        createSlot(8, partTimes[7], 'review', 'مرور لغات زبان انگلیسی و کلوز تست', 15, 'کتاب تست شهاب اناری', 'planned'),
      ],
    },
    {
      dayId: 'tuesday',
      dayName: 'سه‌شنبه',
      dateStr: '۰۸/۰۸',
      dayNotes: 'پیگیری هدفمند پارت‌های شیمی و زیست یازدهم',
      wakeTime: '۰۶:۱۵',
      sleepTime: '۲۳:۳۰',
      parts: [
        createSlot(1, partTimes[0], 'physics', 'فیزیک یازدهم: پتانسیل الکتریکی و انرژی پتانسیل', 25, 'تست‌های منتخب آزمون‌ها', 'planned'),
        createSlot(2, partTimes[1], 'chemistry', 'شیمی دهم: بازده درصدی و درجه خلوص مواد', 25, 'مسائل ترکیبی مبتکران', 'planned'),
        createSlot(3, partTimes[2], 'biology', 'زیست یازدهم: هورمون‌ها و دستگاه درون‌ریز', 35, 'ص ۴۸ تا ۵۸ کتاب درسی', 'planned'),
        createSlot(4, partTimes[3], 'math', 'ریاضی: حد چپ و راست و رفع ابهام صفر صفرم', 25, 'جزوه تست و نکته', 'planned'),
        createSlot(5, partTimes[4], 'physics', 'فیزیک دهم: توان و بازده موتورها و پمپ‌ها', 20, 'مسائل کتاب درسی و کنکور', 'planned'),
        createSlot(6, partTimes[5], 'chemistry', 'شیمی دوازدهم: ثابت تعادل و تغییرات غلظت', 25, 'تست‌های سنجش', 'planned'),
        createSlot(7, partTimes[6], 'general', 'فرهنگیان / عمومی: هوش ریاضی و تحلیلی', 20, 'کتاب ویژه فرهنگیان', 'planned'),
        createSlot(8, partTimes[7], 'review', 'مرور جعبه لایتنر و زیست جانوری دهم', 0, 'خلاصه‌ها', 'planned'),
      ],
    },
    {
      dayId: 'wednesday',
      dayName: 'چهارشنبه',
      dateStr: '۰۸/۰۹',
      dayNotes: 'مرور میان‌هفته و جبران عقب‌افتادگی‌های جزئی',
      wakeTime: '۰۶:۳۰',
      sleepTime: '۲۳:۰۰',
      parts: [
        createSlot(1, partTimes[0], 'biology', 'زیست دوازدهم: پروتئین‌سازی و ترجمه کدون‌ها', 35, 'تست‌های خط‌به‌خط', 'planned'),
        createSlot(2, partTimes[1], 'math', 'ریاضی: پیوستگی تابع در نقطه و بازه', 25, 'تست‌های جامع مهروماه', 'planned'),
        createSlot(3, partTimes[2], 'chemistry', 'شیمی یازدهم: آلکین‌ها و نام‌گذاری آیوپاک', 25, 'تمرین‌های نام‌گذاری', 'planned'),
        createSlot(4, partTimes[3], 'physics', 'فیزیک دوازدهم: نمودار مکان-زمان و تغییر جهت', 25, 'تست‌های زمان‌دار شبیه‌ساز', 'planned'),
        createSlot(5, partTimes[4], 'biology', 'زیست دهم: گردش خون در قلب و الکتروکاردیوگرام', 30, 'نکات تستی و نمودار ECG', 'planned'),
        createSlot(6, partTimes[5], 'general', 'ادبیات: ۱۰ تست قرابت معنایی + ۵ تست تاریخ ادبیات', 25, 'مبحثی نشر الگو', 'planned'),
        createSlot(7, partTimes[6], 'physics', 'فیزیک یازدهم: خازن‌ها و دی‌الکتریک', 20, 'تست‌های کنکورهای اخیر', 'planned'),
        createSlot(8, partTimes[7], 'review', 'جمع‌بندی یادداشت‌های ۴ روز گذشته', 0, 'دفترچه خلاصه', 'planned'),
      ],
    },
    {
      dayId: 'thursday',
      dayName: 'پنج‌شنبه',
      dateStr: '۰۸/۱۰',
      dayNotes: 'آماده‌سازی برای آزمون شبیه‌ساز و مرور جامع',
      wakeTime: '۰۶:۰۰',
      sleepTime: '۲۲:۳۰',
      parts: [
        createSlot(1, partTimes[0], 'biology', 'زیست: آزمون مبحثی جامع گوارش و گردش مواد', 40, 'دفترچه ۵۰ تستی زمان‌دار', 'planned'),
        createSlot(2, partTimes[1], 'chemistry', 'شیمی: حل آزمون جامع استوکیومتری و اسید-باز', 35, 'زمان ۳۵ دقیقه', 'planned'),
        createSlot(3, partTimes[2], 'math', 'ریاضی: مرور کل مباحث تابع و مثلثات و رفع اشکال', 30, 'تست‌های ستاره‌دار هفته', 'planned'),
        createSlot(4, partTimes[3], 'physics', 'فیزیک: مرور فرمول‌های الکتریسیته و حرکت', 25, 'تست‌های جامع نیمه‌طولانی', 'planned'),
        createSlot(5, partTimes[4], 'general', 'عمومی: شبیه‌ساز ۴۰ تستی دروس عمومی نهایی', 40, 'تست‌های سراسری ۱۴۰۲', 'planned'),
        createSlot(6, partTimes[5], 'review', 'بررسی دفترچه تحلیل آزمون‌های گذشته و دام‌ها', 0, 'دفتر خودآموز', 'planned'),
        createSlot(7, partTimes[6], 'review', 'آماده‌سازی وسایل، ساعت خواب منظم و ریلکسیشن', 0, 'آرامش ذهنی', 'planned'),
        createSlot(8, partTimes[7], 'free', 'استراحت فعال و خواب زودهنگام قبل آزمون', 0, 'استراحت', 'planned'),
      ],
    },
    {
      dayId: 'friday',
      dayName: 'جمعه',
      dateStr: '۰۸/۱۱',
      dayNotes: 'روز آزمون آزمایشی، تحلیل دقیق تست‌ها و برنامه‌ریزی هفته بعد',
      wakeTime: '۰۶:۰۰',
      sleepTime: '۲۳:۰۰',
      parts: [
        createSlot(1, partTimes[0], 'exam', 'اجرای آزمون شبیه‌ساز کنکور (دفترچه ۱)', 60, 'سوالات آزمون آزمایشی', 'planned'),
        createSlot(2, partTimes[1], 'exam', 'ادامه آزمون شبیه‌ساز کنکور (دفترچه ۲)', 60, 'سوالات دفترچه دوم', 'planned'),
        createSlot(3, partTimes[2], 'exam', 'استراحت کوتاه و ثبت درصدها و تراز اولیه', 0, 'سایت آزمون', 'planned'),
        createSlot(4, partTimes[3], 'review', 'تحلیل درس به درس زیست‌شناسی و ثبت غلط‌ها', 0, 'دفترچه پاسخنامه تشریحی', 'planned'),
        createSlot(5, partTimes[4], 'review', 'تحلیل درس شیمی و فیزیک آزمون امروز', 0, 'حل دوباره سوالات بی‌پاسخ', 'planned'),
        createSlot(6, partTimes[5], 'review', 'تحلیل درس ریاضیات و استخراج دام‌های آموزشی', 0, 'دفترچه نکته', 'planned'),
        createSlot(7, partTimes[6], 'review', 'تکمیل فرم گزارش کار هفتگی و محاسبه ساعات کل', 0, 'جدول گزارش کار', 'planned'),
        createSlot(8, partTimes[7], 'free', 'تفریح سبک خانوادگی، استراحت و شارژ روحی', 0, 'انرژی مثبت', 'planned'),
      ],
    },
  ];
}

export const INITIAL_REPORTS: DailyReportRow[] = [
  {
    dayId: 'saturday',
    dayName: 'شنبه',
    dateStr: '۰۸/۰۵',
    descriptiveHours: 5.5,
    testingHours: 4.5,
    totalHours: 10,
    testsCorrect: 110,
    testsWrong: 16,
    testsUnanswered: 14,
    totalTests: 140,
    accuracyPercentage: 75,
    sleepHours: 7,
    qualityRating: 5,
    dailyHighlights: 'اتمام کامل پارت‌های زیست و تمرکز عالی در پارت‌های صبح',
    dailyWeaknesses: 'کمی کندی در حل محاسبات کسری شیمی',
    notes: 'انرژی بسیار بالا برای شروع هفته جدید',
  },
  {
    dayId: 'sunday',
    dayName: 'یکشنبه',
    dateStr: '۰۸/۰۶',
    descriptiveHours: 5.0,
    testingHours: 4.0,
    totalHours: 9,
    testsCorrect: 95,
    testsWrong: 19,
    testsUnanswered: 16,
    totalTests: 130,
    accuracyPercentage: 68,
    sleepHours: 6.5,
    qualityRating: 4,
    dailyHighlights: 'یادگیری کامل مفهوم پیوندهای هیدروژنی در زیست',
    dailyWeaknesses: 'سردرد مختصر بعدازظهر به دلیل کم‌آبی بدن',
    notes: 'پارت ۶ فیزیک نیاز به تمرین بیشتر دارد',
  },
  {
    dayId: 'monday',
    dayName: 'دوشنبه',
    dateStr: '۰۸/۰۷',
    descriptiveHours: 4.5,
    testingHours: 5.0,
    totalHours: 9.5,
    testsCorrect: 125,
    testsWrong: 12,
    testsUnanswered: 13,
    totalTests: 150,
    accuracyPercentage: 80,
    sleepHours: 7,
    qualityRating: 5,
    dailyHighlights: 'دقت عالی در تست‌های ریاضی مثلثات (بیش از ۸۰٪)',
    dailyWeaknesses: 'کمی افت انرژی در پارت ۵',
    notes: 'تست‌های زمان‌دار نتیجه داد',
  },
  {
    dayId: 'tuesday',
    dayName: 'سه‌شنبه',
    dateStr: '۰۸/۰۸',
    descriptiveHours: 4.5,
    testingHours: 4.0,
    totalHours: 8.5,
    testsCorrect: 92,
    testsWrong: 18,
    testsUnanswered: 10,
    totalTests: 120,
    accuracyPercentage: 72,
    sleepHours: 6.5,
    qualityRating: 4,
    dailyHighlights: 'پیشرفت در مبحث پتانسیل الکتریکی فیزیک',
    dailyWeaknesses: 'بی‌دقتی در علامت‌های جبری ریاضی',
    notes: 'مرور فرمول‌ها سر شب مفید بود',
  },
  {
    dayId: 'wednesday',
    dayName: 'چهارشنبه',
    dateStr: '۰۸/۰۹',
    descriptiveHours: 5.0,
    testingHours: 4.5,
    totalHours: 9.5,
    testsCorrect: 115,
    testsWrong: 14,
    testsUnanswered: 11,
    totalTests: 140,
    accuracyPercentage: 79,
    sleepHours: 7,
    qualityRating: 4,
    dailyHighlights: 'جمع‌بندی عالی ترجمه کدون‌های زیست‌شناسی',
    dailyWeaknesses: 'خستگی در پارت عمومی آخر شب',
    notes: 'برنامه به موقع پیش رفت',
  },
  {
    dayId: 'thursday',
    dayName: 'پنج‌شنبه',
    dateStr: '۰۸/۱۰',
    descriptiveHours: 3.5,
    testingHours: 5.5,
    totalHours: 9.0,
    testsCorrect: 130,
    testsWrong: 15,
    testsUnanswered: 15,
    totalTests: 160,
    accuracyPercentage: 78,
    sleepHours: 7.5,
    qualityRating: 5,
    dailyHighlights: 'آزمون‌های جامع جمع‌بندی با تراز خوب شبیه‌سازی شد',
    dailyWeaknesses: 'هیچ',
    notes: 'آماده برای آزمون فردا',
  },
  {
    dayId: 'friday',
    dayName: 'جمعه',
    dateStr: '۰۸/۱۱',
    descriptiveHours: 2.0,
    testingHours: 6.0,
    totalHours: 8.0,
    testsCorrect: 145,
    testsWrong: 22,
    testsUnanswered: 13,
    totalTests: 180,
    accuracyPercentage: 76,
    sleepHours: 7,
    qualityRating: 5,
    dailyHighlights: 'تحلیل صددرصدی تمام سوالات غلط و نزده آزمون آزمایشی',
    dailyWeaknesses: 'مدیریت زمان در دفترچه دوم می‌توانست بهتر باشد',
    notes: 'یک هفته پربار و رو به جلو',
  },
];

// Storage helpers
export function loadWeeklyHeader(): WeeklyHeaderInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HEADER);
    return raw ? JSON.parse(raw) : INITIAL_HEADER;
  } catch {
    return INITIAL_HEADER;
  }
}

export function saveWeeklyHeader(data: WeeklyHeaderInfo): void {
  try {
    localStorage.setItem(STORAGE_KEY_HEADER, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save header', err);
  }
}

export function loadSchedule(): DaySchedule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SCHEDULE);
    return raw ? JSON.parse(raw) : generateInitialSchedule();
  } catch {
    return generateInitialSchedule();
  }
}

export function saveSchedule(data: DaySchedule[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save schedule', err);
  }
}

export function loadOverview(): SubjectOverviewItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OVERVIEW);
    return raw ? JSON.parse(raw) : INITIAL_OVERVIEW;
  } catch {
    return INITIAL_OVERVIEW;
  }
}

export function saveOverview(data: SubjectOverviewItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_OVERVIEW, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save overview', err);
  }
}

export function loadReports(): DailyReportRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPORT);
    return raw ? JSON.parse(raw) : INITIAL_REPORTS;
  } catch {
    return INITIAL_REPORTS;
  }
}

export function saveReports(data: DailyReportRow[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_REPORT, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save reports', err);
  }
}

export function loadPartTimes(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PART_TIMES);
    return raw ? JSON.parse(raw) : DEFAULT_PART_TIMES;
  } catch {
    return DEFAULT_PART_TIMES;
  }
}

export function savePartTimes(data: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PART_TIMES, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save part times', err);
  }
}
