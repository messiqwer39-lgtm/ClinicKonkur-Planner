/**
 * Persian number conversion utility
 */
export function toPersianDigits(input: string | number): string {
  if (input === null || input === undefined) return '';
  const str = input.toString();
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit, 10)]);
}

/**
 * Format hours to display (e.g. 1.5 => "۱.۵ ساعت" or "۱ ساعت و ۳۰ دقیقه")
 */
export function formatStudyHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${toPersianDigits(h)} ساعت`;
  if (h === 0) return `${toPersianDigits(m)} دقیقه`;
  return `${toPersianDigits(h)} س و ${toPersianDigits(m)} د`;
}

/**
 * Konkur test percentage formula:
 * Percentage = ((3 * Correct - Wrong) / (3 * Total)) * 100
 */
export function calculateKonkurPercentage(correct: number, wrong: number, unanswered: number): number {
  const total = correct + wrong + unanswered;
  if (total <= 0) return 0;
  const raw = ((3 * correct - wrong) / (3 * total)) * 100;
  return Math.round(raw * 10) / 10;
}

/**
 * Simple Web Audio chime for timer finish or completion
 */
export function playChime(type: 'success' | 'alert' = 'success') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (type === 'success') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(330, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    }
  } catch {
    // Audio might fail in silent context, gracefully ignore
  }
}
