/**
 * Client-side Word (.docx) export of the weekly plan — full RTL support.
 *
 * The `docx` library is loaded dynamically so it never lands in the main
 * bundle. The document contains:
 *   1) Cover block (week info, student, quote) + weekly 8-part schedule table
 *   2) Landscape section: weekly work report & konkur-grade analytics table
 *   3) Weekly subject targets table + support footer
 */
import {
  DaySchedule,
  WeeklyHeaderInfo,
  DailyReportRow,
  SubjectOverviewItem,
  SubjectKey,
  PartStatus,
  PartSlot,
  SUBJECT_CONFIGS,
} from '../types/planner';
import { toPersianDigits, calculateKonkurPercentage } from './helpers';

export interface DocxExportPayload {
  schedule: DaySchedule[];
  headerInfo: WeeklyHeaderInfo;
  partTimes: string[];
  reports: DailyReportRow[];
  subjects: SubjectOverviewItem[];
}

const MAJOR_FA: Record<string, string> = {
  experimental: 'علوم تجربی',
  mathematics: 'ریاضی و فیزیک',
  humanities: 'علوم انسانی',
  all: 'همه رشته‌ها',
};

const STATUS_FA: Record<PartStatus, string> = {
  planned: 'برنامه‌ریزی شده',
  in_progress: 'در حال انجام',
  completed: '✓ انجام شد',
  partial: 'نیمه‌تمام',
  missed: 'از دست رفته',
};

const FONT = 'Vazirmatn';
const C_DARK = '0F172A';
const C_HEADER_BG = '1E293B';
const C_ZEBRA = 'F8FAFC';
const C_REPORT_BG = '312E81';
const C_SUMMARY_BG = 'E0E7FF';
const C_ACCENT = '06B6D4';
const C_MUTED = '64748B';

const sanitize = (s: string) => s.replace(/[\\/:*?"<>|]/g, '').trim();

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    try {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      /* ignore */
    }
  }, 1500);
}

export async function exportWeeklyPlanDocx({
  schedule,
  headerInfo,
  partTimes,
  reports,
  subjects,
}: DocxExportPayload): Promise<void> {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    AlignmentType,
    WidthType,
    BorderStyle,
    ShadingType,
    VerticalAlign,
    HeightRule,
    PageOrientation,
  } = await import('docx');

  const BORDERS = {
    top: { style: BorderStyle.SINGLE, size: 4, color: '94A3B8' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: '94A3B8' },
    left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
  };

  // ---------- run/paragraph helpers ----------
  const run = (
    text: string,
    opts: { bold?: boolean; size?: number; color?: string; italics?: boolean } = {}
  ) =>
    new TextRun({
      text,
      rightToLeft: true,
      font: FONT,
      bold: opts.bold,
      italics: opts.italics,
      size: opts.size ?? 20,
      color: opts.color ?? C_DARK,
    });

  const para = (
    text: string,
    opts: {
      bold?: boolean;
      size?: number;
      color?: string;
      italics?: boolean;
      center?: boolean;
      after?: number;
    } = {}
  ) =>
    new Paragraph({
      bidirectional: true,
      alignment: opts.center ? AlignmentType.CENTER : AlignmentType.START,
      spacing: { after: opts.after ?? 140 },
      children: [run(text, opts)],
    });

  const cellPara = (text: string, opts: { bold?: boolean; color?: string; size?: number } = {}) =>
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.CENTER,
      spacing: { after: 0 },
      children: [run(text, opts)],
    });

  const cell = (
    text: string,
    width: number,
    opts: {
      bold?: boolean;
      color?: string;
      size?: number;
      fill?: string;
      lines?: { text: string; bold?: boolean; color?: string; size?: number }[];
    } = {}
  ) =>
    new TableCell({
      width: { size: width, type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
      shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR, color: 'auto' } : undefined,
      margins: { top: 60, bottom: 60, left: 70, right: 70 },
      children: [
        cellPara(text, { bold: opts.bold, color: opts.color, size: opts.size }),
        ...(opts.lines || []).map((l) => cellPara(l.text, l)),
      ],
    });

  const headerCell = (text: string, width: number, fill = C_HEADER_BG) =>
    cell(text, width, { bold: true, color: 'FFFFFF', fill, size: 18 });

  // ---------- 1) Weekly schedule table (portrait) ----------
  const S_DAY = 1400;
  const S_PART = 940;
  const scheduleWidths = [S_DAY, ...Array(8).fill(S_PART)];

  const scheduleHeader = new TableRow({
    tableHeader: true,
    height: { value: 460, rule: HeightRule.ATLEAST },
    children: [headerCell('روز / پارت', S_DAY), ...Array.from({ length: 8 }, (_, p) => {
      const t = partTimes[p] || `پارت ${p + 1}`;
      return new TableCell({
        width: { size: S_PART, type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        shading: { fill: C_HEADER_BG, type: ShadingType.CLEAR, color: 'auto' },
        margins: { top: 60, bottom: 60, left: 70, right: 70 },
        children: [
          cellPara(`پارت ${toPersianDigits(p + 1)}`, { bold: true, color: 'FFFFFF', size: 18 }),
          cellPara(toPersianDigits(t), { color: 'CBD5E1', size: 14 }),
        ],
      });
    })],
  });

  const scheduleRows = schedule.map((day, dayIdx) => {
    const zebra = dayIdx % 2 === 0 ? C_ZEBRA : 'FFFFFF';
    const dayCell = new TableCell({
      width: { size: S_DAY, type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
      shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
      margins: { top: 60, bottom: 60, left: 70, right: 70 },
      children: [
        cellPara(day.dayName, { bold: true, size: 20 }),
        cellPara(toPersianDigits(day.dateStr || '---'), { color: C_MUTED, size: 16 }),
        cellPara(
          `${toPersianDigits(day.parts.filter((p) => p.status === 'completed').length)}/۸ تکمیل`,
          { color: day.parts.some((p) => p.status === 'completed') ? '059669' : C_MUTED, size: 14 }
        ),
      ],
    });
    const partCells = day.parts.map((part: PartSlot) => {
      if (!part.subject) return cell('—', S_PART, { color: '94A3B8', fill: zebra });
      const cfg = SUBJECT_CONFIGS[part.subject as SubjectKey];
      return new TableCell({
        width: { size: S_PART, type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        shading: { fill: zebra, type: ShadingType.CLEAR, color: 'auto' },
        margins: { top: 50, bottom: 50, left: 60, right: 60 },
        children: [
          cellPara(cfg?.shortTitle || part.subject, { bold: true, size: 16, color: '0D9488' }),
          cellPara(part.topic || 'مطالعه و تست', { size: 14, color: C_DARK }),
          cellPara(
            part.status === 'completed'
              ? '✓ انجام شد'
              : `${toPersianDigits(part.targetTests || 0)} تست`,
            { size: 13, color: part.status === 'completed' ? '059669' : C_MUTED }
          ),
        ],
      });
    });
    return new TableRow({
      height: { value: 700, rule: HeightRule.ATLEAST },
      children: [dayCell, ...partCells],
    });
  });

  const scheduleTable = new Table({
    visuallyRightToLeft: true,
    width: { size: scheduleWidths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: scheduleWidths,
    borders: BORDERS,
    rows: [scheduleHeader, ...scheduleRows],
  });

  // ---------- 2) Weekly report table (landscape) ----------
  const R = [1250, 1050, 1000, 1000, 1150, 1000, 1000, 1000, 1050, 1050];
  const R_QUALITY = 3408;
  const reportWidths = [...R, R_QUALITY];
  const REPORT_COLS = [
    'روز هفته',
    'تاریخ',
    'ساعت تشریحی',
    'ساعت تستی',
    'جمع کل ساعت',
    'تست درست',
    'تست غلط',
    'تست نزده',
    'کل تست‌ها',
    'درصد کنکور',
    'کیفیت و ارزیابی',
  ];

  const reportHeader = new TableRow({
    tableHeader: true,
    height: { value: 420, rule: HeightRule.ATLEAST },
    children: REPORT_COLS.map((t, i) => headerCell(t, reportWidths[i], C_REPORT_BG)),
  });

  let tDesc = 0, tTest = 0, tTot = 0, tCor = 0, tWrg = 0, tUna = 0, tAll = 0;
  const reportRows = schedule.map((day, idx) => {
    const dInfo = day;
    const report = reports.find((r) => r.dayId === dInfo.dayId);
    const descH = report?.descriptiveHours || 0;
    const testH = report?.testingHours || 0;
    const totH = report?.totalHours || descH + testH;
    const corr = report?.testsCorrect || 0;
    const wrg = report?.testsWrong || 0;
    const unans = report?.testsUnanswered || 0;
    const totT = report?.totalTests || corr + wrg + unans;
    const percent =
      report?.accuracyPercentage || calculateKonkurPercentage(corr, wrg, unans);
    tDesc += descH; tTest += testH; tTot += totH; tCor += corr; tWrg += wrg; tUna += unans; tAll += totT;

    const zebra = idx % 2 === 0 ? C_ZEBRA : 'FFFFFF';
    const vals = [
      dInfo.dayName,
      toPersianDigits(report?.dateStr || '---'),
      descH > 0 ? `${toPersianDigits(descH)} س` : '—',
      testH > 0 ? `${toPersianDigits(testH)} س` : '—',
      totH > 0 ? `${toPersianDigits(totH)} ساعت` : '—',
      toPersianDigits(corr),
      toPersianDigits(wrg),
      toPersianDigits(unans),
      toPersianDigits(totT),
      totT > 0 ? `${toPersianDigits(percent)}٪` : '—',
    ];
    const qualityStr =
      (report?.qualityRating || 3) >= 4
        ? '⭐ عالی و پرانرژی'
        : (report?.qualityRating || 3) === 3
        ? '✓ خوب و هدفمند'
        : 'متوسط (نیاز به تمرکز)';
    const cells = vals.map((v, i) =>
      cell(v, reportWidths[i], {
        fill: zebra,
        bold: i === 4 || i === 9,
        color: i === 5 ? '059669' : i === 6 ? 'DC2626' : i === 9 ? (percent >= 60 ? '059669' : 'D97706') : C_DARK,
        size: 17,
      })
    );
    cells.push(cell(qualityStr, R_QUALITY, { fill: zebra, size: 16, color: '334155' }));
    return new TableRow({ height: { value: 440, rule: HeightRule.ATLEAST }, children: cells });
  });

  const weekPercent = tAll > 0 ? calculateKonkurPercentage(tCor, tWrg, tUna) : 0;
  const summaryVals = [
    'مجموع هفته',
    '—',
    `${toPersianDigits(tDesc)} س`,
    `${toPersianDigits(tTest)} س`,
    `${toPersianDigits(tTot)} ساعت`,
    toPersianDigits(tCor),
    toPersianDigits(tWrg),
    toPersianDigits(tUna),
    toPersianDigits(tAll),
    tAll > 0 ? `${toPersianDigits(weekPercent)}٪` : '—',
    'کارنامه رسمی کلینیک کنکور',
  ];
  const summaryRow = new TableRow({
    children: summaryVals.map((v, i) =>
      cell(v, reportWidths[i], { fill: C_SUMMARY_BG, bold: true, size: 17, color: '1E1B4B' })
    ),
  });

  const reportTable = new Table({
    visuallyRightToLeft: true,
    width: { size: reportWidths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: reportWidths,
    borders: BORDERS,
    rows: [reportHeader, ...reportRows, summaryRow],
  });

  // ---------- 3) Subject targets table (portrait) ----------
  const O = [1700, 1100, 1100, 2563, 2563];
  const overviewHeader = new TableRow({
    tableHeader: true,
    children: ['درس', 'ساعت هدف هفته', 'تست هدف هفته', 'فصل‌های تمرکز', 'منابع اصلی'].map(
      (t, i) => headerCell(t, O[i])
    ),
  });
  const overviewRows = subjects
    .filter((s) => s.weeklyTargetHours > 0 || s.weeklyTargetTests > 0 || s.focusChapters.length)
    .map((s, idx) =>
      new TableRow({
        children: [
          cell(s.title || SUBJECT_CONFIGS[s.key as SubjectKey]?.title || s.key, O[0], {
            bold: true,
            fill: idx % 2 === 0 ? C_ZEBRA : 'FFFFFF',
            size: 17,
          }),
          cell(toPersianDigits(s.weeklyTargetHours), O[1], { fill: idx % 2 === 0 ? C_ZEBRA : 'FFFFFF', size: 17 }),
          cell(toPersianDigits(s.weeklyTargetTests), O[2], { fill: idx % 2 === 0 ? C_ZEBRA : 'FFFFFF', size: 17 }),
          cell(s.focusChapters.join('، ') || '—', O[3], { fill: idx % 2 === 0 ? C_ZEBRA : 'FFFFFF', size: 16 }),
          cell(s.sources.join('، ') || '—', O[4], { fill: idx % 2 === 0 ? C_ZEBRA : 'FFFFFF', size: 16 }),
        ],
      })
    );
  const overviewTable =
    overviewRows.length > 0
      ? new Table({
          visuallyRightToLeft: true,
          width: { size: O.reduce((a, b) => a + b, 0), type: WidthType.DXA },
          columnWidths: O,
          borders: BORDERS,
          rows: [overviewHeader, ...overviewRows],
        })
      : null;

  // ---------- assemble document ----------
  const titleBlock = [
    para('برنامه هفتگی کلینیک کنکور', { bold: true, size: 36, center: true, after: 80 }),
    para('کلینیک پلن | Clinic Plan — سیستم ۸ پارت روزانه', { size: 20, color: C_ACCENT, center: true, after: 240 }),
  ];

  const infoLines = [
    `عنوان هفته: ${headerInfo.weekNumber || 'برنامه هفتگی'}`,
    `بازه زمانی: ${toPersianDigits(headerInfo.startDate || '---')} تا ${toPersianDigits(headerInfo.endDate || '---')}`,
    ...(headerInfo.studentName ? [`نام دانش‌آموز: ${headerInfo.studentName}`] : []),
    ...(headerInfo.selectedMajor ? [`رشته: ${MAJOR_FA[headerInfo.selectedMajor] || headerInfo.selectedMajor}`] : []),
    `جمله انگیزشی هفته: «${headerInfo.motivationalQuote || 'پیروزی واقعی با استمرار روزانه ساخته می‌شود.'}»`,
  ].map((l) => para(l, { size: 21, after: 90 }));

  const coverSection = {
    properties: {},
    children: [
      ...titleBlock,
      ...infoLines,
      para('۱. جدول برنامه‌ریزی هفتگی ۸ پارت ۹۰ دقیقه‌ای', { bold: true, size: 26, after: 160 }),
      scheduleTable,
      new Paragraph({
        bidirectional: true,
        spacing: { before: 240, after: 0 },
        children: [run('صفحه بعد: دفترچه گزارش کار و کارنامه عملکرد تحلیلی هفتگی', { size: 17, color: C_MUTED, italics: true })],
      }),
    ],
  };

  const reportSection = {
    properties: { page: { size: { orientation: PageOrientation.LANDSCAPE } } },
    children: [
      para('۲. دفترچه گزارش کار و کارنامه عملکرد تحلیلی هفتگی', { bold: true, size: 26, after: 160 }),
      para(
        'تحلیل ساعات تشریحی و تستی، آمار تست‌ها با کسر نمره منفی کنکور (درصد = (۳×درست − غلط) ÷ (۳×کل) × ۱۰۰)',
        { size: 17, color: C_MUTED, after: 200 }
      ),
      reportTable,
      new Paragraph({
        bidirectional: true,
        spacing: { before: 220, after: 0 },
        children: [
          run(
            `تحلیل مشاور: مجموع ${toPersianDigits(tTot)} ساعت مطالعه و حل ${toPersianDigits(tAll)} تست در این هفته با میانگین ${toPersianDigits(weekPercent)}٪ ثبت شد.`,
            { size: 18, color: '581C87', bold: true }
          ),
        ],
      }),
    ],
  };

  const overviewSection = {
    properties: {},
    children: [
      ...(overviewTable
        ? ([
            para('۳. اهداف هفتگی دروس (ساعت و تست هدف)', { bold: true, size: 26, after: 160 }),
            overviewTable,
          ] as never[])
        : []),
      new Paragraph({
        bidirectional: true,
        spacing: { before: 400, after: 60 },
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: C_ACCENT, space: 8 } },
        children: [
          run(
            'کلینیک کنکور | پشتیبانی و رزرو مشاوره VIP: @Poshtibani_CliniCk_konkur2026 | کانال تلگرام: @CliniC_Konkur2026',
            { size: 17, color: C_MUTED }
          ),
        ],
      }),
      para('ساخته‌شده با اپلیکیشن کلینیک پلن — نسخه ۲.۲.۰', { size: 15, color: '94A3B8', after: 0 }),
    ],
  };

  const doc = new Document({
    creator: 'Clinic Plan (کلینیک پلن)',
    title: `برنامه هفتگی کلینیک کنکور — ${headerInfo.weekNumber || ''}`,
    styles: {
      default: {
        document: {
          run: { font: FONT, size: 20, color: C_DARK },
        },
      },
    },
    sections: [coverSection, reportSection, overviewSection],
  });

  const blob = await Packer.toBlob(doc);
  const datePart = sanitize(headerInfo.startDate) || 'week';
  downloadBlob(blob, `ClinicPlan-Weekly-Program-${datePart}.docx`);
}
