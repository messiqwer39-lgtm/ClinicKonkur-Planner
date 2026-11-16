/**
 * Client-side PDF export (A4 landscape, fully Persian-safe).
 *
 * Reuses the shared canvas page renderers (same pages as the print modal),
 * so the typography and RTL layout are identical to the printed pages.
 * jsPDF is loaded dynamically so it never lands in the main bundle.
 */
import { DaySchedule, WeeklyHeaderInfo, DailyReportRow } from '../types/planner';
import { renderSchedulePageCanvas, renderReportPageCanvas } from './canvasPages';

export interface ExportPayload {
  schedule: DaySchedule[];
  headerInfo: WeeklyHeaderInfo;
  partTimes: string[];
  reports: DailyReportRow[];
}

const sanitize = (s: string) => s.replace(/[\\/:*?"<>|]/g, '').trim();

export async function exportWeeklyPlanPdf({
  schedule,
  headerInfo,
  partTimes,
  reports,
}: ExportPayload): Promise<void> {
  const [{ jsPDF }] = await Promise.all([import('jspdf'), import('./canvasPages')]);

  // A4 landscape: 297 x 210 mm — canvas pages are exactly 1400x960 (same ratio)
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });

  const canvases = [
    renderSchedulePageCanvas({ schedule, headerInfo, partTimes }),
    renderReportPageCanvas({ reports, headerInfo }),
  ];

  canvases.forEach((canvas, idx) => {
    if (idx > 0) pdf.addPage('a4', 'landscape');
    const img = canvas.toDataURL('image/jpeg', 0.92);
    pdf.addImage(img, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
  });

  const datePart = sanitize(headerInfo.startDate) || 'week';
  pdf.save(`ClinicPlan-Weekly-Program-${datePart}.pdf`);
}
